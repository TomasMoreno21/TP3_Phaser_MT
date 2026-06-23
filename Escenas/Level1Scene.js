class Level1Scene extends LevelBase {
  constructor() {
    super('Level1Scene');
  }

  create() {
    super.create({
      bgColor: 0x1a1a2e,
      playerX: 50,
      playerY: 550,
      obstaculos: [
        { x: 200, y: 400, w: 40, h: 40, color: 0x666666 },
        { x: 600, y: 350, w: 60, h: 40, color: 0x666666 },
        { x: 350, y: 180, w: 40, h: 60, color: 0x666666 },
      ],
      civiles: [
        { x: 200, y: 350 },
        { x: 600, y: 300 },
        { x: 350, y: 130 },
      ],
      spawnInterval: 6000,
      npcsRequeridos: 3,
      siguienteNivel: 'Level2Scene'
    });
  }
}
