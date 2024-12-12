/**
 * 主要程式代碼
 */
var debugMode = false;
document.addEventListener("DOMContentLoaded", function () {
  const startWebcamButton = document.getElementById("start-webcam");
  /**
   * 更新輸入顯示
   */
  function updateInputDisplay() {
    let inputType = document.querySelector('input[name="btnradio"]:checked').value;
    document.getElementById("upload-form").style.display =
      inputType === "upload" ? "block" : "none";
    document.getElementById("url-form").style.display =
      inputType === "url" ? "block" : "none";
    document.getElementById("webcam-input").style.display =
      inputType === "webcam" ? "block" : "none";
    document.getElementById("exp-form").style.display =
      inputType === "exp" ? "block" : "none";

    if (inputType === "webcam") {
      window.getAndDisplayDevices();
    }
    if (inputType === "exp") {
      window.expDemo = true;
    } else {
      window.expDemo = false;
    }
    window.stopCamera();
  }

  function checkScreenSize() {
    const inputMethodContainer = document.getElementById('input-method');
    if (inputMethodContainer.offsetWidth < 600) {
      inputMethodContainer.classList.remove('btn-group');
      inputMethodContainer.classList.add('btn-group-vertical');
    } else {
      inputMethodContainer.classList.remove('btn-group-vertical');
      inputMethodContainer.classList.add('btn-group');
    }
  }

  // 初始檢查
  checkScreenSize();

  // 當視窗大小改變時重新檢查
  window.addEventListener('resize', checkScreenSize);

  const inputTypeElement = document.getElementById("input-type");
  const uploadInputElement = document.getElementById("upload-input");
  const urlInputElement = document.getElementById("url-input");
  const urlSubmitElement = document.getElementById("url-submit");
  const webcamSelectElement = document.getElementById("webcam-select");

  const radioButtons = document.querySelectorAll('input[name="btnradio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener("change", updateInputDisplay);
  });

  if (inputTypeElement) {
    inputTypeElement.addEventListener("change", updateInputDisplay);
  }

  if (uploadInputElement) {
    uploadInputElement.addEventListener("change", function (e) {
      let file = e.target.files[0];
      console.debug("上傳的檔案:", file);
      console.debug("檔案類型:", file.type || "未知");
      if (file.type === "image/heic" || file.type === "image/heif") {
        convertHeicToJpeg(file).then(displayImage);
      } else if (file.type === "image/png" || file.type === "image/jpeg") {
        let reader = new FileReader();
        reader.onload = function (event) {
          displayImage(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("只允許上傳 PNG 或 JPEG 檔案");
        e.target.value = "";
      }
    });
  }

  if (urlInputElement) {
    urlInputElement.addEventListener("change", async function () {
      let url = this.value;
      if (url) {
        const isValidImage = await checkImage(url);
        if (isValidImage) {
          displayImage(url);
        } else {
          alert("URL 不是有效的圖片");
        }
      }
    });
  }

  if (urlSubmitElement) {
    urlSubmitElement.addEventListener("click", async function () {
      let url = urlInputElement.value;
      if (url) {
        const isValidImage = await checkImage(url);
        if (isValidImage) {
          displayImage(url);
        } else {
          alert("URL 不是有效的圖片");
        }
      }
    });
  }

  if (startWebcamButton) {
    startWebcamButton.addEventListener("click", function () {
      const selectedDeviceId = webcamSelectElement.value;
      console.debug("Webcam 按鈕被點擊，選擇的設備ID:", selectedDeviceId);

      if (startWebcamButton.textContent.trim() === window.WebcamButtonText.START) {
        window.startCamera(selectedDeviceId);
      } else {
        window.stopCamera();
      }
    });
    webcamSelectElement.addEventListener("change", function () {
      window.stopCamera();
    });
  }

  const prtWebcamButton = document.getElementById("Prt-webcam");
  if (prtWebcamButton) {
    prtWebcamButton.addEventListener("click", function () {
      const videoElement = document.getElementById("webcam-video");
      captureImage(videoElement);
    });
  }

  // 初始化顯示
  updateInputDisplay();
  // window.getAndDisplayDevices();

  // 顯示結果於新分頁
  document.getElementById('open-new-tab').style.display = 'none';
  document.getElementById('open-new-tab').addEventListener('click', function () {
    const canvas = document.getElementById('result-canvas');
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    const newTab = window.open();
    newTab.document.write(`
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>輸出結果</title>
        <style>
          body {
            justify-content: center;
            align-items: center;
          }
        </style>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        />
      </head>
      <body class="bg-dark">
        <img src="${ dataUrl }" alt="輸出結果">
      </body>
      </html>
    `);
  });

  document.getElementById('resistor-examples').addEventListener('click', function (event) {
    let target = event.target;
    while (target && target.tagName !== 'LI') {
      target = target.parentElement;
    }
    if (target && target.tagName === 'LI') {
      const selectedUrl = target.getAttribute('data-value');
      const demoId = target.getAttribute('data-id');
      if (selectedUrl) {
        document.getElementById('resistorDropdown').textContent = target.querySelector('h5').textContent;
        window.expDemoId = demoId;
        displayImage(selectedUrl);
      }
    }
  });

  fetch('../../public/images/data/resistorData.json')
    .then(response => response.json())
    .then(data => {
      const resistorExamples = document.getElementById('resistor-examples');
      data.forEach((item, index) => {
        const option = document.createElement('li');
        option.setAttribute('data-value', item.url);
        option.setAttribute('data-id', item.id);
        option.innerHTML = `<a class="dropdown-item" href="#">
                              <h5 class="card-title pt-2 fs-5">${ item.name }</h5>
                              <h6 class="card-body fs-6">${ item.description }</h6>
                            </a>`;
        resistorExamples.appendChild(option);
      });
    });

  document.getElementById('resistor-examples').addEventListener('change', function () {
    const selectedUrl = this.value;
    if (selectedUrl) {
      displayImage(selectedUrl);
    }
  });

});

/**
 * 顯示圖像在畫布上
 * @param {string} src - 圖像來源URL
 */
function displayImage(src) {
  let canvas = document.getElementById("main-canvas");
  let context = canvas.getContext("2d");
  let img = new Image();

  // 顯示 input-loading 元素
  let loadingElement = document.getElementById("input-loading");
  loadingElement.style.display = "block";

  img.onload = function () {
    // 隱藏 input-loading 元素
    loadingElement.style.display = "none";

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 調節畫布大小避免超出整個網頁畫面
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    let currentScale = 1;

    while (canvas.width * currentScale > maxWidth || canvas.height * currentScale > maxHeight) {
      currentScale -= 0.01;
    }

    canvas.style.width = `${ canvas.width * currentScale }px`;
    canvas.style.height = `${ canvas.height * currentScale }px`;
    canvas.style.margin = "0";
  };
  img.src = src;
}

/**
 * 將 HEIC/HEIF 檔案轉換為 JPEG
 * @param {File} file - HEIC/HEIF 檔案
 * @returns {Promise<string>} - 轉換後的 JPEG 檔案 URL
 */
function convertHeicToJpeg(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      heic2any({
        blob: event.target.result,
        toType: "image/jpeg",
      })
        .then((conversionResult) => {
          const jpegBlob = conversionResult;
          const jpegUrl = URL.createObjectURL(jpegBlob);
          resolve(jpegUrl);
        })
        .catch(reject);
    };
    reader.readAsArrayBuffer(file);
  });
}

function checkImage(url) {
  let loadingElement = document.getElementById("input-loading");
  loadingElement.style.display = "block";
  return new Promise((resolve) => {
    var image = new Image();
    image.onload = function () {
      if (this.width > 0) {
        console.debug("image exists: ", url);
        loadingElement.style.display = "none";
        resolve(true);
      } else {
        resolve(false);
      }
    };
    image.onerror = function () {
      console.debug("image doesn't exist: ", url);
      loadingElement.style.display = "none";
      resolve(false);
    };
    image.src = url;
  });
}