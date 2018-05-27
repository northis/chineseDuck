export const ModeEnum = {
    Development: 'development',
    Production: 'production',
    Test: 'test',
};

export function getMode() {
    var indexModeArg = process.argv.indexOf('--mode');
    if (indexModeArg != -1) {
        var mode = process.argv[indexModeArg + 1];
        return mode == undefined ? ModeEnum.Production : mode;
    }
}

export function isDebug() {
    return getMode() !== ModeEnum.Production;
}

export function isVerbose() {
    return process.argv.includes('--verbose');
}

export function isAnalyze() {
    return process.argv.includes('--analyze') || process.argv.includes('--analyse');
}
