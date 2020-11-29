function makebox(tem, oCm, r, g, b) {
    console.log("Processing ",tem," Source ",tem.src,"Scalar colour to use:(",r,g,b,")");
    let template = cv.imread(tem);
    console.log("Template rows and columns:", template.rows, template.cols);
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(oCm, template, dst, cv.TM_CCOEFF, mask);
    let minPoint = cv.minMaxLoc(dst, mask).minLoc;
    let maxPoint = cv.minMaxLoc(dst, mask).maxLoc;
    console.log("Maxpoint", maxPoint, "Minpoint", minPoint);
    //rgb colour code is not working properly maybe colur space coverion is necessary
    cv.rectangle(oCm, minPoint, new cv.Point(minPoint.x + template.rows, minPoint.y + template.cols), new cv.Scalar(r,g,b), 2, cv.LINE_8, 0);
    dst.delete();
    mask.delete();
};

window.onload = function () {
    //getting the images
    let imgElement = document.getElementById('imageSrc');
    let top_right = document.getElementById('Topr'); //the lightning shield one
    let top_left = document.getElementById('Topl');
    let reff = document.getElementById('ref')
    let inputElement = document.getElementById('fileInput');
    console.log("This are the stats" + reff.src);
    console.log("Lightning shield " + top_right.src);
    console.log("Back arrow" + top_left.src);
    console.log(imgElement.src);
    //made the loader will reimplement once the detector works
    //this is used by setting the visibilty once tesseract starts working and stopping
    //stopping once it's done
    //var loader = document.getElementById("loader");

    inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function () {
        let given_im = cv.imread(imgElement);
        makebox(reff, given_im, 127, 31, 244); //the stats should be - purple
        makebox(top_left, given_im, 31, 244, 127); // the back arrow should be - teal
        makebox(top_right, given_im, 245, 130, 32); // the lightning should be - orange
        cv.imshow('canvasOutput', given_im);
        given_im.delete();
    };
}

