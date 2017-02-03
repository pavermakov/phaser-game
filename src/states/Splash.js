import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.assetsReady = false;
    this.playerReady = false;
  }

  create() {
    this.addBackground();
    this.addLogo();
    this.addText();

    this.createCompleted();
    this.input.onTap.addOnce(this.readyToPlay, this);
  }

  update() {
    if(this.assetsReady && this.playerReady){
      this.state.start('Game');
    }
  }

  addBackground() {
    this.background = this.add.sprite(0, 0, 'background');
    this.background.height = this.game.height;
    this.background.width = this.game.width;
  }

  addLogo() {
    this.trumpLogo = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'trump');
    this.trumpLogo.scale.setTo(0.5);
    this.trumpLogo.anchor.setTo(0.5);
  }

  addText() {
    this.playText = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Tap to Play');
    this.playText.font = 'Bangers';
    this.playText.padding.set(10, 16);
    this.playText.fontSize = 40;
    this.playText.fill = 'navy';
    this.playText.anchor.setTo(0.5);
  }

  createCompleted() {
    this.assetsReady = true;
  }

  readyToPlay() {
    this.playerReady = true;
  }

}
