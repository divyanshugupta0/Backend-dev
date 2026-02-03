const fs =require("fs");



fs.writeFile("file.txt","hello World",function (err){
    if(err){
        console.log("Error writing file");
    }
    else{
        console.log("File written successfully");
    }
});




const text ="This is written using Node.js and make a written file ,above file is readable\n";

fs.appendFile("file.txt",text,function(err){
    if(err){
        console.log("Error writing file");
    }
    else{
        console.log("Data appended");
    }
})



