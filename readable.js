//data will be rendered in streams in chunks
const fs = require('fs');
const path = require('path');
const inputFilePath = path.join(__dirname, 'input.txt');
const readableStream = fs.createReadStream(inputFilePath);

readableStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.toString());
});

readableStream.on('end', () => {
    console.log('No more data to read.');
});

readableStream.on('error', (err) => {
    console.error('Error reading the file:', err);
});