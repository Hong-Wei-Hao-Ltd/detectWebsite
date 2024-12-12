window.WebcamButtonText = {
  START: "啟動Webcam",
  STOP: "關閉Webcam",
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start-webcam").innerText = WebcamButtonText.START;
});

let currentStream = null;
let drawInterval = null;

/**
 * 繪製影像到畫布
 */
function drawVideoFrame(videoElement, canvasElement, flip = false) {
  const context = canvasElement.getContext("2d", { willReadFrequently: true });
  if (flip) {
    context.save();
    context.scale(-1, 1);
    context.drawImage(
      videoElement,
      -canvasElement.width,
      0,
      canvasElement.width,
      canvasElement.height
    );
    context.restore();
  } else {
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
  }
}

/**
 * 使用 requestAnimationFrame 繪製影像
 */
function drawVideoFrameWithRAF(videoElement, canvasElement, flip = false) {
  const context = canvasElement.getContext("2d", { willReadFrequently: true });

  function draw() {
    if (flip) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(
        videoElement,
        -canvasElement.width,
        0,
        canvasElement.width,
        canvasElement.height
      );
      context.restore();
    } else {
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
    }
    requestAnimationFrame(draw);
  }

  draw();
}

/**
 * 擷取當前影像並顯示在畫布上
 */
function captureImage(videoElement) {
  const canvas = document.getElementById("main-canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/png");
  displayImage(dataUrl);

  // 調節畫布大小避免超出整個網頁畫面
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.9;
  let currentScale = 1;

  while (
    canvas.width * currentScale > maxWidth ||
    canvas.height * currentScale > maxHeight
  ) {
    currentScale -= 0.005;
  }

  canvas.style.transformOrigin = "top left";
  canvas.style.transform = `scale(${ currentScale })`;
}

/**
 * 檢測是否為行動裝置
 * @returns {boolean}
 */
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

/**
 * 檢測是否為 iOS 裝置
 * @returns {boolean}
 */
function isIOSDevice() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * 啟動攝像頭
 * @param {string} deviceId - 攝像頭設備ID
 */
window.startCamera = async function (deviceId) {
  const videoElement = document.getElementById("webcam-video");
  const startWebcamButton = document.getElementById("start-webcam");

  if (startWebcamButton.textContent.trim() === WebcamButtonText.STOP) {
    return;
  }
  if (currentStream) {
    stopCamera();
  }
  console.debug("開始啟動攝像頭，設備ID:", deviceId);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode:
          deviceId === "user" || deviceId === "environment"
            ? { exact: deviceId }
            : { deviceId: deviceId ? { exact: deviceId } : undefined },
      },
    });

    videoElement.srcObject = stream;
    videoElement.play();
    currentStream = stream;

    if (isIOSDevice()) {
      videoElement.style.width = document.width + "px";
      videoElement.style.height = document.height + "px";
      videoElement.setAttribute("autoplay", "");
      videoElement.setAttribute("muted", "");
      videoElement.setAttribute("playsinline", "");
    }

    startWebcamButton.textContent = WebcamButtonText.STOP;
    startWebcamButton.classList.remove("btn-success");
    startWebcamButton.classList.add("btn-danger");
    document.getElementById("webcam-container").style.display = "block";

    const flip = deviceId === "user";
    if (isMobileDevice()) {
      drawVideoFrameWithRAF(
        videoElement,
        document.createElement("canvas"),
        flip
      );
    } else {
      drawInterval = setInterval(
        () =>
          drawVideoFrame(videoElement, document.createElement("canvas"), flip),
        1000 / 30
      ); // 每秒30幀
    }

    const prtWebcamButton = document.getElementById("Prt-webcam");
    prtWebcamButton.disabled = false;
    prtWebcamButton.addEventListener("click", captureImageHandler);

    console.debug("攝像頭啟動成功");
  } catch (error) {
    console.error("啟動攝像頭時出錯:", error);
  }
};

/**
 * 停止攝像頭
 */
window.stopCamera = function () {
  const videoElement = document.getElementById("webcam-video");
  const startWebcamButton = document.getElementById("start-webcam");

  if (startWebcamButton.textContent.trim() === WebcamButtonText.START) {
    return;
  }
  console.debug("開始停止攝像頭");
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    currentStream = null;

    if (startWebcamButton) {
      startWebcamButton.textContent = WebcamButtonText.START;
      startWebcamButton.classList.remove("btn-danger");
      startWebcamButton.classList.add("btn-success");
    }
  }

  if (drawInterval) {
    clearInterval(drawInterval);
    drawInterval = null;
  }

  const prtWebcamButton = document.getElementById("Prt-webcam");
  prtWebcamButton.disabled = true; // 停止Webcam時禁用拍照按鈕
  prtWebcamButton.removeEventListener("click", captureImageHandler);

  document.getElementById("webcam-container").style.display = "none";
  console.debug("攝像頭停止成功");
};

function captureImageHandler() {
  const videoElement = document.getElementById("webcam-video");
  captureImage(videoElement);
}

/**
 * 獲取並顯示可用的攝像頭設備
 */
window.getAndDisplayDevices = async function () {
  const webcamSelect = document.getElementById("webcam-select");
  const errmsg = document.getElementById("webcam-errmsg");
  errmsg.style.display = "none";
  errmsg.classList.remove("d-flex");
  const startWebcamButton = document.getElementById("start-webcam");
  startWebcamButton.disabled = false;

  webcamSelect.innerHTML = '';

  console.debug("獲取設備列表");

  const constraints = {
    video: true,
  };

  try {
    // document.getElementById("webcam-errmsg").style.display = "none";

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoTracks = stream.getVideoTracks();

    if (isMobileDevice()) {
      const backCameraOption = document.createElement("li");
      backCameraOption.innerHTML = '<a class="dropdown-item" href="#" data-value="environment">後置相機</a>';
      webcamSelect.appendChild(backCameraOption);

      const frontCameraOption = document.createElement("li");
      frontCameraOption.innerHTML = '<a class="dropdown-item" href="#" data-value="user">前置相機</a>';
      webcamSelect.appendChild(frontCameraOption);
    }

    for (const [index, track] of videoTracks.entries()) {
      if (
        isMobileDevice() &&
        ((track.getSettings().deviceId || "").toLowerCase().includes("user") ||
          (track.getSettings().deviceId || "")
            .toLowerCase()
            .includes("environment") ||
          (track.label || "").toLowerCase().includes("front") ||
          (track.label || "").toLowerCase().includes("前置") ||
          (track.label || "").toLowerCase().includes("back") ||
          (track.label || "").toLowerCase().includes("後置"))
      ) {
        continue; // 跳過行動裝置的前置/後置相機選
      }
      const option = document.createElement("li");
      option.innerHTML = `<a class="dropdown-item" href="#" data-value="${ track.getSettings().deviceId }">${ track.label || `Camera ${ index + 1 }` }</a>`;
      webcamSelect.appendChild(option);
    }

    console.debug("找到的攝像頭:", videoTracks);

    // 停止流以釋放攝像頭
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    if (error.name === "NotFoundError") {
      const errmsg = document.getElementById("webcam-errmsg");
      errmsg.style.display = "block";
      errmsg.classList.add("d-flex");
      const startWebcamButton = document.getElementById("start-webcam");
      startWebcamButton.disabled = true;

      console.debug("未找到攝像頭");
      return;
    }
    console.error("訪問媒體設備時出錯:", error);
  }
};

document.getElementById('webcam-select').addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    const selectedDeviceId = event.target.getAttribute('data-value');
    if (selectedDeviceId) {
      document.getElementById('webcamDropdown').textContent = event.target.textContent;
      console.debug("選擇的設備ID:", selectedDeviceId);
      window.stopCamera();
      window.startCamera(selectedDeviceId);
    }
  }
});
