class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.add.text(400, 80, 'SALVAVIDAS', {
      fontSize: '52px', fill: '#e94560', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 145, '"Está mal, pero no tan mal"', {
      fontSize: '16px', fill: '#aaa', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(400, 210, 'Sos un bombero en un edificio en llamas.\nEmpujá a los civiles fuera del peligro\npara salvarles la vida.', {
      fontSize: '15px', fill: '#ccc', align: 'center', lineSpacing: 5
    }).setOrigin(0.5);

    const btn = this.add.rectangle(400, 380, 220, 55, 0xe94560)
      .setInteractive({ useHandCursor: true });

    this.add.text(400, 380, 'JUGAR', {
      fontSize: '24px', fill: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0xff6b6b));
    btn.on('pointerout', () => btn.setFillStyle(0xe94560));
    btn.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('Level1Scene');
    });

    const tips = [
      'WASD / FLECHAS para moverte',
      'ESPACIO para romper obstáculos',
      'Evitá al enemigo o perdés una vida',
      'Zonas de gas bajan el oxígeno',
    ];
    const tipStyle = {
      fontSize: '13px', fill: '#ffd700', align: 'center',
      lineSpacing: 4, fontStyle: 'bold'
    };
    tips.forEach((t, i) => {
      this.add.text(400, 520 + i * 20, `▸ ${t}`, tipStyle).setOrigin(0.5);
    });

  }
}
