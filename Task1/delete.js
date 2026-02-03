const fs = require("fs");

fs.unlink("copy.txt",function(err){
    if(err){
        console.log("Error deleting file");
    }
    else{
        console.log("File deleted");
    }
});

