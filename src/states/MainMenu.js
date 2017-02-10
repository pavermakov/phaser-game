import Phaser from 'phaser'

export default class extends Phaser.State {
  preload() {
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.scale.setTo(0.5);
    this.logo.anchor.setTo(0.5);

    this.load.image('background', 'assets/images/background.png');
    this.load.image('avocado', 'assets/images/avocado.png');
    this.load.image('wall', 'assets/images/wall.png');
  }

  create() {
    this.game.input.onDown.add(() => this.game.state.start('Game'), this);
  }
}
