const { add, remove } = require('./math');
console.log("Hello");
console.log(add(1,2));
const fs = require("fs");
fs.writeFileSync("./test.txt","This is a test file");
fs.writeFile("./test.txt","This is another test file",(err,data)=>{
    if(err){
        console.log(err);
    }else{
        console.log("File written successfully");
    }
});
fs.appendFile("./test.txt","\nAppending this line",(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("\nFile appended successfully");
    }
});

fs.appendFileSync("test.txt", new Date().toLocaleString());
const file = fs.readFileSync("./test.txt","utf-8");
console.log(file);

const http = require("http");
const server = http.createServer((req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"});
    res.end("Response from server ended");
});
server.listen(3000,()=>{
    console.log("Server is listening on port 3000");
});

