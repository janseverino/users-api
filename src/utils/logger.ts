import { LogMeta } from "../models/logMeta.model";

const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.resolve('src/logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        targets: [
            {
                target: 'pino/file',
                options: {
                    destination: path.join(logDir, 'app.log'),
                },
                level: 'info',
            },
            {
                target: 'pino/file',
                options: {
                    destination: path.join(logDir, 'error.log'),
                },
                level: 'error',
            },
            {
                target: 'pino-pretty',
                level: 'debug',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            },
        ],
    },
});

const log = (level: 'info' | 'warn' | 'error' | 'debug', message: string, error?: Error) => {

    const errorSplit = error?.stack?.split('\n') || [];
    const file= errorSplit.length > 2 ? errorSplit[1].trim() : '';
    const messageError = errorSplit.length > 1 ? errorSplit[0].trim() : message;

    const parsedStack = parseStackLine(file);
    const { functionName, file: shortFile, line, column } = parsedStack;

    const errorMeta: LogMeta = {
        function: functionName,
        file:shortFile,
        line : line ? String(line) : '?',
        column: column ? String(column) : '?',
        error: messageError,
    };
  
    if (error) {
        logger[level]({ ...errorMeta }, message);
    }  

}

function parseStackLine(stackLine: string) {  
    const withFuncRegex = /^\s*at\s+(.*?)\s+\((.*):(\d+):(\d+)\)$/;
    const noFuncRegex = /^\s*at\s+(.*):(\d+):(\d+)$/;
  
    let functionName = 'anonymous';
    let file = 'unknown';
    let line = '?';
    let col = '?';
  
    let match = stackLine.match(withFuncRegex);
    if (match) {
      functionName = match[1];
      file = match[2];
      line = match[3];
      col = match[4];
    } else {
      match = stackLine.match(noFuncRegex);
      if (match) {
        file = match[1];
        line = match[2];
        col = match[3];
      }
    }
  
    const shortFile = file.split(/[\\/]/).pop() || file;
  
    return {
      functionName,
      file: shortFile,
      line: Number(line) || null,
      column: Number(col) || null,
    };
  }
  

const loggerWrapper = {
    info: (message: string, error?: Error) => log('info', message, error),
    error: (message: string, error?: Error) => log('error', message, error),
    debug: (message: string, error?: Error) => log('debug', message, error),
}


module.exports = loggerWrapper;