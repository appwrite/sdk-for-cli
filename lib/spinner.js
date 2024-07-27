const progress = require('cli-progress');
const chalk = require('chalk');

const SPINNER_ARC = 'arc';
const SPINNER_DOTS = 'dots';

const spinners = {
    [SPINNER_ARC]: {
        "interval": 100,
        "frames": ["◜", "◠", "◝", "◞", "◡", "◟"]
    },
    [SPINNER_DOTS]: {
        "interval": 80,
        "frames": ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
}

class Spinner {
    static start(clearOnComplete = true, hideCursor = true) {
        Spinner.updatesBar = new progress.MultiBar({
            format: this.#formatter,
            hideCursor,
            clearOnComplete,
            stopOnComplete: true,
            linewrap: true,
            noTTYOutput: true
        });
    }

    static stop() {
        Spinner.updatesBar.stop();
    }

    static #formatter(options, params, payload) {
        const status = payload.status.padEnd(12);
        const middle = `${payload.resource} (${payload.id})`.padEnd(40);

        let prefix = chalk.cyan(payload.prefix ?? '⧗');
        let start = chalk.cyan(status);
        let end = chalk.yellow(payload.end);

        if (status.toLowerCase().trim() === 'pushed') {
            start = chalk.greenBright.bold(status);
            prefix = chalk.greenBright.bold('✓');
            end = '';
        } else if (status.toLowerCase().trim() === 'deploying') {
            start = chalk.cyanBright.bold(status);
        } else if (status.toLowerCase().trim() === 'deployed') {
            start = chalk.green.bold(status);
            prefix = chalk.green.bold('✓');
        } else if (status.toLowerCase().trim() === 'error') {
            start = chalk.red.bold(status);
            prefix = chalk.red.bold('✗');
            end = chalk.red(payload.errorMessage);
        }

        return Spinner.#line(prefix, start, middle, end);
    }

    static #line(prefix, start, middle, end, separator = '•') {
        return `${prefix} ${start} ${separator} ${middle} ${!end ? '' : separator} ${end}`;

    }

    constructor(payload, total = 100, startValue = 0) {
        this.bar = Spinner.updatesBar.create(total, startValue, payload)
    }

    update(payload) {
        this.bar.update(payload);
        return this;
    }

    fail(payload) {
        this.stopSpinner();
        this.update({ status: 'Error', ...payload });
    }

    startSpinner(name) {
        let spinnerFrame = 1;
        const spinner = spinners[name] ?? spinners['dots'];

        this.spinnerInterval = setInterval(() => {
            if (spinnerFrame === spinner.frames.length) spinnerFrame = 1;
            this.bar.update({ prefix: spinner.frames[spinnerFrame++] });
        }, spinner.interval);
    }

    stopSpinner() {
        clearInterval(this.spinnerInterval);
    }

    replaceSpinner(name) {
        this.stopSpinner();
        this.startSpinner(name);
    }
}


module.exports = {
    Spinner,
    SPINNER_ARC,
    SPINNER_DOTS
}
