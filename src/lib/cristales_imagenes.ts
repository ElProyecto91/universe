// src/lib/cristales_imagenes.ts
// ============================================================
// UNIVERSE — Imágenes reales de cristales desde Wikimedia Commons
// Licencia: Creative Commons / Dominio Público — sin coste
// ============================================================

export const CRISTALES_IMAGENES: Record<string, string> = {
  'Amatista':          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/AmethystDP.jpg/320px-AmethystDP.jpg',
  'Cuarzo Rosa':       'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Rose_quartz_photo.jpg/320px-Rose_quartz_photo.jpg',
  'Obsidiana':         'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/ObsidianOregon.jpg/320px-ObsidianOregon.jpg',
  'Citrino':           'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Citrine.jpg/320px-Citrine.jpg',
  'Lapislázuli':       'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Lapis-lazuli_1.jpg/320px-Lapis-lazuli_1.jpg',
  'Turmalina Negra':   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Tourmaline-121240.jpg/320px-Tourmaline-121240.jpg',
  'Selenita':          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Selenite_-_Minas_Gerais%2C_Brazil.jpg/320px-Selenite_-_Minas_Gerais%2C_Brazil.jpg',
  'Malaquita':         'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Malachite_-_Shaba_Province%2C_Zaire_%284457626943%29.jpg/320px-Malachite_-_Shaba_Province%2C_Zaire_%284457626943%29.jpg',
  'Piedra Luna':       'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Moonstone_gem.JPG/320px-Moonstone_gem.JPG',
  'Cuarzo Transparente': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Quartz%2C_Tibet.jpg/320px-Quartz%2C_Tibet.jpg',
}

// Fallback si la imagen no carga
export const CRISTAL_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Quartz%2C_Tibet.jpg/320px-Quartz%2C_Tibet.jpg'
