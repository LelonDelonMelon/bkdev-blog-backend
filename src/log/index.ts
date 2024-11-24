class Log {
    static info(message: string, ...optionalParams: any[]) {
        console.log(new Date() + " INFO: ", message, optionalParams);
    }
    static error(message: string, ...optionalParams: any[]) {
        console.error(new Date() + " ERROR: ", message, optionalParams);
    }
}

export default Log;