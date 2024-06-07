const PiperTTS = require('./Piper')

const TTS = () => {
    const piperEN = PiperTTS('/piper/process/piper --model /piper/model_EN.onnx --config /piper/config_EN.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -')
    const piperES = PiperTTS('/piper/process/piper --model /piper/model_ES.onnx --config /piper/config_ES.onnx.json --output-raw |   aplay -r 22050 -f S16_LE -t raw -')

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