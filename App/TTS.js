const PiperTTS = require('./Piper')

const TTS = () => {
    const piperEN = PiperTTS('EN')
    const piperES = PiperTTS('ES')

    const startTTSProcesses = () => {
        piperEN.startPiperProcess();
        piperES.startPiperProcess();
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
        }

    }


    return {
        startTTSProcesses,
        handleTTSMessage
    }
}
module.exports = TTS