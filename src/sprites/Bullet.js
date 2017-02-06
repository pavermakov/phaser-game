import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.scale.setTo(0.03);
    this.velocity = 700;

    this.game.physics.arcade.enable(this);
    this.enableBody = true;

    this.flyToTarget();
  }

  flyToTarget() {
    this.game.physics.arcade.moveToPointer(this, this.velocity);
  }
}
