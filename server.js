const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/resize", upload.single("pdf"), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = `uploads/resized-${Date.now()}.pdf`;

  // Using Ghostscript for compression
  const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${filePath}`;

  exec(command, (err) => {
    fs.unlinkSync(filePath); // Delete original file
    if (err) {
      console.error(err);
      return res.status(500).send("Error compressing file");
    }
    res.download(outputFilePath, "resized.pdf", (err) => {
      fs.unlinkSync(outputFilePath); // Delete resized file
      if (err) console.error(err);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
