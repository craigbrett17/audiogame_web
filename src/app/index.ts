import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../engine/key-down-tracker'
import { PointOfView } from '../engine/point-of-view'
import { SoundSource } from '../engine/sound-source'
import sono from 'sono'
import 'sono/effects'
import 'sono/utils'
import '../sounds/truck idle.wav'

const pov = new PointOfView()
sono.panner.defaults.maxDistance = 50

const outputElement = document.getElementById("screen-output")
const obj1 = new SoundSource(0, 10, 0)
obj1.play({ src: 'sounds/truck idle.wav', loop: true })

keyDownEventTracker(document.getElementById("app-area"), 250, ev => {
  switch (ev.which) {
    case Key.UpArrow:
      obj1.move(obj1.X, obj1.Y + 1, obj1.Z)
      break;
    case Key.DownArrow:
      obj1.move(obj1.X, obj1.Y - 1, obj1.Z)
      break;
    case Key.LeftArrow:
      obj1.move(obj1.X - 1, obj1.Y, obj1.Z)
      break;
    case Key.RightArrow:
      obj1.move(obj1.X + 1, obj1.Y, obj1.Z)
      break;
    default:
      outputElement.innerText = "You pressed some other random key";
      break;
  }
})