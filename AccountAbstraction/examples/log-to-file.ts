import * as fs from 'fs';
const logFile = './merged_output';  // Define a shared log file

// Function to append logs to the shared file   
export const logToFile = (message: string,threadNumber: string) => {
    fs.appendFileSync(logFile+threadNumber+'.log', message + '\n', { encoding: 'utf8' });
}

