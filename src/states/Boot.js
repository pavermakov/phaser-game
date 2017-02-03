import Phaser from 'phaser';
import transitions from 'phaser-state-transition'
import WebFont from 'webfontloader';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9';
    this.fontsReady = false;
    this.assetsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload() {
    WebFont.load({
      google: {
        families: ['Bangers'],
      },
      active: this.fontsLoaded,
    });

    this.load.image('trump', './assets/images/trump.png');
    this.load.image('map', './assets/images/map.jpg');
    this.load.image('background', './assets/images/background.jpg');
    this.load.image('vjoy_base', './assets/images/base.png');
    this.load.image('vjoy_cap', './assets/images/cap.png');
    this.load.image('shoot', './assets/images/shootBtn.png');
    this.load.image('bullet', './assets/images/troll.png');

    this.load.onLoadComplete.add(this.assetsLoaded, this);
  }

  create() {
    // добавление спрайтов на игровое поле
    this.background = this.add.sprite(0, 0, 'background');
    this.background.height = this.game.height;
    this.background.width = this.game.width;

    this.trumpLogo = this.add.sprite(this.world.centerX, this.world.centerY, 'trump');
    this.trumpLogo.scale.setTo(0.5);
    this.trumpLogo.anchor.setTo(0.5);
  }

  update() {
    this.trumpLogo.angle += 5;

    if (this.fontsReady && this.assetsReady) {
      this.state.start('Splash');
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }

  assetsLoaded() {
    this.assetsReady = true;
  }

}
