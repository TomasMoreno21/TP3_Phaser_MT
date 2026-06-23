class Level1Scene extends LevelBase {
  constructor() {
    super('Level1Scene');
  }

  create() {
    super.create({
      bgColor: '#2c3e50',
      playerX: 50,
      playerY: 500,
      plataformas: [
        { x: 400, y: 568, w: 800, h: 64, color: 0x555555, label: 'ground' },
        { x: 220, y: 440, w: 280, h: 20, color: 0x666666 },
        { x: 630, y: 450, w: 200, h: 20, color: 0x666666 },
        { x: 350, y: 300, w: 240, h: 20, color: 0x777777 }
      ],
      civiles: [
        { x: 220, y: 420 }, { x: 630, y: 430 }, { x: 350, y: 280 }
      ],
      npcsRequeridos: 3,
      siguienteNivel: 'Level2Scene'
    });
  }
}
