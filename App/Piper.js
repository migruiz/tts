var spawn = require('child_process').spawn;

const PiperTTS = (command) => {
    let piperProcess;
    let terminated = false;

    const sendTextToPiper = (text) => {
        if (!terminated) {
            piperProcess.stdin.write(text + "\r\n")
        }
    }

    const onPiperProcessClosed = () => {
        setTimeout(() => {
            piperProcess.removeAllListeners()
        }, 1)
        if (!terminated) {
            startPiperProcess(command)
        }
    }

    const terminatePiper = () => {
        if (!terminated) {
            terminated = true
            piperProcess.kill()
        }
    }

    const startPiperProcess = () => {
        piperProcess = spawn(command, [], { shell: true });
        piperProcess.stdin.setEncoding('latin1');
        piperProcess.stderr.setEncoding('latin1');
        piperProcess.stdout.setEncoding('latin1');


        piperProcess.stdout.on('data', (data) => {
            console.log(`O-${piperProcess.pid}: ${data}`);
        });
        piperProcess.stderr.on('data', (data) => {
            console.log(`E-${piperProcess.pid}: ${data}`);
        });
        piperProcess.on('close', (code) => {
            console.log(`process ${piperProcess.pid} closed with code ${code}`);
            onPiperProcessClosed()
        });

        piperProcess.on('exit', (code) => {
            console.log(`process ${piperProcess.pid} exited with code ${code}`);
        });

    }

    return {
        startPiperProcess,
        sendTextToPiper,
        terminatePiper
    }
}
module.exports = PiperTTS