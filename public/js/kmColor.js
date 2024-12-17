function getKmeansColor(imageData) {
    // # 讀取影像
    let src = cv.matFromImageData(imageData);

    // # 獲取影像尺寸
    let height = src.rows;
    let width = src.cols;

    // # 重塑影像資料為二維陣列
    let samples = new cv.Mat(height * width, 3, cv.CV_32F);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let pixel = src.ucharPtr(y, x);
            samples.floatPtr(y * width + x)[0] = pixel[0];
            samples.floatPtr(y * width + x)[1] = pixel[1];
            samples.floatPtr(y * width + x)[2] = pixel[2];
        }
    }

    // # 定義 K-means 聚類的準則和執行次數
    let k = 3;
    let criteria = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10, 1.0);
    let attempts = 10;
    let labels = new cv.Mat();
    let centers = new cv.Mat();

    // # 執行 K-means 聚類
    cv.kmeans(samples, k, labels, criteria, attempts, cv.KMEANS_PP_CENTERS, centers);

    // # 將中心點轉換回整數型別
    centers.convertTo(centers, cv.CV_8U);

    // # 計算每個類群的像素數量
    let counts = new Array(k).fill(0);
    for (let i = 0; i < labels.rows; i++) {
        counts[labels.intAt(i, 0)]++;
    }

    // # 找出像素數量最多的類群（假設為底色）
    let maxCount = Math.max(...counts);
    let backgroundColorIndex = counts.indexOf(maxCount);

    // # 排除底色類群，找出剩下的兩個主要類群
    let mainColors = [];
    for (let i = 0; i < k; i++) {
        if (i !== backgroundColorIndex) {
            mainColors.push({ color: centers.row(i), count: counts[i] });
        }
    }

    // # 計算每個類群到圖片中心的平均距離
    let centerX = width / 2;
    let centerY = height / 2;
    mainColors.forEach(color => {
        let sumDistance = 0;
        let count = 0;
        for (let i = 0; i < labels.rows; i++) {
            if (labels.intAt(i, 0) === color.color) {
                let x = i % width;
                let y = Math.floor(i / width);
                let distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                sumDistance += distance;
                count++;
            }
        }
        color.avgDistance = sumDistance / count;
    });

    // # 根據平均距離排序類群
    mainColors.sort((a, b) => a.avgDistance - b.avgDistance);

    // # 顯示兩個主要類群的顏色
    let mainColor1 = mainColors[0].color;
    // let mainColor2 = mainColors[1].color;

    // # 根據距離排序像素 -> 抓取第一個的rgb顏色
    let r = mainColor1.data[0];
    let g = mainColor1.data[1];
    let b = mainColor1.data[2];

    // 釋放資源
    src.delete();
    samples.delete();
    labels.delete();
    centers.delete();
    console.debug("mainColor1", mainColor1);

    return { r, g, b };
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

// #endregion
// #region 未使用
// import cv2
// import numpy as np

// # 讀取影像
// image = cv2.imread('image4.png')
// image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

// # 獲取影像尺寸
// height, width, _ = image.shape
// center_x, center_y = width // 2, height // 2

// # 計算每個像素到圖片中心的距離
// y, x = np.indices((height, width))
// distances = np.sqrt((x - center_x) ** 2 + (y - center_y) ** 2)

// # 重塑影像資料為二維陣列
// pixels = image.reshape((-1, 3))
// distances = distances.flatten()

// # 轉換為浮點數型別
// pixels = np.float32(pixels)

// # 定義 K-means 聚類的準則和執行次數
// criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
// num_clusters = 3

// # 執行 K-means 聚類
// _, labels, centers = cv2.kmeans(pixels, num_clusters, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

// # 將中心點轉換回整數型別
// centers = np.uint8(centers)

// # 計算每個類群的像素數量
// counts = np.bincount(labels.flatten())

// # 找出像素數量最多的類群（假設為底色）
// background_index = np.argmax(counts)

// # 排除底色類群，找出剩下的兩個主要類群
// remaining_indices = np.argsort(counts)[-3:-1]

// # 計算每個類群到圖片中心的平均距離
// average_distances = [np.mean(distances[labels.flatten() == i]) for i in remaining_indices]

// # 根據平均距離排序類群
// sorted_indices = [x for _, x in sorted(zip(average_distances, remaining_indices))]

// # 顯示兩個主要類群的顏色
// dominant_colors = centers[sorted_indices]
// print(f"主要顏色1: {dominant_colors[0]}")
// print(f"主要顏色2: {dominant_colors[1]}")

// # 根據距離排序像素
// sorted_pixel_indices = np.argsort(distances)

// # 創建標示影像
// labeled_image = np.zeros_like(image, dtype=np.uint8)

// # 標示每個像素的類群
// for i in sorted_pixel_indices:
//     y, x = divmod(i, width)
//     labeled_image[y, x] = centers[labels[i]]

// # 顯示結果影像
// cv2.imshow('Labeled Image', cv2.cvtColor(labeled_image, cv2.COLOR_RGB2BGR))
// cv2.waitKey(0)
// cv2.destroyAllWindows()