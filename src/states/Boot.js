import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = 'black';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.setBoundsToWorld();
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

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

    // подгрузи ассеты здесь
    this.load.image('logo', 'assets/images/logo.png');
    this.load.onLoadComplete.add(this.assetsLoaded, this);
  }

  create() {

  }

  update() {
    if(this.fontsReady && this.fontsLoaded) {
      this.game.state.start('Menu');
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }

  assetsLoaded() {
    this.assetsReady = true;
  }

}
