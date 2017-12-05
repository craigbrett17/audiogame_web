import { SoundSource } from '../engine/sound-source'

// not quite generic enough to be part of an engine
/** Obsticles represent sound sources that rotate ambient sounds and also play collision sounds */
export class Obsticle extends SoundSource {
    ambientSounds: Array<any> = []
    collisionSounds: Array<any> = []

    constructor(startX: number = 0, startY: number = 0, startZ: number = 0, ambientSounds: Array<any> = [], collisionSounds: Array<any> = []) {
        super(startX, startY, startZ);
        ambientSounds.forEach(sound => {
            this.ambientSounds.push(this.loadOrRetrieveSound(sound))
        })
        collisionSounds.forEach(sound => {
            this.collisionSounds.push(this.loadOrRetrieveSound(sound))
        })
        this.playAmbientSound()
    }

    playAmbientSound(): void {
        if (this.ambientSounds.length <= 0) {
            return
        }
        
        // first, pick an ambient sound
        const sound = this.ambientSounds[Math.floor(Math.random() * this.ambientSounds.length)]
        
        sound.playbackRate = 0.75 + (Math.random() * 0.5)
        this.playSoundFromLocation(sound)
        sound.once("ended", (sound) => {
            this.playAmbientSound()
        })
    }

    playCollisionSounds(): void {
        for (const sound of this.collisionSounds) {
            this.playSoundFromLocation(sound)
        }
    }

    destroyAllSounds(): void {
        // we'll take responsibility for disposing of these here
        // since we want collision sounds to carry on playing until they end
        //super.destroyAllSounds()
        this.ambientSounds.forEach(sound => {
            sound.stop()
            sound.destroy()
        })
        this.collisionSounds.forEach(sound => {
            if (sound.playing) {
                sound.once("ended", (s) => {
                    s.destroy()
                })
            } else {
                sound.destroy()
            }
        })
    }

    unloadAllSounds(): void {
        // see comment for destroyAllSounds, applies here
        //super.unloadAllSounds()
        this.ambientSounds.forEach(sound => {
            sound.stop()
            sound.unload()
        })
        this.collisionSounds.forEach(sound => {
            if (sound.playing) {
                sound.once("ended", (s) => {
                    s.unload()
                })
            } else {
                sound.unload()
            }
        })
    }
}