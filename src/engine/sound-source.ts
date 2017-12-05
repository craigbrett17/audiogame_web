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
     * @param delay The delay to put in before the sound
     * @param offset The offset to put in to the sound
     */
    loadAndPlay(soundLoadOptions: { src: string, loop?: boolean, effects?: Array<any>, [extraKeys: string]: any }, delay: number = 0, offset: number = 0): any {
        const sound = this.loadOrRetrieveSound(soundLoadOptions)
        this.playSoundFromLocation(sound, delay, offset)
        return sound
    }

    playSoundFromLocation(sound: any, delay: number = 0, offset: number = 0): void {
        const panningEffect = SoundSource.findPanningEffect(sound)
        if (panningEffect) {
            panningEffect.setPosition(this.X, this.Y, this.Z)
        } else {
            console.warn("Cannot find panning effect for sound ", sound.id)
        }
        sound.play(delay, offset)
    }

    move(x: number, y: number, z: number): void {
        super.move(x, y, z)
        // doing this here means this will change the pan location of already playing sounds
        this.loadedSounds//.filter(sound => sound.playing)
                .forEach(sound => {
            const panningEffect = SoundSource.findPanningEffect(sound)
            if (panningEffect) {
                panningEffect.setPosition(this.X, this.Y, this.Z)
            } else {
                console.warn("Unable to find panning effect for sound: ", sound)
            }
        })
    }

    protected static findPanningEffect(sound: any): any {
        return sound.effects.find(eff => eff._in.panningModel)
    }

    /**
     * Attempts to load the given sound into the engine. If the sound already exists on this object with the given src, it will not be loaded and just returned
     */
    loadOrRetrieveSound(soundLoadOptions: { src: string, loop?: boolean, effects?: Array<any>, [extraKeys: string]: any }) {
        const soundId = `${this.uuid}/${soundLoadOptions.src}`
        const existing = sono.get(soundId)
        if (existing) {
            // the sound already exists, so don't load it again
            return existing
        }

        const loadOptions = Object.assign({}, soundLoadOptions)
        const pan = sono.panner()
        pan.setPosition(this.X, this.Y, this.Z)
        if (loadOptions.effects) {
            loadOptions.effects.push(pan)
        } else {
            loadOptions.effects = [pan]
        }
        if (!loadOptions.id)
            loadOptions.id = soundId
        const sound = sono.create(loadOptions)
        this.loadedSounds.push(sound)
        return sound
    }

    destroyAllSounds(): void {
        this.loadedSounds.forEach(sound => {
            sound.destroy()
        })
    }

    unloadAllSounds(): void {
        this.loadedSounds.forEach(sound => {
            sound.unload()
        })
    }
}