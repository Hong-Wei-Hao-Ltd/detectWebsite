document.addEventListener("DOMContentLoaded", function () {
  const confidenceRange = document.getElementById("confidenceRange");
  const confidenceNumber = document.getElementById("confidenceNumber");

  const overlapRange = document.getElementById("overlapRange");
  const overlapNumber = document.getElementById("overlapNumber");

  const lineWidthRange = document.getElementById("lineWidthRange");
  const lineWidthNumber = document.getElementById("lineWidthNumber");

  confidenceRange.addEventListener("input", function () {
    console.debug("Confidence range input:", confidenceRange.value);
    confidenceRange.step = 5;
    let value = parseInt(confidenceRange.value, 10);
    if (value > parseInt(confidenceRange.max, 10)) {
      value = parseInt(confidenceRange.max, 10);
    } else if (value < parseInt(confidenceRange.min, 10)) {
      value = parseInt(confidenceRange.min, 10);
    }
    confidenceRange.value = value;
    confidenceNumber.value = value;
  });

  confidenceNumber.addEventListener("input", function () {
    console.debug("Confidence number input:", confidenceNumber.value);
    confidenceRange.step = 1;
    let value = parseInt(confidenceNumber.value, 10);
    if (value > parseInt(confidenceRange.max, 10)) {
      value = parseInt(confidenceRange.max, 10);
    } else if (value < parseInt(confidenceRange.min, 10)) {
      value = parseInt(confidenceRange.min, 10);
    }
    confidenceNumber.value = value;
    confidenceRange.value = value;
  });

  overlapRange.addEventListener("input", function () {
    console.debug("Overlap range input:", overlapRange.value);
    overlapRange.step = 5;
    let value = parseInt(overlapRange.value, 10);
    if (value > parseInt(overlapRange.max, 10)) {
      value = parseInt(overlapRange.max, 10);
    } else if (value < parseInt(overlapRange.min, 10)) {
      value = parseInt(overlapRange.min, 10);
    }
    overlapRange.value = value;
    overlapNumber.value = value;
  });

  overlapNumber.addEventListener("input", function () {
    console.debug("Overlap number input:", overlapNumber.value);
    overlapRange.step = 1;
    let value = parseInt(overlapNumber.value, 10);
    if (value > parseInt(overlapRange.max, 10)) {
      value = parseInt(overlapRange.max, 10);
    } else if (value < parseInt(overlapRange.min, 10)) {
      value = parseInt(overlapRange.min, 10);
    }
    overlapNumber.value = value;
    overlapRange.value = value;
  });

  lineWidthRange.addEventListener("input", function () {
    console.debug("Line width range input:", lineWidthRange.value);
    lineWidthRange.step = 1;
    let value = parseInt(lineWidthRange.value, 10);
    if (value > parseInt(lineWidthRange.max, 10)) {
      value = parseInt(lineWidthRange.max, 10);
    } else if (value < parseInt(lineWidthRange.min, 10)) {
      value = parseInt(lineWidthRange.min, 10);
    }
    lineWidthRange.value = value;
    lineWidthNumber.value = value;
  });

  lineWidthNumber.addEventListener("input", function () {
    console.debug("Line width number input:", lineWidthNumber.value);
    lineWidthRange.step = 1;
    let value = parseInt(lineWidthNumber.value, 10);
    if (value > parseInt(lineWidthRange.max, 10)) {
      value = parseInt(lineWidthRange.max, 10);
    } else if (value < parseInt(lineWidthRange.min, 10)) {
      value = parseInt(lineWidthRange.min, 10);
    }
    lineWidthNumber.value = value;
    lineWidthRange.value = value;
  });
});
