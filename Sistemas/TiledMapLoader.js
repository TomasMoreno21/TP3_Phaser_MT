const TILE_COLORS = [
  0x000000, 0x666666, 0x555555, 0x22223e,
  0x884422, 0x448844, 0x666644, 0x884444,
  0x444466, 0x664466, 0x446666, 0x666688,
  0x333333, 0x777777, 0x888866, 0x555544,
  0x995533, 0x559955, 0x339999, 0x999955,
];
const TOTAL_TILES = TILE_COLORS.length;
const BLOCKING_INDICES = new Set(Array.from({ length: TOTAL_TILES }, (_, i) => i));

class TiledMapLoader {
  static cargar(scene, mapData) {
    const tileW = mapData.tilewidth;
    const tileH = mapData.tileheight;
    const cols = mapData.width;

    mapData.layers.forEach(layer => {
      if (layer.type !== 'tilelayer') return;

      layer.data.forEach((gid, i) => {
        if (gid === 0) return;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const px = col * tileW + tileW / 2;
        const py = row * tileH + tileH / 2;
        const idx = gid - 1;
        const color = TILE_COLORS[idx] || TILE_COLORS[0];

        if (!BLOCKING_INDICES.has(idx)) return;
        const r = scene.add.rectangle(px, py, tileW, tileH, color).setDepth(0);
        scene.matter.add.gameObject(r, { isStatic: true, label: 'obstacle' });
      });
    });

    return this._parseEntities(mapData);
  }

  static _parseEntities(mapData) {
    const result = { player: null, civiles: [], saveZones: [], breakables: [], fugasGas: [], enemigo: null };
    let layer = mapData.layers.find(l => l.type === 'objectgroup' && l.name === 'entidades');
    if (!layer) {
      layer = mapData.layers.find(l => l.type === 'objectgroup');
    }
    if (!layer) return result;

    layer.objects.forEach(obj => {
      const w = obj.width || 48;
      const h = obj.height || 48;
      const cx = obj.x + w / 2;
      const cy = obj.y + h / 2;
      const name = (obj.name || '').trim();
      const type = (obj.type || '').trim();
      const cls = (obj['class'] || '').trim();

      if (name === 'player') {
        result.player = { x: cx, y: cy };
      } else if (name === 'civil') {
        result.civiles.push({ x: cx, y: cy });
      } else if (name === 'saveZone') {
        result.saveZones.push({ x: cx, y: cy, w: w, h: h });
      } else if (name === 'breakable' || type === 'rompible' || cls === 'rompible') {
        result.breakables.push({ x: cx, y: cy, w: w, h: h });
      } else if (name === 'fugaGas' || type === 'fugaGas' || cls === 'fugaGas' || type === 'gasLeak' || cls === 'gasLeak') {
        result.fugasGas.push({ x: cx, y: cy, w: w, h: h });
      } else if (name === 'enemigo' || type === 'enemigo' || cls === 'enemigo') {
        result.enemigo = { x: cx, y: cy };
      } else if (!name && Math.abs(w - 28) <= 2 && Math.abs(h - 24) <= 2) {
        result.saveZones.push({ x: cx, y: cy, w: w, h: h });
      }
    });
    return result;
  }
}
