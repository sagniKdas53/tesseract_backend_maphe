window.onload = function () {
    //getting the images
    let imgElement = document.getElementById('imageSrc');
    let top_right = document.getElementById('Topr');
    let top_left = document.getElementById('Topl');
    let reff = document.getElementById('ref')
    let inputElement = document.getElementById('fileInput');
    console.log(reff.src);
    console.log("This is the one being " + top_right.src);
    console.log(top_left.src);
    console.log(imgElement.src);
    //made the loader will reimplement once the detector works
    //this is used by setting the visibilty once tesseract starts working and stopping
    //stopping once it's done
    //var loader = document.getElementById("loader");
    
    inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function () {
        //printing to see if the real img is loaded
        console.log(imgElement.src);
        let given_im = cv.imread(imgElement);

        //covert canvas to mat
        //template right
        let template = cv.imread(top_right);
        console.log("Template rows and columns:",template.rows, template.cols);
        //template left
        //let templateLeft = cv.imread(top_left);
        //template stat
        //let templateStat = cv.imread(reff)
        //console.log(template)
        //console.log(template.rows, template.cols)
        let dst = new cv.Mat();
        let mask = new cv.Mat();
        cv.matchTemplate(given_im, template, dst, cv.TM_CCOEFF, mask);
        //let result = cv.minMaxLoc(dst, mask);
        //console.log("output of minMaxLoc",result);
        //let maxPoint = result.maxLoc;
        let minPoint = cv.minMaxLoc(dst, mask).minLoc;
        console.log("Maxpoint",maxPoint,"Minpoint",minPoint);
        //let color = new cv.Scalar(0, 255, 0, 255);
        //let point = new cv.Point(minPoint.x+template.rows, minPoint.y+template.cols);
        //console.log(point)
        //let pointr = new cv.Point(maxPoint.x+template.rows, maxPoint.y+template.cols);
        //console.log(pointr)
        cv.rectangle(given_im, minPoint, new cv.Point(minPoint.x+template.rows, minPoint.y+template.cols), new cv.Scalar(0, 255, 0, 255), 2, cv.LINE_8, 0);
        // so minPoint is the needed starting point, and 
        //let point = new cv.Point(minPoint.x+template.rows, minPoint.y+template.cols);
        // is the needed end point.
        cv.imshow('canvasOutput', given_im);
        given_im.delete();
        dst.delete();
        mask.delete();
    };
}

