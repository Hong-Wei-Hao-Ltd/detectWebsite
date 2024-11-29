
document.addEventListener("DOMContentLoaded", function () {
	const processCanvasButton = document.getElementById("process-canvas");
	const mainCanvas = document.getElementById("main-canvas");
	const resultCanvas = document.getElementById("result-canvas");

	processCanvasButton.addEventListener("click", function () {
		const dataUrl = mainCanvas.toDataURL("image/jpeg");

		// 送給模型處理
		processImageWithModel(dataUrl).then(function (processedImageUrl) {
			displayResultImage(processedImageUrl);
		});
	});

	function processImageWithModel(dataUrl) {
		return new Promise(function (resolve, reject) {
			const model = "resistance-eg6us";
			const version = "3";
			const apiKey = "UB9aRpCvDKvf0BkR3BGd";
			const url = `https://detect.roboflow.com/${model}/${version}?api_key=${apiKey}`;

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `image=${encodeURIComponent(dataUrl)}`,
			})
				.then((response) => response.blob())
				.then((blob) => {
					const processedImageUrl = URL.createObjectURL(blob);
					resolve(processedImageUrl);
				})
				.catch((error) => reject(error));
		});
	}

	function displayResultImage(src) {
		const context = resultCanvas.getContext("2d");
		const img = new Image();
		img.onload = function () {
			resultCanvas.width = img.width;
			resultCanvas.height = img.height;
			context.drawImage(img, 0, 0, resultCanvas.width, resultCanvas.height);
		};
		img.src = src;
	}
});


// document.addEventListener("DOMContentLoaded", function () {
// 	//values pulled from query string
// 	document.getElementById('model').value = "resistance-eg6us";
// 	document.getElementById('version').value = "3";
// 	document.getElementById('api_key').value = "";

// 	setupButtonListeners();
// });

// var infer = function () {
// 	document.getElementById('output').innerHTML = "Inferring...";
// 	document.getElementById("resultContainer").style.display = "block";
// 	window.scrollTo(0, document.body.scrollHeight);

// 	getSettingsFromForm(function (settings) {
// 		settings.error = function (xhr) {
// 			document.getElementById('output').innerHTML = [
// 				"Error loading response.",
// 				"",
// 				"Check your API key, model, version,",
// 				"and other parameters",
// 				"then try again."
// 			].join("\n");
// 		};

// 		fetch(settings.url, {
// 			method: settings.method,
// 			body: settings.data,
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		})
// 			.then(response => response.json())
// 			.then(response => {
// 				if (settings.format == "json") {
// 					var pretty = document.createElement('pre');
// 					var formatted = JSON.stringify(response, null, 4);

// 					pretty.innerHTML = formatted;
// 					document.getElementById('output').innerHTML = "";
// 					document.getElementById('output').appendChild(pretty);
// 					window.scrollTo(0, document.body.scrollHeight);
// 				} else {
// 					var arrayBufferView = new Uint8Array(response);
// 					var blob = new Blob([arrayBufferView], {
// 						'type': 'image/jpeg'
// 					});
// 					var base64image = window.URL.createObjectURL(blob);

// 					var img = document.createElement('img');
// 					img.onload = function () {
// 						window.scrollTo(0, document.body.scrollHeight);
// 					};
// 					img.src = base64image;
// 					document.getElementById('output').innerHTML = "";
// 					document.getElementById('output').appendChild(img);
// 				}
// 			})
// 			.catch(error => settings.error(error));
// 	});
// };

// var retrieveDefaultValuesFromLocalStorage = function () {
// 	try {
// 		var api_key = localStorage.getItem("rf.api_key");
// 		var model = localStorage.getItem("rf.model");
// 		var format = localStorage.getItem("rf.format");

// 		if (api_key) document.getElementById('api_key').value = api_key;
// 		if (model) document.getElementById('model').value = model;
// 		if (format) document.getElementById('format').value = format;
// 	} catch (e) {
// 		// localStorage disabled
// 	}

// 	document.getElementById('model').addEventListener('change', function () {
// 		localStorage.setItem('rf.model', this.value);
// 	});

// 	document.getElementById('api_key').addEventListener('change', function () {
// 		localStorage.setItem('rf.api_key', this.value);
// 	});

// 	document.getElementById('format').addEventListener('change', function () {
// 		localStorage.setItem('rf.format', this.value);
// 	});
// };

// var setupButtonListeners = function () {
// 	// run inference when the form is submitted
// 	document.getElementById('inputForm').addEventListener('submit', function (event) {
// 		event.preventDefault();
// 		infer();
// 	});

// 	// make the buttons blue when clicked
// 	// and show the proper "Select file" or "Enter url" state
// 	document.querySelectorAll('.bttn').forEach(function (button) {
// 		button.addEventListener('click', function () {
// 			this.parentElement.querySelectorAll('.bttn').forEach(function (btn) {
// 				btn.classList.remove('active');
// 			});
// 			this.classList.add('active');

// 			if (document.getElementById('computerButton').classList.contains('active')) {
// 				document.getElementById('fileSelectionContainer').style.display = "block";
// 				document.getElementById('urlContainer').style.display = "none";
// 			} else {
// 				document.getElementById('fileSelectionContainer').style.display = "none";
// 				document.getElementById('urlContainer').style.display = "block";
// 			}

// 			if (document.getElementById('jsonButton').classList.contains('active')) {
// 				document.getElementById('imageOptions').style.display = "none";
// 			} else {
// 				document.getElementById('imageOptions').style.display = "block";
// 			}
// 		});
// 	});

// 	// wire styled button to hidden file input
// 	document.getElementById('fileMock').addEventListener('click', function () {
// 		document.getElementById('file').click();
// 	});

// 	// grab the filename when a file is selected
// 	document.getElementById("file").addEventListener('change', function () {
// 		var path = this.value.replace(/\\/g, "/");
// 		var parts = path.split("/");
// 		var filename = parts.pop();
// 		document.getElementById('fileName').value = filename;
// 	});
// };

// var getSettingsFromForm = function (cb) {
// 	var settings = {
// 		method: "POST",
// 	};

// 	var parts = [
// 		"https://detect.roboflow.com/",
// 		document.getElementById('model').value,
// 		"/",
// 		document.getElementById('version').value,
// 		"?api_key=" + document.getElementById('api_key').value
// 	];

// 	var classes = document.getElementById('classes').value;
// 	if (classes) parts.push("&classes=" + classes);

// 	var confidence = document.getElementById('confidence').value;
// 	if (confidence) parts.push("&confidence=" + confidence);

// 	var overlap = document.getElementById('overlap').value;
// 	if (overlap) parts.push("&overlap=" + overlap);

// 	var format = document.querySelector('#format .active').getAttribute('data-value');
// 	parts.push("&format=" + format);
// 	settings.format = format;

// 	if (format == "image") {
// 		var labels = document.querySelector('#labels .active').getAttribute('data-value');
// 		if (labels) parts.push("&labels=on");

// 		var stroke = document.querySelector('#stroke .active').getAttribute('data-value');
// 		if (stroke) parts.push("&stroke=" + stroke);

// 		settings.xhr = function () {
// 			var override = new XMLHttpRequest();
// 			override.responseType = 'arraybuffer';
// 			return override;
// 		}
// 	}

// 	var method = document.querySelector('#method .active').getAttribute('data-value');
// 	if (method == "upload") {
// 		var file = document.getElementById('file').files && document.getElementById('file').files.item(0);
// 		if (!file) return alert("Please select a file.");

// 		getBase64fromFile(file).then(function (base64image) {
// 			settings.url = parts.join("");
// 			settings.data = base64image;

// 			console.log(settings);
// 			cb(settings);
// 		});
// 	} else {
// 		var url = document.getElementById('url').value;
// 		if (!url) return alert("Please enter an image URL");

// 		parts.push("&image=" + encodeURIComponent(url));

// 		settings.url = parts.join("");
// 		console.log(settings);
// 		cb(settings);
// 	}
// };

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

// var resizeImage = function (base64Str) {
// 	return new Promise(function (resolve, reject) {
// 		var img = new Image();
// 		img.src = base64Str;
// 		img.onload = function () {
// 			var canvas = document.createElement("canvas");
// 			var MAX_WIDTH = 1500;
// 			var MAX_HEIGHT = 1500;
// 			var width = img.width;
// 			var height = img.height;
// 			if (width > height) {
// 				if (width > MAX_WIDTH) {
// 					height *= MAX_WIDTH / width;
// 					width = MAX_WIDTH;
// 				}
// 			} else {
// 				if (height > MAX_HEIGHT) {
// 					width *= MAX_HEIGHT / height;
// 					height = MAX_HEIGHT;
// 				}
// 			}
// 			canvas.width = width;
// 			canvas.height = height;
// 			var ctx = canvas.getContext('2d');
// 			ctx.drawImage(img, 0, 0, width, height);
// 			resolve(canvas.toDataURL('image/jpeg', 1.0));
// 		};
// 	});
// };