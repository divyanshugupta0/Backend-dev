const fs = require("fs");

// File names
const inputFile = "input.txt";
const outputFile = "output.txt";

// Read file
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.log("Error reading file:", err.message);
    return;
  }

  // Convert to words array (remove extra spaces/new lines)
  const words = data.trim().split(/\s+/);

  // Word count
  const wordCount = data.trim() === "" ? 0 : words.length;

  // Write result to output file
  fs.writeFile(outputFile, `Word Count: ${wordCount}`, (err) => {
    if (err) {
      console.log("Error writing file:", err.message);
      return;
    }

    console.log(`✅ Word count written to ${outputFile}`);
  });
});
