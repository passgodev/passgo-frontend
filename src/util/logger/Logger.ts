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

const consoleLogger = new ConsoleLogger();

export default consoleLogger;