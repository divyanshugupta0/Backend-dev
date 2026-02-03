const fs = require('fs');
const readline =  require('readline');


let errCount = 0;
let infoCount = 0;
let warnCount = 0;

const readStream = fs.createReadStream('file.txt', {
    encoding:"utf-8"
});

readStream.on("error",(err)=>{
    console.error("Error read log file:",err.message);
})

const rl = readline.createInterface({
    input:readStream,
    crlfDelay: Infinity
});

rl.on("line",(line)=>{
    if(line.includes("ERROR")) errCount++;
    else if (line.includes("INFO")) infoCount++;
    else if(line.includes("WAARN")) warnCount++;
});

rl.on("close",()=>{
    console.log("Log Summary Report");
    console.log("Errors:",errCount);
    console.log("Info:",infoCount);
    console.log("Warnings:",warnCount);
});