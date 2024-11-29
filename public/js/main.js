/**
 * 主要程式代碼
 */
document.addEventListener("DOMContentLoaded", function () {
  const startWebcamButton = document.getElementById("start-webcam");
  const themeToggleButton = document.getElementById("theme-toggle");

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
    if (inputType === "webcam") {
      window.getAndDisplayDevices();
    }
  }

  /**
   * 切換主題
   */
  function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    body.setAttribute("data-bs-theme", newTheme);
    themeToggleButton.querySelector(".material-icons").innerHTML = newTheme === "light" ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg>`;
  }

  const inputTypeElement = document.getElementById("input-type");
  const uploadInputElement = document.getElementById("upload-input");
  const urlInputElement = document.getElementById("url-input");
  const urlSubmitElement = document.getElementById("url-submit");
  const webcamSelectElement = document.getElementById("webcam-select");

  const radioButtons = document.querySelectorAll('input[name="btnradio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener("change", updateInputDisplay);
  });

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  if (inputTypeElement) {
    inputTypeElement.addEventListener("change", updateInputDisplay);
  }

  if (uploadInputElement) {
    uploadInputElement.addEventListener("change", function (e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function (event) {
        displayImage(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  if (urlInputElement) {
    urlInputElement.addEventListener("change", function () {
      let url = this.value;
      if (url) {
        displayImage(url);
      }
    });
  }
  if (urlSubmitElement) {
    urlSubmitElement.addEventListener("click", function () {
      let url = urlInputElement.value;
      if (url) {
        displayImage(url);
      }
    });
  }

  if (startWebcamButton) {
    startWebcamButton.addEventListener("click", function () {
      const selectedDeviceId = webcamSelectElement.value;
      console.debug("Webcam button clicked, selectedDeviceId:", selectedDeviceId);

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

});
/**
 * 顯示圖像在畫布上
 * @param {string} src - 圖像來源URL
 */
function displayImage(src) {
  let canvas = document.getElementById("main-canvas");
  let context = canvas.getContext("2d");
  let img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 調節畫布大小避免超出整個網頁畫面
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    let currentScale = 1;

    while (canvas.width * currentScale > maxWidth || canvas.height * currentScale > maxHeight) {
      currentScale -= 0.05;
    }

    canvas.style.transformOrigin = "top left";
    canvas.style.transform = `scale(${ currentScale })`;
  };
  img.src = src;
}
