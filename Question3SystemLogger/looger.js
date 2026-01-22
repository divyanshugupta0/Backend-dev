const os = require("os");
const fs = require("fs");
const path = require("path");


const logFile = path.join(__dirname, "system-log.txt");

function formatBytes(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function logSystemInfo() {
  const cpuInfo = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  const logData = `

Time: ${new Date().toLocaleString()}
Platform: ${os.platform()}
OS Type: ${os.type()}
OS Release: ${os.release()}
Architecture: ${os.arch()}

CPU Model: ${cpuInfo[0].model}
CPU Cores: ${cpuInfo.length}
CPU Speed: ${cpuInfo[0].speed} MHz

Total Memory: ${formatBytes(totalMemory)}
Free Memory: ${formatBytes(freeMemory)}
Used Memory: ${formatBytes(totalMemory - freeMemory)}

`;

  fs.appendFile(logFile, logData, (err) => {
    if (err) {
      console.log("❌ Error writing log:", err);
    } else {
      console.log("✅ System info logged successfully!");
    }
  });
}


setInterval(logSystemInfo, 5000);

console.log("📌 System Logger started... logging every 5 seconds");
