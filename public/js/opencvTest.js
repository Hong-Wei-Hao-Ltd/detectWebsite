function runnerS() {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = "https://m.media-amazon.com/images/I/61TXiBJbG2L.jpg";
    img.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let src = cv.imread(canvas);
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        displayStep(src, 'step1'); // 顯示灰階影像
        console.debug("顯示灰階影像");

        // 調整對比度
        let alpha = 1.5; // 對比度控制 (1.0-3.0)
        let beta = 0; // 亮度控制 (0-100)
        src.convertTo(src, -1, alpha, beta);
        displayStep(src, 'step2'); // 顯示調整對比度後的影像
        console.debug("顯示調整對比度後的影像");

        // 移除亮度讓圖片只有純色
        let thresholdValue = 200; // 調整閾值，避免淺色色環消失
        cv.threshold(src, src, thresholdValue, 255, cv.THRESH_BINARY_INV);
        displayStep(src, 'step3'); // 顯示二值化後的影像
        console.debug("顯示二值化後的影像");

        // 檢查白色雜點
        let hsv = new cv.Mat();
        cv.cvtColor(src, hsv, cv.COLOR_GRAY2BGR);
        cv.cvtColor(hsv, hsv, cv.COLOR_BGR2HSV);
        let brightness = new cv.Mat();
        let channels = new cv.MatVector();
        cv.split(hsv, channels);
        brightness = channels.get(2); // V channel
        displayStep(hsv, 'step4'); // 顯示HSV影像
        console.debug("顯示HSV影像");

        let meanBrightness = cv.mean(brightness)[0];
        if (meanBrightness > 200) {
            cv.Canny(src, dst, 50, 100, 3, false);
            displayStep(dst, 'step5'); // 顯示Canny邊緣檢測後的影像
            console.debug("顯示Canny邊緣檢測後的影像");

            // 找到輪廓
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            // 調整過濾掉小區域的閾值
            let filteredContours = new cv.MatVector();
            for (let i = 0; i < contours.size(); ++i) {
                let contour = contours.get(i);
                if (cv.contourArea(contour) > 500) { // 忽略小區域
                    filteredContours.push_back(contour);
                }
            }

            // 繪製輪廓
            let contourImage = cv.Mat.zeros(dst.rows, dst.cols, cv.CV_8UC1);
            cv.drawContours(contourImage, filteredContours, -1, new cv.Scalar(255, 255, 255), 1);
            displayStep(contourImage, 'step6'); // 顯示輪廓影像
            console.debug("顯示輪廓影像");

            // 繪製電阻顏色框線和文字
            for (let i = 0; i < filteredContours.size(); ++i) {
                let contour = filteredContours.get(i);
                let rect = cv.boundingRect(contour);
                let roi = hsv.roi(rect);

                let bestMatch = null;
                let bestColor = null;
                let bestColorBGR = null;

                for (let colorName in COLOR_RANGES) {
                    let lower = COLOR_RANGES[colorName][0];
                    let upper = COLOR_RANGES[colorName][1];
                    let mask = new cv.Mat();
                    let lowerBound = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), lower);
                    let upperBound = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), upper);

                    if (colorName === 'WHITE') {
                        mask = processWhiteColor(roi, lowerBound, upperBound);
                    } else {
                        cv.inRange(roi, lowerBound, upperBound, mask);
                    }

                    let maskSum = cv.sumElems(mask).val[0];
                    if (maskSum > 1000 && (bestMatch === null || maskSum > bestMatch)) {
                        bestMatch = maskSum;
                        bestColor = colorName;
                        bestColorBGR = COLOR_HEX[colorName];
                    }

                    mask.delete();
                    lowerBound.delete();
                    upperBound.delete();
                }

                if (bestColor) {
                    cv.rectangle(src, new cv.Point(rect.x, rect.y), new cv.Point(rect.x + rect.width, rect.y + rect.height), bestColorBGR, 2);
                    cv.putText(src, bestColor, new cv.Point(rect.x, rect.y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, bestColorBGR, 2);
                }

                roi.delete();
            }

            contours.delete();
            hierarchy.delete();
            filteredContours.delete();
            contourImage.delete();
        } else {
            dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
            displayStep(dst, 'step7'); // 顯示空白影像
            console.debug("顯示空白影像");
        }

        src.delete();
        dst.delete();
        hsv.delete();
        brightness.delete();
        channels.delete();
    };
};

function processWhiteColor(roi, lowerBound, upperBound) {
    let mask = new cv.Mat();
    cv.inRange(roi, lowerBound, upperBound, mask);

    // 使用形態學操作來處理遮罩
    let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel);
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel);

    // 附加亮度檢查
    let hsvRoi = new cv.Mat();
    cv.cvtColor(roi, hsvRoi, cv.COLOR_BGR2HSV);
    let brightness = new cv.Mat();
    let channels = new cv.MatVector();
    cv.split(hsvRoi, channels);
    brightness = channels.get(2); // V channel

    let meanBrightness = cv.mean(brightness)[0];
    if (meanBrightness > 200) {
        return mask;
    } else {
        return cv.Mat.zeros(mask.rows, mask.cols, mask.type());
    }
}

const COLOR_RANGES = {
    'BLACK': [[0, 0, 0], [180, 255, 30]],
    'BROWN': [[10, 50, 50], [20, 255, 200]],
    'RED': [[0, 50, 50], [10, 255, 255]],
    'ORANGE': [[10, 50, 50], [25, 255, 255]],
    'YELLOW': [[25, 50, 50], [35, 255, 255]],
    'GREEN': [[35, 50, 50], [85, 255, 255]],
    'BLUE': [[85, 50, 50], [125, 255, 255]],
    'PURPLE': [[125, 50, 50], [160, 255, 255]],
    'GRAY': [[0, 0, 50], [180, 50, 200]],
    'WHITE': [[0, 0, 200], [180, 30, 255]],
    'GOLD': [[20, 50, 50], [30, 255, 255]],
    'SILVER': [[0, 0, 100], [180, 20, 200]],
};

const COLOR_HEX = {
    'BLACK': [0, 0, 0],
    'BROWN': [42, 42, 165],
    'RED': [0, 0, 255],
    'ORANGE': [0, 165, 255],
    'YELLOW': [0, 255, 255],
    'GREEN': [0, 255, 0],
    'BLUE': [255, 0, 0],
    'PURPLE': [255, 0, 255],
    'GRAY': [128, 128, 128],
    'WHITE': [255, 255, 255],
    'GOLD': [0, 215, 255],
    'SILVER': [192, 192, 192],
};

function displayStep(mat, stepId) {
    let canvas = document.getElementById(stepId);
    cv.imshow(canvas, mat);
}