const { log } = require('console');
const os = require('os');
const freeMemory = os.freemem()/(1024*1024*1024);
const totolMemory = os.totalmem()/(1024*1024*1024);
const cpuCores = os.cpus().length;
const user = os.userInfo();
const platform = os.platform();
const uptime = os.uptime()/(3600);
const cpuDetails = os.cpus();
const cpuModel = cpuDetails[0].model;
const fs = require('fs');
const cpuUsage = process.cpuUsage();


console.log(`Free Memory: ${freeMemory}`);
console.log(`Total Memory: ${totolMemory}`);
console.log(`CPU Cores: ${cpuCores}`);
console.log(`User Info: ${JSON.stringify(user)}`);
console.log(`Platform: ${platform}`);
console.log(`Uptime: ${uptime} seconds`);
console.log(`CPU Model: ${cpuModel}`);
console.log(`CPU Details: ${JSON.stringify(cpuDetails)}`);
console.log(`CPU Usage: ${JSON.stringify(cpuUsage)}`);


let pass = 0;

const logRange = setInterval(() =>{
    fs.appendFile('os_log.txt',`Pass: ${pass}\n\nFree Memory: ${freeMemory}\nTotal Memory: ${totolMemory}\nCPU Cores: ${cpuCores}\nUser Info: ${JSON.stringify(user)}\nPlatform: ${platform}\nUptime: ${uptime} seconds\nCPU Model: ${cpuModel}\nCPU Details: ${JSON.stringify(cpuDetails)}\n\nCPU Usage: ${JSON.stringify(cpuUsage)}\n\n======================================================================================================================================\n\n`, (err) => {
        if (err) throw err;
        console.log(`The "Pass : ${pass}, data to append" was appended to file!`);//in production we don't have to show console.log
    });
    
    if(pass == 10){
        clearInterval(logRange);
    }
    pass++;
}, 3000);