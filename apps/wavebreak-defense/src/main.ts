import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './game/content/map'
import { GameScene } from './phaser/scenes/GameScene'
import './styles.css'
import { mountHud } from './ui/hud'

mountHud()

const gameRoot = document.querySelector<HTMLDivElement>('#game-root')

if (!gameRoot) {
  throw new Error('Missing game root')
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: gameRoot,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#16261d',
  pixelArt: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
})
