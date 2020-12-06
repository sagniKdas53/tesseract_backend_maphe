function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    const second = `${date.getSeconds()}`.padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`
}

function makebox(tem, rgb, r, g, b) {
    try {
        tem.style["border"] = "10px solid rgb(140, 255, 26)"; //colour;
        console.log("Processing ", tem, " Source ", tem.src, "Scalar colour to use:(", r, g, b, ")");
        let template = cv.imread(tem);
        console.log("Template colums and rows:", template.cols, template.rows);
        let dst = new cv.Mat();
        let mask = new cv.Mat();
        cv.matchTemplate(rgb, template, dst, cv.TM_CCOEFF, mask); //TM_CCOEFF -better  or TM_CCORR -shit
        let minPoint = cv.minMaxLoc(dst, mask).minLoc;
        let maxPoint = cv.minMaxLoc(dst, mask).maxLoc;
        console.log("Maxpoint", maxPoint, "Minpoint", minPoint);
        //rgb colour code is not working properly maybe colur space coverion is necessary
        cv.rectangle(rgb, minPoint, new cv.Point(minPoint.x + template.cols, minPoint.y + template.rows), new cv.Scalar(0, r, 0, g, 0, b), 2, cv.LINE_8, 0); //works well
        dst.delete();
        mask.delete();
    } catch (e) { console.error(e); }
};

function DownloadCanvasAsImage() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Download_' + getDateString() + '.png');
    let canvas = document.getElementById("canvasOutput");
    canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });
}


window.onload = function () {
    //getting the images
    let imgElement = document.getElementById('imageSrc');
    let chbox1 = document.getElementById('TopLc');
    console.log(chbox1.value);
    let top_right = document.getElementById('Topr'); //the lightning shield one
    let chbox2 = document.getElementById('TopRc');
    console.log(chbox2.value);
    let top_left = document.getElementById('Topl');
    let reff = document.getElementById('ref');
    let atta = document.getElementById('att');
    let cd = document.getElementById('cdam');
    let sw = document.getElementById('attSwo');
    let top_left_big = document.getElementById('TopL');
    let inputElement = document.getElementById('fileInput');
    console.log("This are the stats" + reff.src);
    console.log("Lightning shield " + top_right.src);
    console.log("Back arrow " + top_left.src);
    console.log("Attack " + atta.src);
    console.log("Crit Damage " + cd.src);
    console.log("Swords Locator " + sw.src);
    console.log("Back arrow bigger " + top_left_big.src);
    console.log(imgElement.src);
    //made the loader will reimplement once the detector works
    //this is used by setting the visibilty once tesseract starts working and stopping
    //stopping once it's done
    //var loader = document.getElementById("loader");

    inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function () {
        let image_full = cv.imread(imgElement); //rgb one
        let image = new cv.Mat();
        // idk about the x and y coordinates but i assume rows=> y, cols=> x
        //const begin = Math.round(image_full.rows*0.07)  used only if black bar is present
        //console.log(begin);
        const begin = 00;
        const y = Math.round(image_full.rows);
        const x = Math.round(image_full.cols / 2);
        //console.log(x, y);
        let rect = new cv.Rect(begin, 00, x, y);
        image = image_full.roi(rect);
        cv.imshow('canvasOutput', image);
        image.delete();
        image_full.delete();
        // SAD template matching test
        //SAD(document.getElementById("canvasOutput"),top_right,"tempc");
        SAD(document.getElementById("canvasOutput"),top_left_big,"tempc");
    };
}

function loadImageToCanvas(imageUrl, canvasElement) {
    let context = canvasElement.getContext('2d');
    let image = new Image();
    image.src = imageUrl;
    image.onload = () => {
        canvasElement.width = image.width;
        canvasElement.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
    };
};

function SAD(Src, Tem, id) {
    //console.log(Src, Tem, id);
    let can = document.getElementById(id);
    loadImageToCanvas(Tem.src, can);
    let S_w = Src.width;
    let S_h = Src.height;
    let T_w = Tem.width;
    let T_h = Tem.height;
    //console.log(S_w, S_h, T_w, T_h);
    let templateContext = can.getContext('2d'); 
    let T = templateContext.getImageData(0, 0, T_w, T_h).data;
    let originalContext = Src.getContext('2d');
    let S = originalContext.getImageData(0, 0, S_w, S_h).data;
    // this part is kept same the previous lines are patched in by me.
    let minSAD = Number.MAX_SAFE_INTEGER;
    let posX;
    let posY;
    for (let y = 0; y <= S_h - T_h; y++) {
        for (let x = 0; x <= S_w - T_w; x++) {
            let SAD = 0;
            // loop through template image data.
            for (let j = 0; j < T_h; j++) {
                let S_idx = (y + j) * S_w;
                let T_idx = j * T_w;
                for (let i = 0; i < T_w; i++) {
                    let S_idx_i = (S_idx + (x + i)) * 4;
                    let T_idx_i = (T_idx + i) * 4;
                    let S_pixel = S[S_idx_i];   // using R(ed) component.
                    let T_pixel = T[T_idx_i];   // using R(ed) component.
                    SAD += Math.abs(S_pixel - T_pixel);
                }
            }
            if (minSAD > SAD) {
                minSAD = SAD;
                posX = x;
                posY = y;
            }
        }
    }
    document.getElementById('x_cordd').innerHTML = "X: "+posX;
    document.getElementById('y_cordd').innerHTML = "Y:"+posY;
    originalContext.beginPath();
    originalContext.rect(posX, posY, T_w, T_h);
    originalContext.strokeStyle = 'red';
    originalContext.stroke();
}