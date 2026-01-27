//data will be rendered in streams in chunks
const fs = require('fs');
const path = require('path');
const inputFilePath = path.join(__dirname, 'input.txt');
const readableStream = fs.createReadStream(inputFilePath);
const outputFilePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(outputFilePath);

// readableStream.on('data', (chunk) => {
//     console.log('Received chunk:', chunk.toString());
//     writableStream.write(chunk);
// });

// readableStream.on('end', () => {
//     console.log('No more data to read.');
//     writableStream.end();
// });

// readableStream.on('error', (err) => {
//     console.error('Error reading the file:', err);
// });


// or above all the code can be replaced with below code-====================================================================
readableStream.pipe(writableStream);

writableStream.on('finish', () => {
    console.log('All data has been written to output.txt');
});

writableStream.on('error', (err) => {
    console.error('Error writing to the file:', err);
});