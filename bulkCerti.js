// Parse Excel File
function parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
  
  // Generate Certificates with PNG Template
  async function generateCertificates(data, template, additionalContent) {
    const canvas = document.getElementById("certificateCanvas");
    const ctx = canvas.getContext("2d");
    const link = document.createElement("a");
  
    const templateImage = new Image();
    templateImage.src = URL.createObjectURL(template);
  
    templateImage.onload = async () => {
      canvas.width = templateImage.width;
      canvas.height = templateImage.height;
  
      data.forEach(([name, ...otherInfo], index) => {
        // Draw template
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  
        // Add name
        ctx.font = "150px Pinyon Script";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(name, canvas.width / 2, canvas.height / 1.9);
  
        // Add additional content
        if (additionalContent) {
            ctx.font = "50px canva sans";
            ctx.fillStyle = "#111";
            ctx.textAlign = "center";
          
            const maxLineWidth = canvas.width * 0.69; // Maximum width for a single line (75% of canvas width)
            const words = additionalContent.split(' '); // Split the text into words
            const lines = [];
            let currentLine = '';
          
            for (const word of words) {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              const testWidth = ctx.measureText(testLine).width;
          
              if (testWidth > maxLineWidth) {
                // If the line exceeds the maximum width, push the current line and start a new one
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }
            // Push the last line
            if (currentLine) {
              lines.push(currentLine);
            }
          
            const lineHeight = 60; // Adjust the line height
            const startX = canvas.width / 2; // Center align
            const startY = canvas.height / 1.7 //- ((lines.length - 1) * lineHeight) / 2; // Vertically center text
          
            // Render each line on the canvas
            lines.forEach((line, index) => {
              ctx.fillText(line, startX, startY + index * lineHeight);
            });
            // ctx.fillText(additionalContent, ctxWidth / 2, canvas.height / 1.5);
          }
          
          
  
        // Save certificate
        const dataURL = canvas.toDataURL("image/png");
        link.href = dataURL;
        link.download = `${name}_certificate.png`;
        link.click();
      });
  
      alert("Certificates generated!");
    };
  }
  
  // Event Listeners
  document.getElementById("excelInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await parseExcel(file);
      if (data.length === 0) {
        alert("No data found in the Excel file!");
        return;
      }
      window.certificateData = data.slice(1); // Remove header row
      alert("Data loaded successfully!");
    }
  });
  
  document.getElementById("templateInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = document.getElementById("templatePreview");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
      window.templateFile = file; // Save for later use
    }
  });
  
  document.getElementById("generateBtn").addEventListener("click", () => {
    if (!window.templateFile || !window.certificateData) {
      alert("Please upload both template and data!");
      return;
    }
  
    const additionalContent = document.getElementById("contentBox").value.trim();
    generateCertificates(window.certificateData, window.templateFile, additionalContent);
  });
  