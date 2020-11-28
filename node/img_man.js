window.onload = function () {
    let imgElement = document.getElementById('imageSrc');
    let inputElement = document.getElementById('fileInput');
    var x = document.getElementById("ldr");
    inputElement.addEventListener('change', (e) => {
      imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function () {
      console.log(imgElement.src)
      read_text(imgElement.src, x)
      let mat = cv.imread(imgElement);
      cv.imshow('canvasOutput', mat);
      mat.delete();
    };
  }
  function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
  }