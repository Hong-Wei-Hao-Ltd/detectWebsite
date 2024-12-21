var cvReady = false;

var resGroup = [];

function onOpenCvReady() {
    cvReady = true;
    console.debug("OpenCV 已準備好");
    document.getElementById('result-canvas').style.display = 'none';
    // drawExp(response);
}

function drawExp(response) {
    console.debug("開始 drawExp 函數");

    console.debug("回應:", response);

    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imageWidth = response.image.width;
    const imageHeight = response.image.height;

    // 設置 canvas 大小
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // 清空 canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 加載原始圖片
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        console.debug("原始圖片加載完成");
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

        // 確保圖片加載完成後再進行處理
        setTimeout(function () {
            // 找到所有的 Resistor
            const resistors = response.predictions.filter(prediction => prediction.class === "Resistor");
            const resultText = document.getElementById('result-text');
            resultText.innerHTML = '';
            console.debug("找到的電阻:", resistors);

            // 繪製電阻及其色環區塊
            resistors.forEach(resistor => {
                console.debug("處理電阻:", resistor);
                resistor.predictions = []
                const { x, y, width, height } = resistor;

                // 繪製電阻
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = document.getElementById('lineWidthRange').value * 2;
                ctx.strokeRect(x - width / 2, y - height / 2, width, height);

                // 找到屬於這個電阻的色環區塊
                response.predictions.forEach(prediction => {
                    if (prediction.class !== "Resistor") {
                        const { x: px, y: py, width: pwidth, height: pheight } = prediction;

                        // 檢查色環區塊是否在電阻範圍內，添加誤差範圍
                        const margin = 20; // 誤差範圍
                        if (px > x - width / 2 - margin && px < x + width / 2 + margin && py > y - height / 2 - margin && py < y + height / 2 + margin) {
                            console.debug("找到的色環預測:", prediction);

                            // 繪製色環區塊
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = document.getElementById('lineWidthRange').value;
                            ctx.strokeRect(px - pwidth / 2, py - pheight / 2, pwidth, pheight);

                            // 提取色環區塊的圖像數據
                            const imageData = ctx.getImageData(px - pwidth / 2, py - pheight / 2, pwidth, pheight);

                            // #region 處理色環區塊的圖像數據

                            // 主要處理
                            const { r, g, b } = getKmeansColor(imageData);
                            console.debug("平均 RGB 顏色:", { r, g, b });

                            const hsv = rgbToHsv(r, g, b);
                            if (isNaN(hsv[0]) || isNaN(hsv[1]) || isNaN(hsv[2])) {
                                console.error("無效的 HSV 值:", hsv);
                                return;
                            }

                            // #endregion

                            const color = window.expDemo
                                ? resistorData.find(d => d.id == window.expDemoId).colors[prediction.class_id]
                                : detectColor(hsv);

                            if (color) {
                                prediction.color = color;
                                console.debug("預測顏色:", { color });
                            }

                            resistor.predictions.push(prediction);
                        }
                    }
                });

                const uniquePredictions = [];
                const seen = new Set();

                resistor.predictions.forEach(prediction => {
                    const key = `${ prediction.class_id }-${ prediction.x }-${ prediction.y }`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniquePredictions.push(prediction);
                    }
                });

                // 顯示電阻的4個顏色標示
                const sortedPredictions = uniquePredictions.sort((a, b) => a.class_id - b.class_id);
                // let colorText = sortedPredictions.map(prediction => prediction.color).join(' ');

                // 計算電阻值
                const firstBand = sortedPredictions.find(prediction => prediction.class_id === 0);
                const secondBand = sortedPredictions.find(prediction => prediction.class_id === 1);
                const multiplier = sortedPredictions.find(prediction => prediction.class_id === 2);
                const tolerance = sortedPredictions.find(prediction => prediction.class_id === 3);

                if (firstBand && secondBand && multiplier && tolerance) {
                    let resistanceValue = (COLOR_CODES[firstBand.color] * 10 + COLOR_CODES[secondBand.color]) * Math.pow(10, COLOR_CODES[multiplier.color]);
                    const toleranceValue = TOLERANCE_VALUES[tolerance.color];
                    const confidence = Math.round(Math.min(...sortedPredictions.map(prediction => prediction.confidence)) * 100) + "%";

                    // 檢測是否無法計算
                    if (Number.isNaN(resistanceValue) || toleranceValue === undefined) {
                        resistanceValue = -1;
                    }
                    // 將電阻值轉換為適當的單位
                    let unit = 'Ω';
                    if (resistanceValue >= 1e9) {
                        resistanceValue /= 1e9;
                        unit = 'GΩ';
                    } else if (resistanceValue >= 1e6) {
                        resistanceValue /= 1e6;
                        unit = 'MΩ';
                    } else if (resistanceValue >= 1e3) {
                        resistanceValue /= 1e3;
                        unit = 'kΩ';
                    }

                    const resistanceText = `${ resistanceValue }${ unit } ±${ toleranceValue || "??" }%`;
                    const resistanceElement = document.createElement('div');
                    resistanceElement.classList.add("font-monospace", "resistor", "h5");

                    const badgeElement = document.createElement('div');
                    badgeElement.classList.add("badge", "border", "border-warning-subtle", "rounded", "text-bg-light", "band", "shadow");

                    badgeElement.innerHTML = `<p class="p-0 m-1">${ resistanceText }</p>
                    <span class="rounded-start-pill" style="background-color: burlywood;">&nbsp;</span><span
						class="band-${ firstBand.color }">&emsp;</span><span class="rounded-0"
						style="background-color: burlywood;">&nbsp;</span><span class="band-${ secondBand.color }">&emsp;</span><span
						class="rounded-0" style="background-color: burlywood;">&nbsp;</span><span
						class="band-${ multiplier.color }">&emsp;</span><span class="rounded-0"
						style="background-color: burlywood;">&nbsp;</span><span class="band-${ tolerance.color }">&emsp;</span><span
						class="rounded-end-pill" style="background-color: burlywood;">&nbsp;</span>`;

                    if (resistanceValue != -1) {
                        resistanceElement.appendChild(badgeElement);
                        resultText.appendChild(resistanceElement);
                    }
                    if (document.getElementById('showLabel').checked && resistanceValue != -1) {
                        ctx.font = '16px Arial';
                        ctx.textBaseline = 'top';

                        let confidenceTextWidth = ctx.measureText(confidence).width;
                        let resistanceTextWidth = ctx.measureText(resistanceText).width;
                        let textHeight = 16;

                        ctx.fillStyle = "blue";
                        ctx.fillRect(x - width / 2, y - height / 2 - 10 - textHeight / 2, resistanceTextWidth + 10, textHeight + 5);
                        ctx.fillRect(x - width / 2, y - height / 2 - 30 - textHeight / 2, confidenceTextWidth + 10, textHeight + 5);

                        ctx.fillStyle = "white";
                        ctx.fillText(resistanceText, x - width / 2 + 5, y - height / 2 - 15);
                        ctx.fillText(confidence, x - width / 2 + 5, y - height / 2 - 35);

                    }
                }

                resGroup.push(resistor);
            });
            console.debug("電阻組:", resGroup);

            // 調節畫布大小避免超出整個網頁畫面
            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.9;
            let currentScale = 1;

            while (canvas.width * currentScale > maxWidth || canvas.height * currentScale > maxHeight) {
                currentScale -= 0.005;
            }

            canvas.style.width = `${ canvas.width * currentScale }px`;
            canvas.style.height = `${ canvas.height * currentScale }px`;
            canvas.style.margin = "0";

            // 繪畫完畢後顯示 result-canvas
            document.getElementById('result-canvas').style.display = 'block';
            document.getElementById('open-new-tab').style.display = 'block';
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 500);
        }, 100);
    };
    img.onerror = function (error) {
        console.error("加載原始圖片時出錯:", error);
    };
    const mainCanvas = document.getElementById("main-canvas");
    img.src = mainCanvas.toDataURL("image/jpeg", 1.0);
}

function displayStepImage(mat, stepName) {
    if (!debugMode) return;
    const canvas = document.createElement('canvas');
    canvas.width = mat.cols;
    canvas.height = mat.rows;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // 確保輸入數據長度正確
    const clampedArray = new Uint8ClampedArray(mat.data.length * 4);
    for (let i = 0; i < mat.data.length; i++) {
        clampedArray[i * 4] = mat.data[i];
        clampedArray[i * 4 + 1] = mat.data[i];
        clampedArray[i * 4 + 2] = mat.data[i];
        clampedArray[i * 4 + 3] = 255; // 設置 alpha 通道為不透明
    }
    const imageData = new ImageData(clampedArray, mat.cols, mat.rows);
    ctx.putImageData(imageData, 0, 0);

    const label = document.createElement('div');
    label.innerText = stepName;
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.appendChild(label);
}

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
}

function detactColor() {
    if (!cvReady) {
        console.error("OpenCV 尚未準備好");
        return;
    }


}