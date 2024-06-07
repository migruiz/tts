var spawn = require('child_process').spawn;

const PiperTTS = (language) => {
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
            startPiperProcess(language)
        }
    }

    const terminatePiper = () => {
        if (!terminated) {
            terminated = true
            piperProcess.kill()
        }
    }

    const startPiperProcess = () => {
        const command = `/piper/process/piper --model /piper/model_${language}.onnx --config /piper/config_${language}.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -`
        piperProcess = spawn(command, [], { shell: true });
        piperProcess.stdin.setEncoding('latin1');
        piperProcess.stderr.setEncoding('latin1');
        piperProcess.stdout.setEncoding('latin1');


        piperProcess.stdout.on('data', (data) => {
            console.log(`${language}-O-${piperProcess.pid}: ${data}`);
        });
        piperProcess.stderr.on('data', (data) => {
            console.log(`${language}E-${piperProcess.pid}: ${data}`);
        });
        piperProcess.on('close', (code) => {
            console.log(`${language} - process ${piperProcess.pid} closed with code ${code}`);
            onPiperProcessClosed()
        });

        piperProcess.on('exit', (code) => {
            console.log(`${language} - process ${piperProcess.pid} exited with code ${code}`);
        });

    }

    return {
        startPiperProcess,
        sendTextToPiper,
        terminatePiper
    }
}
module.exports = PiperTTS