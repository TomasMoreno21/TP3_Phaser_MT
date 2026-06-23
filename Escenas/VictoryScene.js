class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0a0a1e);

    this.add.text(400, 200, '¡VICTORIA!', {
      fontSize: '48px', fill: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const status = gameState.getStatus();
    this.add.text(400, 290, `Puntuación final: ${status.score}`, {
      fontSize: '22px', fill: '#fff'
    }).setOrigin(0.5);

    this.add.text(400, 330, `NPCs rescatados: ${status.npcsSaved}`, {
      fontSize: '18px', fill: '#ccc'
    }).setOrigin(0.5);

    const btn = this.add.text(400, 430, 'VOLVER AL MENÚ', {
      fontSize: '26px', fill: '#fff',
      backgroundColor: '#227722',
      padding: { x: 24, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ fill: '#ffd700' }));
    btn.on('pointerout', () => btn.setStyle({ fill: '#fff' }));
    btn.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('MenuScene');
    });
  }
}
