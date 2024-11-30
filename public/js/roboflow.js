/**
 * 當DOM內容加載完成後設置按鈕監聽器
 */
document.addEventListener("DOMContentLoaded", function () {
	//values pulled from query string
	document.getElementById('model').value = "resistance-eg6us";
	document.getElementById('version').value = "3";
	document.getElementById('api_key').value = "UB9aRpCvDKvf0BkR3BGd";

	setupButtonListeners();
});

/**
 * 執行推理並顯示結果
 */
var infer = function () {
	document.getElementById('output').innerHTML = "運算中...";
	document.getElementById("resultContainer").style.display = "block";
	window.scrollTo(0, document.body.scrollHeight);

	getSettingsFromForm(function (settings) {
		settings.error = function (xhr) {
			document.getElementById('output').innerHTML = [
				"加載響應時出錯。",
				"",
				"請檢查您的API密鑰、模型、版本，",
				"和其他參數(如圖片格式、URL、或文件)是否正確",
				"然後再試一次。"
			].join("\n");
		};

		fetch(settings.url, {
			method: settings.method,
			body: settings.data,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(response => {
				if (settings.format == "json") {
					var pretty = document.createElement('pre');
					var formatted = JSON.stringify(response, null, 4);

					pretty.innerHTML = formatted;
					document.getElementById('output').innerHTML = "";
					document.getElementById('output').appendChild(pretty);
					window.scrollTo(0, document.body.scrollHeight);
					drawExp(response);
				} else {
					var arrayBufferView = new Uint8Array(response);
					var blob = new Blob([arrayBufferView], {
						'type': 'image/jpeg'
					});
					var base64image = window.URL.createObjectURL(blob);

					var img = document.createElement('img');
					img.onload = function () {
						window.scrollTo(0, document.body.scrollHeight);
					};
					img.src = base64image;
					document.getElementById('output').innerHTML = "";
					document.getElementById('output').appendChild(img);
					drawExp(response);
				}
			})
			.catch(error => settings.error(error));
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

		if (api_key) document.getElementById('api_key').value = api_key;
		if (model) document.getElementById('model').value = model;
		if (format) document.getElementById('format').value = format;
	} catch (e) {
		// localStorage disabled
	}

	document.getElementById('model').addEventListener('change', function () {
		localStorage.setItem('rf.model', this.value);
	});

	document.getElementById('api_key').addEventListener('change', function () {
		localStorage.setItem('rf.api_key', this.value);
	});

	document.getElementById('format').addEventListener('change', function () {
		localStorage.setItem('rf.format', this.value);
	});
};

/**
 * 設置按鈕監聽器
 */
var setupButtonListeners = function () {
	// 提交表單時運行推理
	document.getElementById('submit').addEventListener('click', function (event) {
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
		document.getElementById('model').value,
		"/",
		document.getElementById('version').value,
		"?api_key=" + document.getElementById('api_key').value
	];

	var classes = document.getElementById('classes')?.value || "";
	if (classes) parts.push("&classes=" + classes);

	var confidence = document.getElementById('confidenceNumber').value;
	if (confidence) parts.push("&confidence=" + confidence);



	var overlap = document.getElementById('overlapNumber').value;
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

	if (method == "upload" || method == "webcam") {
		getBase64fromCanvas().then(function (base64image) {
			settings.url = parts.join("");
			settings.data = base64image;

			console.log(settings);
			cb(settings);
		}).catch(function (error) {
			alert("將畫布轉換為 Base64 時發生錯誤：" + error);
		});
	} else if (method == "url") {
		var url = document.getElementById('url-input').value;
		if (!url) return alert("請輸入影像網址");

		parts.push("&image=" + encodeURIComponent(url));

		settings.url = parts.join("");
		settings.data = JSON.stringify({ image: url });

		// 加載圖片到 main-canvas 畫布上
		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function () {
			var canvas = document.getElementById("main-canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);
			cb(settings);
		};
		img.src = url;
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
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', 1.0));
		};
	});
};