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
    let top_right = document.getElementById('Topr'); //the lightning shield one
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
        let image = cv.imread(imgElement); //rgb one
        makebox(reff, image, 127, 31, 244); //the stats should be - purple - hopeless won't work
        makebox(top_left, image, 31, 244, 127); // the back arrow should be - teal - works but sometimes
        makebox(top_right, image, 245, 130, 32); // the lightning should be - orange - fails drastically
        makebox(atta,image,255,255,255); // fails drastically
        makebox(cd,image,255,255,255); // fails drastically
        makebox(top_left_big, image, 255, 255, 255); //works sometimes
        makebox(sw,image,255,255,255); // fails drastically
        // fails drastically means misses the region by a lot the plot still occures but not where it's needed
        cv.imshow('canvasOutput', image);
        image.delete();
    };
}

