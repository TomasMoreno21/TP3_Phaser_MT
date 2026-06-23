class Level2Scene extends LevelBase {
  constructor() {
    super('Level2Scene');
  }

  create() {
    super.create({
      bgColor: 0x2c3e50,
      playerX: 50,
      playerY: 550,
      obstaculos: [
        { x: 200, y: 450, w: 50, h: 50, color: 0x777799 },
        { x: 550, y: 400, w: 40, h: 60, color: 0x777799 },
        { x: 300, y: 250, w: 60, h: 40, color: 0x8888aa },
        { x: 500, y: 150, w: 50, h: 50, color: 0x8888aa },
      ],
      civiles: [
        { x: 200, y: 400 },
        { x: 550, y: 350 },
        { x: 300, y: 200 },
        { x: 500, y: 100 },
      ],
      spawnInterval: 3500,
      npcsRequeridos: 3,
      siguienteNivel: 'Level3Scene'
    });
  }
}
