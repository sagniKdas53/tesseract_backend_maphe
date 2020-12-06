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
        loadImageToCanvas(tem.src, document.getElementById("template_canvas"));
        console.log("Processing ", tem, " Source ", tem.src);
        let template = cv.imread(tem);
        console.log("Template colums and rows:", template.cols, template.rows);
        let dst = new cv.Mat();
        let mask = new cv.Mat();
        cv.matchTemplate(rgb, template, dst, cv.TM_CCOEFF, mask); //TM_CCOEFF -better  or TM_CCORR -shit
        let minPoint = cv.minMaxLoc(dst, mask).minLoc;
        let maxPoint = cv.minMaxLoc(dst, mask).maxLoc;
        console.log("Maxpoint", maxPoint, "Minpoint", minPoint);
        document.getElementById('x_cordd').innerHTML = "minpointX:maxpointX: " + minPoint.x+":"+maxPoint.x;
        document.getElementById('y_cordd').innerHTML = "minpointY:maxpointY:" + minPoint.y+":"+maxPoint.y;
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
    let main_image_ele = document.getElementById('main_image');

    let usage_stat_ele = document.getElementById('usage_stats'); //the lightning shield one
    let usage_stat_cb = document.getElementById('usage_statsCB');

    let back_arrow_ele = document.getElementById('back_arrow');
    let back_arrow_cb = document.getElementById('back_arrowCB');
    
    let attack_icon_ele = document.getElementById('attack_icon');
    let attack_icon_cb = document.getElementById('attack_iconCB');

    let critdam_icon_ele = document.getElementById('critdam_icon');
    let critdam_icon_cb = document.getElementById('critdam_iconCB');

    let crossed_swo_ele = document.getElementById('crossed_swo');
    let crossed_swo_cb = document.getElementById('crossed_swoCB');

    let inputElement = document.getElementById('fileInput');
    //console.log("This are the stats" + stats_box_ele.src);
    console.log("Lightning shield " + usage_stat_ele.src);
    console.log("Back arrow " + back_arrow_ele.src);
    console.log("Attack icon " + attack_icon_ele.src);
    console.log("Crit Damage " + critdam_icon_ele.src);
    console.log("Swords Locator " + crossed_swo_ele.src);
    console.log(main_image_ele.src);
    //made the loader will reimplement once the detector works
    //this is used by setting the visibilty once tesseract starts working and stopping
    //stopping once it's done
    //var loader = document.getElementById("loader");

    inputElement.addEventListener('change', (e) => {
        main_image_ele.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    main_image_ele.onload = function () {
        let image_full = cv.imread(main_image_ele); //rgb one
        let image = new cv.Mat();
        // idk about the x and y coordinates but i assume rows=> y, cols=> x
        const begin = Math.round(image_full.rows * 0.07)  //used only if black bar is present
        console.log(begin);
        //const begin = 00;
        const y = Math.round(image_full.rows);
        const x = Math.round(image_full.cols / 2);
        console.log(x, y);  //used only if there i no black bar
        let rect = new cv.Rect(begin, 00, x, y);
        image = image_full.roi(rect);

        //image = greyScale(image);   //not uses or tested

        image_full.delete();
        const r = 51;
        const g = 219;
        const b = 0;
        if (usage_stat_cb.checked === true) {
            makebox(usage_stat_ele, image, r, g, b);
        }
        if (back_arrow_cb.checked === true) {
            makebox(back_arrow_ele, image, r, g, b);          
        }
        if (attack_icon_cb.checked === true) {
            makebox(attack_icon_ele, image, r, g, b);
        }
        if (critdam_icon_cb.checked === true) {
            makebox(critdam_icon_ele, image, r, g, b);
        }
        if (crossed_swo_cb.checked === true) {
            makebox(crossed_swo_ele, image, r, g, b);
        }
        cv.imshow('output_canavs', image);
        image.delete();
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


function greyScale(srccc) {
    let dst = new cv.Mat();
    // You can try more different parameters
    cv.cvtColor(srccc, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}