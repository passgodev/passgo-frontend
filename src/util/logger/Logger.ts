interface Logger {
    log(...messages: any[]): void
}

class ConsoleLogger implements Logger {
    private readonly PREFIX: string = "[CL]";
    private readonly IS_ENABLED: boolean = true;

    log(...messages: any[]): void {
        if ( this.IS_ENABLED ) {
            console.log(this.PREFIX, `[${this.getCurrentDateTimeAsString()}]`, ...messages);
        }
    }

    private getCurrentDateTimeAsString(): string {
        const currentDate = new Date();
        return currentDate.toISOString();
    }
}

export const loggerPrelogWithFactory = (prelogWith: any): Logger    => {
    const logger = new ConsoleLogger();
    const loggerLogFunctionRef = logger.log;
    logger.log = (...messages: any[]) => {
        loggerLogFunctionRef.call(logger, prelogWith, ...messages);
    }
    return logger;
}

const consoleLogger = new ConsoleLogger();

export default consoleLogger;