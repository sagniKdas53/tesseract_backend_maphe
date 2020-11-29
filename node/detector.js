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
    cv.rectangle(oCm, minPoint, new cv.Point(minPoint.x + template.rows, minPoint.y + template.cols), new cv.Scalar(0,r,0,g,0,b), 2, cv.LINE_8, 0); //works well
    dst.delete();
    mask.delete();
};

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
    console.log("Attack "+ atta.src);
    console.log("Crit Damage "+ cd.src);
    console.log("Swords Locator "+ sw.src);
    console.log("Back arrow bigger "+ top_left_big.src);
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
        //makebox(reff, given_im, 127, 31, 244); //the stats should be - purple - hopeless won't work
        //makebox(top_left, given_im, 31, 244, 127); // the back arrow should be - teal - works but sometimes
        //makebox(top_right, given_im, 245, 130, 32); // the lightning should be - orange - fails drastically
        //makebox(atta,given_im,255,255,255); // fails drastically
        //makebox(cd,given_im,255,255,255); // fails drastically
        makebox(top_left_big,given_im,255,255,255); //works
        //makebox(sw,given_im,255,255,255); // fails drastically
        // fails drastically means misses the region by a lot the plot still occures but not where it's needed
        cv.imshow('canvasOutput', given_im);
        given_im.delete();
    };
}

