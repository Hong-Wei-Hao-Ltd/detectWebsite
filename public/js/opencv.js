function onOpenCvReady() {
    console.debug("OpenCV is ready");

    var response = {
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
    img.onload = function () {
        console.debug("Original image loaded");
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

        // 找到所有的 Resistor
        const resistors = response.predictions.filter(prediction => prediction.class === "Resistor");

        // 繪製電阻及其色環區塊
        resistors.forEach(resistor => {
            const { x, y, width, height } = resistor;

            // 繪製電阻
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - width / 2, y - height / 2, width, height);

            // 找到屬於這個電阻的色環區塊
            response.predictions.forEach(prediction => {
                if (prediction.class !== "Resistor") {
                    const { x: px, y: py, width: pwidth, height: pheight } = prediction;

                    // 檢查色環區塊是否在電阻範圍內，添加誤差範圍
                    const margin = 20; // 誤差範圍
                    if (px > x - width / 2 - margin && px < x + width / 2 + margin && py > y - height / 2 - margin && py < y + height / 2 + margin) {
                        // 繪製色環區塊
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(px - pwidth / 2, py - pheight / 2, pwidth, pheight);
                    }
                }
            });
        });

        // 調節畫布大小避免超出整個網頁畫面
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        let currentScale = 1;

        while (canvas.width * currentScale > maxWidth || canvas.height * currentScale > maxHeight) {
            currentScale -= 0.05;
        }

        canvas.style.width = `${canvas.width * currentScale}px`;
        canvas.style.height = `${canvas.height * currentScale}px`;
        canvas.style.margin = "0";
    };
    img.onerror = function (error) {
        console.error("Error loading original image:", error);
    };
    img.src = 'https://m.media-amazon.com/images/I/61TXiBJbG2L.jpg'; // 替換為原始圖片的實際路徑
}