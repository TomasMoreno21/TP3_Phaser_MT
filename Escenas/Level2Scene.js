class Level2Scene extends LevelBase {
  constructor() {
    super('Level2Scene');
  }

  preload() {
    this.load.json('nivel2', 'Assets/nivel2.json');
  }

  create() {
    const mapData = this._obtenerMapa();
    const ent = TiledMapLoader.cargar(this, mapData);
    const civilesConZona = this._asignarZonas(ent.civiles, ent.saveZones);

    super.create({
      bgColor: 0x0a0a2e,
      playerX: ent.player.x,
      playerY: ent.player.y,
      civiles: civilesConZona,
      obstaculos: [],
      breakables: ent.breakables,
      npcsRequeridos: civilesConZona.length,
      siguienteNivel: 'Level3Scene'
    });
  }

  _obtenerMapa() {
    if (this.cache.json.exists('nivel2')) {
      return this.cache.json.get('nivel2');
    }
    return this._mapaDefecto();
  }

  _mapaDefecto() {
    return {
      "width": 20, "height": 15, "tilewidth": 40, "tileheight": 40,
      "layers": [
        {"name":"suelo","type":"tilelayer","width":20,"height":15,
          "data":[1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1] },
        {"name":"objetos","type":"tilelayer","width":20,"height":15,
          "data":[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,3,0,0,0,0,3,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] },
        {"name":"entidades","type":"objectgroup",
          "objects":[
            {"name":"player","x":60,"y":60,"width":32,"height":48},
            {"name":"civil","x":180,"y":180,"width":32,"height":64},
            {"name":"civil","x":640,"y":260,"width":32,"height":64},
            {"name":"civil","x":260,"y":420,"width":32,"height":64},
            {"name":"civil","x":580,"y":440,"width":32,"height":64},
            {"name":"saveZone","x":220,"y":180,"width":28,"height":24},
            {"name":"saveZone","x":680,"y":260,"width":28,"height":24},
            {"name":"saveZone","x":300,"y":420,"width":28,"height":24},
            {"name":"saveZone","x":620,"y":440,"width":28,"height":24}
          ]
        }
      ]
    };
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
