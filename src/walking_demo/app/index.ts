declare function require(s: string): string

import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../../engine/key-down-tracker'
import '../sounds/fireplace.wav'

import { Howl, Howler } from 'howler'

const outputElement = document.getElementById("screen-output")
let started = false
const mapDistance = 50
let gameLoopHandle: number
let dir = 0
const circle: number = Math.PI * 2;

keyDownEventTracker(document.getElementById("app-area"), 250, ev => {
  if (!started && ev.which == Key.Enter) {
    startGame()
  } else {
    inGameKeyPressHandler(ev)
  }
})

function startGame(): void {
  started = true
  
  // set up the game loop
  gameLoopHandle = setInterval(gameLoop, 150)

  // give a little context
  outputElement.innerText = "You open your eyes. You find yourself in a spacious wooden hall. A fire crackles merrily in the harth. You may wander round and explore"
  let fireplaceSound = new Howl({
    autoplay: true,
    loop: true,
    src: '../sounds/fireplace.wav'
  });
  fireplaceSound.pos(10, 0, -0.5);
  Howler.pos(0, 0, -0.5)
  rotate(Math.PI * 0);
}

function gameLoop() {
  
}

function inGameKeyPressHandler(ev: KeyboardEvent): void {
  switch (ev.which) {
    case Key.LeftArrow:
      rotate(-1)
      break
    case Key.RightArrow:
      rotate(1)
      break
    case Key.UpArrow:
      break
  }
}

function rotate(angle: number): void {
  dir = (dir + angle + circle) % circle;

  // Calculate the rotation vector and update the orientation of the listener.
  var x = Math.cos(dir);
  var y = 0;
  var z = Math.sin(dir);
  Howler.orientation(x, y, z, 0, 1, 0);
  outputElement.innerText = dir + " degrees, facing " + x + "," + y + "," + z
}