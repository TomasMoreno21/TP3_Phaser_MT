class Level2Scene extends LevelBase {
  constructor() {
    super('Level2Scene');
  }

  create() {
    super.create({
      bgColor: '#34495e',
      playerX: 50,
      playerY: 500,
      plataformas: [
        { x: 400, y: 568, w: 800, h: 64, color: 0x555555, label: 'ground' },
        { x: 180, y: 460, w: 240, h: 20, color: 0x666666 },
        { x: 640, y: 450, w: 200, h: 20, color: 0x666666 },
        { x: 260, y: 350, w: 260, h: 20, color: 0x777777 },
        { x: 620, y: 270, w: 200, h: 20, color: 0x777777 }
      ],
      civiles: [
        { x: 180, y: 440 }, { x: 640, y: 430 },
        { x: 260, y: 330 }, { x: 620, y: 250 }
      ],
      npcsRequeridos: 3,
      siguienteNivel: 'Level3Scene'
    });
  }
}
