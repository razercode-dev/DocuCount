# DocuCount

DocuCount is a lightweight web-based PDF and DOCX document analyzer.

## Features

- PDF text extraction
- DOCX text extraction
- Word counting
- Character counting
- Line Counting
- Space Counting
- Special character counting
- PDF page counting
- DOCX page counting
- File size display
- Maximum file size: 20 MB
- Drag and drop upload
- Responsive dark interface

## Preview

### Desktop
![DocuCount Desktop](assets/screenshots/desktop.png)

### Mobile
![DocuCount Mobile](assets/screenshots/mobile.png)

### Document Analysis
![DocuCount Analysis](assets/screenshots/analysis.png)

## Technologies

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- PDF.js
- Mammoth.js
- JSZip
## Project Structure

```text
DocuCount/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── favicon.svg
└── README.md
 ```

 ## Supported Files

- `.pdf`
- `.docx`

## Usage 
1. Open `index.html` using a local web server.
2. Upload a PDF or DOCX file.
3. DocuCount extracts the document text.
4. View the extracted text and document statistic.

## Project Status

Stable - v1.0.0

## Limitations

- DOCX page count is estimated when explicit page breaks are unavailable.
- Maximum file size: 20 MB
- Processing is performed locally in the browser

## License

MIT License




