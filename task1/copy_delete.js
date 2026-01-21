//delete using fs module
//copy using fs module
const { error } = require('console');
const fs = require('fs');
// fs.copyFile('source.txt', 'destination.txt', (err) => {//copy file is aync function while copyFileSync is sync function
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log('source.txt was copied to destination.txt');
// });

// try {
//     fs.copyFileSync('source.txt', 'destination.txt');
//     console.log('source.txt was copied to destination.txt (sync)');
// } catch (err) {
//     throw err;
// }

// fs.unlink('destination.txt', (err) => {//async function while unlinkSync is sync function it is used to delete the file
//     if (err) throw err;
//     console.log('destination.txt was deleted');
// });

// try {
//     fs.linkSync('source.txt', 'destination.txt', (err) => {//async function while linkSync is sync function it is used to create hard link or file copy
//         if (err) throw err;
//         console.log('destination.txt was created');
//     });
// } catch (err) {
//     console.log(error);
// }

// fs.writeFile('source.txt', 'This is source file', (err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log('source.txt has been created');
// });

