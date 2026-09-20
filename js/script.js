import * as pdfjsLib from
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.min.mjs";  


pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";

import JSZip from
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";

 


const textInput = document.getElementById("textInput");
const clearText = document.getElementById("clearText");
const textStatus = document.getElementById("textStatus");

const liveWordCount = document.getElementById("liveWordCount");
const liveCharacterCount = document.getElementById("liveCharacterCount");


const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

const documentInfo = document.getElementById("documentInfo");
const fileName = document.getElementById("fileName");
const fileDetails = document.getElementById("fileDetails");
const fileIcon = document.getElementById("fileIcon");
const fileStatus = document.getElementById("fileStatus");

const wordCount = document.getElementById("wordCount");
const characterCount = document.getElementById("characterCount");
const letterCount = document.getElementById("letterCount");

const numberCount = document.getElementById("numberCount");
const paragraphCount = document.getElementById("paragraphCount");
const lineCount = document.getElementById("lineCount");
const spaceCount = document.getElementById("spaceCount");  
const specialCount = document.getElementById("specialCount");
const pageCount = document.getElementById("pageCount");

const loadingStatus = document.getElementById("loadingStatus");
const appStatus = document.getElementById("appStatus");

const MAX_FILE_SIZE = 20 * 1024 * 1024;

if (dropZone) {

  dropZone.addEventListener("click", function () {
    fileInput.click();
  });

  dropZone.addEventListener("dragover", function (event) {

    event.preventDefault();

    dropZone.classList.add("drag-over");
  });
  

  dropZone.addEventListener("dragleave", function () {
  
    dropZone.classList.remove("drag-over");
  });
  
  dropZone.addEventListener("drop", function (event) {

    event.preventDefault();

    dropZone.classList.remove("drag-over");

    const files = event.dataTransfer.files;

    if (!files || files.length === 0) {
      return;
    }

    handleSelectedFile(files[0])
  });

  
}





function analyzeText() {

  const text = textInput.value;

  const characterTotal = text.length;

  const words = text.trim()
    ? text.trim().split(/\s+/) : [];

  const wordTotal = words.length;

  const letters = text.match(/\p{L}/gu) || [];
  const letterTotal = letters.length;

  const numbers = text.match(/[0-9]/g) || [];
  const numberTotal = numbers.length;

  const spaces = text.match(/[ \t]/g) || [];
  const spaceTotal = spaces.length;

  const specialCharacters = text.match(/[^\p{L}\p{N}\s]/gu) || [];
  const specialTotal = specialCharacters.length;

  const paragraphs = text
                        .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0);
  const paragraphTotal = paragraphs.length;

  const lines = text
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);
  const lineTotal = lines.length;

  wordCount.textContent = wordTotal;
  characterCount.textContent = characterTotal;
  letterCount.textContent = letterTotal;
  numberCount.textContent = numberTotal;
  paragraphCount.textContent = paragraphTotal;
  lineCount.textContent = lineTotal;
  spaceCount.textContent = spaceTotal;
  specialCount.textContent = specialTotal;

  updateLiveSummary();
  

}

function updateLiveSummary() {

  const text = textInput.value;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const characters = text.length;

  if (liveWordCount) {
    liveWordCount.textContent = words.toLocaleString("en-US");
  }

  if (liveCharacterCount) {
    liveCharacterCount.textContent = characters.toLocaleString("en-US");
  }
}

function estimatePages() {

    const text = textInput.value.trim();

    if (!text) {
        pageCount.textContent = "0";
        return;
    }

    const characters = text.length;



    const paragraphs = text
        .split(/\n\s*\n/)
        .filter(paragraph => paragraph.trim().length > 0);

    const charactersPerPage = 2500;

    const characterPages = characters / charactersPerPage;

    const paragraphFactor = paragraphs.length * 0.02;

    const estimatedPages = Math.max(
        1,
        Math.ceil(characterPages + paragraphFactor)
    );

    pageCount.textContent = estimatedPages;
}

function showLoading() {

  loadingStatus.classList.remove("d-none");

  loadingStatus.querySelector("span").textContent = "Processing Document...";
}

function hideLoading() {

  loadingStatus.classList.add("d-none");
}

function setAppStatus(status) {
  const icon = appStatus.querySelector("i");

  if (!icon) {
    return;
  }
  
  const statusText = Array.from(appStatus.childNodes)
    .find(node => node.nodeType ===
      Node.TEXT_NODE &&
      node.textContent.trim());

  if (statusText) {
    statusText.textContent = `${status}`;
  }
  

  appStatus.classList.remove(
    "status-ready",
    "status-processing",
    "status-completed",
    "status-error"
  
  )

  if (status === "Ready") {
    
    icon.className = "bi bi-circle-fill";
    
    appStatus.classList.add("status-ready")
    
  } else if (status === "Processing") {

    icon.className = "bi bi-arrow-repeat";

    appStatus.classList.add("status-processing")
    
  } else if (status === "Completed") {

    icon.className = "bi bi-check-circle-fill";

    appStatus.classList.add("status-completed");
    
  } else if (status === "Error") {

    icon.className = "bi bi-exclamation-circle-fill";

    appStatus.classList.add("status-error");
  }
}

function resetDocument() {

  textInput.value = "";

  fileInput.value = "";

  fileName.textContent = "No file selected";
  fileDetails.textContent = "-";
  fileIcon.className = "bi bi-file-earmark";

 

  documentInfo.classList.add("d-none");

  textStatus.textContent = "Ready to analyze";

  setFileStatus(
    "success",
    "Ready",
    "bi-check-circle-fill"
  );

  hideLoading();

  analyzeText();

  estimatePages();

  setAppStatus("Ready");

  
}

textInput.addEventListener("input", function () {

  analyzeText();

  estimatePages();

  if (textInput.value.trim()) {
    textStatus.textContent = "text ready to analyze";
  } else {

    textStatus.textContent = "Ready to analyze";
  }
});

if (clearText) {
  clearText.addEventListener("click", resetDocument);

};

window.addEventListener("pageshow", function () {

  resetDocument();
});

function formatFileSize(bytes) {

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} GB`;

  
}

function setFileStatus(type, message, icon) {

  const statusClasses = {
    warning: "text-warning",
    success: "text-success",
    danger: "text-danger"
  };

  fileStatus.className = `${statusClasses[type] || "text-secondary"} d-block mt-1 `;

  fileStatus.innerHTML = `<i class="bi ${icon}"></i> ${message}`;
}

function isSupportedFile(file) {

  if (!file) {
    return false;
  }

  const fileName = file.name.toLowerCase();

  return (fileName.endsWith(".pdf") || fileName.endsWith(".docx"));
}

function handleSelectedFile(file) {

  if (!file) {
    return;
  }

  if (!isSupportedFile(file)) {

    setFileStatus(
      "danger",
      "Only PDF and DOCX files are supported",
      "bi-exclamation-circle-fill"
    )

    return;
  }

  if (file.size > MAX_FILE_SIZE) {

    setFileStatus(
      "danger",
      "File size must not exceed 20 MB",
      "bi-exclamation-circle-fill"
    )
    return;
  }

  const dataTransfer = new DataTransfer();
  
  dataTransfer.items.add(file);
  
  fileInput.files = dataTransfer.files;

  fileInput.dispatchEvent(new Event("change", {
    bubbles: true
  }));

  
} 

fileInput.addEventListener("change", async function () {

  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  if (!isSupportedFile(file)) {

    setFileStatus(
      "danger",
      "Only PDF and DOCX files are supported",
      "bi-exclamation-circle-fill"
    );

    fileInput.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {

    setFileStatus(
      "danger",
      `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`,
      "bi-exclamation-circle-fill"
    );

    fileInput.value = "";
    return;
  }

  const fileNameLower = file.name.toLowerCase();

  const isPDF = fileNameLower.endsWith(".pdf");
  const isDOCX = fileNameLower.endsWith(".docx");

  documentInfo.classList.remove("d-none");

  fileName.textContent = file.name;

  const fileSize = formatFileSize(file.size);

  let fileType = "Unknown";

  if (isPDF) {

    fileType = "PDF";

    fileIcon.className =
      "bi bi-file-earmark-pdf file-icon-pdf";

  } else if (isDOCX) {

    fileType = "DOCX";

    fileIcon.className =
      "bi bi-file-earmark-word file-icon-docx";
  }

  fileDetails.textContent =
    `${fileType} • ${fileSize}`;

  showLoading();
  setAppStatus("Processing");

  setFileStatus(
    "warning",
    "Processing...",
    "bi-arrow-repeat"
  );

  try {

    let result;

    if (isPDF) {

      result = await extractPDFText(file);

      textInput.value = result.text;

      pageCount.textContent = result.pages;

      textStatus.textContent =
        "PDF text extracted successfully";

    } else if (isDOCX) {

      result = await extractDOCXText(file);

      textInput.value = result.text;

      textStatus.textContent =
        "DOCX text extracted successfully";

      if (result.pageBreaks > 0) {

        pageCount.textContent =
          result.pageBreaks + 1;

      } else {

        estimatePages();
      }
    }

    analyzeText();

    setAppStatus("Completed");

    setFileStatus(
      "success",
      `${fileType} analyzed successfully`,
      "bi-check-circle-fill"
    );

  } catch (error) {

    console.error(
      `${fileType} extraction error:`,
      error
    );

    setAppStatus("Error");

    setFileStatus(
      "danger",
      "Failed to analyze document",
      "bi-exclamation-circle-fill"
    );

    textStatus.textContent =
      "Failed to extract document text";

  } finally {

    hideLoading();
  }

});

async function extractPDFText(file) {

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;

    let extractedText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const pageText = textContent.items
            .map(item => item.str)
            .join(" ");

        extractedText += pageText + "\n\n";
    }

    return {
        text: extractedText,
        pages: pdf.numPages
    };
}

async function extractDOCXText(file) {

  

  if (!file) {
    throw new Error("No DOCX file selected");
  }

  checkMammoth();

  if (!mammoth || typeof mammoth.extractRawText !== "function") {
    throw new Error("Mammoth.js is not available");
  }

  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer
  });

  const zip = await JSZip.loadAsync(arrayBuffer);

  const documentFile = zip.file("word/document.xml");

  if (!documentFile) {
    throw new Error("Invalid DOCX: word/document.xml not found");
  }

  const documentXML = await documentFile.async("text");

  const pageBreaks =
    (documentXML.match(/w:type=["']page["']/g) || []).length;

  return {
    text: result.value || "",
    pageBreaks
  };
}

function checkMammoth() {
  if (
    typeof mammoth === "undefined" || typeof mammoth.extractRawText !=="function"
  ) {
    throw new Error("Mammoth.js failed to load.")
  }
}


