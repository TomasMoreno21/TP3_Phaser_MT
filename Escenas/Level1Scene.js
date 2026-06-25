class Level1Scene extends LevelBase {
  constructor() {
    super('Level1Scene');
  }

  preload() {
    this.load.json('nivel1', 'Assets/nivel1.json');
  }

  create() {
    gameState.currentLevel = 1;
    if (this.cache.json.exists('nivel1')) {
      this._crearDesdeMapa(this.cache.json.get('nivel1'));
    } else {
      this._crearPorDefecto();
    }
  }

  _crearDesdeMapa(mapData) {
    const ent = TiledMapLoader.cargar(this, mapData);
    const civilesConZona = this._asignarZonas(ent.civiles, ent.saveZones);

    super.create({
      bgColor: 0x0a0a2e,
      playerX: ent.player.x,
      playerY: ent.player.y,
      civiles: civilesConZona,
      obstaculos: [],
      breakables: ent.breakables,
      fugasGas: ent.fugasGas,
      enemigo: ent.enemigo,
      npcsRequeridos: civilesConZona.length,
      siguienteNivel: 'Level2Scene'
    });
  }

  _crearPorDefecto() {
    super.create({
      bgColor: 0x0a0a2e,
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
      npcsRequeridos: 3,
      siguienteNivel: 'Level2Scene'
    });
  }

  _asignarZonas(civiles, zonas) {
    return civiles.map(c => {
      const best = zonas.reduce((mejor, z) => {
        const d = Phaser.Math.Distance.Between(c.x, c.y, z.x, z.y);
        return d < mejor.d ? { zona: z, d } : mejor;
      }, { zona: null, d: Infinity });
      return { x: c.x, y: c.y, zona: best.zona };
    });
  }
}
