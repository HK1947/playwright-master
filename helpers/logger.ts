// helpers/logger.ts

// DESIGN PATTERN: Singleton
// Only ONE logger instance exists for the entire framework
// Every file uses the SAME logger → all logs go to same file

import winston from 'winston';

// Lesson 11: class with private constructor = Singleton
// Lesson 11: static = belongs to CLASS, not instance
class Logger {
    // Lesson 11: static — one instance shared by everyone
    private static instance: winston.Logger;

    // Lesson 11: private constructor — nobody can write 'new Logger()'
    // Forces everyone to use Logger.getInstance()
    private constructor() {}

    // This is the ONLY way to get the logger
    static getInstance(): winston.Logger {
        // Lesson 10: if — create only if doesn't exist yet
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                // Log level: info shows info + warn + error
                level: 'info',

                // Format: timestamp + level + message
                format: winston.format.combine(
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf((info) => {
                        const ts = info.timestamp as string;
                        const msg = info.message as string;
                        return `${ts} [${info.level.toUpperCase()}] ${msg}`;
                        // Output: 2026-05-26 14:30:45 [INFO] Login successful
                    }),
                ),

                // WHERE to write logs
                transports: [
                    // Write to file — survives after test run
                    new winston.transports.File({
                        filename: 'logs/test-run.log',
                        maxsize: 5242880, // 5MB max file size
                        maxFiles: 3, // keep last 3 log files
                    }),

                    // Write to console — visible during run
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.printf((info) => {
                                const ts = info.timestamp as string;
                                const msg = info.message as string;
                                return `${ts} [${info.level}] ${msg}`;
                            }),
                        ),
                    }),
                ],
            });
        }
        return Logger.instance;
    }
}

// Export the singleton instance
// Everyone imports this — gets the SAME logger
export const logger = Logger.getInstance();
