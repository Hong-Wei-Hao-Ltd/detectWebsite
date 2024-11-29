document.addEventListener("DOMContentLoaded", function () {
  const confidenceRange = document.getElementById("confidenceRange");
  const confidenceNumber = document.getElementById("confidenceNumber");

  const overlapRange = document.getElementById("overlapRange");
  const overlapNumber = document.getElementById("overlapNumber");

  const lineWidthRange = document.getElementById("lineWidthRange");
  const lineWidthNumber = document.getElementById("lineWidthNumber");

  confidenceRange.addEventListener("input", function () {
    confidenceNumber.value = confidenceRange.value;
  });

  confidenceNumber.addEventListener("input", function () {
    confidenceRange.value = confidenceNumber.value;
  });

  overlapRange.addEventListener("input", function () {
    overlapNumber.value = overlapRange.value;
  });

  overlapNumber.addEventListener("input", function () {
    overlapRange.value = overlapNumber.value;
  });

  lineWidthRange.addEventListener("input", function () {
    lineWidthNumber.value = lineWidthRange.value;
  });

  lineWidthNumber.addEventListener("input", function () {
    lineWidthRange.value = lineWidthNumber.value;
  });
});
