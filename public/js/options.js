document.addEventListener("DOMContentLoaded", function () {
  const confidenceRange = document.getElementById("confidenceRange");
  const confidenceNumber = document.getElementById("confidenceNumber");

  const overlapRange = document.getElementById("overlapRange");
  const overlapNumber = document.getElementById("overlapNumber");

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
});
