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

keyDownEventTracker(document.getElementById("app-area"), 250, ev => {
  const outputElement = document.getElementById("screen-output")
  sono.create({ src: 'sounds/keyok.wav', id: "keyok1", effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
  sono.create({ src: 'sounds/keyok1.wav', id: "keyok2", effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
  sono.create({ src: 'sounds/keyok2.wav', id: "keyok3", effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
  sono.create({ src: 'sounds/keyok3.wav', id: "keyok4", effects: [ sono.panner(), sono.echo(), sono.reverb() ] });
  
  switch (ev.which) {
    case Key.UpArrow:
      listenerY += 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)
      sono.get('keyok1').play()
      break;
    case Key.DownArrow:
      listenerY -= 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)
      sono.get('keyok2').play()
      break;
    case Key.LeftArrow:
      listenerX -= 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)  
      sono.get('keyok3').play()
      break;
    case Key.RightArrow:
      listenerX += 1
      sono.panner.setListenerPosition(listenerX, listenerY, listenerZ)  
      sono.get('keyok4').play()
      break;
    default:
      outputElement.innerText = "You pressed some other random key";
      break;
  }
})