const WebcamButtonText = {
  START: "啟動Webcam",
  STOP: "關閉Webcam",
};

let currentStream = null;
const videoElement = document.createElement("video");
videoElement.setAttribute("autoplay", "");
videoElement.setAttribute("playsinline", "");
const startWebcamButton = document.getElementById("start-webcam");

async function startCamera(deviceId) {
  console.debug("Starting camera with deviceId:", deviceId);
  if (currentStream) {
    stopCamera();
  }

  if (startWebcamButton.textContent === WebcamButtonText.STOP) {
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: deviceId ? { exact: deviceId } : undefined },
    });

    videoElement.srcObject = stream;
    currentStream = stream;

    startWebcamButton.textContent = WebcamButtonText.STOP;
    startWebcamButton.classList.remove("btn-success");
    startWebcamButton.classList.add("btn-danger");
    console.debug("Camera started successfully");
  } catch (error) {
    console.error("Error starting camera:", error);
  }
}

function stopCamera() {
  console.debug("Stopping camera");
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    currentStream = null;

    startWebcamButton.textContent = WebcamButtonText.START;
    startWebcamButton.classList.remove("btn-danger");
    startWebcamButton.classList.add("btn-success");
    console.debug("Camera stopped successfully");
  }

  if (startWebcamButton.textContent === WebcamButtonText.START) {
    return;
  }
}

async function getAndDisplayDevices() {
  console.debug("Getting list of devices");
  const deviceInfos = await navigator.mediaDevices.enumerateDevices();
  console.debug("Available input and output devices:", deviceInfos);
  const webcamSelect = document.getElementById("webcam-select");

  // 清空現有選項
  webcamSelect.innerHTML = "";

  const videoDevices = deviceInfos.filter(
    (device) => device.kind === "videoinput"
  );

  if (videoDevices.length === 0) {
    const option = document.createElement("option");
    option.value = "none";
    option.text = "無法獲取Webcam";
    webcamSelect.appendChild(option);
    console.debug("No webcams found");
  } else {
    for (const deviceInfo of videoDevices) {
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      option.text = deviceInfo.label || `Camera ${webcamSelect.length + 1}`;
      webcamSelect.appendChild(option);
    }
    console.debug("Webcams found:", videoDevices);
  }
}

function onOpenCvReady() {
  function updateInputDisplay() {
    let inputType = document.getElementById("input-type").value;
    document.getElementById("upload-input").style.display =
      inputType === "upload" ? "block" : "none";
    document.getElementById("url-input").style.display =
      inputType === "url" ? "block" : "none";
    document.getElementById("webcam-input").style.display =
      inputType === "webcam" ? "block" : "none";
  }

  document
    .getElementById("input-type")
    .addEventListener("change", updateInputDisplay);

  document
    .getElementById("upload-input")
    .addEventListener("change", function (e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function (event) {
        displayImage(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  document.getElementById("url-input").addEventListener("change", function () {
    let url = this.value;
    if (url) {
      displayImage(url);
    }
  });

  startWebcamButton.addEventListener("click", function () {
    const selectedDeviceId = document.getElementById("webcam-select").value;
    console.debug("Webcam button clicked, selectedDeviceId:", selectedDeviceId);

    if (startWebcamButton.textContent === WebcamButtonText.START) {
      startCamera(selectedDeviceId);
    } else {
      stopCamera();
    }
  });

  // 初始化顯示
  updateInputDisplay();
}

function displayImage(src) {
  let canvas = document.getElementById("main-canvas");
  let context = canvas.getContext("2d");
  let img = new Image();
  img.onload = function () {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = src;
}
