const http = require("http");
const fs = require("fs");
const server = http.createServer((req,res)=>{
    fs.appendFileSync("test.txt", `${new Date().toLocaleString()} ${req.url} ${req.method}\n`);
    console.log(`${new Date().toLocaleString()} ${req.url} ${req.method}`);
    switch(req.url) {
        case "/":
            fs.readFile("./lecture1.html", (err, data) => {
                if (err) {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.end("File not found");
                } else {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end(data);
                }
            });
            break;
        case "/application":
            fs.readFile("./application.html", (err, data) => {
                if (err) {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.end("File not found");
                } else {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end(data);
                }
            });
            break;
        case "/style.css":
            fs.readFile("./style.css", (err, data) => {
                if (err) {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.end("File not found");
                } else {
                    res.writeHead(200, {"Content-Type": "text/css"});
                    res.end(data);
                }
            });
            break;
        case "/api/data":
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({
                message: "Hello, this is your data!",
                timestamp: new Date().toISOString()
            }));
            break;
        default:
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("Route not found");
    }
});

server.listen(4000,()=>{
    console.log("Server is listening on port 4000");
}  );