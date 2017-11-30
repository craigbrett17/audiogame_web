declare function require(s: string): string

import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../engine/key-down-tracker'
import GameState from './game-state'
import { PointOfView } from '../engine/point-of-view'
import { SoundSource } from '../engine/sound-source'
import sono from 'sono'
import 'sono/effects'
import 'sono/utils'
const bgm = require('../music/bgm.mp3')
import '../sounds/run1.wav'
import '../sounds/run2.wav'
import '../sounds/run3.wav'
import '../sounds/gate.wav'

// the little trick with the pov is that the pov doesn't move, the other objects' Y coordinate does
// neat, huh?
const pov = new PointOfView()
sono.panner.defaults.maxDistance = 50

// okay, for brevity, I've dispensed with engineering the actual game and slung it mostly into one file
// the engine at least keeps some of the more niche bits tidy
// I was on course to make this all neat and well engineered. But gah, inspiration damn you!

const outputElement = document.getElementById("screen-output")
let gameState = GameState.PreStart
let score = 0
let gameLoopHandle: number
const runSounds = [
  sono.create('sounds/run1.wav'),
  sono.create('sounds/run2.wav'),
  sono.create('sounds/run3.wav')
]
sono.create({
  src: "sounds/gate.wav",
  id: "bump",
  effects: [ sono.panner() ]
})

keyDownEventTracker(document.getElementById("app-area"), 250, ev => {
  switch (gameState) {
    case GameState.PreStart:
      preStartKeyPressHandler(ev)
      break
    case GameState.Started:
      inGameKeyPressHandler(ev)
      break
    case GameState.Finished:
      finishedKeyPressEventHandler(ev)
      break
  }
})

function preStartKeyPressHandler(ev: KeyboardEvent): void {
  if (ev.which == Key.Enter) {
    startGame()
  }
}

function startGame(): void {
  gameState = GameState.Started
  // start playing the bgm
  sono.create({
    src: bgm,
    id: 'bgm',
    volume: 0.5,
    loop: true
  }).play()
  
  // set up the game loop
  setTimeout(() => {
    gameLoopHandle = setInterval(gameLoop, 150)
    setTimeout(() => {
      gameOver()
    }, 30000);
  }, 3000);
}

function gameLoop() {
  if (gameState != GameState.Started) {
    clearInterval(gameLoopHandle)
    return // just stop
  }

  runSounds[Math.floor(Math.random()*runSounds.length)].play()
  score += 1
}

function inGameKeyPressHandler(ev: KeyboardEvent): void {
  switch (ev.which) {
    case Key.LeftArrow:
      if (pov.X > -10) {
        pov.X -= 1
      } else {
        sono.get("bump").effects[0].set(-0.5)
        sono.get("bump").play()
      }
      break
    case Key.RightArrow:
      if (pov.X < 10) {
        pov.X += 1
      } else {
        sono.get("bump").effects[0].set(0.5)
        sono.get("bump").play()
      }
      break
  }
}

function gameOver() {
  gameState = GameState.Finished
  slowDownMusic(() => {
    outputElement.innerText = `Bah! Game over! Your final score is: ${score}`
  })
}

function slowDownMusic(musicStoppedCallback: () => void): void {
  if (sono.get('bgm').playbackRate > 0.3) {
    sono.get('bgm').playbackRate -= 0.02
    setTimeout(() => {
      slowDownMusic(musicStoppedCallback)
    }, 200);
  } else {
    sono.get('bgm').fade(0, 1)
    if (musicStoppedCallback) {
      musicStoppedCallback()
    }
  }
}

function finishedKeyPressEventHandler(ev: KeyboardEvent): void {

}