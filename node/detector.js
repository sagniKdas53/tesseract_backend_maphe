window.onload = function () {
    //getting the images
    let imgElement = document.getElementById('imageSrc');
    let top_right = document.getElementById('Topr');
    let top_left = document.getElementById('Topl');
    let reff = document.getElementById('ref')
    let inputElement = document.getElementById('fileInput');
    console.log(reff.src);
    console.log(top_right.src);
    console.log(top_left.src);
    console.log(imgElement.src);
    //right
    let canvastopr = document.getElementById('cTopr');
    var ctr = canvastopr.getContext('2d');
    ctr.width = 72;
    ctr.height = 66;
    ctr.drawImage(top_right,0,0);
    //left
    let canvastopl = document.getElementById('cTopl');
    var ctl = canvastopl.getContext('2d');
    ctl.width = 75;
    ctl.height = 78;
    ctl.drawImage(top_left,0,0);
    //centered
    let canvascc = document.getElementById('cref');
    var ctc = canvascc.getContext('2d');
    console.log(reff.src)
    ctc.width = 99;
    ctc.height = 339;
    ctc.drawImage(reff,0,0);
    //made the loader will reimplement once the detector works
    //this is used by setting the visibilty once tesseract starts working and stopping
    //stopping once it's done
    var loader = document.getElementById("loader");
    inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function () {
        //printing to see if the real img is loaded
        console.log(imgElement.src);
        let given_im = cv.imread(imgElement);
        
        //covert canvas to mat
        let template = cv.imread(canvastopr);
        let dst = new cv.Mat();
        let mask = new cv.Mat();
        cv.matchTemplate(given_im, template, dst, cv.TM_CCOEFF, mask);
        let result = cv.minMaxLoc(dst, mask);
        let maxPoint = result.maxLoc;
        let color = new cv.Scalar(255, 0, 0, 255);
        let point = new cv.Point(maxPoint.x + template.cols, maxPoint.y + template.rows);
        cv.rectangle(given_im, maxPoint, point, color, 2, cv.LINE_8, 0);
        cv.imshow('canvasOutput', given_im);
        given_im.delete();
        dst.delete();
        mask.delete();
    };
}

