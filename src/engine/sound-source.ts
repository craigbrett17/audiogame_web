import { MobileObject } from "./mobile-object";
import sono from "sono"
import { v4 as uuidV4 } from 'uuid'

/** Represents a mobile object (or otherwise) that will play sounds from its position */
export class SoundSource extends MobileObject {
    loadedSounds: Array<any> = []
    uuid: string

    /**
     * Creates a new sound source object
     * @param startX The X position to start at
     * @param startY the Y position to start at
     * @param startZ The Z position to start at
     */
    constructor(startX: number, startY: number, startZ: number) {
        super(startX, startY, startZ)
        this.uuid = uuidV4()
    }

    /**
     * Plays the sound, setting its panning position to the object's location when it does so
     * @param soundLoadOptions The sounds' config object that will be passed into sound.play. Must include the src for the sound
     */
    play(soundLoadOptions: { src: string, loop?: boolean, effects?: Array<any>, [extraKeys: string]: any }): void {
        const soundId = `${this.uuid}/${soundLoadOptions.src}`
        const existing = sono.get(soundId)
        if (existing) {
            // find the panning effect of this sound 
            const panEffect = SoundSource.findPanningEffect(existing)
            if (panEffect)
                panEffect.setPosition(this.X, this.Y, this.Z)
            if (!existing.playing) {
                existing.play()
            }
        } else {
            const pan = sono.panner()
            pan.setPosition(this.X, this.Y, this.Z)
            if (soundLoadOptions.effects) {
                soundLoadOptions.effects.push(pan)
            } else {
                soundLoadOptions.effects = [pan]
            }
            if (!soundLoadOptions.id)
                soundLoadOptions.id = soundId
            this.loadedSounds.push(sono.create(soundLoadOptions).play())
        }
    }

    move(x: number, y: number, z: number): void {
        super.move(x, y, z)
        this.loadedSounds.forEach(sound => {
            const panningEffect = SoundSource.findPanningEffect(sound)
            if (panningEffect) {
                panningEffect.setPosition(this.X, this.Y, this.Z)
            }
        })
    }

    private static findPanningEffect(sound: any): any {
        return sound.effects.find(eff => eff._in.panningModel)
    }

    unloadAllSounds(): void {
        this.loadedSounds.forEach(sound => {
            sound.unload()
        })
    }
}