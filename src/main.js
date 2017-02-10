import Phaser from 'phaser';

import BootState from './states/Boot';
import MainMenuState from './states/MainMenu';
import GameState from './states/Game';

import config from './config';

class Game extends Phaser.Game {

  constructor () {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.AUTO, 'content', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Menu', MainMenuState, false);
    this.state.add('Game', GameState, false);

    this.state.start('Boot');
  }
}

window.game = new Game();
