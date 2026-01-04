const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const dropArea = document.getElementById("dropArea");

const uploadBox = document.getElementById("uploadBox");
const cards = document.getElementById("cards");

const previewImg = document.getElementById("previewImg");
const resultImg = document.getElementById("resultImg");

const removeBtn = document.getElementById("removeBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

const loader = document.getElementById("loader");
const statusText = document.getElementById("statusText");

let file = null;
const API_URL = "https://api.remove.bg/v1.0/removebg";
const API_KEY = "YOUR_API_KEY_HERE"; // ⚠️ Move to backend in production

uploadBtn.addEventListener("click", () => fileInput.click());

// File select
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0]);
  }
});

// Drag & Drop Events
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragging");
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) handleFile(droppedFile);
});

// Handle file preview
function handleFile(selectedFile) {
  if (!selectedFile.type.startsWith("image/")) {
    alert("Please upload a valid image file!");
    return;
  }

  file = selectedFile;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    previewImg.src = reader.result;
    resultImg.src = "";
    statusText.textContent = "Waiting for processing...";
    showCards();
  };
}

// Remove BG
removeBtn.addEventListener("click", async () => {
  if (!file) return alert("Please upload an image first!");

  loader.style.display = "flex";
  statusText.textContent = "Processing image...";

  try {
    const formData = new FormData();
    formData.append("image_file", file);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "X-Api-key": API_KEY },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to remove background. Check API key & image.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    resultImg.src = url;
    downloadBtn.href = url;

    statusText.textContent = "Background removed successfully ✅";
  } catch (err) {
    console.error(err);
    statusText.textContent = "Something went wrong ❌ Try again.";
    alert(err.message);
  } finally {
    loader.style.display = "none";
  }
});

// Reset
resetBtn.addEventListener("click", () => {
  file = null;
  fileInput.value = "";
  previewImg.src = "";
  resultImg.src = "";
  cards.style.display = "none";
  uploadBox.style.display = "flex";
});

// Show preview/result UI
function showCards() {
  uploadBox.style.display = "none";
  cards.style.display = "flex";
}
