import { Howl } from 'howler';

export const gameState = {
  speed: 1.0,
  baseScrollSpeed: 6,
  maxSpeed: 1.5,
  speedIncrement: 0.005,
  platformLength: 80,
  activeFloatingPlatforms: [],
  activeGroundPlatforms: [],
  score: 0,
  playerY: -2.3,
  gameOver: false,
  gameStarted: false,
};

export const sounds = {
  jump: new Howl({ src: ['/sounds/jump.mp3'], volume: 0.6 }),
  coin: new Howl({ src: ['/sounds/coin.mp3'], volume: 0.7 }),
  fall: new Howl({ src: ['/sounds/fall.mp3'], volume: 0.8 }),
  bgm: new Howl({ src: ['/sounds/bgm.mp3'], volume: 0.4, loop: true, autoplay: false }),
};
