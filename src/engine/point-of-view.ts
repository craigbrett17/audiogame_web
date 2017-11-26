import { MobileObject } from './mobile-object'
import sono from 'sono'

/**
 * Represents a poitn of view that can be used as a source for listening to sounds
 * Will control the sono.panner position and orientation
 */
export class PointOfView extends MobileObject {
    /**
     * Activates this given point of view, setting the listener's position and angle to be this point of view's
     * Useful in the case of having several points of view
     */
    activate() {
        sono.panner.setListenerPosition(this.X, this.Y, this.Z)
        sono.panner.setListenerOrientation(this.X, this.Y, this.Z)
    }

    move(x: number, y: number, z: number) {
        super.move(x, y, z)
        sono.panner.setListenerPosition(this.X, this.Y, this.Z)
    }
}