class Level1Scene extends LevelBase {
  constructor() {
    super('Level1Scene');
  }

  create() {
    super.create({
      bgColor: '#2c3e50',
      playerX: 100,
      playerY: 500,
      plataformas: [
        { x: 400, y: 568, w: 800, h: 64, color: 0x555555, label: 'ground' },
        { x: 250, y: 440, w: 200, h: 20, color: 0x777777 },
        { x: 550, y: 340, w: 200, h: 20, color: 0x777777 }
      ]
    });
  }
}
