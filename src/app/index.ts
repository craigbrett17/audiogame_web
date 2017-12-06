declare function require(s: string): string

import { Key } from 'ts-keycode-enum';
import './main.css'
import keyDownEventTracker from '../engine/key-down-tracker'
import GameState from './game-state'
import { PointOfView } from '../engine/point-of-view'
import { SoundSource } from '../engine/sound-source'
import { Obsticle } from './obsticle';
import sono from 'sono'
import 'sono/effects'
import 'sono/utils'
const bgm = require('../music/bgm.mp3')
import '../sounds/run1.wav'
import '../sounds/run2.wav'
import '../sounds/run3.wav'
import '../sounds/gate.wav'
import '../sounds/keyok1.wav'
import '../sounds/cow1.mp3'
import '../sounds/cow2.mp3'
import '../sounds/cow3.mp3'
import '../sounds/cow4.mp3'
import '../sounds/angry cow1.mp3'
import '../sounds/angry cow2.mp3'
import '../sounds/sheep1.mp3'
import '../sounds/sheep2.mp3'
import '../sounds/sheep long1.mp3'
import '../sounds/sheep short1.mp3'

// the little trick with the pov is that the pov doesn't move, the other objects' Y coordinate does
// neat, huh?
const pov = new PointOfView()
pov.activate()
sono.panner.defaults.maxDistance = 20

// okay, for brevity, I've dispensed with engineering the actual game and slung it mostly into one file
// the engine at least keeps some of the more niche bits tidy
// I was on course to make this all neat and well engineered. But gah, inspiration damn you!

const outputElement = document.getElementById("screen-output")
let gameState = GameState.PreStart
let score = 0
const mapWidth = 3
const obsticles: Array<Obsticle> = []
let gameLoopHandle: number
let lastLoopXPosition = 0
const runSounds = [
  sono.create('sounds/run1.wav'),
  sono.create('sounds/run2.wav'),
  sono.create('sounds/run3.wav')
]
// so the running sounds can pan slightly when you move left and right, add a panner to each one
//runSounds.forEach(sound => sound.effects.add(sono.panner()))
sono.create({
  src: "sounds/gate.wav",
  id: "bump",
  effects: [ sono.panner() ]
})
const cowSounds = [
  { src: 'sounds/cow1.mp3'},
  { src: 'sounds/cow2.mp3'},
  { src: 'sounds/cow3.mp3'},
  { src: 'sounds/cow4.mp3'}
]
const cowCollisionSounds = [
  { src: 'sounds/angry cow2.mp3' },
  { src: 'sounds/sheep short1.mp3' }
]

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
    volume: 0.2,
    loop: true
  }).play()
  
  // set up the game loop
  setTimeout(() => {
    gameLoopHandle = setInterval(gameLoop, 150)
  }, 3000);
}

function gameLoop() {
  if (gameState != GameState.Started) {
    clearInterval(gameLoopHandle)
    return // just stop
  }

  const runSound = runSounds[Math.floor(Math.random()*runSounds.length)]
  // if (lastLoopXPosition < pov.X) {
  //   runSound.effects[0].setPosition(pov.X - 0.1, pov.Y, pov.Z)
  // } else if (lastLoopXPosition > pov.X) {
  //   runSound.effects[0].setPosition(pov.X + 0.1, pov.Y, pov.Z)
  // } else {
  //   runSound.effects[0].setPosition(pov.X, pov.Y, pov.Z)
  // }
  runSound.play()
  
  score += 1
  lastLoopXPosition = pov.X

  for (let index = obsticles.length - 1; index >= 0; index--) {
    const obsticle = obsticles[index]
    obsticle.move(obsticle.X, obsticle.Y - 1, obsticle.Z)
    // console.log("Obsticle %d: %o", index, obsticle)
    
    if (pov.X == obsticle.X && pov.Y == obsticle.Y && pov.Z == obsticle.Z) {
      // console.log("Collision!")
      // CRASH!
      obsticle.playCollisionSounds()
      gameOver()
      return
    }

    if (obsticle.Y < -10) {
      // console.log("Obsticle %n to be unloaded", index)
      obsticle.unloadAllSounds()
      obsticles.splice(index, 1)
    }
  }

  // add new obsticles

  if (score % 20 == 0) {
    const topRandomNumber = mapWidth * 2 + 1
    const x = Math.floor(Math.random() * topRandomNumber) - (mapWidth + 1)
    const obsticle = createCow(x, 50, 0)
    // console.log("Adding new obsticle: ", obsticle)
    obsticles.push(obsticle)
  }
}

function inGameKeyPressHandler(ev: KeyboardEvent): void {
  switch (ev.which) {
    case Key.LeftArrow:
      if (pov.X > 0 - mapWidth) {
        pov.move(pov.X - 1, pov.Y, pov.Z)
      } else {
        sono.get("bump").effects[0].setPosition(pov.X - 1, pov.Y, pov.Z)
        sono.get("bump").play()
      }
      break
    case Key.RightArrow:
      if (pov.X < 0 + mapWidth) {
        pov.move(pov.X + 1, pov.Y, pov.Z)
      } else {
        sono.get("bump").effects[0].setPosition(pov.X + 1, pov.Y, pov.Z)
        sono.get("bump").play()
      }
      break
  }
}

function gameOver() {
  gameState = GameState.Finished

  obsticles.forEach(obsticle => obsticle.unloadAllSounds())

  slowDownMusic(() => {
    outputElement.innerText = `Bah! Game over! Your final score is: ${score}`
  })
}

function slowDownMusic(musicStoppedCallback: () => void): void {
  if (sono.get('bgm').playbackRate > 0.4) {
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

function createCow(x: number, y: number, z: number) {
  return new Obsticle(x, y, z, cowSounds, cowCollisionSounds)
}

function finishedKeyPressEventHandler(ev: KeyboardEvent): void {

}