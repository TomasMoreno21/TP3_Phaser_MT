class Level3Scene extends LevelBase {
  constructor() {
    super('Level3Scene');
  }

  preload() {
    this.load.json('nivel3', 'Assets/nivel3.tmj');
  }

  create() {
    gameState.currentLevel = 3;
    const mapData = this.cache.json.exists('nivel3')
      ? this.cache.json.get('nivel3')
      : this._mapaDefecto();
    const ent = TiledMapLoader.cargar(this, mapData);
    const civilesConZona = this._asignarZonas(ent.civiles, ent.saveZones);

    super.create({
      bgColor: 0x0a0a2e,
      worldWidth: 800,
      worldHeight: 600,
      playerX: ent.player.x,
      playerY: ent.player.y,
      obstaculos: [],
      breakables: ent.breakables,
      fugasGas: ent.fugasGas,
      enemigo: ent.enemigo,
      civiles: civilesConZona,
      npcsRequeridos: civilesConZona.length,
      siguienteNivel: 'VictoryScene'
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

  _mapaDefecto() {
    return {
      "width": 20, "height": 15, "tilewidth": 40, "tileheight": 40,
      "layers": [
        {"name":"objetos","type":"tilelayer","width":20,"height":15,
          "data": new Array(300).fill(0)},
        {"name":"entidades","type":"objectgroup","objects":[
          {"name":"player","x":380,"y":30,"width":32,"height":48}
        ]}
      ]
    };
  }
}
