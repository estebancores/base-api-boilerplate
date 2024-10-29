import { format } from 'date-fns';
import { randomUUID } from 'crypto';

import { fileURLToPath } from 'url';
import { existsSync, promises } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;

    try {
        if (!existsSync(path.join(__dirname, '..', 'logs'))) {
            await promises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await promises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requestsLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}
