var spawn = require('child_process').spawn;
var kill = require('tree-kill');

const Sound = (soundFile) => {
    let curremntAPlayProcess = null;
    let forceToTerminate = false;

    const startProcessToPlaySound = () => {
        if (curremntAPlayProcess != null)
            return;
        const command = `aplay ${soundFile}`
        curremntAPlayProcess = spawn(command, [], { shell: true });

        curremntAPlayProcess.stdout.on('data', (data) => {
            console.log(`${soundFile} -O-${curremntAPlayProcess.pid}: ${data}`);
        });
        curremntAPlayProcess.stderr.on('data', (data) => {
            console.log(`${soundFile} -E-${curremntAPlayProcess.pid}: ${data}`);
        });
        curremntAPlayProcess.on('close', (code) => {
            console.log(`${soundFile} - process ${curremntAPlayProcess.pid} closed with code ${code}`);
            onAplayProcessClosed()
        });

        curremntAPlayProcess.on('exit', (code) => {
            console.log(`${soundFile} - process ${curremntAPlayProcess.pid} exited with code ${code}`);
        });
        forceToTerminate = false
    }
    const stopProcessToStopSound = () => {
        if (curremntAPlayProcess == null)
            return;
        if (!forceToTerminate) {
            forceToTerminate = true
            console.log("try to kill")
            kill(curremntAPlayProcess.pid, 'SIGKILL');
        }
    }

    const onAplayProcessClosed = () => {
        curremntAPlayProcess.removeAllListeners()
        curremntAPlayProcess = null
        if (!forceToTerminate) {
            startProcessToPlaySound()
        }
    }




    return {
        startProcessToPlaySound,
        stopProcessToStopSound
    }
}
module.exports = Sound