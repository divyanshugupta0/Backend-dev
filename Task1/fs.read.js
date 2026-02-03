const fs = require("fs");

fs.readFile("file.txt","utf8",function (err,data){
    if(err){
        console.log("canot read file");
    }
    else{
        console.log("File Content");
        console.log(data);
    }
});







// delete a file

















