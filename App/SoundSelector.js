const Sound = require('./Sound')

const SoundSelector = () => {
    const policeSound = Sound('/sounds/police.wav')
    const discoSound = Sound('/sounds/disco.wav')

    const handleSoundMessage = (data) => {
        if (data.type === 'PLAY_SOUND') {
            const { sound } = data
            if (sound === 0) {
                policeSound.startProcessToPlaySound()
            }
            else if (sound === 1) {
                discoSound.startProcessToPlaySound()
            }
        }
        else if (data.type === 'STOP_ALL_SOUNDS') {
            stopAllSounds();
        }
    }

    const stopAllSounds = () => {
        policeSound.stopProcessToStopSound()
        discoSound.stopProcessToStopSound()
    }

    return {
        handleSoundMessage,
        stopAllSounds
    }
}
module.exports = SoundSelector