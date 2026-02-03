const fs = require("fs");

fs.readdir("./Task1",function (err,files){
    if(err){
        console.log("cannot open directory");
    }
    else{
        for (let i = 0; i <files.length ; i++) {
                console.log(files[i]);
        }
    }
})