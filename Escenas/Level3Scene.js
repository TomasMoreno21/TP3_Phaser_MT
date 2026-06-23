class Level3Scene extends LevelBase {
  constructor() {
    super('Level3Scene');
  }

  create() {
    super.create({
      bgColor: '#3d1a1a',
      playerX: 50,
      playerY: 500,
      plataformas: [
        { x: 400, y: 568, w: 800, h: 64, color: 0x444444, label: 'ground' },
        { x: 160, y: 460, w: 220, h: 20, color: 0x555555 },
        { x: 640, y: 470, w: 200, h: 20, color: 0x555555 },
        { x: 220, y: 340, w: 240, h: 20, color: 0x666666 },
        { x: 600, y: 270, w: 200, h: 20, color: 0x666666 }
      ],
      civiles: [
        { x: 160, y: 440 }, { x: 640, y: 450 },
        { x: 220, y: 320 }, { x: 600, y: 250 }
      ],
      npcsRequeridos: 3,
      siguienteNivel: 'VictoryScene'
    });
  }
}
