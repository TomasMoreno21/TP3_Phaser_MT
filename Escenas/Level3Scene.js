class Level3Scene extends LevelBase {
  constructor() {
    super('Level3Scene');
  }

  create() {
    super.create({
      bgColor: 0x0a0a2e,
      playerX: 50,
      playerY: 550,
      obstaculos: [
        { x: 200, y: 450, w: 50, h: 50, color: 0x664444 },
        { x: 550, y: 400, w: 40, h: 60, color: 0x664444 },
        { x: 150, y: 250, w: 60, h: 40, color: 0x774444 },
        { x: 500, y: 200, w: 50, h: 50, color: 0x774444 },
        { x: 350, y: 120, w: 40, h: 40, color: 0x884444 },
      ],
      civiles: [
        { x: 200, y: 400 },
        { x: 550, y: 350 },
        { x: 150, y: 200 },
        { x: 500, y: 150 },
      ],
      enemigo: { x: 400, y: 300, speed: 2, patrolRange: 150 },
      fugasGas: [
        { x: 400, y: 480, w: 60, h: 60 },
        { x: 400, y: 80, w: 60, h: 60 },
      ],

      npcsRequeridos: 4,
      siguienteNivel: 'VictoryScene'
    });
  }
}
