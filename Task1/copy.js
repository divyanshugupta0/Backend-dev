const fs = require("fs");

fs.copyFile("file.txt","copy.txt",function(err){
    if(err){
        console.log("Error copying file");
    }
    else{
        console.log("File copied successfully");
    }
});


