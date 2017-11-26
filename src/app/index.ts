import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../engine/key-down-tracker'
import sono from 'sono'
import 'sono/effects'
import 'sono/utils'
import '../sounds/keyok.wav'
import '../sounds/keyok1.wav'
import '../sounds/keyok2.wav'
import '../sounds/keyok3.wav'

sono.panner.setListenerPosition(0, 0, 0)
sono.panner.setListenerOrientation(0, 0, -1)
let listenerX = 0, listenerY = 0, listenerZ = 0

keyDownEventTracker(document.getElementById("app-area"), ev => {
  const outputElement = document.getElementById("screen-output")
  let sound

  switch (ev.which) {
    case Key.UpArrow:
      listenerY += 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)
      sound = sono.create({ src: 'sounds/keyok.wav', effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
      sound.effects[0].setPosition(0, 100, 0)
      sound.play();
      break;
    case Key.DownArrow:
      listenerY -= 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)
      sound = sono.create({ src: 'sounds/keyok1.wav', effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
      sound.effects[0].setPosition(0, -100, 0)
      sound.play();
      break;
    case Key.LeftArrow:
      listenerX -= 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)  
      sound = sono.create({ src: 'sounds/keyok2.wav', effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
      sound.effects[0].setPosition(-100, 0, 0)
      sound.play();
      break;
    case Key.RightArrow:
      listenerX += 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)  
      sound = sono.create({ src: 'sounds/keyok3.wav', effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
      sound.effects[0].setPosition(100, 0, 0)
      sound.play();
      break;
    default:
      outputElement.innerText = "You pressed some other random key";
      break;
  }
})