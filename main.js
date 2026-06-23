const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [
    MenuScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    GameOverScene,
    VictoryScene
  ]
};

const game = new Phaser.Game(config);
