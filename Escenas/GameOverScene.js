class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x1a0000);

    this.add.text(400, 200, 'GAME OVER', {
      fontSize: '48px', fill: '#cc3333',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const status = gameState.getStatus();
    this.add.text(400, 280, `Puntuación: ${status.score}`, {
      fontSize: '22px', fill: '#fff'
    }).setOrigin(0.5);

    this.add.text(400, 320, `NPCs rescatados: ${status.npcsSaved}`, {
      fontSize: '18px', fill: '#ccc'
    }).setOrigin(0.5);

    const btnReintentar = this.add.text(350, 420, 'REINTENTAR', {
      fontSize: '22px', fill: '#fff',
      backgroundColor: '#882222',
      padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const btnMenu = this.add.text(350, 480, 'MENÚ PRINCIPAL', {
      fontSize: '22px', fill: '#fff',
      backgroundColor: '#444444',
      padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnReintentar.on('pointerover', () => btnReintentar.setStyle({ fill: '#ffd700' }));
    btnReintentar.on('pointerout', () => btnReintentar.setStyle({ fill: '#fff' }));
    btnReintentar.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('Level1Scene');
    });

    btnMenu.on('pointerover', () => btnMenu.setStyle({ fill: '#ffd700' }));
    btnMenu.on('pointerout', () => btnMenu.setStyle({ fill: '#fff' }));
    btnMenu.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('MenuScene');
    });
  }
}
