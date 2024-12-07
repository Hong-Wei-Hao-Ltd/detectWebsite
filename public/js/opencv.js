var cvReady = false;
var testResponse = {
    "inference_id": "61560fa3-5531-46f0-9874-d3e71a10d998",
    "time": 0.27952759400000105,
    "image": {
        "width": 1500,
        "height": 1500
    },
    "predictions": [
        {
            "x": 726.5,
            "y": 1064.5,
            "width": 337,
            "height": 123,
            "confidence": 0.8061307072639465,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "404ee783-fd17-498b-b389-35f831e7a9b5"
        },
        {
            "x": 747.5,
            "y": 170.5,
            "width": 337,
            "height": 111,
            "confidence": 0.8032177686691284,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "7e58c663-825a-49ec-9585-bd6e831ddb7b"
        },
        {
            "x": 740,
            "y": 394.5,
            "width": 332,
            "height": 115,
            "confidence": 0.7988061904907227,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "cd59bdb1-9355-4bff-8be6-5a98ac07d653"
        },
        {
            "x": 740.5,
            "y": 840,
            "width": 341,
            "height": 122,
            "confidence": 0.7881441712379456,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "ba444551-4043-4069-967a-8e832925ce75"
        },
        {
            "x": 740,
            "y": 616.5,
            "width": 334,
            "height": 117,
            "confidence": 0.774665117263794,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "c8f28d3e-ccea-4414-ba03-1e4e9ffd7dd5"
        },
        {
            "x": 740,
            "y": 1298,
            "width": 334,
            "height": 112,
            "confidence": 0.7478917837142944,
            "class": "Resistor",
            "class_id": 4,
            "detection_id": "ecd5bc1d-f70f-477b-8413-827a938e5fb2"
        },
        {
            "x": 685.5,
            "y": 1062,
            "width": 37,
            "height": 98,
            "confidence": 0.5483188033103943,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "23a272dd-c433-403e-9d5e-e6982c172872"
        },
        {
            "x": 706.5,
            "y": 168.5,
            "width": 39,
            "height": 97,
            "confidence": 0.5311142206192017,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "6ea5ef0c-6ba6-436d-8771-e4f763f06b80"
        },
        {
            "x": 643.5,
            "y": 167,
            "width": 37,
            "height": 110,
            "confidence": 0.5091390609741211,
            "class": "1-first-band",
            "class_id": 0,
            "detection_id": "3ab61956-1e3d-489d-af4d-84603ddbb926"
        },
        {
            "x": 841,
            "y": 1060.5,
            "width": 52,
            "height": 111,
            "confidence": 0.5015026330947876,
            "class": "4-Tolerance",
            "class_id": 3,
            "detection_id": "e0b5ef38-76f7-4ffc-94a4-933f59dc8a25"
        },
        {
            "x": 619,
            "y": 1062.5,
            "width": 40,
            "height": 111,
            "confidence": 0.4717775881290436,
            "class": "1-first-band",
            "class_id": 0,
            "detection_id": "22c43444-a1a1-4561-8936-d1885ab1e574"
        },
        {
            "x": 778.5,
            "y": 392.5,
            "width": 33,
            "height": 95,
            "confidence": 0.4464978575706482,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "9843a390-fb42-44e4-9475-661feead1775"
        },
        {
            "x": 859,
            "y": 167,
            "width": 46,
            "height": 110,
            "confidence": 0.44432899355888367,
            "class": "4-Tolerance",
            "class_id": 3,
            "detection_id": "6030a789-3a68-4806-98b6-f2c8a04cee5e"
        },
        {
            "x": 777,
            "y": 836.5,
            "width": 32,
            "height": 93,
            "confidence": 0.4424489736557007,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "5aadfb70-29f0-4fb6-b35b-3a07a17f37e5"
        },
        {
            "x": 692,
            "y": 838,
            "width": 32,
            "height": 98,
            "confidence": 0.4367096722126007,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "6a9b6ba5-bbbb-4ada-ac2b-c1db3778746c"
        },
        {
            "x": 697,
            "y": 394,
            "width": 38,
            "height": 96,
            "confidence": 0.4231286942958832,
            "class": "2-second-band",
            "class_id": 1,
            "detection_id": "0af9fc58-1d09-4465-b7b8-25d4be24cb2f"
        }
    ]
}
var resGroup = [];

function onOpenCvReady() {
    cvReady = true;
    console.debug("OpenCV 已準備好");
    document.getElementById('result-canvas').style.display = 'none';
    // drawExp(response);
}

function detectColor(hsv) {
    console.debug("檢測顏色的 HSV 值:", hsv);
    for (const [color, range] of Object.entries(COLOR_RANGES)) {
        const [hMin, sMin, vMin, hMax, sMax, vMax] = range;
        if (hsv[0] >= hMin && hsv[0] <= hMax && hsv[1] >= sMin && hsv[1] <= sMax && hsv[2] >= vMin && hsv[2] <= vMax) {
            console.debug("檢測到的顏色:", color);
            return color;
        }
    }
    console.debug("未檢測到顏色");
    return null;
}

function drawExp(response) {
    console.debug("開始 drawExp 函數");

    console.debug("回應:", response);

    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');
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
                            const data = imageData.data;

                            // 將圖像數據轉換為灰階圖像
                            const grayImage = new cv.Mat();
                            const src = cv.matFromImageData(imageData);
                            cv.cvtColor(src, grayImage, cv.COLOR_RGBA2GRAY, 0);

                            // 顯示灰階圖像
                            displayStepImage(grayImage, 'Gray Image');

                            // 使用Canny邊緣檢測
                            const edges = new cv.Mat();
                            cv.Canny(grayImage, edges, 30, 150);

                            // 顯示邊緣檢測結果
                            displayStepImage(edges, 'Edges');

                            // 計算邊緣區域的平均顏色
                            let r = 0, g = 0, b = 0, count = 0;
                            for (let i = 0; i < data.length; i += 4) {
                                if (edges.data[i / 4] > 0) { // 只考慮邊緣區域
                                    r += data[i];
                                    g += data[i + 1];
                                    b += data[i + 2];
                                    count++;
                                }
                            }
                            r = Math.floor(r / count);
                            g = Math.floor(g / count);
                            b = Math.floor(b / count);

                            // 釋放內存
                            src.delete();
                            grayImage.delete();
                            edges.delete();

                            console.debug("平均 RGB 顏色:", { r, g, b });

                            const hsv = rgbToHsv(r, g, b);
                            const color = window.expDemo ? demoDataValue[window.expDemoId].colors[prediction.class_id] : detectColor(hsv);

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

                // 顯示電阻的4個顏色並且標示上去
                const sortedPredictions = uniquePredictions.sort((a, b) => a.class_id - b.class_id);
                let colorText = sortedPredictions.map(prediction => prediction.color).join(' ');
                if (document.getElementById('showLabel').checked) {
                    ctx.fillStyle = 'black';
                    ctx.font = '16px Arial';
                    ctx.fillText(colorText, x - width / 2, y - height / 2 - 10);
                }

                // 計算電阻值
                const firstBand = sortedPredictions.find(prediction => prediction.class_id === 0);
                const secondBand = sortedPredictions.find(prediction => prediction.class_id === 1);
                const multiplier = sortedPredictions.find(prediction => prediction.class_id === 2);
                const tolerance = sortedPredictions.find(prediction => prediction.class_id === 3);

                if (firstBand && secondBand && multiplier && tolerance) {
                    let resistanceValue = (COLOR_CODES[firstBand.color] * 10 + COLOR_CODES[secondBand.color]) * Math.pow(10, COLOR_CODES[multiplier.color]);
                    const toleranceValue = TOLERANCE_VALUES[tolerance.color];

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
                    if (document.getElementById('showLabel').checked) {
                        ctx.fillText(resistanceText, x - width / 2, y - height / 2 - 30);
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
    const ctx = canvas.getContext('2d');

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