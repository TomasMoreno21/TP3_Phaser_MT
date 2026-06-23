class Level1Scene extends LevelBase {
  constructor() {
    super('Level1Scene');
  }

  create() {
    super.create({
      bgColor: '#2c3e50',
      playerX: 80,
      playerY: 500,
      plataformas: [
        { x: 400, y: 568, w: 800, h: 64, color: 0x555555, label: 'ground' },

        { x: 180, y: 460, w: 280, h: 20, color: 0x666666 },
        { x: 620, y: 460, w: 280, h: 20, color: 0x666666 },

        { x: 220, y: 350, w: 300, h: 20, color: 0x777777 },
        { x: 620, y: 350, w: 220, h: 20, color: 0x777777 }
      ],
      civiles: [
        { x: 180, y: 445 },
        { x: 620, y: 445 },
        { x: 220, y: 335 }
      ],
      spawnInterval: 4500,
      npcsRequeridos: 3,
      siguienteNivel: 'Level2Scene'
    });
  }
}
