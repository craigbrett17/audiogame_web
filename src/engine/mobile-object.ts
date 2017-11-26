/**
 * Represents an object that has X, Y, Z coordinates and can move
 */
export abstract class MobileObject {
    /** The current X position of this object */
    X: number
    /** The current Y position of this object */
    Y: number
    /** The current Z position of this object */
    Z: number

    /** Base constructor, shouldn't be made on its own, as chances are you'd want a PointOfView or a SoundSource */
    constructor(startX: number = 0, startY: number = 0, startZ: number = 0) {
        this.X = startX
        this.Y = startY
        this.Z = startZ
    }

    /** Moves this object's coordinates */
    move(x: number, y: number, z: number) {
        this.X = x
        this.Y = y
        this.Z = z
    }
}