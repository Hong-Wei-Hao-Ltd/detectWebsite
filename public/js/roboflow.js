/**
 * 當DOM內容加載完成後設置按鈕監聽器
 */
document.addEventListener("DOMContentLoaded", function () {
  //values pulled from query string
  document.getElementById("model").value = "resistance-eg6us";
  document.getElementById("version").value = "3";
  document.getElementById("api_key").value = "UB9aRpCvDKvf0BkR3BGd";

  setupButtonListeners();
});

const runButton = {
  RUN: `<svg xmlns="http://www.w3.org/2000/svg"
          width="24"
					height="24"
					fill="currentColor"
					class= "bi bi-play-fill"
					viewBox="0 0 16 16">
            <path
              d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
            />
				</svg>執行`,
  LOADING:
    '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div> 執行',
};

/**
 * 執行推理並顯示結果
 */
var infer = function () {
  console.debug("開始推理");
  resGroup = [];
  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;
  submitButton.innerHTML = runButton.LOADING;

  // 顯示秒數
  const timerDiv = document.createElement("div");
  timerDiv.style.display = "inline-block";
  timerDiv.style.marginLeft = "10px";
  submitButton.appendChild(timerDiv);

  let startTime = Date.now();
  let timerInterval = setInterval(() => {
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerDiv.textContent = `(${ elapsedTime }s)`;
  }, 1000);

  document.getElementById("output").innerHTML = "運算中...";
  document.getElementById("resultContainer").style.display = "block";

  getSettingsFromForm(function (settings) {
    settings.error = function (xhr) {
      console.debug("推理失敗");
      clearInterval(timerInterval);
      document.getElementById("output").innerHTML = [
        "加載響應時出錯。",
        "",
        "請檢查您的API密鑰、模型、版本，",
        "和其他參數(如圖片格式、URL、或文件)是否正確",
        "然後再試一次。",
      ].join("\n");
      submitButton.disabled = false;
      submitButton.innerHTML = runButton.RUN;
    };

    fetch(settings.url, {
      method: settings.method,
      body: settings.data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.debug("fetch 成功，開始讀取數據");
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0;
        let chunks = [];
        let startTime = Date.now();

        return reader
          .read()
          .then(function processText({ done, value }) {
            if (done) {
              const chunksAll = new Uint8Array(receivedLength);
              let position = 0;
              for (let chunk of chunks) {
                chunksAll.set(chunk, position);
                position += chunk.length;
              }
              const result = new TextDecoder("utf-8").decode(chunksAll);
              return JSON.parse(result);
            }

            chunks.push(value);
            receivedLength += value.length;

            // 將 stream 的部分數據顯示在 output div 中
            const outputDiv = document.getElementById("output");
            const streamDiv = document.createElement("div");
            streamDiv.textContent = new TextDecoder("utf-8").decode(value);
            outputDiv.appendChild(streamDiv);

            return new Promise((resolve) =>
              setTimeout(() => resolve(reader.read().then(processText)), 50)
            );
          })
          .then((result) => {
            const elapsedTime = Date.now() - startTime;
            const minDisplayTime = 1000;
            if (elapsedTime < minDisplayTime) {
              return new Promise((resolve) =>
                setTimeout(() => resolve(result), minDisplayTime - elapsedTime)
              );
            }
            return result;
          });
      })
      .then((response) => {
        console.debug("數據讀取完成，開始處理數據");
        clearInterval(timerInterval);
        if (settings.format == "json") {
          var pretty = document.createElement("pre");
          var formatted = JSON.stringify(response, null, 4);

          pretty.innerHTML = formatted;
          document.getElementById("output").innerHTML = "";
          document.getElementById("output").appendChild(pretty);
        } else {
          var arrayBufferView = new Uint8Array(response);
          var blob = new Blob([arrayBufferView], {
            type: "image/jpeg",
          });
          var base64image = window.URL.createObjectURL(blob);

          var img = document.createElement("img");
          img.src = base64image;
          document.getElementById("output").innerHTML = "";
          document.getElementById("output").appendChild(img);
        }
        drawExp(response);
        console.debug("推理完成");
        submitButton.disabled = false;
        submitButton.innerHTML = runButton.RUN;
      })
      .catch((error) => {
        console.debug("推理過程中出錯");
        clearInterval(timerInterval);
        settings.error(error);
        submitButton.disabled = false;
        submitButton.innerHTML = runButton.RUN;
      });
  });
};

/**
 * 從本地存儲中檢索默認值
 */
var retrieveDefaultValuesFromLocalStorage = function () {
  try {
    var api_key = localStorage.getItem("rf.api_key");
    var model = localStorage.getItem("rf.model");
    var format = localStorage.getItem("rf.format");

    if (api_key) document.getElementById("api_key").value = api_key;
    if (model) document.getElementById("model").value = model;
    if (format) document.getElementById("format").value = format;
  } catch (e) {
    // localStorage disabled
  }

  document.getElementById("model").addEventListener("change", function () {
    localStorage.setItem("rf.model", this.value);
  });

  document.getElementById("api_key").addEventListener("change", function () {
    localStorage.setItem("rf.api_key", this.value);
  });

  document.getElementById("format").addEventListener("change", function () {
    localStorage.setItem("rf.format", this.value);
  });
};

/**
 * 設置按鈕監聽器
 */
var setupButtonListeners = function () {
  // 提交表單時運行推理
  document.getElementById("submit").innerHTML = runButton.RUN;
  document.getElementById("submit").addEventListener("click", function (event) {
    this.dataset.clicked = true;
    if (checkCanvasEmpty()) {
      const stepG1 = document.getElementById('stepG1');
      stepG1.scrollIntoView();
      updateSubmitButtonState()
      return;
    }
    event.preventDefault();
    infer();
  });
};

/**
 * 從表單中獲取設置
 * @param {Function} cb 回調函數
 */
var getSettingsFromForm = function (cb) {
  var settings = {
    method: "POST",
  };

  var parts = [
    "https://detect.roboflow.com/",
    document.getElementById("model").value,
    "/",
    document.getElementById("version").value,
    "?api_key=" + document.getElementById("api_key").value,
  ];

  var classes = document.getElementById("classes")?.value || "";
  if (classes) parts.push("&classes=" + classes);

  var confidence = document.getElementById("confidenceNumber").value;
  if (confidence) parts.push("&confidence=" + confidence);

  var overlap = document.getElementById("overlapNumber").value;
  if (overlap) parts.push("&overlap=" + overlap);

  // var format = document.querySelector('#format .active').getAttribute('data-value');
  var format = "json";
  parts.push("&format=" + format);
  settings.format = format;

  // if (format == "image") {
  // 	var labels = document.querySelector('#labels .active').getAttribute('data-value');
  // 	if (labels) parts.push("&labels=on");

  // 	var stroke = document.querySelector('#stroke .active').getAttribute('data-value');
  // 	if (stroke) parts.push("&stroke=" + stroke);

  // 	settings.xhr = function () {
  // 		var override = new XMLHttpRequest();
  // 		override.responseType = 'arraybuffer';
  // 		return override;
  // 	}
  // }

  var method = document.querySelector('input[name="btnradio"]:checked').value;

  if (method == "upload" || method == "webcam" || method == "exp") {
    getBase64fromCanvas()
      .then(function (base64image) {
        settings.url = parts.join("");
        settings.data = base64image;

        console.log(settings);
        cb(settings);
      })
      .catch(function (error) {
        alert("將畫布轉換為 Base64 時發生錯誤：" + error);
      });
  } else if (method == "url") {
    var url = document.getElementById("url-input").value;
    if (!url) return alert("請輸入影像網址");

    parts.push("&image=" + encodeURIComponent(url));

    settings.url = parts.join("");
    settings.data = JSON.stringify({ image: url });

    // 加載圖片到 main-canvas 畫布上
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.getElementById("main-canvas");
      var ctx = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      cb(settings);
    };
    img.src = url;
  } else {
    alert("未知的方式");
    const submitButton = document.getElementById("submit");
    submitButton.disabled = false;
    submitButton.innerHTML = runButton.RUN;
  }
};

/**
 * 將 main-canvas 內容轉換為 Base64 格式
 * @returns {Promise<string>} Base64字符串
 */
var getBase64fromCanvas = function () {
  return new Promise(function (resolve, reject) {
    try {
      var canvas = document.getElementById("main-canvas");
      var base64image = canvas.toDataURL("image/jpeg", 1.0);
      resolve(base64image);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 將文件轉換為Base64格式
 * @param {File} file 文件對象
 * @returns {Promise<string>} Base64字符串
 */
// var getBase64fromFile = function (file) {
// 	return new Promise(function (resolve, reject) {
// 		var reader = new FileReader();
// 		reader.readAsDataURL(file);
// 		reader.onload = function () {
// 			resizeImage(reader.result).then(function (resizedImage) {
// 				resolve(resizedImage);
// 			});
// 		};
// 		reader.onerror = function (error) {
// 			reject(error);
// 		};
// 	});
// };

/**
 * 調整圖像大小
 * @param {string} base64Str Base64字符串
 * @returns {Promise<string>} 調整大小後的Base64字符串
 */
var resizeImage = function (base64Str) {
  return new Promise(function (resolve, _reject) {
    var img = new Image();
    img.src = base64Str;
    img.onload = function () {
      var canvas = document.createElement("canvas");
      var MAX_WIDTH = 1500;
      var MAX_HEIGHT = 1500;
      var width = img.width;
      var height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 1.0));
    };
  });
};
