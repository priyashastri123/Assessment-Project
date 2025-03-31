
const os = require('os');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../cpu-usage.log');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

function checkCPUUsage() {
    const cpuUsage = os.loadavg()[0]; // 1-minute load average
    const maxCpu = os.cpus().length;
    const usagePercent = (cpuUsage / maxCpu) * 100;

    if (usagePercent > 70) {
        const msg = `⚠️ High CPU Usage: ${usagePercent.toFixed(2)}% - Restarting server...`;
        console.log(msg);
        logToFile(msg);
        process.exit(1);
    }
}

module.exports = {
    startMonitoring: () => setInterval(checkCPUUsage, 5000),
};

