const PiperTTS = require('./Piper')

const TTS = () => {
    const piperEN = PiperTTS('EN')
    const piperES = PiperTTS('ES')
    const piperPL = PiperTTS('PL')

    const startTTSProcesses = () => {
        piperEN.startPiperProcess();
        piperES.startPiperProcess();
        piperPL.startPiperProcess();
    }
    const handleTTSMessage = (data) => {
        const { text, lg } = data
        if (lg && text && text.length > 0 && text.length < 100) {
            if (lg === "EN") {
                piperEN.sendTextToPiper(text)
            }
            else if (lg === "ES") {
                piperES.sendTextToPiper(text)
            }
            else if (lg === "PL") {
                piperPL.sendTextToPiper(text)
            }
        }

    }


    return {
        startTTSProcesses,
        handleTTSMessage
    }
}
module.exports = TTS