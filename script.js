// === Editsome PDF Merge Logic ===

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const mergeBtn = document.getElementById("mergeBtn");
const statusMsg = document.getElementById("statusMsg");

let files = [];

// Drag and drop area
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#eafff4";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.backgroundColor = "#fff";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#fff";
  files = Array.from(e.dataTransfer.files);
  statusMsg.textContent = ${files.length} file(s) ready to merge;
});

// Choose files manually
fileInput.addEventListener("change", (e) => {
  files = Array.from(e.target.files);
  statusMsg.textContent = ${files.length} file(s) ready to merge;
});

// Merge button
mergeBtn.addEventListener("click", async () => {
  if (files.length === 0) {
    alert("Please select at least one PDF file first!");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  statusMsg.textContent = "⏳ Merging PDFs... Please wait.";

  try {
    const response = await fetch("https://editsome-backend-5.onrender.com/merge", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to merge");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();

    statusMsg.textContent = "✅ PDF merged successfully! File downloaded.";
  } catch (error) {
    statusMsg.textContent = "❌ Error merging PDFs. Try again.";
  }
});
