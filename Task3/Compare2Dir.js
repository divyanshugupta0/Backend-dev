const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "source");
const destDir = path.join(__dirname, "destination");

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error("Error reading source directory:", err.message);
        return;
    }

    files.forEach((file) => {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        fs.access(destPath, fs.constants.F_OK, (err) => {
            if (err) {
                fs.copyFile(srcPath, destPath, (err) => {
                    if (err)
                        console.error("Error copying file:", file);
                    else

                        console.log("Copied:", file);
                });
            }
        });
    });
});
