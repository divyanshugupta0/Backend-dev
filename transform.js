//data will be rendered in streams in chunks
const fs = require('fs');
const path = require('path');
const {Transform} = require("stream");
const inputFilePath = path.join(__dirname, 'input.txt');
const readableStream = fs.createReadStream(inputFilePath);
const transformFilePath = path.join(__dirname, 'transform.txt');
const writableStream = fs.createWriteStream(transformFilePath);

const UpperCaseTransfom = new  Transform({
    transform(chunk, encoding, callback){
        const transformedData = chunk.toString().toUpperCase();
        this.push(transformedData);
        callback(null, chunk.toString().toUpperCase())
    }
});

readableStream.pipe(UpperCaseTransfom).pipe(writableStream);