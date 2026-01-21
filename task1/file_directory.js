//make directory using fs module
//remove directory using fs module
//read directory using fs module
//nested directories using fs module
const fs = require('fs');
// fs.mkdir('TESTER PACK', (err) => { // mkdir is used to create directory like in terminal mkdir <directory name>
//     if (err) {
//         console.log(err);
//         return;
//     }  
//     console.log('Directory TESTER PACK created');
// });

// fs.mkdir("TESTER PACK/sider", { recursive: true }, (err) => { // mkdir is used to create directory in nested folders format like in terminal mkdir <directory name>
//     if (err) {
//         console.log(err);
//         return;
//     }  
//     console.log('Directory TESTER PACK created');
// });

// fs.rmdir("task1/TESTER PACK", { recursive: true }, (err) => {  // rmdir is used to delete directory in nested folders format like in terminal rmdir <directory name>
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log('Directory TESTER PACK deleted');
// });

// fs.rmdir('TESTER PACK', (err) => {  // rmdir is used to delete directory like in terminal rmdir <directory name>
//     if (err) {
//         console.log(err);
//         return;
//     }  
//     console.log('Directory TESTER PACK deleted');
// });

fs.readdir('TESTER PACK', (err, files) => {  // readdir is used to read directory like in terminal ls <directory name> 
    if (err) {
        console.log(err);
        return;
    }
    console.log('Files in directory task1:');
    files.forEach(File => {
        console.log(File);
    });
});