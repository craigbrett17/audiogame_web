import { MobileObject } from './mobile-object'
import sono from 'sono'

/**
 * Represents a point of view that can be used as a source for listening to sounds
 * Will control the sono.panner position and orientation
 */
export class PointOfView extends MobileObject {
    /** The orientation X direction of the POV */
    OrientationX: number
    /** The orientation Y direction of the POV */
    OrientationY: number
    /** The orientation Z direction of the POV */
    OrientationZ: number

    constructor(startX: number = 0, startY: number = 0, startZ: number = 0, orientationX: number = 0, orientationY: number = 0, orientationZ: number = 0) {
        super(startX, startY, startZ)
        this.OrientationX = orientationX
        this.OrientationY = orientationY
        this.OrientationZ = orientationZ
    }

    /**
     * Activates this given point of view, setting the listener's position and angle to be this point of view's
     * Useful in the case of having several points of view
     */
    activate() {
        sono.panner.setListenerPosition(this.X, this.Y, this.Z)
        sono.panner.setListenerOrientation(this.OrientationX, this.OrientationY, this.OrientationZ)
    }

    move(x: number, y: number, z: number) {
        super.move(x, y, z)
        sono.panner.setListenerPosition(this.X, this.Y, this.Z)
    }

    rotateLeft(degrees: number) {
        this.OrientationX -= degrees * Math.PI / 180
        sono.panner.setListenerOrientation(this.OrientationX, this.OrientationY, this.OrientationZ)        
    }

    rotateRight(degrees: number) {
        this.OrientationX += degrees * Math.PI / 180
        sono.panner.setListenerOrientation(this.OrientationX, this.OrientationY, this.OrientationZ)        
    }
}