import Phaser from 'phaser';


export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(1, 1);
    this.scale.setTo(0.2);
    this.velocity = 300;
    this.fixedToCamera = true;
    this.cameraOffset.setTo(this.game.camera.width - 20, this.game.camera.height - 20);
    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.inputEnabled = true;
  }
}
