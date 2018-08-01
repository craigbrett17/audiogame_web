declare function require(s: string): string

import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../../engine/key-down-tracker'
import { PointOfView } from '../../engine/point-of-view'
import { SoundSource } from '../../engine/sound-source'
import sono from 'sono'
import 'sono/effects'
import 'sono/utils'
import '../sounds/fireplace.wav'

import { Howl, Howler } from 'howler';

const pov = new PointOfView()
pov.activate()
sono.panner.defaults.maxDistance = 10

const outputElement = document.getElementById("screen-output")
let started = false
const mapDistance = 50
let gameLoopHandle: number

keyDownEventTracker(document.getElementById("app-area"), 250, ev => {
  if (!started && ev.which == Key.Enter) {
    startGame()
  } else {
    inGameKeyPressHandler(ev)
  }
})

let sound
function startGame(): void {
  started = true
  
  // set up the game loop
  gameLoopHandle = setInterval(gameLoop, 150)

  // give a little context
  outputElement.innerText = "You open your eyes. You find yourself in a spacious wooden hall. A fire crackles merrily in the harth. You may wander round and explore"
  sound = new SoundSource(0, 5, -1).loadAndPlay({
    src: 'sounds/fireplace.wav',
    loop: true,
  })
}

function gameLoop() {
  
}

function inGameKeyPressHandler(ev: KeyboardEvent): void {
  switch (ev.which) {
    case Key.LeftArrow:
      pov.rotateLeft(45)
      console.log("Orientation: ", pov.OrientationX, pov.OrientationY, pov.OrientationZ)
      break
    case Key.RightArrow:
      pov.rotateRight(45)
      console.log("Orientation: ", pov.OrientationX, pov.OrientationY, pov.OrientationZ)
      break
    case Key.UpArrow:
      // walk forward
      break
  }
}