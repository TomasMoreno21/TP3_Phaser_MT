class Level3Scene extends LevelBase {
  constructor() {
    super('Level3Scene');
  }

  create() {
    // Nivel 3 en construcción
    super.create({
      bgColor: 0x0a0a2e,
      playerX: 50,
      playerY: 550,
      obstaculos: [],
      civiles: [],
      siguienteNivel: 'VictoryScene'
    });
  }
}
