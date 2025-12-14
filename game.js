/* ============================================
   BATALLA DE HÉROES - RPG AUTOMÁTICO
   Lógica principal del juego
   ============================================ */

// ============================================
// CONFIGURACIÓN Y CONSTANTES DEL JUEGO
// ============================================

/**
 * Definición de todas las clases disponibles en el juego
 * Cada clase tiene stats base y un ícono representativo
 */
const CLASSES = {
    barbaro: {
        name: 'Bárbaro',
        icon: '🪓',
        iconFemale: '🪓',
        description: 'Guerrero feroz con alto daño físico',
        baseStats: { str: 15, agi: 10, res: 12, int: 5 }
    },
    tanque: {
        name: 'Tanque',
        icon: '🛡️',
        iconFemale: '🛡️',
        description: 'Defensor resistente que protege al equipo',
        baseStats: { str: 10, agi: 5, res: 18, int: 8 }
    },
    asesino: {
        name: 'Asesino',
        icon: '🗡️',
        iconFemale: '🗡️',
        description: 'Atacante ágil con golpes críticos',
        baseStats: { str: 12, agi: 18, res: 6, int: 6 }
    },
    arquero: {
        name: 'Arquero',
        icon: '🏹',
        iconFemale: '🏹',
        description: 'Atacante a distancia con precisión',
        baseStats: { str: 11, agi: 15, res: 8, int: 8 }
    },
    peleador: {
        name: 'Peleador',
        icon: '👊',
        iconFemale: '👊',
        description: 'Luchador equilibrado cuerpo a cuerpo',
        baseStats: { str: 13, agi: 12, res: 10, int: 7 }
    },
    curador: {
        name: 'Curador',
        icon: '💚',
        iconFemale: '💚',
        description: 'Sanador que restaura vida del equipo',
        baseStats: { str: 5, agi: 8, res: 10, int: 18 }
    },
    hechicero: {
        name: 'Hechicero',
        icon: '🔮',
        iconFemale: '🔮',
        description: 'Mago con poderosos hechizos',
        baseStats: { str: 4, agi: 7, res: 8, int: 22 }
    },
    invocador: {
        name: 'Invocador',
        icon: '👻',
        iconFemale: '👻',
        description: 'Controla criaturas invocadas',
        baseStats: { str: 6, agi: 9, res: 9, int: 18 }
    }
};

/**
 * Avatares según género para mostrar en UI
 */
const AVATARS = {
    male: '🧙‍♂️',
    female: '🧙‍♀️'
};

/**
 * Avatares de peleadores según género y clase
 */
const FIGHTER_AVATARS = {
    male: {
        barbaro: '🧔',
        tanque: '🦸‍♂️',
        asesino: '🥷',
        arquero: '🧝‍♂️',
        peleador: '🥋',
        curador: '👨‍⚕️',
        hechicero: '🧙‍♂️',
        invocador: '🧛‍♂️'
    },
    female: {
        barbaro: '👩‍🦰',
        tanque: '🦸‍♀️',
        asesino: '🥷',
        arquero: '🧝‍♀️',
        peleador: '🥋',
        curador: '👩‍⚕️',
        hechicero: '🧙‍♀️',
        invocador: '🧛‍♀️'
    }
};

/**
 * Configuración de invocaciones
 */
const SUMMON_CONFIG = {
    wolf: { name: 'Lobo Espiritual', icon: '🐺', stats: { str: 1.2, agi: 1.5, res: 0.8, int: 0.5 } },
    golem: { name: 'Gólem de Piedra', icon: '🗿', stats: { str: 1.5, agi: 0.5, res: 2.0, int: 0.5 } },
    spirit: { name: 'Espíritu Vengativo', icon: '👻', stats: { str: 0.5, agi: 1.2, res: 0.8, int: 1.8 } },
    dragon: { name: 'Dragón Ancestral', icon: '🐉', stats: { str: 2.0, agi: 1.2, res: 1.5, int: 2.0 } },
    undead: { name: 'Guerrero Esqueleto', icon: '💀', stats: { str: 1.0, agi: 1.0, res: 0.8, int: 0.5 } }
};

/**
 * Experiencia requerida por nivel de cuenta
 */
const ACCOUNT_EXP_TABLE = [];
for (let i = 1; i <= 30; i++) {
    ACCOUNT_EXP_TABLE[i] = Math.floor(100 * Math.pow(1.5, i - 1));
}

/**
 * Experiencia requerida por nivel de peleador
 */
const FIGHTER_EXP_TABLE = [];
for (let i = 1; i <= 50; i++) {
    FIGHTER_EXP_TABLE[i] = Math.floor(50 * Math.pow(1.3, i - 1));
}

/**
 * Slots de equipo según nivel de cuenta
 */
const TEAM_SLOTS_BY_LEVEL = {
    1: 1,   // Nivel 1-10: 1 slot
    11: 2,  // Nivel 11-20: 2 slots
    21: 3   // Nivel 21-30: 3 slots
};

/**
 * Configuración de zonas de exploración
 * Cada zona tiene 10 escenarios (9 normales + 1 jefe)
 */
const ZONE_CONFIG = {
    1: {
        name: 'Bosque Inicial',
        icon: '🌲',
        levelRange: [1, 10],
        monsters: ['Slime', 'Goblin', 'Lobo', 'Araña', 'Murciélago'],
        boss: { name: 'Rey Goblin', icon: '👺' }
    },
    2: {
        name: 'Montaña Oscura',
        icon: '🏔️',
        levelRange: [11, 20],
        monsters: ['Orco', 'Troll', 'Harpía', 'Golem', 'Ogro'],
        boss: { name: 'Gigante de Piedra', icon: '🗿' }
    },
    3: {
        name: 'Castillo Sombrío',
        icon: '🏰',
        levelRange: [21, 30],
        monsters: ['Esqueleto', 'Zombi', 'Fantasma', 'Vampiro', 'Nigromante'],
        boss: { name: 'Conde Vampiro', icon: '🧛' }
    },
    4: {
        name: 'Volcán Infernal',
        icon: '🌋',
        levelRange: [31, 40],
        monsters: ['Demonio', 'Diablo', 'Elemental', 'Salamandra', 'Cerbero'],
        boss: { name: 'Señor del Fuego', icon: '😈' }
    },
    5: {
        name: 'Trono del Rey',
        icon: '👑',
        levelRange: [41, 50],
        monsters: ['Caballero Oscuro', 'Liche', 'Quimera', 'Hidra', 'Dragón'],
        boss: { name: 'Rey Demonio', icon: '👹' }
    }
};

/**
 * Configuración de rangos de arena
 */
const ARENA_RANKS = {
    bronze3: { name: 'Bronce III', icon: '🥉', minPoints: 0, maxPoints: 99, rewards: { gold: 50, gems: 0 } },
    bronze2: { name: 'Bronce II', icon: '🥉', minPoints: 100, maxPoints: 199, rewards: { gold: 75, gems: 0 } },
    bronze1: { name: 'Bronce I', icon: '🥉', minPoints: 200, maxPoints: 299, rewards: { gold: 100, gems: 1 } },
    silver3: { name: 'Plata III', icon: '🥈', minPoints: 300, maxPoints: 399, rewards: { gold: 125, gems: 1 } },
    silver2: { name: 'Plata II', icon: '🥈', minPoints: 400, maxPoints: 499, rewards: { gold: 150, gems: 2 } },
    silver1: { name: 'Plata I', icon: '🥈', minPoints: 500, maxPoints: 649, rewards: { gold: 200, gems: 2 } },
    gold3: { name: 'Oro III', icon: '🥇', minPoints: 650, maxPoints: 799, rewards: { gold: 250, gems: 3 } },
    gold2: { name: 'Oro II', icon: '🥇', minPoints: 800, maxPoints: 949, rewards: { gold: 300, gems: 3 } },
    gold1: { name: 'Oro I', icon: '🥇', minPoints: 950, maxPoints: 1149, rewards: { gold: 400, gems: 5 } },
    platinum: { name: 'Platino', icon: '💎', minPoints: 1150, maxPoints: 1399, rewards: { gold: 500, gems: 7 } },
    diamond: { name: 'Diamante', icon: '💠', minPoints: 1400, maxPoints: 1699, rewards: { gold: 700, gems: 10 } },
    master: { name: 'Maestro', icon: '👑', minPoints: 1700, maxPoints: 1999, rewards: { gold: 1000, gems: 15 } },
    grandmaster: { name: 'Gran Maestro', icon: '⚜️', minPoints: 2000, maxPoints: 9999, rewards: { gold: 1500, gems: 20 } }
};

/**
 * Nombres para oponentes generados aleatoriamente
 */
const OPPONENT_NAMES = [
    'Guerrero Oscuro', 'Caballero Errante', 'Mago Místico', 'Asesino Silencioso',
    'Bárbaro Salvaje', 'Arquero Certero', 'Sanador Divino', 'Invocador Oscuro',
    'Duelista Maestro', 'Campeón de Arena', 'Gladiador Feroz', 'Espadachín Veloz',
    'Hechicero Antiguo', 'Paladín Sagrado', 'Nigromante Sombrío', 'Druida Natural',
    'Monje Zen', 'Berserker Furioso', 'Cazador Solitario', 'Brujo Maldito'
];

/**
 * Raridades de items y sus multiplicadores de stats
 */
const ITEM_RARITIES = {
    normal: { name: 'Normal', color: '#9e9e9e', icon: '⚪', multiplier: 1.0 },
    rare: { name: 'Raro', color: '#2196f3', icon: '🔵', multiplier: 1.5 },
    epic: { name: 'Épico', color: '#9c27b0', icon: '🟣', multiplier: 2.0 },
    legendary: { name: 'Legendario', color: '#ff9800', icon: '🟠', multiplier: 3.0 }
};

/**
 * Tipos de armas por clase
 */
const WEAPON_TYPES = {
    barbaro: [
        { name: 'Lanza de Dos Manos', icon: '🔱', baseStats: { str: 8, agi: 0, res: 0, int: 0 } },
        { name: 'Hacha de Dos Manos', icon: '🪓', baseStats: { str: 10, agi: 0, res: 0, int: 0 } }
    ],
    tanque: [
        { name: 'Hacha de Una Mano', icon: '⚔️', baseStats: { str: 5, agi: 0, res: 3, int: 0 } },
        { name: 'Espada de Una Mano', icon: '🗡️', baseStats: { str: 6, agi: 0, res: 2, int: 0 } },
        { name: 'Escudo', icon: '🛡️', baseStats: { str: 0, agi: 0, res: 10, int: 0 } }
    ],
    asesino: [
        { name: 'Espada de Una Mano', icon: '🗡️', baseStats: { str: 5, agi: 5, res: 0, int: 0 } },
        { name: 'Daga', icon: '🔪', baseStats: { str: 3, agi: 8, res: 0, int: 0 } }
    ],
    arquero: [
        { name: 'Arco', icon: '🏹', baseStats: { str: 4, agi: 8, res: 0, int: 0 } }
    ],
    peleador: [
        { name: 'Guantes de Pelea', icon: '🥊', baseStats: { str: 6, agi: 4, res: 0, int: 0 } }
    ],
    curador: [
        { name: 'Mazo', icon: '🔨', baseStats: { str: 2, agi: 0, res: 3, int: 5 } },
        { name: 'Escudo', icon: '🛡️', baseStats: { str: 0, agi: 0, res: 8, int: 2 } }
    ],
    hechicero: [
        { name: 'Báculo', icon: '🪄', baseStats: { str: 0, agi: 0, res: 0, int: 10 } },
        { name: 'Libro Mágico', icon: '📖', baseStats: { str: 0, agi: 0, res: 0, int: 12 } },
        { name: 'Espada', icon: '🗡️', baseStats: { str: 3, agi: 0, res: 0, int: 5 } },
        { name: 'Daga', icon: '🔪', baseStats: { str: 2, agi: 2, res: 0, int: 4 } },
        { name: 'Guantes', icon: '🧤', baseStats: { str: 0, agi: 2, res: 0, int: 6 } }
    ],
    invocador: [
        { name: 'Báculo', icon: '🪄', baseStats: { str: 0, agi: 0, res: 0, int: 10 } },
        { name: 'Libro Mágico', icon: '📖', baseStats: { str: 0, agi: 0, res: 0, int: 12 } },
        { name: 'Espada', icon: '🗡️', baseStats: { str: 3, agi: 0, res: 0, int: 5 } },
        { name: 'Daga', icon: '🔪', baseStats: { str: 2, agi: 2, res: 0, int: 4 } },
        { name: 'Guantes', icon: '🧤', baseStats: { str: 0, agi: 2, res: 0, int: 6 } }
    ]
};

/**
 * Tipos de armaduras (aplican a todas las clases)
 */
const ARMOR_TYPES = [
    { name: 'Casco', icon: '⛑️', slot: 'helmet', baseStats: { str: 1, agi: 0, res: 5, int: 1 } },
    { name: 'Guantes', icon: '🧤', slot: 'gloves', baseStats: { str: 2, agi: 2, res: 3, int: 0 } },
    { name: 'Botas', icon: '🥾', slot: 'boots', baseStats: { str: 1, agi: 3, res: 3, int: 0 } },
    { name: 'Cinturón', icon: '🎽', slot: 'belt', baseStats: { str: 2, agi: 1, res: 4, int: 0 } },
    { name: 'Peto', icon: '🦺', slot: 'chest', baseStats: { str: 2, agi: 0, res: 8, int: 0 } },
    { name: 'Pantalones', icon: '👖', slot: 'legs', baseStats: { str: 1, agi: 2, res: 5, int: 0 } }
];

/**
 * Tipos de accesorios (aplican a todas las clases)
 */
const ACCESSORY_TYPES = [
    { name: 'Brazalete', icon: '📿', slot: 'bracelet', baseStats: { str: 2, agi: 2, res: 2, int: 2 } },
    { name: 'Arete', icon: '💍', slot: 'earring', baseStats: { str: 1, agi: 3, res: 1, int: 3 } },
    { name: 'Anillo', icon: '💍', slot: 'ring', baseStats: { str: 3, agi: 1, res: 1, int: 3 } },
    { name: 'Collar', icon: '📿', slot: 'necklace', baseStats: { str: 1, agi: 1, res: 3, int: 4 } },
    { name: 'Runa', icon: '🔮', slot: 'rune', baseStats: { str: 2, agi: 2, res: 2, int: 5 } }
];

/**
 * Definición de slots de equipamiento disponibles
 */
const EQUIPMENT_SLOTS = {
    // Armadura (6 slots únicos)
    helmet: { name: 'Casco', icon: '⛑️', type: 'armor', max: 1 },
    chest: { name: 'Peto', icon: '🦺', type: 'armor', max: 1 },
    legs: { name: 'Pantalones', icon: '👖', type: 'armor', max: 1 },
    gloves: { name: 'Guantes', icon: '🧤', type: 'armor', max: 1 },
    boots: { name: 'Botas', icon: '🥾', type: 'armor', max: 1 },
    belt: { name: 'Cinturón', icon: '🎽', type: 'armor', max: 1 },
    
    // Accesorios
    necklace: { name: 'Collar', icon: '📿', type: 'accessory', max: 1 },
    rune: { name: 'Runa', icon: '🔮', type: 'accessory', max: 1 },
    bracelet: { name: 'Brazalete', icon: '📿', type: 'accessory', max: 2 },
    earring: { name: 'Arete', icon: '💍', type: 'accessory', max: 2 },
    ring: { name: 'Anillo', icon: '💍', type: 'accessory', max: 2 },
    
    // Armas (variable según clase)
    mainhand: { name: 'Mano Principal', icon: '⚔️', type: 'weapon', max: 1 },
    offhand: { name: 'Mano Secundaria', icon: '🗡️', type: 'weapon', max: 1 }
};

/**
 * Probabilidades de drop por zona
 */
const DROP_RATES = {
    1: { normal: 1.0, rare: 0, epic: 0, legendary: 0 },      // Bosque Inicial: 100% Normal
    2: { normal: 0.8, rare: 0.2, epic: 0, legendary: 0 },    // Montaña Oscura: 80% Normal, 20% Raro
    3: { normal: 0, rare: 0.8, epic: 0.2, legendary: 0 },    // Castillo Sombrío: 80% Raro, 20% Épico
    4: { normal: 0, rare: 0, epic: 0.8, legendary: 0.2 },    // Volcán Infernal: 80% Épico, 20% Legendario
    5: { normal: 0, rare: 0, epic: 0.5, legendary: 0.5 }     // Trono del Rey: 50% Épico, 50% Legendario
};

/**
 * Prefijos para nombres de items según rareza
 */
const ITEM_PREFIXES = {
    normal: ['Viejo', 'Común', 'Simple', 'Básico', 'Desgastado'],
    rare: ['Reforzado', 'Mejorado', 'Pulido', 'Fino', 'Sólido'],
    epic: ['Magistral', 'Superior', 'Excepcional', 'Poderoso', 'Majestuoso'],
    legendary: ['Divino', 'Ancestral', 'Mítico', 'Celestial', 'Eterno']
};

/**
 * Niveles donde se desbloquean habilidades
 */
const SKILL_UNLOCK_LEVELS = {
    active1: 2,
    active2: 10,
    active3: 20,
    active4: 35,
    
    passive1: 5,
    passive2: 15,
    passive3: 25,
    passive4: 40,
    
    active1_lv2: 8, active1_lv3: 18,
    active2_lv2: 18, active2_lv3: 28,
    active3_lv2: 28, active3_lv3: 38,
    active4_lv2: 42, active4_lv3: 48,
    
    passive1_lv2: 12, passive1_lv3: 22,
    passive2_lv2: 22, passive2_lv3: 32,
    passive3_lv2: 32, passive3_lv3: 42,
    passive4_lv2: 45, passive4_lv3: 50
};

/**
 * Pool de habilidades activas por clase
 */
const ACTIVE_SKILLS = {
    barbaro: [
        { id: 'fury_strike', name: 'Golpe Furioso', icon: '💥', description: 'Golpe con 150% de daño' },
        { id: 'berserker', name: 'Berserker', icon: '😤', description: 'Aumenta daño 50% por 3 turnos' },
        { id: 'whirlwind', name: 'Torbellino', icon: '🌀', description: 'Ataca a todos los enemigos' },
        { id: 'brutal_charge', name: 'Carga Brutal', icon: '🐂', description: 'Embiste causando stun' },
        { id: 'war_cry', name: 'Grito de Guerra', icon: '📢', description: 'Aumenta stats del equipo' },
        { id: 'execute', name: 'Ejecutar', icon: '⚰️', description: 'Daño extra a enemigos heridos' },
        { id: 'blood_rage', name: 'Furia Sangrienta', icon: '🩸', description: 'Más daño al perder vida' },
        { id: 'ground_slam', name: 'Golpe Sísmico', icon: '🌍', description: 'Daño en área y slow' },
        { id: 'intimidate', name: 'Intimidar', icon: '😠', description: 'Reduce daño enemigo' },
        { id: 'rampage', name: 'Frenesí', icon: '⚡', description: 'Ataque múltiple consecutivo' }
    ],
    tanque: [
        { id: 'shield_bash', name: 'Golpe de Escudo', icon: '🛡️', description: 'Aturde al enemigo' },
        { id: 'fortify', name: 'Fortificar', icon: '🏰', description: 'Aumenta defensa 100%' },
        { id: 'taunt', name: 'Provocar', icon: '😤', description: 'Fuerza al enemigo a atacarte' },
        { id: 'iron_skin', name: 'Piel de Hierro', icon: '🔩', description: 'Reduce daño recibido' },
        { id: 'reflect', name: 'Reflejo', icon: '🪞', description: 'Devuelve parte del daño' },
        { id: 'last_stand', name: 'Última Defensa', icon: '⚔️', description: 'Sobrevive con 1 HP' },
        { id: 'guardian', name: 'Guardián', icon: '🦺', description: 'Protege a un aliado' },
        { id: 'counter', name: 'Contraataque', icon: '↩️', description: 'Ataca al ser golpeado' },
        { id: 'wall', name: 'Muro', icon: '🧱', description: 'Bloquea todo el daño' },
        { id: 'rally', name: 'Reagrupar', icon: '🚩', description: 'Cura y protege al equipo' }
    ],
    asesino: [
        { id: 'backstab', name: 'Puñalada Trasera', icon: '🔪', description: 'Daño crítico garantizado' },
        { id: 'poison', name: 'Veneno', icon: '☠️', description: 'Daño por turno' },
        { id: 'shadow_step', name: 'Paso Sombrío', icon: '👤', description: 'Esquiva el próximo ataque' },
        { id: 'ambush', name: 'Emboscada', icon: '🌙', description: 'Ataque sorpresa con bonus' },
        { id: 'vital_strike', name: 'Golpe Vital', icon: '❤️‍🔥', description: 'Ignora armadura' },
        { id: 'smoke_bomb', name: 'Bomba de Humo', icon: '💨', description: 'Aumenta evasión del equipo' },
        { id: 'blade_dance', name: 'Danza de Cuchillas', icon: '💃', description: 'Ataques múltiples rápidos' },
        { id: 'mark', name: 'Marcar Objetivo', icon: '🎯', description: 'Objetivo recibe más daño' },
        { id: 'vanish', name: 'Desvanecerse', icon: '🫥', description: 'Invisible por 2 turnos' },
        { id: 'death_lotus', name: 'Loto Mortal', icon: '🌸', description: 'Daño masivo en área' }
    ],
    arquero: [
        { id: 'precise_shot', name: 'Tiro Preciso', icon: '🎯', description: 'Nunca falla, daño extra' },
        { id: 'rain_arrows', name: 'Lluvia de Flechas', icon: '🌧️', description: 'Daño a todos los enemigos' },
        { id: 'explosive_arrow', name: 'Flecha Explosiva', icon: '💥', description: 'Daño en área' },
        { id: 'freeze_arrow', name: 'Flecha de Hielo', icon: '❄️', description: 'Ralentiza al objetivo' },
        { id: 'fire_arrow', name: 'Flecha de Fuego', icon: '🔥', description: 'Daño adicional de fuego' },
        { id: 'double_shot', name: 'Disparo Doble', icon: '2️⃣', description: 'Dos flechas consecutivas' },
        { id: 'eagle_eye', name: 'Ojo de Águila', icon: '🦅', description: 'Aumenta crítico del equipo' },
        { id: 'trap', name: 'Trampa', icon: '🪤', description: 'Coloca trampa dañina' },
        { id: 'piercing', name: 'Perforante', icon: '📍', description: 'Atraviesa enemigos' },
        { id: 'snipe', name: 'Francotirador', icon: '🔭', description: 'Daño masivo a un objetivo' }
    ],
    peleador: [
        { id: 'combo', name: 'Combo', icon: '👊', description: 'Cadena de golpes' },
        { id: 'uppercut', name: 'Uppercut', icon: '🤛', description: 'Golpe que aturde' },
        { id: 'flying_kick', name: 'Patada Voladora', icon: '🦵', description: 'Ataque a distancia' },
        { id: 'focus', name: 'Concentración', icon: '🧘', description: 'Aumenta precisión' },
        { id: 'chi_burst', name: 'Explosión de Chi', icon: '💫', description: 'Daño mágico en área' },
        { id: 'counter_stance', name: 'Postura Defensiva', icon: '🥊', description: 'Contraataca golpes' },
        { id: 'pressure_point', name: 'Punto de Presión', icon: '👆', description: 'Debilita al enemigo' },
        { id: 'iron_fist', name: 'Puño de Hierro', icon: '✊', description: 'Golpe devastador' },
        { id: 'sweep', name: 'Barrido', icon: '🦿', description: 'Derriba enemigos' },
        { id: 'inner_power', name: 'Poder Interior', icon: '🔆', description: 'Aumenta todos los stats' }
    ],
    curador: [
        { id: 'heal', name: 'Curar', icon: '💚', description: 'Restaura vida a un aliado' },
        { id: 'group_heal', name: 'Curación Grupal', icon: '💕', description: 'Cura a todo el equipo' },
        { id: 'purify', name: 'Purificar', icon: '✨', description: 'Remueve efectos negativos' },
        { id: 'blessing', name: 'Bendición', icon: '🙏', description: 'Aumenta stats de aliado' },
        { id: 'barrier', name: 'Barrera', icon: '🛡️', description: 'Escudo protector' },
        { id: 'revive', name: 'Revivir', icon: '💖', description: 'Resucita aliado caído' },
        { id: 'holy_light', name: 'Luz Sagrada', icon: '☀️', description: 'Daño a enemigos y cura' },
        { id: 'regeneration', name: 'Regeneración', icon: '♻️', description: 'Cura por turno' },
        { id: 'divine_protection', name: 'Protección Divina', icon: '😇', description: 'Inmunidad temporal' },
        { id: 'miracle', name: 'Milagro', icon: '⭐', description: 'Restaura toda la vida' }
    ],
    hechicero: [
        { id: 'fireball', name: 'Bola de Fuego', icon: '🔥', description: 'Daño mágico de fuego' },
        { id: 'ice_spike', name: 'Pico de Hielo', icon: '🧊', description: 'Daño y ralentiza' },
        { id: 'lightning', name: 'Rayo', icon: '⚡', description: 'Daño eléctrico' },
        { id: 'meteor', name: 'Meteoro', icon: '☄️', description: 'Daño masivo en área' },
        { id: 'arcane_blast', name: 'Explosión Arcana', icon: '💜', description: 'Daño puro' },
        { id: 'mana_drain', name: 'Drenar Maná', icon: '🔮', description: 'Roba energía enemiga' },
        { id: 'polymorph', name: 'Transformar', icon: '🐸', description: 'Convierte en rana' },
        { id: 'time_stop', name: 'Detener Tiempo', icon: '⏰', description: 'Paraliza enemigos' },
        { id: 'inferno', name: 'Infierno', icon: '🌋', description: 'Quema continua' },
        { id: 'black_hole', name: 'Agujero Negro', icon: '🕳️', description: 'Succiona y daña' }
    ],
    invocador: [
        { id: 'summon_wolf', name: 'Invocar Lobo', icon: '🐺', description: 'Invoca lobo de combate' },
        { id: 'summon_golem', name: 'Invocar Gólem', icon: '🗿', description: 'Invoca gólem tanque' },
        { id: 'summon_spirit', name: 'Invocar Espíritu', icon: '👻', description: 'Espíritu que ataca' },
        { id: 'command', name: 'Comandar', icon: '📯', description: 'Potencia invocaciones' },
        { id: 'sacrifice', name: 'Sacrificio', icon: '💀', description: 'Destruye invocación para daño' },
        { id: 'soul_link', name: 'Enlace de Almas', icon: '🔗', description: 'Comparte vida con invocación' },
        { id: 'swarm', name: 'Enjambre', icon: '🐝', description: 'Invoca múltiples criaturas' },
        { id: 'dragon', name: 'Dragón', icon: '🐉', description: 'Invoca dragón poderoso' },
        { id: 'possession', name: 'Posesión', icon: '😈', description: 'Controla enemigo débil' },
        { id: 'army', name: 'Ejército', icon: '💀', description: 'Invoca ejército de muertos' }
    ]
};

/**
 * Pool de habilidades pasivas por clase
 */
const PASSIVE_SKILLS = {
    barbaro: [
        { id: 'p_strength', name: 'Fuerza Bruta', icon: '💪', description: '+10% daño físico' },
        { id: 'p_thick_skin', name: 'Piel Gruesa', icon: '🦏', description: '+10% vida máxima' },
        { id: 'p_rage', name: 'Ira', icon: '😡', description: '+5% daño por cada 10% vida perdida' },
        { id: 'p_cleave', name: 'Tajo', icon: '⚔️', description: 'Ataques golpean área' },
        { id: 'p_bloodlust', name: 'Sed de Sangre', icon: '🩸', description: 'Recupera vida al matar' },
        { id: 'p_intimidating', name: 'Presencia', icon: '👁️', description: 'Enemigos hacen menos daño' },
        { id: 'p_relentless', name: 'Implacable', icon: '🔄', description: 'Resiste efectos de control' },
        { id: 'p_savage', name: 'Salvaje', icon: '🐻', description: '+15% crítico' },
        { id: 'p_warlord', name: 'Señor de Guerra', icon: '👑', description: 'Bonifica al equipo' },
        { id: 'p_unstoppable', name: 'Imparable', icon: '🚂', description: 'Ignora ralentización' }
    ],
    tanque: [
        { id: 'p_armor', name: 'Armadura Pesada', icon: '🛡️', description: '+15% defensa' },
        { id: 'p_vitality', name: 'Vitalidad', icon: '❤️', description: '+20% vida máxima' },
        { id: 'p_block', name: 'Bloqueo', icon: '🚫', description: '15% chance de bloquear' },
        { id: 'p_thorns', name: 'Espinas', icon: '🌵', description: 'Refleja daño' },
        { id: 'p_guardian', name: 'Guardián', icon: '🏛️', description: 'Protege aliados cercanos' },
        { id: 'p_steadfast', name: 'Firme', icon: '⚓', description: 'Inmune a empuje' },
        { id: 'p_regenerate', name: 'Regenerar', icon: '💚', description: 'Recupera vida por turno' },
        { id: 'p_bulwark', name: 'Baluarte', icon: '🧱', description: '+25% resistencia mágica' },
        { id: 'p_endurance', name: 'Resistencia', icon: '🏃', description: 'Reduce daño crítico' },
        { id: 'p_indomitable', name: 'Indomable', icon: '🦁', description: 'No puede morir en 1 golpe' }
    ],
    asesino: [
        { id: 'p_agility', name: 'Agilidad', icon: '🏃', description: '+15% evasión' },
        { id: 'p_critical', name: 'Golpe Crítico', icon: '💥', description: '+20% daño crítico' },
        { id: 'p_swift', name: 'Veloz', icon: '💨', description: '+20% velocidad' },
        { id: 'p_deadly', name: 'Letal', icon: '☠️', description: '+10% chance de crítico' },
        { id: 'p_silent', name: 'Silencioso', icon: '🤫', description: 'Primera ataque no genera aggro' },
        { id: 'p_exploit', name: 'Explotar', icon: '🎯', description: '+30% daño a marcados' },
        { id: 'p_assassin', name: 'Asesino', icon: '🗡️', description: 'Ejecuta enemigos con poca vida' },
        { id: 'p_shadow', name: 'Sombra', icon: '🌑', description: 'Invisible al inicio' },
        { id: 'p_precision', name: 'Precisión', icon: '🎯', description: 'Ataques nunca fallan' },
        { id: 'p_venom', name: 'Veneno', icon: '🐍', description: 'Ataques envenenan' }
    ],
    arquero: [
        { id: 'p_accuracy', name: 'Precisión', icon: '🎯', description: '+15% precisión' },
        { id: 'p_range', name: 'Alcance', icon: '📏', description: 'Ataca desde más lejos' },
        { id: 'p_quick_draw', name: 'Tiro Rápido', icon: '⚡', description: '+15% velocidad de ataque' },
        { id: 'p_keen_eye', name: 'Ojo Agudo', icon: '👁️', description: '+10% crítico' },
        { id: 'p_steady', name: 'Estable', icon: '🧘', description: 'No pierde precisión' },
        { id: 'p_multishot', name: 'Multidisparo', icon: '🎆', description: 'Chance de disparo extra' },
        { id: 'p_hunter', name: 'Cazador', icon: '🏹', description: '+20% daño a bestias' },
        { id: 'p_wind', name: 'Viento', icon: '🌬️', description: 'Flechas penetran' },
        { id: 'p_tracker', name: 'Rastreador', icon: '🔍', description: 'Ve enemigos ocultos' },
        { id: 'p_sniper', name: 'Francotirador', icon: '🔭', description: 'Primer ataque hace +50%' }
    ],
    peleador: [
        { id: 'p_martial', name: 'Artes Marciales', icon: '🥋', description: '+10% a todos los stats' },
        { id: 'p_combo_master', name: 'Maestro Combo', icon: '🔢', description: 'Combos más largos' },
        { id: 'p_counter', name: 'Contraataque', icon: '↩️', description: 'Chance de contraatacar' },
        { id: 'p_balance', name: 'Equilibrio', icon: '☯️', description: 'Resiste empuje' },
        { id: 'p_inner_peace', name: 'Paz Interior', icon: '🧘', description: 'Regenera vida lento' },
        { id: 'p_flow', name: 'Flujo', icon: '🌊', description: '+20% evasión en combate' },
        { id: 'p_iron_body', name: 'Cuerpo de Hierro', icon: '🔩', description: '+15% defensa' },
        { id: 'p_chi', name: 'Chi', icon: '💫', description: 'Habilidades cuestan menos' },
        { id: 'p_master', name: 'Maestro', icon: '👴', description: 'Todas las habilidades +1 nivel' },
        { id: 'p_discipline', name: 'Disciplina', icon: '📿', description: 'Inmune a confusión' }
    ],
    curador: [
        { id: 'p_healing', name: 'Curación', icon: '💚', description: '+20% poder de curación' },
        { id: 'p_mana', name: 'Maná', icon: '🔵', description: '+30% maná máximo' },
        { id: 'p_blessed', name: 'Bendecido', icon: '😇', description: 'Curas afectan en área' },
        { id: 'p_sanctuary', name: 'Santuario', icon: '⛪', description: 'Aliados regeneran cerca' },
        { id: 'p_martyr', name: 'Mártir', icon: '✝️', description: 'Absorbe daño de aliados' },
        { id: 'p_divine', name: 'Divino', icon: '✨', description: 'Chance de cura crítica' },
        { id: 'p_spirit', name: 'Espíritu', icon: '👼', description: 'Continúa curando al morir' },
        { id: 'p_purity', name: 'Pureza', icon: '🕊️', description: 'Inmune a veneno' },
        { id: 'p_hope', name: 'Esperanza', icon: '🌈', description: 'Equipo resiste muerte' },
        { id: 'p_salvation', name: 'Salvación', icon: '💖', description: 'Revive automáticamente' }
    ],
    hechicero: [
        { id: 'p_arcane', name: 'Arcano', icon: '🔮', description: '+20% daño mágico' },
        { id: 'p_mana_pool', name: 'Pozo de Maná', icon: '🌀', description: '+40% maná' },
        { id: 'p_elemental', name: 'Elemental', icon: '🌪️', description: 'Hechizos elementales +15%' },
        { id: 'p_spellpower', name: 'Poder Mágico', icon: '⭐', description: '+25% poder de hechizo' },
        { id: 'p_penetration', name: 'Penetración', icon: '🔻', description: 'Ignora resistencia mágica' },
        { id: 'p_focus', name: 'Enfoque', icon: '🎯', description: 'Hechizos no fallan' },
        { id: 'p_cascade', name: 'Cascada', icon: '🌊', description: 'Hechizos rebotan' },
        { id: 'p_amplify', name: 'Amplificar', icon: '📢', description: 'Efectos duran más' },
        { id: 'p_efficient', name: 'Eficiente', icon: '♻️', description: '-20% costo de maná' },
        { id: 'p_archmage', name: 'Archimago', icon: '🧙', description: 'Todas habilidades +1' }
    ],
    invocador: [
        { id: 'p_bond', name: 'Vínculo', icon: '🔗', description: 'Invocaciones +20% stats' },
        { id: 'p_summons', name: 'Invocaciones', icon: '👥', description: '+1 invocación máxima' },
        { id: 'p_control', name: 'Control', icon: '🎮', description: 'Invocaciones más inteligentes' },
        { id: 'p_share', name: 'Compartir', icon: '🤝', description: 'Comparte buffs con invocaciones' },
        { id: 'p_essence', name: 'Esencia', icon: '💎', description: 'Invocaciones dan maná al morir' },
        { id: 'p_eternal', name: 'Eterno', icon: '♾️', description: 'Invocaciones duran más' },
        { id: 'p_empower', name: 'Potenciar', icon: '💪', description: 'Invocaciones hacen +30% daño' },
        { id: 'p_horde', name: 'Horda', icon: '🐺', description: 'Invoca múltiples criaturas' },
        { id: 'p_master_sum', name: 'Maestro', icon: '👑', description: 'Invocaciones élite' },
        { id: 'p_soul', name: 'Alma', icon: '👻', description: 'Absorbe alma de enemigos' }
    ]
};

// ============================================
// ESTADO DEL JUEGO
// ============================================

/**
 * Estado global del juego que se guarda en localStorage
 */
let gameState = {
    // Info del jugador
    player: {
        name: '',
        gender: 'male',
        level: 1,
        exp: 0,
        gold: 500,
        gems: 10
    },
    
    // Peleadores del jugador
    fighters: [],
    
    // Equipo activo (IDs de peleadores)
    team: [],
    
    // Inventario
    inventory: [],
    
    // Estadísticas de arena
    arena: {
        rank: 'bronze3',
        points: 0,
        wins: 0,
        losses: 0
    },
    
    // Progreso de exploración (10 escenarios por zona)
    exploration: {
        currentZone: 1,
        currentStage: 1,
        // Progreso por zona: { zona: escenarioDesbloqueado }
        zoneProgress: {
            1: 1,  // Bosque Inicial - escenario 1 desbloqueado
            2: 0,  // Montaña Oscura - bloqueada
            3: 0,  // Castillo Sombrío - bloqueada
            4: 0,  // Volcán Infernal - bloqueada
            5: 0   // Trono del Rey - bloqueada
        }
    },
    
    // Configuración
    settings: {
        musicVolume: 50,
        sfxVolume: 70,
        particles: true
    }
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un ID único para peleadores
 * @returns {string} ID único
 */
function generateId() {
    return 'fighter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Guarda el estado del juego en localStorage
 */
function saveGame() {
    localStorage.setItem('battleHeroes_save', JSON.stringify(gameState));
    console.log('💾 Juego guardado');
}

/**
 * Carga el estado del juego desde localStorage
 * @returns {boolean} True si se cargó correctamente
 */
function loadGame() {
    const saved = localStorage.getItem('battleHeroes_save');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
            console.log('📂 Juego cargado');
            return true;
        } catch (e) {
            console.error('Error cargando partida:', e);
            return false;
        }
    }
    return false;
}

/**
 * Reinicia completamente el juego
 */
function resetGame() {
    localStorage.removeItem('battleHeroes_save');
    location.reload();
}

/**
 * Exporta los datos de la partida como archivo JSON
 */
function exportSaveGame() {
    try {
        // Obtener datos del juego
        const saveData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            gameState: gameState
        };
        
        // Convertir a JSON
        const jsonString = JSON.stringify(saveData, null, 2);
        
        // Crear blob y descargar
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Nombre del archivo con fecha y nombre del jugador
        const playerName = gameState.player.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const date = new Date().toISOString().split('T')[0];
        link.download = `batalla_heroes_${playerName}_${date}.json`;
        
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Partida exportada exitosamente', 'success');
    } catch (error) {
        console.error('Error al exportar partida:', error);
        showToast('Error al exportar la partida', 'error');
    }
}

/**
 * Importa los datos de una partida desde un archivo JSON
 * @param {Event} event - Evento del input file
 */
function importSaveGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar que sea un archivo JSON
    if (!file.name.endsWith('.json')) {
        showToast('El archivo debe ser formato JSON', 'error');
        event.target.value = ''; // Resetear input
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const saveData = JSON.parse(e.target.result);
            
            // Validar estructura del archivo
            if (!saveData.gameState || !saveData.gameState.player) {
                showToast('Archivo de partida inválido', 'error');
                return;
            }
            
            // Confirmar importación
            showModal(
                'Cargar Partida',
                `<p>¿Deseas cargar la partida de <strong>${saveData.gameState.player.name}</strong>?</p>
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.5rem;">
                    Nivel ${saveData.gameState.player.level} • ${saveData.gameState.fighters.length} peleadores
                </p>
                <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem;">
                    Tu partida actual será reemplazada
                </p>`,
                [
                    { text: 'Cancelar', action: 'closeModal()' },
                    { 
                        text: 'Cargar', 
                        class: 'btn-primary', 
                        action: `confirmImportSave('${encodeURIComponent(JSON.stringify(saveData.gameState))}')` 
                    }
                ]
            );
            
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            showToast('Error al leer el archivo de partida', 'error');
        }
        
        // Resetear input para permitir seleccionar el mismo archivo nuevamente
        event.target.value = '';
    };
    
    reader.onerror = () => {
        showToast('Error al leer el archivo', 'error');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

/**
 * Confirma la importación de la partida
 * @param {string} encodedData - Datos codificados del gameState
 */
function confirmImportSave(encodedData) {
    try {
        const newGameState = JSON.parse(decodeURIComponent(encodedData));
        
        // Reemplazar gameState
        Object.assign(gameState, newGameState);
        
        // Guardar en localStorage
        saveGame();
        
        // Navegar al menú principal
        closeModal();
        navigateTo('screen-main-menu');
        initMainMenu();
        
        showToast('¡Partida cargada exitosamente!', 'success');
    } catch (error) {
        console.error('Error al importar partida:', error);
        showToast('Error al importar la partida', 'error');
        closeModal();
    }
}

/**
 * Obtiene el número de slots de equipo según el nivel de cuenta
 * @param {number} level - Nivel de cuenta
 * @returns {number} Número de slots disponibles
 */
function getTeamSlots(level) {
    if (level >= 21) return 3;
    if (level >= 11) return 2;
    return 1;
}

/**
 * Calcula la experiencia necesaria para el siguiente nivel de cuenta
 * @param {number} level - Nivel actual
 * @returns {number} EXP necesaria
 */
function getAccountExpNeeded(level) {
    return ACCOUNT_EXP_TABLE[level] || 999999;
}

/**
 * Calcula la experiencia necesaria para el siguiente nivel de peleador
 * @param {number} level - Nivel actual
 * @returns {number} EXP necesaria
 */
function getFighterExpNeeded(level) {
    return FIGHTER_EXP_TABLE[level] || 999999;
}

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Muestra un modal con contenido personalizado
 * @param {string} title - Título del modal
 * @param {string} content - HTML del contenido
 * @param {Array} buttons - Array de objetos {text, class, action}
 */
function showModal(title, content, buttons = []) {
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    let buttonsHTML = buttons.map(btn => 
        `<button class="${btn.class || 'btn-secondary'}" onclick="${btn.action}">${btn.text}</button>`
    ).join('');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
        </div>
        <div class="modal-body">
            ${content}
        </div>
        <div class="modal-footer">
            ${buttonsHTML}
        </div>
    `;
    
    overlay.classList.remove('hidden');
}

/**
 * Cierra el modal
 */
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// ============================================
// NAVEGACIÓN ENTRE PANTALLAS
// ============================================

/**
 * Cambia a una pantalla específica
 * @param {string} screenId - ID de la pantalla destino
 */
function navigateTo(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla objetivo
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Ejecutar función de inicialización si existe
        const initFn = screenInitializers[screenId];
        if (initFn) initFn();
    }
}

/**
 * Funciones de inicialización para cada pantalla
 */
const screenInitializers = {
    'screen-main-menu': initMainMenu,
    'screen-fighters': initFightersScreen,
    'screen-recruit': initRecruitScreen,
    'screen-fighter-detail': initFighterDetailScreen,
    'screen-exploration': initExplorationScreen,
    'screen-arena': initArenaScreen,
    'screen-inventory': initInventoryScreen
};

// ============================================
// INICIALIZACIÓN DE PANTALLAS
// ============================================

/**
 * Inicializa el menú principal con datos del jugador
 */
function initMainMenu() {
    // Actualizar info del jugador
    document.getElementById('menu-player-avatar').textContent = AVATARS[gameState.player.gender];
    document.getElementById('menu-player-name').textContent = gameState.player.name;
    document.getElementById('menu-player-level').textContent = gameState.player.level;
    document.getElementById('menu-gold').textContent = gameState.player.gold.toLocaleString();
    document.getElementById('menu-gems').textContent = gameState.player.gems.toLocaleString();
    
    // Actualizar barra de experiencia
    const expNeeded = getAccountExpNeeded(gameState.player.level);
    const expPercent = (gameState.player.exp / expNeeded) * 100;
    document.getElementById('menu-exp-bar').style.width = `${expPercent}%`;
    
    // Actualizar badge de peleadores
    const slots = getTeamSlots(gameState.player.level);
    document.getElementById('badge-fighters').textContent = `${gameState.fighters.length}/${slots}`;
}

/**
 * Inicializa la pantalla de peleadores
 */
function initFightersScreen() {
    const teamSlotsContainer = document.getElementById('team-slots');
    const fightersGrid = document.getElementById('fighters-grid');
    const noFighters = document.getElementById('no-fighters');
    
    // Generar slots de equipo
    const totalSlots = 3;
    const availableSlots = getTeamSlots(gameState.player.level);
    
    teamSlotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'team-slot';
        slot.dataset.slot = i;
        
        if (i >= availableSlots) {
            // Slot bloqueado
            slot.classList.add('locked');
            const unlockLevel = i === 1 ? 11 : 21;
            slot.innerHTML = `
                <span class="slot-lock">🔒</span>
                <span class="slot-label">Nivel ${unlockLevel}</span>
            `;
        } else if (gameState.team[i]) {
            // Slot con peleador
            const fighter = gameState.fighters.find(f => f.id === gameState.team[i]);
            if (fighter) {
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="slot-fighter">
                        <span class="slot-fighter-icon">${FIGHTER_AVATARS[fighter.gender][fighter.class]}</span>
                        <span class="slot-fighter-name">${fighter.name}</span>
                        <span class="slot-fighter-level">Nv. ${fighter.level}</span>
                    </div>
                `;
                // Hacer clic abre el detalle del peleador
                slot.onclick = () => openFighterDetail(fighter.id);
            }
        } else {
            // Slot vacío
            slot.innerHTML = `
                <span class="slot-empty-icon">➕</span>
                <span class="slot-label">Vacío</span>
            `;
            slot.onclick = () => openFighterSelector(i);
        }
        
        teamSlotsContainer.appendChild(slot);
    }
    
    // Generar grid de peleadores
    fightersGrid.innerHTML = '';
    
    if (gameState.fighters.length === 0) {
        noFighters.style.display = 'block';
        fightersGrid.appendChild(noFighters);
    } else {
        noFighters.style.display = 'none';
        
        gameState.fighters.forEach(fighter => {
            const card = createFighterCard(fighter);
            fightersGrid.appendChild(card);
        });
    }
}

/**
 * Crea una tarjeta de peleador para el grid
 * @param {Object} fighter - Datos del peleador
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createFighterCard(fighter) {
    const card = document.createElement('div');
    card.className = 'fighter-card';
    card.onclick = () => openFighterDetail(fighter.id);
    
    const classInfo = CLASSES[fighter.class];
    const avatar = FIGHTER_AVATARS[fighter.gender][fighter.class];
    
    card.innerHTML = `
        <div class="fighter-card-header">
            <div class="fighter-card-avatar">${avatar}</div>
            <div class="fighter-card-info">
                <h4>${fighter.name}</h4>
                <p>${classInfo.name}</p>
                <span class="fighter-card-level">Nivel ${fighter.level}</span>
            </div>
        </div>
        <div class="fighter-card-stats">
            <div class="mini-stat">
                <span class="mini-stat-icon">💪</span>
                <span class="mini-stat-value">${fighter.stats.str}</span>
            </div>
            <div class="mini-stat">
                <span class="mini-stat-icon">🏃</span>
                <span class="mini-stat-value">${fighter.stats.agi}</span>
            </div>
            <div class="mini-stat">
                <span class="mini-stat-icon">🛡️</span>
                <span class="mini-stat-value">${fighter.stats.res}</span>
            </div>
            <div class="mini-stat">
                <span class="mini-stat-icon">🧠</span>
                <span class="mini-stat-value">${fighter.stats.int}</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Abre el selector de peleadores para un slot de equipo
 * @param {number} slotIndex - Índice del slot
 */
function openFighterSelector(slotIndex) {
    // Filtrar peleadores que no están en el equipo
    const available = gameState.fighters.filter(f => !gameState.team.includes(f.id));
    
    if (available.length === 0) {
        showToast('No tienes peleadores disponibles', 'error');
        return;
    }
    
    let content = '<div class="fighters-grid" style="max-height: 300px; overflow-y: auto;">';
    available.forEach(fighter => {
        const classInfo = CLASSES[fighter.class];
        const avatar = FIGHTER_AVATARS[fighter.gender][fighter.class];
        content += `
            <div class="fighter-card" onclick="addToTeam('${fighter.id}', ${slotIndex}); closeModal();">
                <div class="fighter-card-header">
                    <div class="fighter-card-avatar">${avatar}</div>
                    <div class="fighter-card-info">
                        <h4>${fighter.name}</h4>
                        <p>${classInfo.name}</p>
                        <span class="fighter-card-level">Nivel ${fighter.level}</span>
                    </div>
                </div>
            </div>
        `;
    });
    content += '</div>';
    
    showModal('Seleccionar Peleador', content, [
        { text: 'Cancelar', action: 'closeModal()' }
    ]);
}

/**
 * Añade un peleador al equipo
 * @param {string} fighterId - ID del peleador
 * @param {number} slotIndex - Índice del slot
 */
function addToTeam(fighterId, slotIndex) {
    gameState.team[slotIndex] = fighterId;
    saveGame();
    initFightersScreen();
    showToast('Peleador añadido al equipo', 'success');
}

/**
 * Remueve un peleador del equipo
 * @param {number} slotIndex - Índice del slot
 */
function removeFromTeam(slotIndex) {
    const fighter = gameState.fighters.find(f => f.id === gameState.team[slotIndex]);
    
    showModal(
        'Remover del Equipo',
        `<p>¿Quieres remover a <strong>${fighter.name}</strong> del equipo?</p>`,
        [
            { text: 'Cancelar', action: 'closeModal()' },
            { text: 'Remover', class: 'btn-danger', action: `confirmRemoveFromTeam(${slotIndex})` }
        ]
    );
}

/**
 * Confirma la remoción de un peleador del equipo
 * @param {number} slotIndex - Índice del slot
 */
function confirmRemoveFromTeam(slotIndex) {
    gameState.team[slotIndex] = null;
    // Limpiar nulls al final
    while (gameState.team.length > 0 && gameState.team[gameState.team.length - 1] === null) {
        gameState.team.pop();
    }
    saveGame();
    closeModal();
    initFightersScreen();
    showToast('Peleador removido del equipo', 'info');
}

/**
 * Remueve el peleador actual del equipo (desde la pantalla de detalle)
 */
function removeCurrentFromTeam() {
    if (!currentFighterId) return;
    
    const fighter = gameState.fighters.find(f => f.id === currentFighterId);
    if (!fighter) return;
    
    const teamIndex = gameState.team.indexOf(currentFighterId);
    if (teamIndex === -1) return;
    
    showModal(
        'Remover del Equipo',
        `<p>¿Quieres remover a <strong>${fighter.name}</strong> del equipo?</p>`,
        [
            { text: 'Cancelar', action: 'closeModal()' },
            { text: 'Remover', class: 'btn-danger', action: 'confirmRemoveCurrentFromTeam()' }
        ]
    );
}

/**
 * Confirma la remoción del peleador actual del equipo
 */
function confirmRemoveCurrentFromTeam() {
    if (!currentFighterId) return;
    
    const teamIndex = gameState.team.indexOf(currentFighterId);
    if (teamIndex !== -1) {
        gameState.team[teamIndex] = null;
        // Limpiar nulls al final
        while (gameState.team.length > 0 && gameState.team[gameState.team.length - 1] === null) {
            gameState.team.pop();
        }
    }
    
    saveGame();
    closeModal();
    // Actualizar la pantalla de detalle
    initFighterDetailScreen();
    showToast('Peleador removido del equipo', 'info');
}

// Variable global para el peleador seleccionado actualmente
let currentFighterId = null;

/**
 * Abre el detalle de un peleador
 * @param {string} fighterId - ID del peleador
 */
function openFighterDetail(fighterId) {
    currentFighterId = fighterId;
    navigateTo('screen-fighter-detail');
}

/**
 * Inicializa la pantalla de detalle del peleador
 */
function initFighterDetailScreen() {
    if (!currentFighterId) return;
    
    const fighter = gameState.fighters.find(f => f.id === currentFighterId);
    if (!fighter) return;
    
    const classInfo = CLASSES[fighter.class];
    const avatar = FIGHTER_AVATARS[fighter.gender][fighter.class];
    
    // === INFO PRINCIPAL ===
    document.getElementById('detail-avatar').innerHTML = `<span>${avatar}</span>`;
    document.getElementById('detail-name').textContent = fighter.name;
    document.getElementById('detail-class').textContent = classInfo.name;
    document.getElementById('detail-gender').textContent = fighter.gender === 'male' ? '♂ Masculino' : '♀ Femenino';
    document.getElementById('detail-level').textContent = fighter.level;
    
    // === EXPERIENCIA ===
    const expNeeded = getFighterExpNeeded(fighter.level);
    const expPercent = Math.min((fighter.exp / expNeeded) * 100, 100);
    const expRemaining = expNeeded - fighter.exp;
    
    document.getElementById('detail-exp-bar').style.width = `${expPercent}%`;
    document.getElementById('detail-exp-text').textContent = `${fighter.exp}/${expNeeded}`;
    
    if (fighter.level >= 50) {
        document.getElementById('detail-exp-next').textContent = '¡Nivel máximo alcanzado!';
    } else {
        document.getElementById('detail-exp-next').textContent = `Faltan ${expRemaining} EXP para nivel ${fighter.level + 1}`;
    }
    
    // === PUNTOS DISPONIBLES ===
    const pointsElement = document.getElementById('detail-points');
    const pointsBadge = document.getElementById('detail-points-badge');
    pointsElement.textContent = fighter.statPoints;
    
    if (fighter.statPoints > 0) {
        pointsBadge.style.display = 'inline-block';
    } else {
        pointsBadge.style.display = 'none';
    }
    
    // === STATS BASE ===
    document.getElementById('stat-str').textContent = fighter.stats.str;
    document.getElementById('stat-agi').textContent = fighter.stats.agi;
    document.getElementById('stat-res').textContent = fighter.stats.res;
    document.getElementById('stat-int').textContent = fighter.stats.int;
    
    // === EFECTOS DE STATS ===
    const combatStats = calculateCombatStats(fighter);
    
    // Fuerza -> Daño físico
    document.getElementById('stat-str-dmg').textContent = combatStats.physicalDamage;
    
    // Agilidad -> Precisión, Evasión, Velocidad, Crítico
    document.getElementById('stat-agi-hit').textContent = `+${combatStats.accuracy}%`;
    document.getElementById('stat-agi-eva').textContent = `+${combatStats.evasion}%`;
    document.getElementById('stat-agi-spd').textContent = combatStats.attackSpeed.toFixed(1);
    document.getElementById('stat-agi-crit').textContent = `+${combatStats.critChance}%`;
    
    // Resistencia -> Vida, Defensa, Res. Mágica
    document.getElementById('stat-res-hp').textContent = combatStats.maxHp;
    document.getElementById('stat-res-def').textContent = combatStats.defense;
    document.getElementById('stat-res-mdef').textContent = combatStats.magicDefense;
    
    // Inteligencia -> Daño mágico, Maná, Poder invocación
    document.getElementById('stat-int-mdmg').textContent = combatStats.magicDamage;
    document.getElementById('stat-int-mana').textContent = combatStats.maxMana;
    document.getElementById('stat-int-summon').textContent = `+${combatStats.summonPower}%`;
    
    // === STATS DE COMBATE CALCULADOS ===
    const combatStatsGrid = document.getElementById('combat-stats-grid');
    combatStatsGrid.innerHTML = `
        <div class="combat-stat-item">
            <span class="combat-stat-icon">❤️</span>
            <span class="combat-stat-value">${combatStats.maxHp}</span>
            <span class="combat-stat-label">Vida</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">💧</span>
            <span class="combat-stat-value">${combatStats.maxMana}</span>
            <span class="combat-stat-label">Maná</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">⚔️</span>
            <span class="combat-stat-value">${combatStats.physicalDamage}</span>
            <span class="combat-stat-label">Daño Físico</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">🔮</span>
            <span class="combat-stat-value">${combatStats.magicDamage}</span>
            <span class="combat-stat-label">Daño Mágico</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">🛡️</span>
            <span class="combat-stat-value">${combatStats.defense}</span>
            <span class="combat-stat-label">Defensa</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">✨</span>
            <span class="combat-stat-value">${combatStats.magicDefense}</span>
            <span class="combat-stat-label">Res. Mágica</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">🎯</span>
            <span class="combat-stat-value">${combatStats.accuracy}%</span>
            <span class="combat-stat-label">Precisión</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">💨</span>
            <span class="combat-stat-value">${combatStats.evasion}%</span>
            <span class="combat-stat-label">Evasión</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">🎲</span>
            <span class="combat-stat-value">${combatStats.critChance}%</span>
            <span class="combat-stat-label">Crítico</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">💥</span>
            <span class="combat-stat-value">${combatStats.critDamage}%</span>
            <span class="combat-stat-label">Daño Crit.</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">⚡</span>
            <span class="combat-stat-value">${combatStats.attackSpeed.toFixed(1)}</span>
            <span class="combat-stat-label">Vel. Ataque</span>
        </div>
        <div class="combat-stat-item">
            <span class="combat-stat-icon">👻</span>
            <span class="combat-stat-value">${combatStats.summonPower}%</span>
            <span class="combat-stat-label">P. Invocación</span>
        </div>
    `;
    
    // Mostrar/ocultar botones de añadir según puntos disponibles
    document.querySelectorAll('.btn-stat-add').forEach(btn => {
        if (fighter.statPoints > 0) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    // === HABILIDADES ACTIVAS ===
    const activeSkillsContainer = document.getElementById('active-skills-detailed');
    activeSkillsContainer.innerHTML = '';
    
    const activeUnlockLevels = [
        { level: SKILL_UNLOCK_LEVELS.active1, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.active1, SKILL_UNLOCK_LEVELS.active1_lv2, SKILL_UNLOCK_LEVELS.active1_lv3] },
        { level: SKILL_UNLOCK_LEVELS.active2, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.active2, SKILL_UNLOCK_LEVELS.active2_lv2, SKILL_UNLOCK_LEVELS.active2_lv3] },
        { level: SKILL_UNLOCK_LEVELS.active3, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.active3, SKILL_UNLOCK_LEVELS.active3_lv2, SKILL_UNLOCK_LEVELS.active3_lv3] },
        { level: SKILL_UNLOCK_LEVELS.active4, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.active4, SKILL_UNLOCK_LEVELS.active4_lv2, SKILL_UNLOCK_LEVELS.active4_lv3] }
    ];
    
    activeUnlockLevels.forEach((config, index) => {
        const card = document.createElement('div');
        card.className = 'skill-detailed-card active-skill';
        
        if (fighter.level >= config.level && fighter.activeSkills[index]) {
            const skill = fighter.activeSkills[index];
            const tierInfo = getTierInfo(skill.tier, config.maxTier);
            
            card.innerHTML = `
                <div class="skill-icon-large skill-tooltip-trigger" 
                     data-tooltip-title="${skill.name}" 
                     data-tooltip-desc="${skill.description}"
                     data-tooltip-meta="Tier ${skill.tier}/${config.maxTier} • Nv.${config.level}">
                    ${skill.icon}
                    <span class="skill-tier-badge">${skill.tier}</span>
                </div>
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-unlock-level">Desbloqueada Nv.${config.level} • Tier ${skill.tier}/${config.maxTier}</span>
                    <span class="skill-description">${skill.description}</span>
                    <span class="skill-effect-tag">${getSkillEffectTag(skill, skill.tier)}</span>
                </div>
            `;
        } else if (fighter.level >= config.level) {
            card.classList.add('empty');
            card.innerHTML = `
                <div class="skill-icon-large">❓</div>
                <div class="skill-info">
                    <span class="skill-name">Sin aprender</span>
                    <span class="skill-unlock-level">Disponible desde Nv.${config.level}</span>
                    <span class="skill-description">Se aprenderá aleatoriamente al subir de nivel</span>
                </div>
            `;
        } else {
            card.classList.add('locked');
            card.innerHTML = `
                <div class="skill-icon-large">🔒</div>
                <div class="skill-info">
                    <span class="skill-name">Bloqueada</span>
                    <span class="skill-unlock-level">Se desbloquea en Nv.${config.level}</span>
                    <span class="skill-description">Sube de nivel para desbloquear este slot de habilidad</span>
                </div>
            `;
        }
        
        activeSkillsContainer.appendChild(card);
    });
    
    // === HABILIDADES PASIVAS ===
    const passiveSkillsContainer = document.getElementById('passive-skills-detailed');
    passiveSkillsContainer.innerHTML = '';
    
    const passiveUnlockLevels = [
        { level: SKILL_UNLOCK_LEVELS.passive1, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.passive1, SKILL_UNLOCK_LEVELS.passive1_lv2, SKILL_UNLOCK_LEVELS.passive1_lv3] },
        { level: SKILL_UNLOCK_LEVELS.passive2, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.passive2, SKILL_UNLOCK_LEVELS.passive2_lv2, SKILL_UNLOCK_LEVELS.passive2_lv3] },
        { level: SKILL_UNLOCK_LEVELS.passive3, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.passive3, SKILL_UNLOCK_LEVELS.passive3_lv2, SKILL_UNLOCK_LEVELS.passive3_lv3] },
        { level: SKILL_UNLOCK_LEVELS.passive4, maxTier: 3, tierLevels: [SKILL_UNLOCK_LEVELS.passive4, SKILL_UNLOCK_LEVELS.passive4_lv2, SKILL_UNLOCK_LEVELS.passive4_lv3] }
    ];
    
    passiveUnlockLevels.forEach((config, index) => {
        const card = document.createElement('div');
        card.className = 'skill-detailed-card passive-skill';
        
        if (fighter.level >= config.level && fighter.passiveSkills[index]) {
            const skill = fighter.passiveSkills[index];
            
            card.innerHTML = `
                <div class="skill-icon-large skill-tooltip-trigger"
                     data-tooltip-title="${skill.name}" 
                     data-tooltip-desc="${skill.description}"
                     data-tooltip-meta="Tier ${skill.tier}/${config.maxTier} • Nv.${config.level}">
                    ${skill.icon}
                    <span class="skill-tier-badge">${skill.tier}</span>
                </div>
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-unlock-level">Desbloqueada Nv.${config.level} • Tier ${skill.tier}/${config.maxTier}</span>
                    <span class="skill-description">${skill.description}</span>
                    <span class="skill-effect-tag">${getPassiveEffectTag(skill, skill.tier)}</span>
                </div>
            `;
        } else if (fighter.level >= config.level) {
            card.classList.add('empty');
            card.innerHTML = `
                <div class="skill-icon-large">❓</div>
                <div class="skill-info">
                    <span class="skill-name">Sin aprender</span>
                    <span class="skill-unlock-level">Disponible desde Nv.${config.level}</span>
                    <span class="skill-description">Se aprenderá aleatoriamente al subir de nivel</span>
                </div>
            `;
        } else {
            card.classList.add('locked');
            card.innerHTML = `
                <div class="skill-icon-large">🔒</div>
                <div class="skill-info">
                    <span class="skill-name">Bloqueada</span>
                    <span class="skill-unlock-level">Se desbloquea en Nv.${config.level}</span>
                    <span class="skill-description">Sube de nivel para desbloquear este slot de habilidad</span>
                </div>
            `;
        }
        
        passiveSkillsContainer.appendChild(card);
    });
    
    // === POOL DE HABILIDADES POR APRENDER ===
    // Verificar que exista el skillPool
    if (!fighter.skillPool) {
        fighter.skillPool = {
            active: shuffleArray([...ACTIVE_SKILLS[fighter.class]]).slice(0, 10),
            passive: shuffleArray([...PASSIVE_SKILLS[fighter.class]]).slice(0, 10)
        };
        saveGame();
    }
    
    const poolActiveContainer = document.getElementById('pool-active-skills');
    const poolPassiveContainer = document.getElementById('pool-passive-skills');
    
    document.getElementById('pool-active-count').textContent = fighter.skillPool.active.length;
    document.getElementById('pool-passive-count').textContent = fighter.skillPool.passive.length;
    
    poolActiveContainer.innerHTML = fighter.skillPool.active.map(skill => `
        <div class="skill-pool-item" title="${skill.description}">
            <span class="pool-icon">${skill.icon}</span>
            <span class="pool-name">${skill.name}</span>
        </div>
    `).join('') || '<span style="color: var(--color-text-muted); font-size: 0.75rem;">No hay más habilidades por aprender</span>';
    
    poolPassiveContainer.innerHTML = fighter.skillPool.passive.map(skill => `
        <div class="skill-pool-item" title="${skill.description}">
            <span class="pool-icon">${skill.icon}</span>
            <span class="pool-name">${skill.name}</span>
        </div>
    `).join('') || '<span style="color: var(--color-text-muted); font-size: 0.75rem;">No hay más habilidades por aprender</span>';
    
    // === EQUIPAMIENTO ===
    renderEquipmentSlots(fighter);
    
    // === BOTÓN DE REMOVER DEL EQUIPO ===
    const btnRemoveFromTeam = document.getElementById('btn-remove-from-team');
    const isInTeam = gameState.team.includes(currentFighterId);
    
    if (isInTeam) {
        btnRemoveFromTeam.style.display = 'inline-block';
    } else {
        btnRemoveFromTeam.style.display = 'none';
    }
}

/**
 * Renderiza los slots de equipamiento del peleador
 * @param {Object} fighter - Peleador
 */
function renderEquipmentSlots(fighter) {
    const equipmentContainer = document.getElementById('equipment-slots');
    if (!equipmentContainer) return;
    
    // Inicializar equipment si no existe
    if (!fighter.equipment) {
        fighter.equipment = {
            helmet: null,
            chest: null,
            legs: null,
            gloves: null,
            boots: null,
            belt: null,
            necklace: null,
            rune: null,
            bracelet: [],
            earring: [],
            ring: [],
            mainhand: null,
            offhand: null
        };
    }
    
    // Función helper para obtener item por ID
    const getItem = (itemId) => gameState.inventory.find(i => i.id === itemId);
    
    // Función para renderizar un slot único
    const renderSlot = (slotKey, slotInfo) => {
        const itemId = fighter.equipment[slotKey];
        const item = itemId ? getItem(itemId) : null;
        
        return `
            <div class="equipment-slot ${item ? 'equipped' : 'empty'}">
                <div class="slot-icon">${slotInfo.icon}</div>
                <div class="slot-content">
                    <div class="slot-label">${slotInfo.name}</div>
                    ${item ? `
                        <div class="slot-item" style="color: ${item.rarityInfo.color};">
                            ${item.icon} ${item.name}
                            <button class="btn-unequip" onclick="unequipItem('${fighter.id}', '${slotKey}')">✖</button>
                        </div>
                        <div class="slot-stats">${Object.entries(item.stats).filter(([s, v]) => v > 0).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(', ')}</div>
                    ` : `
                        <div class="slot-empty-text">Vacío</div>
                    `}
                </div>
            </div>
        `;
    };
    
    // Función para renderizar slots múltiples
    const renderMultiSlot = (slotKey, slotInfo) => {
        const items = fighter.equipment[slotKey] || [];
        const maxSlots = slotInfo.max;
        
        let slotsHTML = '';
        for (let i = 0; i < maxSlots; i++) {
            const itemId = items[i];
            const item = itemId ? getItem(itemId) : null;
            
            slotsHTML += `
                <div class="equipment-slot-mini ${item ? 'equipped' : 'empty'}">
                    ${item ? `
                        <div class="slot-item-mini" style="border-color: ${item.rarityInfo.color};" title="${item.name}&#10;${Object.entries(item.stats).filter(([s, v]) => v > 0).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(', ')}">
                            ${item.icon}
                            <button class="btn-unequip-mini" onclick="unequipItem('${fighter.id}', '${slotKey}', ${i})">✖</button>
                        </div>
                    ` : `
                        <div class="slot-empty-mini">${slotInfo.icon}</div>
                    `}
                </div>
            `;
        }
        
        return `
            <div class="equipment-slot-group">
                <div class="slot-group-label">${slotInfo.name} (${items.length}/${maxSlots})</div>
                <div class="slot-group-items">
                    ${slotsHTML}
                </div>
            </div>
        `;
    };
    
    equipmentContainer.innerHTML = `
        <div class="equipment-grid">
            <!-- Armas -->
            <div class="equipment-section">
                <h4>⚔️ Armas</h4>
                ${renderSlot('mainhand', EQUIPMENT_SLOTS.mainhand)}
                ${renderSlot('offhand', EQUIPMENT_SLOTS.offhand)}
            </div>
            
            <!-- Armadura -->
            <div class="equipment-section">
                <h4>🛡️ Armadura</h4>
                ${renderSlot('helmet', EQUIPMENT_SLOTS.helmet)}
                ${renderSlot('chest', EQUIPMENT_SLOTS.chest)}
                ${renderSlot('legs', EQUIPMENT_SLOTS.legs)}
                ${renderSlot('gloves', EQUIPMENT_SLOTS.gloves)}
                ${renderSlot('boots', EQUIPMENT_SLOTS.boots)}
                ${renderSlot('belt', EQUIPMENT_SLOTS.belt)}
            </div>
            
            <!-- Accesorios -->
            <div class="equipment-section">
                <h4>✨ Accesorios</h4>
                ${renderSlot('necklace', EQUIPMENT_SLOTS.necklace)}
                ${renderSlot('rune', EQUIPMENT_SLOTS.rune)}
                ${renderMultiSlot('bracelet', EQUIPMENT_SLOTS.bracelet)}
                ${renderMultiSlot('earring', EQUIPMENT_SLOTS.earring)}
                ${renderMultiSlot('ring', EQUIPMENT_SLOTS.ring)}
            </div>
        </div>
    `;
}

/**
 * Calcula los stats de combate basados en stats base y pasivas
 * @param {Object} fighter - Peleador
 * @returns {Object} Stats de combate calculados
 */
function calculateCombatStats(fighter) {
    // Usar stats totales (base + equipamiento)
    const stats = calculateTotalStats(fighter);
    const level = fighter.level;
    
    // Stats base calculados
    let combatStats = {
        maxHp: 100 + (stats.res * 5) + (level * 10),
        maxMana: 50 + (stats.int * 3) + (level * 2),
        physicalDamage: stats.str * 2 + level,
        magicDamage: Math.floor(stats.int * 1.5) + level,
        defense: Math.floor(stats.res * 0.5),
        magicDefense: Math.floor(stats.res * 0.5),
        accuracy: 75 + Math.floor(stats.agi * 0.5),
        evasion: 5 + Math.floor(stats.agi * 0.5),
        critChance: 5 + Math.floor(stats.agi * 0.5),
        critDamage: 150, // 150% base
        attackSpeed: 1 + (stats.agi * 0.05),
        summonPower: 100 + (stats.int * 1)
    };
    
    // Aplicar bonos de habilidades pasivas
    if (fighter.passiveSkills && fighter.passiveSkills.length > 0) {
        fighter.passiveSkills.forEach(skill => {
            if (!skill) return;
            const bonus = getPassiveBonus(skill.id, skill.tier);
            applyPassiveBonus(combatStats, bonus);
        });
    }
    
    // Redondear valores
    Object.keys(combatStats).forEach(key => {
        if (key !== 'attackSpeed') {
            combatStats[key] = Math.floor(combatStats[key]);
        }
    });
    
    return combatStats;
}

/**
 * Obtiene el bono de una habilidad pasiva según su ID y tier
 * @param {string} skillId - ID de la habilidad
 * @param {number} tier - Nivel de la habilidad (1-3)
 * @returns {Object} Bonos a aplicar
 */
function getPassiveBonus(skillId, tier) {
    const tierMultiplier = tier;
    
    const passiveBonuses = {
        // Bárbaro
        'p_strength': { physicalDamage: 10 * tierMultiplier },
        'p_thick_skin': { maxHp: 10 * tierMultiplier },
        'p_rage': { physicalDamagePercent: 5 * tierMultiplier },
        'p_cleave': { aoeChance: 15 * tierMultiplier },
        'p_bloodlust': { lifesteal: 5 * tierMultiplier },
        'p_intimidating': { enemyDamageReduction: 5 * tierMultiplier },
        'p_relentless': { ccResist: 10 * tierMultiplier },
        'p_savage': { critChance: 5 * tierMultiplier },
        'p_warlord': { teamBonus: 3 * tierMultiplier },
        'p_unstoppable': { slowImmune: true },
        
        // Tanque
        'p_armor': { defense: 5 * tierMultiplier },
        'p_vitality': { maxHp: 20 * tierMultiplier },
        'p_block': { blockChance: 5 * tierMultiplier },
        'p_thorns': { thornsDamage: 10 * tierMultiplier },
        'p_guardian': { allyProtection: 10 * tierMultiplier },
        'p_steadfast': { pushImmune: true },
        'p_regenerate': { hpRegen: 2 * tierMultiplier },
        'p_bulwark': { magicDefense: 8 * tierMultiplier },
        'p_endurance': { critDamageReduction: 10 * tierMultiplier },
        'p_indomitable': { surviveLethal: 10 * tierMultiplier },
        
        // Asesino
        'p_agility': { evasion: 5 * tierMultiplier },
        'p_critical': { critDamage: 20 * tierMultiplier },
        'p_swift': { attackSpeed: 0.1 * tierMultiplier },
        'p_deadly': { critChance: 5 * tierMultiplier },
        'p_silent': { noAggroFirst: true },
        'p_exploit': { markedDamage: 10 * tierMultiplier },
        'p_assassin': { executeDamage: 15 * tierMultiplier },
        'p_shadow': { invisibleStart: true },
        'p_precision': { accuracy: 20 * tierMultiplier },
        'p_venom': { poisonChance: 15 * tierMultiplier },
        
        // Arquero
        'p_accuracy': { accuracy: 5 * tierMultiplier },
        'p_range': { range: 1 * tierMultiplier },
        'p_quick_draw': { attackSpeed: 0.05 * tierMultiplier },
        'p_keen_eye': { critChance: 3 * tierMultiplier },
        'p_steady': { accuracyLock: true },
        'p_multishot': { multishotChance: 10 * tierMultiplier },
        'p_hunter': { beastDamage: 20 * tierMultiplier },
        'p_wind': { arrowPenetration: 10 * tierMultiplier },
        'p_tracker': { seeInvisible: true },
        'p_sniper': { firstAttackBonus: 15 * tierMultiplier },
        
        // Peleador
        'p_martial': { allStats: 3 * tierMultiplier },
        'p_combo_master': { comboLength: 1 * tierMultiplier },
        'p_counter': { counterChance: 10 * tierMultiplier },
        'p_balance': { knockbackResist: 20 * tierMultiplier },
        'p_inner_peace': { hpRegen: 1 * tierMultiplier },
        'p_flow': { evasionInCombat: 5 * tierMultiplier },
        'p_iron_body': { defense: 5 * tierMultiplier },
        'p_chi': { manaCostReduction: 10 * tierMultiplier },
        'p_master': { skillBonus: 1 * tierMultiplier },
        'p_discipline': { confusionImmune: true },
        
        // Curador
        'p_healing': { healPower: 10 * tierMultiplier },
        'p_mana': { maxMana: 15 * tierMultiplier },
        'p_blessed': { aoeHeal: true },
        'p_sanctuary': { allyRegen: 2 * tierMultiplier },
        'p_martyr': { absorbDamage: 10 * tierMultiplier },
        'p_divine': { critHealChance: 10 * tierMultiplier },
        'p_spirit': { healAfterDeath: 3 * tierMultiplier },
        'p_purity': { poisonImmune: true },
        'p_hope': { deathResist: 5 * tierMultiplier },
        'p_salvation': { autoRevive: 10 * tierMultiplier },
        
        // Hechicero
        'p_arcane': { magicDamage: 10 * tierMultiplier },
        'p_mana_pool': { maxMana: 20 * tierMultiplier },
        'p_elemental': { elementalDamage: 5 * tierMultiplier },
        'p_spellpower': { spellPower: 8 * tierMultiplier },
        'p_penetration': { magicPenetration: 10 * tierMultiplier },
        'p_focus': { spellAccuracy: 15 * tierMultiplier },
        'p_cascade': { spellBounce: 10 * tierMultiplier },
        'p_amplify': { effectDuration: 20 * tierMultiplier },
        'p_efficient': { manaCostReduction: 7 * tierMultiplier },
        'p_archmage': { allSpellBonus: 5 * tierMultiplier },
        
        // Invocador
        'p_bond': { summonStats: 7 * tierMultiplier },
        'p_summons': { maxSummons: 1 * tierMultiplier },
        'p_control': { summonAI: 10 * tierMultiplier },
        'p_share': { buffShare: true },
        'p_essence': { summonManaReturn: 10 * tierMultiplier },
        'p_eternal': { summonDuration: 20 * tierMultiplier },
        'p_empower': { summonDamage: 10 * tierMultiplier },
        'p_horde': { multiSummon: true },
        'p_master_sum': { eliteSummon: 15 * tierMultiplier },
        'p_soul': { soulAbsorb: 5 * tierMultiplier }
    };
    
    return passiveBonuses[skillId] || {};
}

/**
 * Aplica los bonos de pasiva a los stats de combate
 * @param {Object} combatStats - Stats de combate
 * @param {Object} bonus - Bonos a aplicar
 */
function applyPassiveBonus(combatStats, bonus) {
    // Bonos directos
    if (bonus.maxHp) combatStats.maxHp += bonus.maxHp;
    if (bonus.maxMana) combatStats.maxMana += bonus.maxMana;
    if (bonus.physicalDamage) combatStats.physicalDamage += bonus.physicalDamage;
    if (bonus.magicDamage) combatStats.magicDamage += bonus.magicDamage;
    if (bonus.defense) combatStats.defense += bonus.defense;
    if (bonus.magicDefense) combatStats.magicDefense += bonus.magicDefense;
    if (bonus.accuracy) combatStats.accuracy += bonus.accuracy;
    if (bonus.evasion) combatStats.evasion += bonus.evasion;
    if (bonus.critChance) combatStats.critChance += bonus.critChance;
    if (bonus.critDamage) combatStats.critDamage += bonus.critDamage;
    if (bonus.attackSpeed) combatStats.attackSpeed += bonus.attackSpeed;
    
    // Bonos porcentuales
    if (bonus.physicalDamagePercent) {
        combatStats.physicalDamage = Math.floor(combatStats.physicalDamage * (1 + bonus.physicalDamagePercent / 100));
    }
    
    // Bonos a todos los stats
    if (bonus.allStats) {
        combatStats.physicalDamage += bonus.allStats;
        combatStats.magicDamage += bonus.allStats;
        combatStats.defense += bonus.allStats;
        combatStats.magicDefense += bonus.allStats;
    }
}

/**
 * Obtiene el tag de efecto para una habilidad activa
 * @param {Object} skill - Habilidad
 * @param {number} tier - Tier de la habilidad
 * @returns {string} Tag descriptivo del efecto
 */
function getSkillEffectTag(skill, tier) {
    const baseDamage = 100 + (tier * 50);
    const baseEffect = 10 + (tier * 10);
    
    // Determinar tipo de habilidad por palabras clave
    if (skill.description.toLowerCase().includes('daño')) {
        return `${baseDamage}% daño`;
    } else if (skill.description.toLowerCase().includes('cura') || skill.description.toLowerCase().includes('restaura')) {
        return `Cura ${baseEffect * 3}% vida`;
    } else if (skill.description.toLowerCase().includes('aumenta') || skill.description.toLowerCase().includes('buff')) {
        return `+${baseEffect}% stats`;
    } else if (skill.description.toLowerCase().includes('aturde') || skill.description.toLowerCase().includes('stun')) {
        return `Aturde ${tier}s`;
    } else if (skill.description.toLowerCase().includes('área') || skill.description.toLowerCase().includes('todos')) {
        return `AoE ${baseDamage}%`;
    }
    
    return `Poder: ${baseDamage}%`;
}

/**
 * Obtiene el tag de efecto para una habilidad pasiva
 * @param {Object} skill - Habilidad pasiva
 * @param {number} tier - Tier de la habilidad
 * @returns {string} Tag descriptivo del efecto
 */
function getPassiveEffectTag(skill, tier) {
    const bonus = getPassiveBonus(skill.id, tier);
    const entries = Object.entries(bonus);
    
    if (entries.length === 0) return `Tier ${tier}`;
    
    const [key, value] = entries[0];
    
    const labels = {
        maxHp: `+${value} Vida`,
        maxMana: `+${value} Maná`,
        physicalDamage: `+${value} Daño`,
        magicDamage: `+${value} D.Mágico`,
        defense: `+${value} Defensa`,
        evasion: `+${value}% Evasión`,
        critChance: `+${value}% Crítico`,
        critDamage: `+${value}% D.Crit`,
        attackSpeed: `+${(value * 100).toFixed(0)}% Vel.`,
        accuracy: `+${value}% Precisión`
    };
    
    return labels[key] || `Tier ${tier} activo`;
}

/**
 * Obtiene información del tier
 * @param {number} currentTier - Tier actual
 * @param {number} maxTier - Tier máximo
 * @returns {Object} Información del tier
 */
function getTierInfo(currentTier, maxTier) {
    return {
        current: currentTier,
        max: maxTier,
        isMax: currentTier >= maxTier
    };
}

/**
 * Despide (elimina) un peleador
 */
function removeFighter() {
    if (!currentFighterId) return;
    
    const fighter = gameState.fighters.find(f => f.id === currentFighterId);
    if (!fighter) return;
    
    showModal(
        '⚠️ Despedir Peleador',
        `
            <div style="text-align: center;">
                <p>¿Estás seguro de que quieres despedir a <strong>${fighter.name}</strong>?</p>
                <p style="color: var(--color-red); font-size: 0.875rem;">Esta acción no se puede deshacer.</p>
                <p style="color: var(--color-gold); font-size: 0.875rem;">Recuperarás 50 de oro.</p>
            </div>
        `,
        [
            { text: 'Cancelar', action: 'closeModal()' },
            { text: 'Despedir', class: 'btn-danger', action: 'confirmRemoveFighter()' }
        ]
    );
}

/**
 * Confirma la eliminación de un peleador
 */
function confirmRemoveFighter() {
    if (!currentFighterId) return;
    
    // Remover del equipo si está
    const teamIndex = gameState.team.indexOf(currentFighterId);
    if (teamIndex !== -1) {
        gameState.team.splice(teamIndex, 1);
    }
    
    // Remover de la lista de peleadores
    const fighterIndex = gameState.fighters.findIndex(f => f.id === currentFighterId);
    if (fighterIndex !== -1) {
        gameState.fighters.splice(fighterIndex, 1);
    }
    
    // Dar algo de oro
    gameState.player.gold += 50;
    
    saveGame();
    closeModal();
    currentFighterId = null;
    navigateTo('screen-fighters');
    showToast('Peleador despedido. +50 oro', 'info');
}

/**
 * Añade un punto a un stat del peleador actual
 * @param {string} stat - Nombre del stat (str, agi, res, int)
 */
function addStatPoint(stat) {
    if (!currentFighterId) return;
    
    const fighter = gameState.fighters.find(f => f.id === currentFighterId);
    if (!fighter || fighter.statPoints <= 0) return;
    
    fighter.stats[stat]++;
    fighter.statPoints--;
    
    saveGame();
    initFighterDetailScreen();
    showToast(`+1 ${stat.toUpperCase()}`, 'success');
}

/**
 * Inicializa la pantalla de reclutamiento
 */
function initRecruitScreen() {
    const classGrid = document.getElementById('class-grid');
    classGrid.innerHTML = '';
    
    // Generar opciones de clase
    Object.entries(CLASSES).forEach(([key, classData]) => {
        const option = document.createElement('div');
        option.className = 'class-option';
        option.dataset.class = key;
        option.innerHTML = `
            <span class="class-icon">${classData.icon}</span>
            <span class="class-name">${classData.name}</span>
        `;
        option.onclick = () => selectClass(key);
        classGrid.appendChild(option);
    });
    
    // Resetear preview
    updateRecruitPreview();
}

// Variables para el reclutamiento
let selectedGender = 'male';
let selectedClass = null;

/**
 * Selecciona un género para el nuevo peleador
 * @param {string} gender - 'male' o 'female'
 */
function selectGender(gender) {
    selectedGender = gender;
    
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.gender === gender);
    });
    
    updateRecruitPreview();
}

/**
 * Selecciona una clase para el nuevo peleador
 * @param {string} classKey - Clave de la clase
 */
function selectClass(classKey) {
    selectedClass = classKey;
    
    document.querySelectorAll('.class-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.class === classKey);
    });
    
    updateRecruitPreview();
}

/**
 * Actualiza el preview del peleador a reclutar
 */
function updateRecruitPreview() {
    const previewAvatar = document.getElementById('preview-avatar');
    const previewClass = document.getElementById('preview-class');
    const previewStats = document.getElementById('preview-stats');
    const btnRecruit = document.getElementById('btn-recruit-confirm');
    
    if (selectedClass) {
        const classData = CLASSES[selectedClass];
        const avatar = FIGHTER_AVATARS[selectedGender][selectedClass];
        
        previewAvatar.innerHTML = `<span>${avatar}</span>`;
        previewClass.textContent = classData.name;
        previewClass.style.fontStyle = 'normal';
        
        previewStats.innerHTML = `
            <div class="preview-stat">
                <span class="preview-stat-icon">💪</span>
                <span>FUE: ${classData.baseStats.str}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-icon">🏃</span>
                <span>AGI: ${classData.baseStats.agi}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-icon">🛡️</span>
                <span>RES: ${classData.baseStats.res}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-icon">🧠</span>
                <span>INT: ${classData.baseStats.int}</span>
            </div>
        `;
        
        btnRecruit.disabled = false;
    } else {
        previewAvatar.innerHTML = '<span>❓</span>';
        previewClass.textContent = 'Selecciona una clase';
        previewClass.style.fontStyle = 'italic';
        previewStats.innerHTML = '';
        btnRecruit.disabled = true;
    }
}

/**
 * Recluta un nuevo peleador
 */
function recruitFighter() {
    const nameInput = document.getElementById('fighter-name');
    const name = nameInput.value.trim() || `${CLASSES[selectedClass].name} #${gameState.fighters.length + 1}`;
    
    // Verificar oro
    if (gameState.player.gold < 100) {
        showToast('No tienes suficiente oro', 'error');
        return;
    }
    
    // Verificar límite de peleadores (por ahora sin límite)
    
    // Crear el peleador
    const classData = CLASSES[selectedClass];
    const newFighter = {
        id: generateId(),
        name: name,
        gender: selectedGender,
        class: selectedClass,
        level: 1,
        exp: 0,
        statPoints: 0,
        stats: { ...classData.baseStats },
        activeSkills: [],
        passiveSkills: [],
        skillPool: {
            active: shuffleArray([...ACTIVE_SKILLS[selectedClass]]).slice(0, 10),
            passive: shuffleArray([...PASSIVE_SKILLS[selectedClass]]).slice(0, 10)
        },
        equipment: {
            helmet: null,
            chest: null,
            legs: null,
            gloves: null,
            boots: null,
            belt: null,
            necklace: null,
            rune: null,
            bracelet: [],  // max 2
            earring: [],   // max 2
            ring: [],      // max 2
            mainhand: null,
            offhand: null
        }
    };
    
    // Descontar oro y añadir peleador
    gameState.player.gold -= 100;
    gameState.fighters.push(newFighter);
    
    // Si no hay equipo y hay slots, añadir automáticamente
    const availableSlots = getTeamSlots(gameState.player.level);
    if (gameState.team.filter(t => t).length < availableSlots) {
        gameState.team.push(newFighter.id);
    }
    
    saveGame();
    
    showToast(`¡${name} se ha unido a tu equipo!`, 'success');
    
    // Resetear
    nameInput.value = '';
    selectedClass = null;
    initRecruitScreen();
    
    // Ir a peleadores
    navigateTo('screen-fighters');
}

/**
 * Mezcla un array aleatoriamente (Fisher-Yates)
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado
 */
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Inicializa la pantalla de inventario
 */
function initInventoryScreen() {
    const inventoryGrid = document.getElementById('inventory-grid');
    
    // Inicializar inventario si no existe
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
    // Aplicar filtros
    const activeTypeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const activeRarityFilter = document.querySelector('.rarity-filter-btn.active')?.dataset.rarity || 'all';
    
    let filteredItems = gameState.inventory;
    
    // Filtrar por tipo
    if (activeTypeFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === activeTypeFilter);
    }
    
    // Filtrar por rareza
    if (activeRarityFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.rarity === activeRarityFilter);
    }
    
    // Actualizar contador
    document.getElementById('inventory-count').textContent = filteredItems.length;
    
    // Mostrar items
    if (filteredItems.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎒</span>
                <p>${gameState.inventory.length === 0 ? 'Tu inventario está vacío' : 'No hay items con estos filtros'}</p>
            </div>
        `;
        return;
    }
    
    // Ordenar items por rareza (legendario primero) y luego por zona
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, normal: 3 };
    filteredItems.sort((a, b) => {
        if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        return b.zone - a.zone;
    });
    
    // Limpiar grid y agregar items con event listeners
    inventoryGrid.innerHTML = '';
    filteredItems.forEach(item => {
        const card = createItemCard(item);
        inventoryGrid.appendChild(card);
    });
    
    // Configurar event listeners para filtros si no están configurados
    setupInventoryFilters();
}

/**
 * Configura los event listeners para los filtros del inventario
 */
function setupInventoryFilters() {
    // Filtros de tipo
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initInventoryScreen();
        };
    });
    
    // Filtros de rareza
    document.querySelectorAll('.rarity-filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.rarity-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initInventoryScreen();
        };
    });
}

/**
 * Crea una tarjeta de item para el inventario
 * @param {Object} item - Datos del item
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.borderLeft = `4px solid ${item.rarityInfo.color}`;
    
    // Construir texto de stats
    const statsText = Object.entries(item.stats)
        .filter(([stat, val]) => val > 0)
        .map(([stat, val]) => `+${val} ${stat.toUpperCase()}`)
        .join(', ');
    
    // Texto de clase (solo para armas)
    const classText = item.class ? `<p style="font-size: 0.75rem; color: var(--color-text-secondary);">Para: ${CLASSES[item.class].name}</p>` : '';
    
    // Mostrar información de equipamiento
    let equipText = '';
    if (item.equipped && item.equippedBy) {
        const fighter = gameState.fighters.find(f => f.id === item.equippedBy);
        if (fighter) {
            equipText = `<p style="font-size: 0.75rem; color: var(--color-green); margin: 0.25rem 0;">✓ Equipado en ${fighter.name}</p>`;
        }
    }
    
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 2rem;">${item.icon}</span>
            <div style="flex: 1;">
                <p style="font-weight: bold; color: ${item.rarityInfo.color}; margin: 0;">${item.name}</p>
                <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin: 0.25rem 0;">
                    ${item.rarityInfo.name} • ${item.type === 'weapon' ? 'Arma' : item.type === 'armor' ? 'Armadura' : 'Accesorio'}
                </p>
                ${classText}
                ${equipText}
                <p style="font-size: 0.875rem; color: var(--color-gold); margin: 0.25rem 0;">${statsText}</p>
                <p style="font-size: 0.75rem; color: var(--color-text-muted); margin: 0;">Zona ${item.zone}</p>
            </div>
            ${!item.equipped ? `
                <button class="btn-secondary btn-small equip-btn">
                    Equipar
                </button>
            ` : ''}
        </div>
    `;
    
    // Asignar evento al botón de equipar
    const equipBtn = card.querySelector('.equip-btn');
    if (equipBtn) {
        equipBtn.onclick = (e) => {
            e.stopPropagation();
            openEquipModal(item.id);
        };
    }
    
    return card;
}

/**
 * Abre el modal para seleccionar a qué peleador equipar
 */
function openEquipModal(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Obtener peleadores del equipo
    const teamFighters = gameState.team
        .filter(id => id)
        .map(id => gameState.fighters.find(f => f.id === id))
        .filter(f => f);
    
    if (teamFighters.length === 0) {
        showToast('No tienes peleadores en tu equipo', 'error');
        return;
    }
    
    // Filtrar por clase si es arma
    let availableFighters = teamFighters;
    if (item.type === 'weapon' && item.class) {
        availableFighters = teamFighters.filter(f => f.class === item.class);
        if (availableFighters.length === 0) {
            showToast('Ningún peleador de tu equipo puede usar este arma', 'error');
            return;
        }
    }
    
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    // Guardar el itemId en la ventana para acceso posterior
    window.currentEquipItemId = itemId;
    
    modalContent.innerHTML = `
        <h2>Equipar: ${item.name}</h2>
        <p style="color: ${item.rarityInfo.color}; margin-bottom: 1rem;">${item.rarityInfo.name}</p>
        <p style="margin-bottom: 1.5rem; font-size: 0.9rem;">Selecciona un peleador:</p>
        <div style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem; max-height: 300px; overflow-y: auto;">
            ${availableFighters.map(fighter => `
                <button 
                    class="btn-secondary" 
                    style="padding: 1rem; text-align: left; border: 2px solid var(--color-border); border-radius: 8px;"
                    onclick="selectFighterForEquip('${fighter.id}')">
                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">${FIGHTER_AVATARS[fighter.gender][fighter.class]}</span>
                    <span style="font-weight: bold;">${fighter.name}</span>
                    <span style="color: var(--color-text-secondary); margin-left: 0.5rem;">• ${CLASSES[fighter.class].name} Lvl ${fighter.level}</span>
                </button>
            `).join('')}
        </div>
        <button class="btn-secondary" style="width: 100%;" onclick="closeModal()">Cancelar</button>
    `;
    
    modal.style.display = 'flex';
}

/**
 * Selecciona un peleador para equipar el item
 */
function selectFighterForEquip(fighterId) {
    const itemId = window.currentEquipItemId;
    const item = gameState.inventory.find(i => i.id === itemId);
    const fighter = gameState.fighters.find(f => f.id === fighterId);
    
    if (!item || !fighter) {
        showToast('Error al equipar', 'error');
        return;
    }
    
    // Inicializar equipment si no existe
    if (!fighter.equipment) {
        fighter.equipment = {
            helmet: null,
            chest: null,
            legs: null,
            gloves: null,
            boots: null,
            belt: null,
            necklace: null,
            rune: null,
            bracelet: [],
            earring: [],
            ring: [],
            mainhand: null,
            offhand: null
        };
    }
    
    // Determinar slot
    let slot = null;
    
    if (item.type === 'armor') {
        slot = item.slot;
    } else if (item.type === 'accessory') {
        slot = item.slot;
    } else if (item.type === 'weapon') {
        // Para armas, usar lógica de clase
        const itemName = item.subtype ? item.subtype.toLowerCase() : '';
        
        if (['asesino', 'hechicero', 'invocador'].includes(fighter.class)) {
            if (!fighter.equipment.mainhand) {
                slot = 'mainhand';
            } else if (!fighter.equipment.offhand && (itemName.includes('daga') || itemName.includes('espada'))) {
                slot = 'offhand';
            } else if (!fighter.equipment.mainhand) {
                slot = 'mainhand';
            }
        } else {
            if (!fighter.equipment.mainhand) {
                slot = 'mainhand';
            }
        }
    }
    
    if (!slot) {
        showToast('No hay espacio para equipar este item', 'error');
        return;
    }
    
    // Verificar si hay algo equipado
    if (Array.isArray(fighter.equipment[slot])) {
        // Slot múltiple
        const maxSlots = EQUIPMENT_SLOTS[slot] ? EQUIPMENT_SLOTS[slot].max : 3;
        if (fighter.equipment[slot].length >= maxSlots) {
            showToast(`Ya tienes ${maxSlots} items en este slot`, 'error');
            return;
        }
        // fighter.equipment[slot].push(item.id); // Removed premature push
    } else if (fighter.equipment[slot]) {
        // Slot ocupado, preguntar si reemplazar
        const currentItemId = fighter.equipment[slot];
        const currentItem = gameState.inventory.find(i => i.id === currentItemId);
        
        const slotName = EQUIPMENT_SLOTS[slot] ? EQUIPMENT_SLOTS[slot].name : slot;
        
        showModal(
            'Reemplazar Equipo',
            `<p>${fighter.name} ya tiene <strong>${currentItem ? currentItem.name : 'un item'}</strong> equipado en ${slotName}.</p><p>¿Deseas reemplazarlo?</p>`,
            [
                { text: 'Cancelar', action: 'closeModal()' },
                { text: 'Reemplazar', class: 'btn-primary', action: `doEquipItem('${itemId}', '${fighterId}', '${slot}', true)` }
            ]
        );
        return;
    } else {
        // Slot vacío, equipar directamente
        doEquipItem(itemId, fighterId, slot, false);
        return;
    }
    
    // Para slots múltiples sin espacio completo
    doEquipItem(itemId, fighterId, slot, false);
}

/**
 * Ejecuta el equipamiento del item
 */
function doEquipItem(itemId, fighterId, slot, replacing) {
    const item = gameState.inventory.find(i => i.id === itemId);
    const fighter = gameState.fighters.find(f => f.id === fighterId);
    
    if (!item || !fighter) return;
    
    // Si reemplazamos, desequipar el anterior
    if (replacing && fighter.equipment[slot]) {
        const oldItemId = fighter.equipment[slot];
        const oldItem = gameState.inventory.find(i => i.id === oldItemId);
        if (oldItem) {
            oldItem.equipped = false;
            oldItem.equippedBy = null;
        }
    }
    
    // Equipar el nuevo item
    if (Array.isArray(fighter.equipment[slot])) {
        fighter.equipment[slot].push(item.id);
    } else {
        fighter.equipment[slot] = item.id;
    }
    
    item.equipped = true;
    item.equippedBy = fighterId;
    
    saveGame();
    showToast(`${item.name} equipado a ${fighter.name}`, 'success');
    closeModal();
    
    // Actualizar UI
    if (document.getElementById('screen-inventory').classList.contains('active')) {
        initInventoryScreen();
    }
}

/**
 * Muestra modal para seleccionar peleador al que equipar item
 * @param {Object} item - Item a equipar
 */
/**
 * Desequipa un item del peleador
 * @param {string} fighterId - ID del peleador
 * @param {string} slot - Slot del que desequipar
 * @param {number} index - Índice (para slots múltiples)
 */
function unequipItem(fighterId, slot, index = null) {
    const fighter = gameState.fighters.find(f => f.id === fighterId);
    if (!fighter || !fighter.equipment) return;
    
    let itemId = null;
    
    // Obtener ID del item
    if (index !== null && Array.isArray(fighter.equipment[slot])) {
        // Slot múltiple (brazalete, arete, anillo)
        itemId = fighter.equipment[slot][index];
        fighter.equipment[slot].splice(index, 1);
    } else {
        // Slot único
        itemId = fighter.equipment[slot];
        fighter.equipment[slot] = null;
    }
    
    if (!itemId) return;
    
    // Marcar item como no equipado
    const item = gameState.inventory.find(i => i.id === itemId);
    if (item) {
        item.equipped = false;
        item.equippedBy = null;
    }
    
    saveGame();
    showToast('Item desequipado', 'success');
    
    // Actualizar UI
    openFighterDetail(fighterId);
}

/**
 * Calcula los stats totales del peleador incluyendo equipamiento
 * @param {Object} fighter - Peleador
 * @returns {Object} Stats totales
 */
function calculateTotalStats(fighter) {
    const baseStats = { ...fighter.stats };
    
    if (!fighter.equipment) {
        return baseStats;
    }
    
    // Sumar stats de todos los items equipados
    Object.keys(fighter.equipment).forEach(slot => {
        if (Array.isArray(fighter.equipment[slot])) {
            // Slots múltiples
            fighter.equipment[slot].forEach(itemId => {
                const item = gameState.inventory.find(i => i.id === itemId);
                if (item && item.stats) {
                    baseStats.str += item.stats.str || 0;
                    baseStats.agi += item.stats.agi || 0;
                    baseStats.res += item.stats.res || 0;
                    baseStats.int += item.stats.int || 0;
                }
            });
        } else if (fighter.equipment[slot]) {
            // Slot único
            const item = gameState.inventory.find(i => i.id === fighter.equipment[slot]);
            if (item && item.stats) {
                baseStats.str += item.stats.str || 0;
                baseStats.agi += item.stats.agi || 0;
                baseStats.res += item.stats.res || 0;
                baseStats.int += item.stats.int || 0;
            }
        }
    });
    
    return baseStats;
}

/**
 * Inicializa la pantalla de exploración
 * Muestra las zonas con su progreso de escenarios
 */
function initExplorationScreen() {
    const container = document.querySelector('.exploration-container');
    
    // Verificar si zoneProgress existe (para saves antiguos)
    if (!gameState.exploration.zoneProgress) {
        gameState.exploration.zoneProgress = {
            1: 1, 2: 0, 3: 0, 4: 0, 5: 0
        };
        saveGame();
    }
    
    container.innerHTML = `
        <div class="world-map" id="world-map">
            ${Object.entries(ZONE_CONFIG).map(([zoneNum, config]) => {
                const progress = gameState.exploration.zoneProgress[zoneNum] || 0;
                const isUnlocked = progress > 0;
                const isCompleted = progress > 10;
                
                return `
                    <div class="map-zone ${isUnlocked ? 'available' : 'locked'} ${isCompleted ? 'completed' : ''}" 
                         data-zone="${zoneNum}">
                        <span class="zone-icon">${config.icon}</span>
                        <span class="zone-name">${config.name}</span>
                        <span class="zone-level">Nv. ${config.levelRange[0]}-${config.levelRange[1]}</span>
                        <span class="zone-progress">${isUnlocked ? `${Math.min(progress - 1, 10)}/10` : ''}</span>
                        ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
                        ${isCompleted ? '<span class="complete-icon">⭐</span>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // Agregar event listeners a las zonas
    document.querySelectorAll('.map-zone.available').forEach(zone => {
        zone.onclick = () => openZoneStages(parseInt(zone.dataset.zone));
    });
}

/**
 * Abre el modal con los escenarios de una zona
 * @param {number} zoneNum - Número de la zona
 */
function openZoneStages(zoneNum) {
    const config = ZONE_CONFIG[zoneNum];
    const progress = gameState.exploration.zoneProgress[zoneNum] || 1;
    
    let stagesHTML = '<div class="stages-grid">';
    
    for (let stage = 1; stage <= 10; stage++) {
        const isUnlocked = stage <= progress;
        const isBoss = stage === 10;
        const isCompleted = stage < progress;
        
        // Calcular nivel del escenario
        const baseLevel = config.levelRange[0];
        const stageLevel = baseLevel + (stage - 1);
        
        stagesHTML += `
            <div class="stage-card ${isUnlocked ? 'available' : 'locked'} ${isBoss ? 'boss' : ''} ${isCompleted ? 'completed' : ''}"
                 data-zone="${zoneNum}" data-stage="${stage}"
                 ${isUnlocked ? `onclick="enterStage(${zoneNum}, ${stage})"` : ''}>
                <div class="stage-number">${isBoss ? '👑' : stage}</div>
                <div class="stage-info">
                    <span class="stage-name">${isBoss ? config.boss.name : `Escenario ${stage}`}</span>
                    <span class="stage-level">Nv. ${isBoss ? stageLevel + ' (JEFE)' : stageLevel}</span>
                </div>
                ${isCompleted ? '<span class="stage-check">✅</span>' : ''}
                ${!isUnlocked ? '<span class="stage-lock">🔒</span>' : ''}
            </div>
        `;
    }
    
    stagesHTML += '</div>';
    
    showModal(
        `${config.icon} ${config.name}`,
        stagesHTML,
        [
            { text: 'Cerrar', action: 'closeModal()' }
        ]
    );
}

/**
 * Entra a un escenario específico de una zona
 * @param {number} zoneNum - Número de la zona
 * @param {number} stage - Número del escenario (1-10)
 */
function enterStage(zoneNum, stage) {
    // Verificar que haya peleadores en el equipo
    if (gameState.team.filter(t => t).length === 0) {
        showToast('Necesitas al menos un peleador en tu equipo', 'error');
        return;
    }
    
    // Guardar zona y escenario actual
    gameState.exploration.currentZone = zoneNum;
    gameState.exploration.currentStage = stage;
    
    closeModal();
    startBattle('exploration', zoneNum, stage);
}

/**
 * Inicializa la pantalla de arena
 */
function initArenaScreen() {
    // Actualizar rango actual
    const currentRank = getCurrentRank();
    const rankInfo = ARENA_RANKS[currentRank];
    
    document.querySelector('.rank-name').textContent = rankInfo.name;
    document.querySelector('.rank-icon').textContent = rankInfo.icon;
    document.getElementById('arena-points').textContent = gameState.arena.points;
    
    // Generar oponentes si no existen o regenerar
    if (currentOpponents.length === 0) {
        generateAndStoreOpponents();
    }
    
    // Generar oponentes en UI
    generateArenaOpponents();
}

/**
 * Obtiene el rango actual del jugador según sus puntos
 * @returns {string} ID del rango
 */
function getCurrentRank() {
    const points = gameState.arena.points;
    
    for (const [rankId, rankData] of Object.entries(ARENA_RANKS).reverse()) {
        if (points >= rankData.minPoints) {
            return rankId;
        }
    }
    
    return 'bronze3';
}

/**
 * Genera 3 oponentes aleatorios para la arena
 */
function generateArenaOpponents() {
    const opponentsList = document.getElementById('opponents-list');
    opponentsList.innerHTML = '';
    
    // Mostrar los oponentes actuales (ya generados)
    currentOpponents.forEach((opponent, index) => {
        const card = createOpponentCard(opponent, index);
        opponentsList.appendChild(card);
    });
}

/**
 * Genera un oponente aleatorio para la arena
 * @returns {Object} Datos del oponente
 */
function generateArenaOpponent() {
    const playerLevel = gameState.player.level;
    const playerTeamAvgLevel = calculateTeamAverageLevel();
    
    // Nivel del oponente: ±3 niveles del jugador
    const opponentLevel = Math.max(1, Math.min(30, playerLevel + Math.floor(Math.random() * 7) - 3));
    
    // Nombre aleatorio
    const name = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
    const avatar = Math.random() > 0.5 ? '🧙‍♂️' : '🧙‍♀️';
    
    // Generar equipo de peleadores (1-3 según nivel del jugador)
    const teamSize = Math.min(getTeamSlots(playerLevel), 3);
    const team = [];
    
    for (let i = 0; i < teamSize; i++) {
        const fighter = generateArenaFighter(opponentLevel);
        team.push(fighter);
    }
    
    return {
        id: 'opponent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        avatar: avatar,
        level: opponentLevel,
        team: team,
        points: gameState.arena.points + Math.floor(Math.random() * 100) - 50
    };
}

/**
 * Genera un peleador para el equipo de un oponente de arena
 * @param {number} baseLevel - Nivel base del oponente
 * @returns {Object} Peleador generado
 */
function generateArenaFighter(baseLevel) {
    // Nivel del peleador: ±2 del nivel base
    const level = Math.max(1, Math.min(50, baseLevel + Math.floor(Math.random() * 5) - 2));
    
    // Clase aleatoria
    const classKeys = Object.keys(CLASSES);
    const randomClass = classKeys[Math.floor(Math.random() * classKeys.length)];
    const classData = CLASSES[randomClass];
    
    // Género aleatorio
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    
    // Generar nombre aleatorio basado en la clase
    const firstName = gender === 'male' 
        ? ['Leon', 'Marcus', 'Thor', 'Ragnar', 'Zephyr', 'Drake', 'Fenrir', 'Axel'][Math.floor(Math.random() * 8)]
        : ['Luna', 'Aria', 'Nova', 'Freya', 'Athena', 'Selene', 'Lyra', 'Nyx'][Math.floor(Math.random() * 8)];
    
    // Stats base + crecimiento por nivel + variación aleatoria
    const statVariation = 0.9 + Math.random() * 0.2; // 90% - 110%
    
    const fighter = {
        id: 'arena_fighter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: firstName,
        class: randomClass,
        gender: gender,
        level: level,
        stats: {
            str: Math.floor((classData.baseStats.str + level * 0.8) * statVariation),
            agi: Math.floor((classData.baseStats.agi + level * 0.8) * statVariation),
            res: Math.floor((classData.baseStats.res + level * 0.8) * statVariation),
            int: Math.floor((classData.baseStats.int + level * 0.8) * statVariation)
        },
        activeSkills: [],
        passiveSkills: [],
        exp: 0,
        statPoints: 0
    };
    
    return fighter;
}

/**
 * Calcula el nivel promedio del equipo del jugador
 * @returns {number} Nivel promedio
 */
function calculateTeamAverageLevel() {
    const teamFighters = gameState.team
        .filter(id => id)
        .map(id => gameState.fighters.find(f => f.id === id))
        .filter(f => f);
    
    if (teamFighters.length === 0) return 1;
    
    const totalLevel = teamFighters.reduce((sum, f) => sum + f.level, 0);
    return Math.floor(totalLevel / teamFighters.length);
}

/**
 * Crea la tarjeta HTML de un oponente
 * @param {Object} opponent - Datos del oponente
 * @param {number} index - Índice del oponente
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createOpponentCard(opponent, index) {
    const card = document.createElement('div');
    card.className = 'opponent-card';
    
    const rankInfo = getCurrentRankByPoints(opponent.points);
    
    card.innerHTML = `
        <div class="opponent-info">
            <span class="opponent-avatar">${opponent.avatar}</span>
            <div class="opponent-details">
                <span class="opponent-name">${opponent.name}</span>
                <span class="opponent-level">Nivel ${opponent.level} • ${rankInfo.name}</span>
                <span class="opponent-team">${opponent.team.length} peleador${opponent.team.length > 1 ? 'es' : ''}</span>
            </div>
        </div>
        <button class="btn-fight" onclick="startArenaFight(${index})">⚔️ Luchar</button>
    `;
    
    return card;
}

/**
 * Obtiene información de rango según puntos
 * @param {number} points - Puntos de arena
 * @returns {Object} Información del rango
 */
function getCurrentRankByPoints(points) {
    for (const [rankId, rankData] of Object.entries(ARENA_RANKS).reverse()) {
        if (points >= rankData.minPoints) {
            return rankData;
        }
    }
    return ARENA_RANKS.bronze3;
}

// Variable para almacenar oponentes actuales
let currentOpponents = [];

/**
 * Genera y almacena oponentes actuales
 */
function generateAndStoreOpponents() {
    currentOpponents = [];
    for (let i = 0; i < 3; i++) {
        currentOpponents.push(generateArenaOpponent());
    }
}

/**
 * Inicia una pelea de arena contra un oponente
 * @param {number} opponentIndex - Índice del oponente (0-2)
 */
function startArenaFight(opponentIndex) {
    // Verificar que haya peleadores en el equipo
    if (gameState.team.filter(t => t).length === 0) {
        showToast('Necesitas al menos un peleador en tu equipo', 'error');
        return;
    }
    
    // Obtener oponente
    const opponent = currentOpponents[opponentIndex];
    if (!opponent) {
        showToast('Error al cargar oponente', 'error');
        return;
    }
    
    startBattle('arena', opponent);
}

// ============================================
// SISTEMA DE COMBATE
// ============================================

let battleState = null;
let battleInterval = null;
let battleSpeed = 1.5;

/**
 * Inicia una batalla
 * @param {string} type - 'exploration' o 'arena'
 * @param {number|Object} zoneOrOpponent - Zona (number) o datos del oponente (Object)
 * @param {number} stage - Escenario (1-10) para exploración
 */
function startBattle(type, zoneOrOpponent, stage = 1) {
    const isBoss = stage === 10;
    
    // Configurar estado de batalla
    battleState = {
        type: type,
        zone: typeof zoneOrOpponent === 'number' ? zoneOrOpponent : null,
        stage: stage,
        isBoss: isBoss,
        opponent: typeof zoneOrOpponent === 'object' ? zoneOrOpponent : null,
        playerTeam: [],
        enemyTeam: [],
        log: [],
        isRunning: false,
        winner: null
    };
    
    // Preparar equipo del jugador
    gameState.team.forEach(fighterId => {
        if (fighterId) {
            const fighter = gameState.fighters.find(f => f.id === fighterId);
            if (fighter) {
                battleState.playerTeam.push(createBattleFighter(fighter, 'player'));
            }
        }
    });
    
    // Generar enemigos según el tipo de batalla
    if (type === 'exploration') {
        const zone = zoneOrOpponent;
        if (isBoss) {
            // Escenario 10: Solo el jefe
            battleState.enemyTeam.push(generateBoss(zone));
        } else {
            // Escenarios 1-9: Monstruos normales (cantidad según jugadores)
            const enemyCount = Math.min(battleState.playerTeam.length, 3);
            for (let i = 0; i < enemyCount; i++) {
                battleState.enemyTeam.push(generateEnemy(zone, stage));
            }
        }
    } else if (type === 'arena') {
        // Arena: usar equipo del oponente
        const opponent = zoneOrOpponent;
        opponent.team.forEach(fighter => {
            battleState.enemyTeam.push(createBattleFighter(fighter, 'enemy'));
        });
    }
    
    // Navegar a pantalla de batalla
    navigateTo('screen-battle');
    
    // Configurar UI
    if (type === 'exploration') {
        const config = ZONE_CONFIG[zoneOrOpponent];
        document.getElementById('battle-type').textContent = isBoss ? '⚔️ BATALLA DE JEFE' : 'Exploración';
        document.getElementById('battle-zone').textContent = isBoss 
            ? `${config.name} - ${config.boss.name}`
            : `${config.name} - Escenario ${stage}`;
    } else if (type === 'arena') {
        document.getElementById('battle-type').textContent = '⚔️ Arena PvP';
        document.getElementById('battle-zone').textContent = `vs ${zoneOrOpponent.name}`;
    }
    
    // Renderizar equipos
    renderBattleTeams();
    
    // Limpiar log
    let logMessage;
    if (type === 'exploration') {
        const config = ZONE_CONFIG[zoneOrOpponent];
        logMessage = isBoss 
            ? `¡${config.boss.name} aparece! ¡Prepárate para la batalla final!`
            : '¡La batalla está por comenzar!';
    } else {
        logMessage = `¡Te enfrentas a ${zoneOrOpponent.name}!`;
    }
    
    document.getElementById('battle-log').innerHTML = `<p class="log-entry ${isBoss ? 'skill' : ''}">${logMessage}</p>`;
    
    // Mostrar botón de inicio
    document.getElementById('btn-start-battle').classList.remove('hidden');
    document.getElementById('btn-speed').classList.add('hidden');
}

/**
 * Obtiene el nombre de una zona
 * @param {number} zoneNum - Número de zona
 * @returns {string} Nombre de la zona
 */
function getZoneName(zoneNum) {
    return ZONE_CONFIG[zoneNum]?.name || 'Zona Desconocida';
}

/**
 * Crea un peleador para la batalla con stats calculados
 * @param {Object} fighter - Datos del peleador
 * @param {string} team - 'player' o 'enemy'
 * @returns {Object} Peleador de batalla
 */
function createBattleFighter(fighter, team) {
    // Si es un peleador del jugador, usar calculateCombatStats para aplicar pasivas
    let combatStats;
    
    if (team === 'player' && fighter.passiveSkills) {
        combatStats = calculateCombatStats(fighter);
    } else {
        // Para enemigos, cálculo básico
        combatStats = {
            maxHp: 100 + (fighter.stats.res * 5) + (fighter.level * 10),
            maxMana: 50 + (fighter.stats.int * 3) + (fighter.level * 2),
            physicalDamage: fighter.stats.str * 2 + fighter.level,
            magicDamage: Math.floor(fighter.stats.int * 1.5) + fighter.level,
            defense: Math.floor(fighter.stats.res * 0.5),
            magicDefense: Math.floor(fighter.stats.res * 0.5),
            accuracy: 75 + Math.floor(fighter.stats.agi * 0.5),
            evasion: 5 + Math.floor(fighter.stats.agi * 0.5),
            critChance: 5 + Math.floor(fighter.stats.agi * 0.5),
            critDamage: 150,
            attackSpeed: 1 + (fighter.stats.agi * 0.05),
            summonPower: 100 + (fighter.stats.int * 1)
        };
    }
    
    // Si es un jefe, multiplicar stats
    if (fighter.isBoss) {
        combatStats.maxHp *= 3;
        combatStats.physicalDamage = Math.floor(combatStats.physicalDamage * 1.5);
        combatStats.defense = Math.floor(combatStats.defense * 1.5);
    }
    
    return {
        id: fighter.id,
        name: fighter.name,
        class: fighter.class,
        gender: fighter.gender,
        level: fighter.level,
        team: team,
        isBoss: fighter.isBoss || false,
        isSummon: fighter.isSummon || false,
        summonType: fighter.summonType || null,
        summonerId: fighter.summonerId || null,
        
        // Stats base
        stats: { ...fighter.stats },
        
        // Stats de combate calculados
        combatStats: combatStats,
        
        // Vida y maná
        maxHp: combatStats.maxHp,
        hp: combatStats.maxHp,
        maxMana: combatStats.maxMana,
        mana: combatStats.maxMana,
        
        // Sistema de acción
        actionBar: 0,
        attackCount: 0,
        specialAttackReady: false,
        
        // Habilidades
        activeSkills: fighter.activeSkills || [],
        passiveSkills: fighter.passiveSkills || [],
        
        // Efectos activos
        buffs: [],
        debuffs: [],
        
        // Flags de combate
        isInvisible: false,
        hasActedOnce: false
    };
}

/**
 * Genera un enemigo normal para una zona y escenario específico
 * @param {number} zoneNum - Número de zona (1-5)
 * @param {number} stage - Número de escenario (1-9)
 * @returns {Object} Enemigo generado
 */
function generateEnemy(zoneNum, stage) {
    const config = ZONE_CONFIG[zoneNum];
    
    // Calcular nivel basado en la zona y el escenario
    // Zona 1: niveles 1-9, Zona 2: niveles 11-19, etc.
    const baseLevel = config.levelRange[0] + (stage - 1);
    
    // Seleccionar clase aleatoria
    const classKeys = Object.keys(CLASSES);
    const randomClass = classKeys[Math.floor(Math.random() * classKeys.length)];
    const classData = CLASSES[randomClass];
    
    // Seleccionar nombre del monstruo de la zona
    const name = config.monsters[Math.floor(Math.random() * config.monsters.length)];
    
    // Stats escalados por nivel (escenarios más altos = enemigos más fuertes)
    const statMultiplier = 1 + (stage - 1) * 0.1; // 10% más stats por escenario
    
    const enemy = {
        id: 'enemy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        class: randomClass,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        level: baseLevel,
        stats: {
            str: Math.floor((classData.baseStats.str + baseLevel * 0.8) * statMultiplier),
            agi: Math.floor((classData.baseStats.agi + baseLevel * 0.8) * statMultiplier),
            res: Math.floor((classData.baseStats.res + baseLevel * 0.8) * statMultiplier),
            int: Math.floor((classData.baseStats.int + baseLevel * 0.8) * statMultiplier)
        },
        activeSkills: [],
        passiveSkills: []
    };
    
    return createBattleFighter(enemy, 'enemy');
}

/**
 * Genera un jefe para el escenario 10 de una zona
 * El jefe tiene x3 stats base de un monstruo nivel 5 de esa zona
 * @param {number} zoneNum - Número de zona (1-5)
 * @returns {Object} Jefe generado
 */
function generateBoss(zoneNum) {
    const config = ZONE_CONFIG[zoneNum];
    
    // El jefe tiene nivel 5 de la zona (ej: zona 1 = nivel 5, zona 2 = nivel 15)
    const bossBaseLevel = config.levelRange[0] + 4; // Nivel base del escenario 5
    
    // Seleccionar clase aleatoria (pero el jefe tiene stats amplificados)
    const classKeys = Object.keys(CLASSES);
    const randomClass = classKeys[Math.floor(Math.random() * classKeys.length)];
    const classData = CLASSES[randomClass];
    
    // Stats base de un enemigo nivel 5 de la zona, multiplicado x3
    const baseStatMultiplier = 3;
    
    const boss = {
        id: 'boss_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: config.boss.name,
        class: randomClass,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        level: bossBaseLevel,
        isBoss: true,
        stats: {
            str: Math.floor((classData.baseStats.str + bossBaseLevel * 0.8) * baseStatMultiplier),
            agi: Math.floor((classData.baseStats.agi + bossBaseLevel * 0.8) * baseStatMultiplier),
            res: Math.floor((classData.baseStats.res + bossBaseLevel * 0.8) * baseStatMultiplier),
            int: Math.floor((classData.baseStats.int + bossBaseLevel * 0.8) * baseStatMultiplier)
        },
        activeSkills: [],
        passiveSkills: []
    };
    
    return createBattleFighter(boss, 'enemy');
}

/**
 * Renderiza los equipos en la UI de batalla
 */
function renderBattleTeams() {
    const playerContainer = document.getElementById('player-team-container');
    const enemyContainer = document.getElementById('enemy-team-container');
    
    playerContainer.innerHTML = '';
    enemyContainer.innerHTML = '';
    
    // Equipo del jugador
    battleState.playerTeam.forEach((fighter) => {
        const slot = document.createElement('div');
        slot.className = 'fighter-battle-slot';
        slot.dataset.fighterId = fighter.id;
        if (fighter.isSummon) slot.classList.add('summon-slot');
        slot.innerHTML = createBattleFighterHTML(fighter);
        playerContainer.appendChild(slot);
    });
    
    // Equipo enemigo
    battleState.enemyTeam.forEach((fighter) => {
        const slot = document.createElement('div');
        slot.className = 'fighter-battle-slot';
        slot.dataset.fighterId = fighter.id;
        if (fighter.isSummon) slot.classList.add('summon-slot');
        slot.innerHTML = createBattleFighterHTML(fighter);
        enemyContainer.appendChild(slot);
    });
}

/**
 * Crea el HTML de un peleador en batalla
 * @param {Object} fighter - Peleador de batalla
 * @returns {string} HTML del peleador
 */
function createBattleFighterHTML(fighter) {
    let avatar, className;
    
    if (fighter.isSummon) {
        const config = SUMMON_CONFIG[fighter.summonType];
        avatar = config ? config.icon : '❓';
        className = config ? config.name : 'Invocación';
    } else {
        avatar = FIGHTER_AVATARS[fighter.gender][fighter.class];
        className = `Nv.${fighter.level} ${CLASSES[fighter.class].name}`;
    }
    
    const hpPercent = (fighter.hp / fighter.maxHp) * 100;
    const actionPercent = fighter.actionBar;
    
    return `
        <div class="battle-fighter ${fighter.isSummon ? 'summon' : ''}" data-fighter-id="${fighter.id}">
            <span class="battle-fighter-avatar">${avatar}</span>
            <span class="battle-fighter-name">${fighter.name}</span>
            <span class="battle-fighter-class">${className}</span>
            <div class="battle-bars">
                <div class="bar-container">
                    <span class="bar-label">HP</span>
                    <div class="bar">
                        <div class="bar-fill hp" style="width: ${hpPercent}%"></div>
                    </div>
                </div>
                <div class="bar-container">
                    <span class="bar-label">ATK</span>
                    <div class="bar">
                        <div class="bar-fill action ${actionPercent >= 100 ? 'ready' : ''}" style="width: ${Math.min(actionPercent, 100)}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Actualiza la UI de un peleador en batalla
 * @param {Object} fighter - Peleador a actualizar
 */
function updateBattleFighterUI(fighter) {
    const element = document.querySelector(`[data-fighter-id="${fighter.id}"]`);
    if (!element) return;
    
    const hpPercent = Math.max(0, (fighter.hp / fighter.maxHp) * 100);
    const actionPercent = fighter.actionBar;
    
    const hpBar = element.querySelector('.bar-fill.hp');
    const actionBar = element.querySelector('.bar-fill.action');
    
    if (hpBar) hpBar.style.width = `${hpPercent}%`;
    if (actionBar) {
        actionBar.style.width = `${Math.min(actionPercent, 100)}%`;
        actionBar.classList.toggle('ready', actionPercent >= 100);
    }
    
    // Efecto visual si está muerto
    if (fighter.hp <= 0) {
        element.style.opacity = '0.3';
        element.style.filter = 'grayscale(100%)';
    }
}

/**
 * Inicia la ejecución del combate
 */
function runBattle() {
    battleState.isRunning = true;
    
    document.getElementById('btn-start-battle').classList.add('hidden');
    document.getElementById('btn-speed').classList.remove('hidden');
    
    addBattleLog('¡La batalla ha comenzado!', 'skill');
    
    battleInterval = setInterval(() => {
        battleTick();
    }, 100 / battleSpeed);
}

// ============================================
// SISTEMA DE BATALLA - INTERACCIÓN
// ============================================

/**
 * Reanuda la batalla
 */
function resumeBattle() {
    battleState.isRunning = true;
}

/**
 * Muestra el menú de acciones para el jugador
 */
function showBattleActionMenu(fighter) {
    const menu = document.getElementById('battle-actions-menu');
    const skillMenu = document.getElementById('skill-selection-menu');
    const targetMsg = document.getElementById('target-selection-msg');
    
    // Resetear estado del menú
    menu.classList.remove('hidden');
    skillMenu.classList.add('hidden');
    targetMsg.classList.add('hidden');
    
    // Configurar botones principales
    document.getElementById('btn-action-attack').onclick = () => {
        enableTargetSelection('enemy', (target) => {
            executeAction(fighter, { type: 'attack', target: target });
            hideBattleActionMenu();
            resumeBattle();
        });
    };
    
    document.getElementById('btn-action-defend').onclick = () => {
        executeAction(fighter, { type: 'defend' });
        hideBattleActionMenu();
        resumeBattle();
    };
    
    document.getElementById('btn-action-skill').onclick = () => {
        showSkillSelection(fighter);
    };
}

function hideBattleActionMenu() {
    document.getElementById('battle-actions-menu').classList.add('hidden');
    // Limpiar selección de objetivos si estaba activa
    document.querySelectorAll('.selectable-target').forEach(el => {
        el.classList.remove('selectable-target', 'enemy-target', 'ally-target');
        el.onclick = null;
    });
    document.getElementById('target-selection-msg').classList.add('hidden');
}

function showSkillSelection(fighter) {
    const skillMenu = document.getElementById('skill-selection-menu');
    const skillsGrid = document.getElementById('battle-skills-grid');
    
    skillMenu.classList.remove('hidden');
    skillsGrid.innerHTML = '';
    
    if (!fighter.activeSkills || fighter.activeSkills.length === 0) {
        skillsGrid.innerHTML = '<p style="color:white; font-size:0.8rem;">No hay habilidades disponibles</p>';
        return;
    }
    
    fighter.activeSkills.forEach(skill => {
        const btn = document.createElement('div');
        btn.className = 'battle-skill-btn';
        btn.innerHTML = `
            <span style="font-size: 1.5rem">${skill.icon}</span>
            <span style="font-size: 0.8rem">${skill.name}</span>
        `;
        
        btn.onclick = () => {
            // Determinar tipo de objetivo basado en la habilidad
            const dummyTarget = fighter; 
            const effect = getActiveSkillEffect(skill, fighter, dummyTarget);
            
            let targetMode = 'enemy';
            if (effect.heal || effect.buff || effect.shield || effect.healTarget) {
                targetMode = 'ally';
            }
            
            // Excepciones específicas
            if (skill.id === 'revive') targetMode = 'dead_ally'; 
            
            enableTargetSelection(targetMode, (target) => {
                executeAction(fighter, { type: 'skill', skill: skill, target: target });
                hideBattleActionMenu();
                resumeBattle();
            });
        };
        
        skillsGrid.appendChild(btn);
    });
    
    document.getElementById('btn-cancel-skill').onclick = () => {
        skillMenu.classList.add('hidden');
    };
}

function enableTargetSelection(mode, callback) {
    const targetMsg = document.getElementById('target-selection-msg');
    const skillMenu = document.getElementById('skill-selection-menu');
    
    skillMenu.classList.add('hidden');
    targetMsg.classList.remove('hidden');
    
    document.getElementById('btn-cancel-target').onclick = () => {
        targetMsg.classList.add('hidden');
        // Volver al menú principal
        document.getElementById('battle-actions-menu').classList.remove('hidden');
        // Limpiar targets
        document.querySelectorAll('.selectable-target').forEach(el => {
            el.classList.remove('selectable-target', 'enemy-target', 'ally-target');
            el.onclick = null;
        });
    };
    
    let targets = [];
    if (mode === 'enemy') {
        targets = battleState.enemyTeam.filter(f => f.hp > 0);
    } else if (mode === 'ally') {
        targets = battleState.playerTeam.filter(f => f.hp > 0);
    } else if (mode === 'dead_ally') {
        targets = battleState.playerTeam.filter(f => f.hp <= 0);
    }
    
    // Añadir clases visuales y listeners
    targets.forEach(target => {
        const slot = document.querySelector(`.fighter-battle-slot[data-fighter-id="${target.id}"]`);
        if (slot) {
            slot.classList.add('selectable-target');
            if (mode === 'enemy') slot.classList.add('enemy-target');
            else slot.classList.add('ally-target');
            
            slot.onclick = (e) => {
                e.stopPropagation(); // Evitar clicks múltiples
                callback(target);
            };
        }
    });
}

/**
 * Ejecuta una acción de batalla (Player o AI)
 */
function executeAction(attacker, action) {
    // Resetear barra de acción
    attacker.actionBar = 0;
    attacker.attackCount++;
    
    if (action.type === 'defend') {
        addBattleLog(`${attacker.name} se pone en guardia!`, 'skill');
        attacker.isDefending = true;
        updateBattleFighterUI(attacker);
        return;
    }
    
    // Si estaba defendiendo, dejar de defender al atacar
    attacker.isDefending = false;
    
    const target = action.target;
    if (!target) return; // Error safety
    
    const cs = attacker.combatStats;
    const tcs = target.combatStats;
    
    // Pre-calcular efecto si es skill para saber si es invocación
    let skillEffect = null;
    if (action.type === 'skill') {
        skillEffect = getActiveSkillEffect(action.skill, attacker, target);
    }
    
    // Verificar precisión vs evasión (solo para ataques ofensivos)
    // Excluir si es skill de curación, buff, O INVOCACIÓN
    const isSummonSkill = skillEffect && skillEffect.summon;
    const isSupportSkill = action.type === 'skill' && (action.skill.heal || action.skill.buff || isSummonSkill);
    
    if (action.type === 'attack' || (action.type === 'skill' && !isSupportSkill)) {
        const hitChance = Math.min(95, Math.max(50, cs.accuracy - tcs.evasion));
        const hitRoll = Math.random() * 100;
        
        if (hitRoll > hitChance) {
            addBattleLog(`${attacker.name} falla su ataque contra ${target.name}!`, '');
            return;
        }
    }
    
    if (action.type === 'attack') {
        // Ataque básico
        let damage = cs.physicalDamage;
        
        // Reducción por defensa
        const defense = tcs.defense * (target.isDefending ? 1.5 : 1);
        damage = Math.max(1, Math.floor(damage * (100 / (100 + defense))));
        
        // Crítico
        if (Math.random() * 100 < cs.critChance) {
            damage = Math.floor(damage * (cs.critDamage / 100));
            addBattleLog(`¡CRÍTICO! ${attacker.name} golpea a ${target.name} por ${damage} de daño!`, 'damage');
        } else {
            addBattleLog(`${attacker.name} ataca a ${target.name} por ${damage} de daño.`, 'damage');
        }
        
        target.hp = Math.max(0, target.hp - damage);
        updateBattleFighterUI(target);
        
    } else if (action.type === 'skill') {
        const skill = action.skill;
        // skillEffect ya fue calculado arriba
        
        addBattleLog(`${skill.icon} ${attacker.name} usa ${skill.name}!`, 'skill');
        
        // Aplicar efectos
        if (skillEffect.damage) {
            let damage = skillEffect.damage;
            // Reducción por defensa (mágica o física)
            const defense = skillEffect.damageType === 'mágico' ? tcs.magicDefense : tcs.defense;
            const finalDefense = defense * (target.isDefending ? 1.5 : 1);
            
            if (!skillEffect.armorPen) {
                damage = Math.max(1, Math.floor(damage * (100 / (100 + finalDefense))));
            }
            
            damage = Math.floor(damage);
            target.hp = Math.max(0, target.hp - damage);
            addBattleLog(`${target.name} recibe ${damage} de daño ${skillEffect.damageType || 'mágico'}.`, 'damage');
            
            // Efectos secundarios (stun, dot, etc) - Simplificado
            if (skillEffect.stun) addBattleLog(`${target.name} está aturdido!`, 'debuff');
        }
        
        if (skillEffect.heal) {
            const healAmount = Math.floor(skillEffect.heal);
            target.hp = Math.min(target.maxHp, target.hp + healAmount);
            addBattleLog(`${target.name} recupera ${healAmount} HP`, 'heal');
        }
        
        if (skillEffect.buff) {
            addBattleLog(`${target.name} recibe ${skillEffect.buff.name}`, 'buff');
        }
        
        // Invocaciones
        if (skillEffect.summon) {
            summonCreature(attacker, skillEffect.summon);
        }
        
        updateBattleFighterUI(target);
    }
    
    updateBattleFighterUI(attacker);
}

/**
 * Calcula la acción de la IA
 */
function calculateAIAction(attacker) {
    // Seleccionar objetivo (enemigo vivo aleatorio)
    const targets = attacker.team === 'player' 
        ? battleState.enemyTeam.filter(f => f.hp > 0)
        : battleState.playerTeam.filter(f => f.hp > 0);
    
    if (targets.length === 0) return { type: 'wait' };
    
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    // Lógica de skills vs ataque básico
    const skillFrequency = ['tanque', 'curador', 'invocador'].includes(attacker.class) ? 3 : 4;
    const isSpecialTurn = (attacker.attackCount + 1) % skillFrequency === 0;
    
    if (isSpecialTurn && attacker.activeSkills && attacker.activeSkills.length > 0) {
        const skill = attacker.activeSkills[Math.floor(Math.random() * attacker.activeSkills.length)];
        
        // Determinar target correcto para el skill (aliado o enemigo)
        const dummyEffect = getActiveSkillEffect(skill, attacker, target);
        let skillTarget = target;
        
        if (dummyEffect.heal || dummyEffect.buff || dummyEffect.shield) {
            // Buscar aliado herido
            const allies = attacker.team === 'player' ? battleState.playerTeam : battleState.enemyTeam;
            const injuredAllies = allies.filter(f => f.hp > 0 && f.hp < f.maxHp);
            if (injuredAllies.length > 0) {
                skillTarget = injuredAllies.sort((a, b) => a.hp - b.hp)[0]; // El más herido
            } else {
                skillTarget = attacker; // Self cast si todos están full
            }
        }
        
        return { type: 'skill', skill: skill, target: skillTarget };
    }
    
    return { type: 'attack', target: target };
}

/**
 * Un tick del sistema de combate
 */
function battleTick() {
    if (!battleState.isRunning) return;
    
    // Verificar condiciones de victoria/derrota
    const playerAlive = battleState.playerTeam.filter(f => f.hp > 0);
    const enemyAlive = battleState.enemyTeam.filter(f => f.hp > 0);
    
    if (playerAlive.length === 0) {
        endBattle('enemy');
        return;
    }
    
    if (enemyAlive.length === 0) {
        endBattle('player');
        return;
    }
    
    // Incrementar barras de acción
    const allFighters = [...battleState.playerTeam, ...battleState.enemyTeam];
    
    // 1. Incrementar barras de todos
    allFighters.forEach(fighter => {
        if (fighter.hp <= 0) return;
        
        // La velocidad depende del attackSpeed calculado (incluye pasivas)
        const speed = fighter.combatStats ? fighter.combatStats.attackSpeed : (1 + (fighter.stats.agi * 0.05));
        fighter.actionBar += speed;
        
        updateBattleFighterUI(fighter);
    });

    // 2. Ejecutar UN solo ataque por tick para evitar spam en el log
    // Buscar peleadores listos
    const readyFighters = allFighters.filter(f => f.hp > 0 && f.actionBar >= 100);
    
    if (readyFighters.length > 0) {
        // Ordenar por quién tiene más barra (prioridad)
        readyFighters.sort((a, b) => b.actionBar - a.actionBar);
        
        const attacker = readyFighters[0];
        
        // Si es un peleador del jugador (y no es una invocación automática)
        if (attacker.team === 'player' && !attacker.isSummon) {
            battleState.isRunning = false; // Pausar batalla
            showBattleActionMenu(attacker);
            return;
        }
        
        // IA (Enemigos o Invocaciones)
        const action = calculateAIAction(attacker);
        executeAction(attacker, action);
    }
}

/**
 * Invoca una criatura al campo de batalla
 */
function summonCreature(summoner, summonData) {
    const config = SUMMON_CONFIG[summonData.type];
    if (!config) return;

    // Limitar invocaciones por equipo (max 2)
    const team = summoner.team === 'player' ? battleState.playerTeam : battleState.enemyTeam;
    const currentSummons = team.filter(f => f.isSummon).length;
    
    if (currentSummons >= 2) {
        addBattleLog(`${summoner.name} intenta invocar pero ya hay demasiadas criaturas!`, 'error');
        return;
    }

    const power = summonData.power || 1;
    const level = summoner.level;
    
    // Calcular stats basados en el invocador
    const stats = {
        str: Math.floor(summoner.stats.int * 0.5 * config.stats.str * power),
        agi: Math.floor(summoner.stats.int * 0.5 * config.stats.agi * power),
        res: Math.floor(summoner.stats.int * 0.5 * config.stats.res * power),
        int: Math.floor(summoner.stats.int * 0.5 * config.stats.int * power)
    };

    const summon = {
        id: `summon_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: config.name,
        class: 'summon', // Clase especial
        summonType: summonData.type,
        gender: 'male',
        level: level,
        stats: stats,
        isSummon: true,
        summonerId: summoner.id
    };

    const battleFighter = createBattleFighter(summon, summoner.team);
    
    // Añadir al equipo
    team.push(battleFighter);
    
    addBattleLog(`${summoner.name} invoca a ${config.name}!`, 'skill');
    
    // Actualizar UI
    renderBattleTeams();
}



/**
 * Obtiene el efecto de una habilidad activa
 * @param {Object} skill - Habilidad activa
 * @param {Object} attacker - Atacante
 * @param {Object} target - Objetivo
 * @returns {Object} Efecto de la habilidad
 */
function getActiveSkillEffect(skill, attacker, target) {
    const cs = attacker.combatStats;
    const tier = skill.tier || 1;
    const baseDamage = cs.physicalDamage;
    const magicDamage = cs.magicDamage;
    
    // Multiplicadores por tier
    const tierMult = 1 + (tier - 1) * 0.25; // 1.0, 1.25, 1.5
    
    // Efectos según el ID de la habilidad
    const skillEffects = {
        // BÁRBARO - Daño físico alto
        'fury_strike': { damage: baseDamage * 1.5 * tierMult, damageType: 'físico' },
        'berserker': { damage: baseDamage * 1.2 * tierMult, buff: { name: 'Berserker', type: 'damage', value: 50, duration: 3 } },
        'whirlwind': { damage: baseDamage * 0.8 * tierMult, aoe: true, damageType: 'físico' },
        'brutal_charge': { damage: baseDamage * 1.3 * tierMult, stun: tier },
        'war_cry': { damage: 0, buff: { name: 'Grito de Guerra', type: 'allStats', value: 20 * tier, duration: 3 } },
        'execute': { damage: baseDamage * (2 + (1 - target.hp / target.maxHp)) * tierMult, damageType: 'físico' },
        'blood_rage': { damage: baseDamage * (1.5 + (1 - attacker.hp / attacker.maxHp)) * tierMult },
        'ground_slam': { damage: baseDamage * 1.2 * tierMult, aoe: true, damageType: 'físico' },
        'intimidate': { damage: baseDamage * 0.8 * tierMult, debuff: { type: 'weaken', value: 20 * tier } },
        'rampage': { damage: baseDamage * 0.6 * tierMult * 3, damageType: 'físico' }, // 3 golpes
        
        // TANQUE - Utilidad y defensa
        'shield_bash': { damage: baseDamage * 1.2 * tierMult, stun: tier },
        'fortify': { damage: 0, buff: { name: 'Fortificar', type: 'defense', value: 100 * tier, duration: 2 } },
        'taunt': { damage: baseDamage * 0.5 * tierMult, taunt: true },
        'iron_skin': { damage: 0, buff: { name: 'Piel de Hierro', type: 'damageReduction', value: 30 * tier, duration: 3 } },
        'reflect': { damage: 0, buff: { name: 'Reflejo', type: 'reflect', value: 30 * tier, duration: 2 } },
        'last_stand': { damage: baseDamage * tierMult, buff: { name: 'Última Defensa', type: 'survive', duration: 1 } },
        'guardian': { damage: 0, buff: { name: 'Guardián', type: 'protect', duration: 2 } },
        'counter': { damage: baseDamage * 1.5 * tierMult, damageType: 'físico' },
        'wall': { damage: 0, buff: { name: 'Muro', type: 'immune', duration: 1 } },
        'rally': { damage: 0, heal: attacker.maxHp * 0.2 * tierMult, healTarget: attacker },
        
        // ASESINO - Alto daño single target
        'backstab': { damage: baseDamage * 2 * tierMult, damageType: 'físico', autoCrit: true },
        'poison': { damage: baseDamage * 0.8 * tierMult, dot: { type: 'poison', damage: baseDamage * 0.2 * tier, duration: 3 } },
        'shadow_step': { damage: baseDamage * tierMult, buff: { name: 'Paso Sombrío', type: 'evasion', value: 100, duration: 1 } },
        'ambush': { damage: baseDamage * 1.8 * tierMult, damageType: 'físico' },
        'vital_strike': { damage: baseDamage * 1.5 * tierMult, armorPen: true },
        'smoke_bomb': { damage: 0, buff: { name: 'Humo', type: 'evasion', value: 50 * tier, duration: 2 } },
        'blade_dance': { damage: baseDamage * 0.5 * tierMult * 4, damageType: 'físico' }, // 4 golpes
        'mark': { damage: baseDamage * tierMult, debuff: { type: 'marked', value: 30 * tier, duration: 3 } },
        'vanish': { damage: 0, buff: { name: 'Invisible', type: 'invisible', duration: 2 } },
        'death_lotus': { damage: baseDamage * 1.5 * tierMult, aoe: true, damageType: 'físico' },
        
        // ARQUERO - Daño a distancia
        'precise_shot': { damage: baseDamage * 1.8 * tierMult, damageType: 'físico' },
        'rain_arrows': { damage: baseDamage * 0.7 * tierMult, aoe: true, damageType: 'físico' },
        'explosive_arrow': { damage: baseDamage * 1.4 * tierMult, aoe: true, damageType: 'físico' },
        'freeze_arrow': { damage: baseDamage * 1.2 * tierMult, debuff: { type: 'slow', value: 30 * tier, duration: 2 } },
        'fire_arrow': { damage: baseDamage * 1.3 * tierMult + magicDamage * 0.5, damageType: 'mixto' },
        'double_shot': { damage: baseDamage * 0.9 * tierMult * 2, damageType: 'físico' },
        'eagle_eye': { damage: 0, buff: { name: 'Ojo de Águila', type: 'crit', value: 30 * tier, duration: 3 } },
        'trap': { damage: baseDamage * 1.5 * tierMult, stun: 1 },
        'piercing': { damage: baseDamage * 1.4 * tierMult, armorPen: true },
        'snipe': { damage: baseDamage * 2.5 * tierMult, damageType: 'físico' },
        
        // PELEADOR - Balance y combos
        'combo': { damage: baseDamage * 0.6 * tierMult * 3, damageType: 'físico' },
        'uppercut': { damage: baseDamage * 1.4 * tierMult, stun: tier },
        'flying_kick': { damage: baseDamage * 1.5 * tierMult, damageType: 'físico' },
        'focus': { damage: 0, buff: { name: 'Concentración', type: 'accuracy', value: 50 * tier, duration: 3 } },
        'chi_burst': { damage: magicDamage * 1.5 * tierMult, aoe: true, damageType: 'mágico' },
        'counter_stance': { damage: 0, buff: { name: 'Contraataque', type: 'counter', value: 50 * tier, duration: 2 } },
        'pressure_point': { damage: baseDamage * 1.2 * tierMult, debuff: { type: 'weaken', value: 25 * tier, duration: 2 } },
        'iron_fist': { damage: baseDamage * 2 * tierMult, damageType: 'físico' },
        'sweep': { damage: baseDamage * 1.1 * tierMult, aoe: true, stun: 1 },
        'inner_power': { damage: 0, buff: { name: 'Poder Interior', type: 'allStats', value: 15 * tier, duration: 3 } },
        
        // CURADOR - Soporte
        'heal': { heal: attacker.maxHp * 0.3 * tierMult, healTarget: getLowestHpAlly(attacker) },
        'group_heal': { heal: attacker.maxHp * 0.15 * tierMult, healTarget: attacker, aoeHeal: true },
        'purify': { damage: 0, cleanse: true },
        'blessing': { damage: 0, buff: { name: 'Bendición', type: 'allStats', value: 20 * tier, duration: 3 } },
        'barrier': { damage: 0, buff: { name: 'Barrera', type: 'shield', value: attacker.maxHp * 0.2 * tierMult, duration: 2 } },
        'revive': { revive: 0.3 * tierMult },
        'holy_light': { damage: magicDamage * 1.2 * tierMult, heal: attacker.maxHp * 0.1 * tierMult, healTarget: attacker, damageType: 'mágico' },
        'regeneration': { heal: attacker.maxHp * 0.05 * tierMult, healTarget: getLowestHpAlly(attacker), hot: { duration: 3 } },
        'divine_protection': { damage: 0, buff: { name: 'Protección Divina', type: 'immune', duration: tier } },
        'miracle': { heal: attacker.maxHp * 0.5 * tierMult, healTarget: getLowestHpAlly(attacker) },
        
        // HECHICERO - Daño mágico
        'fireball': { damage: magicDamage * 1.5 * tierMult, damageType: 'mágico' },
        'ice_spike': { damage: magicDamage * 1.3 * tierMult, debuff: { type: 'slow', value: 30 * tier, duration: 2 }, damageType: 'mágico' },
        'lightning': { damage: magicDamage * 1.4 * tierMult, damageType: 'mágico' },
        'meteor': { damage: magicDamage * 2 * tierMult, aoe: true, damageType: 'mágico' },
        'arcane_blast': { damage: magicDamage * 1.6 * tierMult, armorPen: true, damageType: 'mágico' },
        'mana_drain': { damage: magicDamage * 0.8 * tierMult, manaSteal: 20 * tier, damageType: 'mágico' },
        'polymorph': { damage: 0, stun: tier + 1 },
        'time_stop': { damage: 0, aoeStun: tier },
        'inferno': { damage: magicDamage * 0.8 * tierMult, dot: { type: 'burn', damage: magicDamage * 0.3 * tier, duration: 3 }, damageType: 'mágico' },
        'black_hole': { damage: magicDamage * 1.8 * tierMult, aoe: true, damageType: 'mágico' },
        
        // INVOCADOR - Invocaciones
        'summon_wolf': { damage: baseDamage * 0.8 * tierMult, summon: { type: 'wolf', power: tierMult } },
        'summon_golem': { damage: 0, summon: { type: 'golem', power: tierMult } },
        'summon_spirit': { damage: magicDamage * tierMult, summon: { type: 'spirit', power: tierMult }, damageType: 'mágico' },
        'command': { damage: 0, buff: { name: 'Comandar', type: 'summonBoost', value: 50 * tier, duration: 3 } },
        'sacrifice': { damage: magicDamage * 2.5 * tierMult, damageType: 'mágico' },
        'soul_link': { damage: 0, buff: { name: 'Enlace', type: 'soulLink', duration: 3 } },
        'swarm': { damage: baseDamage * 0.3 * tierMult * 5, aoe: true, damageType: 'físico' },
        'dragon': { damage: magicDamage * 2 * tierMult, summon: { type: 'dragon', power: tierMult * 2 }, damageType: 'mágico' },
        'possession': { damage: 0, charm: tier },
        'army': { damage: baseDamage * 0.5 * tierMult, aoe: true, summon: { type: 'undead', count: tier * 2 } }
    };
    
    return skillEffects[skill.id] || { damage: baseDamage * 1.5 * tierMult, damageType: 'físico' };
}

/**
 * Obtiene el aliado con menor HP
 * @param {Object} attacker - El peleador actual
 * @returns {Object} Aliado con menor HP
 */
function getLowestHpAlly(attacker) {
    const allies = attacker.team === 'player' 
        ? battleState.playerTeam.filter(f => f.hp > 0)
        : battleState.enemyTeam.filter(f => f.hp > 0);
    
    if (allies.length === 0) return attacker;
    
    return allies.reduce((lowest, current) => {
        const lowestPercent = lowest.hp / lowest.maxHp;
        const currentPercent = current.hp / current.maxHp;
        return currentPercent < lowestPercent ? current : lowest;
    }, allies[0]);
}

/**
 * Añade una entrada al log de batalla
 * @param {string} message - Mensaje
 * @param {string} type - Tipo de entrada
 */
function addBattleLog(message, type = '') {
    const logContainer = document.getElementById('battle-log');
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    logContainer.prepend(entry);
    // No hacemos scroll al fondo porque ahora los nuevos mensajes aparecen arriba
}

/**
 * Termina la batalla
 * @param {string} winner - 'player' o 'enemy'
 */
function endBattle(winner) {
    battleState.isRunning = false;
    battleState.winner = winner;
    
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
    }
    
    if (winner === 'player') {
        // Victoria
        if (battleState.type === 'arena') {
            handleArenaVictory();
        } else {
            handleExplorationVictory();
        }
    } else {
        // Derrota
        if (battleState.type === 'arena') {
            handleArenaDefeat();
        } else {
            handleExplorationDefeat();
        }
    }
}

// ============================================
// SISTEMA DE ITEMS Y DROPS
// ============================================

/**
 * Genera un item aleatorio
 * @param {number} zone - Zona actual (1-5)
 * @param {string} rarity - Rareza del item (normal, rare, epic, legendary)
 * @param {string} type - Tipo de item (weapon, armor, accessory)
 * @param {string} fighterClass - Clase del peleador (opcional, para armas)
 * @returns {Object} Item generado
 */
function generateItem(zone, rarity, type, fighterClass = null) {
    const rarityInfo = ITEM_RARITIES[rarity];
    let itemData, itemPool;
    
    // Seleccionar pool de items según el tipo
    if (type === 'weapon') {
        if (!fighterClass) {
            // Seleccionar clase aleatoria si no se especifica
            const classes = Object.keys(WEAPON_TYPES);
            fighterClass = classes[Math.floor(Math.random() * classes.length)];
        }
        itemPool = WEAPON_TYPES[fighterClass];
        itemData = itemPool[Math.floor(Math.random() * itemPool.length)];
    } else if (type === 'armor') {
        itemPool = ARMOR_TYPES;
        itemData = itemPool[Math.floor(Math.random() * itemPool.length)];
    } else if (type === 'accessory') {
        itemPool = ACCESSORY_TYPES;
        itemData = itemPool[Math.floor(Math.random() * itemPool.length)];
    }
    
    // Calcular stats con el multiplicador de rareza
    const stats = {};
    Object.keys(itemData.baseStats).forEach(stat => {
        const baseValue = itemData.baseStats[stat];
        const zoneMult = 1 + (zone - 1) * 0.2; // +20% stats por zona
        stats[stat] = Math.floor(baseValue * rarityInfo.multiplier * zoneMult);
    });
    
    // Generar nombre del item
    const prefix = ITEM_PREFIXES[rarity][Math.floor(Math.random() * ITEM_PREFIXES[rarity].length)];
    const itemName = `${prefix} ${itemData.name}`;
    
    return {
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: itemName,
        type: type,
        slot: itemData.slot || 'weapon',
        icon: itemData.icon,
        rarity: rarity,
        rarityInfo: rarityInfo,
        stats: stats,
        class: type === 'weapon' ? fighterClass : null,
        zone: zone
    };
}

/**
 * Determina la rareza de un item según la zona
 * @param {number} zone - Zona actual (1-5)
 * @returns {string} Rareza del item
 */
function rollItemRarity(zone) {
    const rates = DROP_RATES[zone];
    const roll = Math.random();
    
    let cumulative = 0;
    for (const [rarity, probability] of Object.entries(rates)) {
        cumulative += probability;
        if (roll <= cumulative) {
            return rarity;
        }
    }
    
    return 'normal'; // Fallback
}

/**
 * Genera drops de items al completar una batalla de exploración
 * @param {number} zone - Zona actual
 * @param {boolean} isBoss - Si es batalla de jefe
 * @returns {Array} Array de items generados
 */
function generateLoot(zone, isBoss) {
    const drops = [];
    
    // Cantidad de drops
    let dropCount = Math.random() < 0.5 ? 1 : 0; // 50% chance de drop normal
    
    if (isBoss) {
        dropCount = 2 + Math.floor(Math.random() * 2); // Jefes dropean 2-3 items
    }
    
    // Generar items
    for (let i = 0; i < dropCount; i++) {
        const rarity = rollItemRarity(zone);
        
        // Decidir tipo de item (40% arma, 40% armadura, 20% accesorio)
        let type;
        const typeRoll = Math.random();
        if (typeRoll < 0.4) type = 'weapon';
        else if (typeRoll < 0.8) type = 'armor';
        else type = 'accessory';
        
        // Para armas, seleccionar clase aleatoria del equipo del jugador
        let fighterClass = null;
        if (type === 'weapon' && gameState.team.length > 0) {
            const randomTeamIndex = Math.floor(Math.random() * gameState.team.length);
            const fighterId = gameState.team[randomTeamIndex];
            if (fighterId) {
                const fighter = gameState.fighters.find(f => f.id === fighterId);
                if (fighter) {
                    fighterClass = fighter.class;
                }
            }
        }
        
        const item = generateItem(zone, rarity, type, fighterClass);
        drops.push(item);
    }
    
    return drops;
}

/**
 * Agrega items al inventario del jugador
 * @param {Array} items - Items a agregar
 */
function addItemsToInventory(items) {
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
    items.forEach(item => {
        gameState.inventory.push(item);
    });
    
    saveGame();
}

/**
 * Maneja victoria en exploración
 */
function handleExplorationVictory() {
    const zone = battleState.zone;
    const stage = battleState.stage || 1;
    const isBoss = battleState.isBoss;
    const config = ZONE_CONFIG[zone];
        
        // Calcular recompensas (más por escenarios altos y jefes)
        let expMultiplier = 1 + (stage - 1) * 0.15; // +15% por escenario
        let goldMultiplier = 1 + (stage - 1) * 0.2; // +20% por escenario
        
        if (isBoss) {
            expMultiplier *= 3;  // Jefes dan x3 EXP
            goldMultiplier *= 5; // Jefes dan x5 Oro
        }
        
        const baseExp = zone * 15 + stage * 5;
        const baseGold = zone * 10 + stage * 8;
        
        const expGain = (Math.floor(baseExp * expMultiplier) + Math.floor(Math.random() * 10)) * 2;
        const goldGain = Math.floor(baseGold * goldMultiplier) + Math.floor(Math.random() * 20);
        
        // Dar experiencia a los peleadores
        battleState.playerTeam.forEach(fighter => {
            const realFighter = gameState.fighters.find(f => f.id === fighter.id);
            if (realFighter) {
                gainFighterExp(realFighter, expGain);
            }
        });
        
        // Dar experiencia y oro al jugador
        gameState.player.exp += Math.floor(expGain / 2);
        gameState.player.gold += goldGain;
        
        // Verificar nivel de cuenta
        checkAccountLevelUp();
        
        // Progresión de escenarios
        let progressMessage = '';
        const currentProgress = gameState.exploration.zoneProgress[zone];
        
        if (stage === currentProgress) {
            // Completó el escenario actual, desbloquear siguiente
            gameState.exploration.zoneProgress[zone] = stage + 1;
            
            if (isBoss) {
                // Completó el jefe (escenario 10), desbloquear siguiente zona
                if (zone < 5) {
                    gameState.exploration.zoneProgress[zone + 1] = 1;
                    progressMessage = `<p class="text-green">🔓 ¡${ZONE_CONFIG[zone + 1].name} desbloqueada!</p>`;
                } else {
                    progressMessage = `<p class="text-gold">👑 ¡Has completado todas las zonas!</p>`;
                }
            } else {
                progressMessage = `<p class="text-blue">→ Escenario ${stage + 1} desbloqueado</p>`;
            }
        }
        
    // Generar drops de items
    const lootDrops = generateLoot(zone, isBoss);
    if (lootDrops.length > 0) {
        addItemsToInventory(lootDrops);
        lootDrops.forEach(item => {
            addBattleLog(`${item.rarityInfo.icon} ${item.name} obtenido`, 'heal');
        });
    }
    
    saveGame();
    
    addBattleLog('¡VICTORIA!', 'skill');
    addBattleLog(`+${expGain} EXP para peleadores`, 'heal');
    addBattleLog(`+${goldGain} Oro`, 'heal');
    
    const victoryTitle = isBoss ? `¡${config.boss.name} Derrotado!` : '¡Victoria!';
    const victoryIcon = isBoss ? '👑' : '🏆';
    
    // Construir HTML de items dropeados
    let itemsHTML = '';
    if (lootDrops.length > 0) {
        itemsHTML = '<div style="margin-top: 1rem;"><p style="font-weight: bold; margin-bottom: 0.5rem;">Items Obtenidos:</p>';
        lootDrops.forEach(item => {
            itemsHTML += `
                <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem; background: rgba(0,0,0,0.2); border-radius: 4px; margin-bottom: 0.25rem;">
                    <span style="font-size: 1.5rem;">${item.icon}</span>
                    <span style="color: ${item.rarityInfo.color}; font-weight: bold;">${item.name}</span>
                    <span style="font-size: 0.75rem; color: var(--color-text-secondary);">
                        ${Object.entries(item.stats).map(([stat, val]) => val > 0 ? `+${val} ${stat.toUpperCase()}` : '').filter(s => s).join(', ')}
                    </span>
                </div>
            `;
        });
        itemsHTML += '</div>';
    }
    
    showModal(
        victoryTitle,
        `
            <div style="text-align: center;">
                <p style="font-size: 3rem;">${victoryIcon}</p>
                <p>${isBoss ? `¡Has derrotado al jefe de ${config.name}!` : 'Has derrotado a todos los enemigos'}</p>
                <p class="text-gold">+${expGain} EXP</p>
                <p class="text-gold">+${goldGain} Oro</p>
                ${progressMessage}
                ${itemsHTML}
            </div>
        `,
        [
            { text: 'Continuar', class: 'btn-main', action: 'handleVictoryContinue()' }
        ]
    );
}

/**
 * Maneja derrota en exploración
 */
function handleExplorationDefeat() {
    addBattleLog('DERROTA...', 'damage');
    
    showModal(
        'Derrota',
        `
            <div style="text-align: center;">
                <p style="font-size: 3rem;">💀</p>
                <p>Tu equipo ha sido derrotado</p>
                <p>Entrena más y vuelve a intentarlo</p>
            </div>
        `,
        [
            { text: 'Volver', class: 'btn-secondary', action: 'handleDefeatReturn()' }
        ]
    );
}

/**
 * Maneja victoria en arena
 */
function handleArenaVictory() {
    const opponent = battleState.opponent;
    
    // Calcular puntos ganados (más puntos contra oponentes de mayor rango)
    const pointDiff = opponent.points - gameState.arena.points;
    let pointsGain = 25; // Base
    
    if (pointDiff > 100) pointsGain = 35; // Oponente más fuerte
    else if (pointDiff < -100) pointsGain = 15; // Oponente más débil
    
    // Calcular oro ganado según rango
    const currentRank = getCurrentRank();
    const rankInfo = ARENA_RANKS[currentRank];
    const goldGain = rankInfo.rewards.gold + Math.floor(Math.random() * 30);
    
    // Aplicar recompensas
    gameState.arena.points += pointsGain;
    gameState.arena.wins += 1;
    gameState.player.gold += goldGain;
    
    // Dar algo de EXP a los peleadores
    const expGain = Math.floor(20 + gameState.player.level * 2) * 2;
    battleState.playerTeam.forEach(fighter => {
        const realFighter = gameState.fighters.find(f => f.id === fighter.id);
        if (realFighter) {
            gainFighterExp(realFighter, expGain);
        }
    });
    
    // Verificar cambio de rango
    const oldRank = currentRank;
    const newRank = getCurrentRank();
    const rankChanged = oldRank !== newRank;
    
    saveGame();
    
    addBattleLog('¡VICTORIA!', 'skill');
    addBattleLog(`+${pointsGain} Puntos de Arena`, 'heal');
    addBattleLog(`+${goldGain} Oro`, 'heal');
    
    showModal(
        '¡Victoria en Arena!',
        `
            <div style="text-align: center;">
                <p style="font-size: 3rem;">🏆</p>
                <p>¡Has derrotado a ${opponent.name}!</p>
                <p class="text-gold">+${pointsGain} Puntos de Arena</p>
                <p class="text-gold">+${goldGain} Oro</p>
                <p class="text-blue">+${expGain} EXP</p>
                ${rankChanged ? `<p class="text-green">🎉 ¡Ascendiste a ${ARENA_RANKS[newRank].name}!</p>` : ''}
                <p style="margin-top: 1rem; color: var(--color-text-secondary); font-size: 0.875rem;">
                    Puntos actuales: ${gameState.arena.points}
                </p>
            </div>
        `,
        [
            { text: 'Continuar', class: 'btn-main', action: 'handleVictoryContinue()' }
        ]
    );
}

/**
 * Maneja derrota en arena
 */
function handleArenaDefeat() {
    const opponent = battleState.opponent;
    
    // Perder puntos (menos puntos perdidos contra oponentes más fuertes)
    const pointDiff = opponent.points - gameState.arena.points;
    let pointsLoss = 15; // Base
    
    if (pointDiff > 100) pointsLoss = 10; // Oponente más fuerte, pierdes menos
    else if (pointDiff < -100) pointsLoss = 20; // Oponente más débil, pierdes más
    
    gameState.arena.points = Math.max(0, gameState.arena.points - pointsLoss);
    gameState.arena.losses += 1;
    
    // Verificar cambio de rango
    const oldRank = getCurrentRank();
    saveGame();
    const newRank = getCurrentRank();
    const rankChanged = oldRank !== newRank;
    
    addBattleLog('DERROTA...', 'damage');
    addBattleLog(`-${pointsLoss} Puntos de Arena`, 'damage');
    
    showModal(
        'Derrota en Arena',
        `
            <div style="text-align: center;">
                <p style="font-size: 3rem;">💀</p>
                <p>Has sido derrotado por ${opponent.name}</p>
                <p class="text-red">-${pointsLoss} Puntos de Arena</p>
                ${rankChanged ? `<p class="text-red">📉 Descendiste a ${ARENA_RANKS[newRank].name}</p>` : ''}
                <p style="margin-top: 1rem; color: var(--color-text-secondary); font-size: 0.875rem;">
                    Puntos actuales: ${gameState.arena.points}
                </p>
            </div>
        `,
        [
            { text: 'Volver', class: 'btn-secondary', action: 'handleDefeatReturn()' }
        ]
    );
}

/**
 * Maneja el botón de continuar después de una victoria
 */
function handleVictoryContinue() {
    closeModal();
    navigateTo('screen-main-menu');
}

/**
 * Maneja el botón de volver después de una derrota
 */
function handleDefeatReturn() {
    closeModal();
    navigateTo('screen-main-menu');
}

/**
 * Otorga experiencia a un peleador y verifica subida de nivel
 * @param {Object} fighter - Peleador
 * @param {number} exp - Cantidad de experiencia
 */
function gainFighterExp(fighter, exp) {
    fighter.exp += exp;
    
    // Verificar level up
    while (fighter.level < 50) {
        const needed = getFighterExpNeeded(fighter.level);
        if (fighter.exp >= needed) {
            fighter.exp -= needed;
            fighter.level++;
            fighter.statPoints += 5;
            
            // Incremento base de stats por nivel
            fighter.stats.str += 1;
            fighter.stats.agi += 1;
            fighter.stats.res += 1;
            fighter.stats.int += 1;
            
            // Verificar desbloqueo de habilidades
            checkSkillUnlock(fighter);
            
            showToast(`${fighter.name} subió a nivel ${fighter.level}!`, 'success');
        } else {
            break;
        }
    }
}

/**
 * Verifica y desbloquea habilidades según el nivel
 * @param {Object} fighter - Peleador
 */
function checkSkillUnlock(fighter) {
    // Habilidades activas
    const activeUnlockLevels = [
        SKILL_UNLOCK_LEVELS.active1,
        SKILL_UNLOCK_LEVELS.active2,
        SKILL_UNLOCK_LEVELS.active3,
        SKILL_UNLOCK_LEVELS.active4
    ];
    
    activeUnlockLevels.forEach((level, index) => {
        if (fighter.level >= level && !fighter.activeSkills[index] && fighter.skillPool.active.length > 0) {
            const skill = fighter.skillPool.active.shift();
            fighter.activeSkills[index] = { ...skill, tier: 1 };
            showToast(`${fighter.name} aprendió ${skill.name}!`, 'success');
        }
    });
    
    // Subir nivel de habilidades activas
    // Active 1
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active1_lv2 && fighter.activeSkills[0] && fighter.activeSkills[0].tier < 2) fighter.activeSkills[0].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active1_lv3 && fighter.activeSkills[0] && fighter.activeSkills[0].tier < 3) fighter.activeSkills[0].tier = 3;
    
    // Active 2
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active2_lv2 && fighter.activeSkills[1] && fighter.activeSkills[1].tier < 2) fighter.activeSkills[1].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active2_lv3 && fighter.activeSkills[1] && fighter.activeSkills[1].tier < 3) fighter.activeSkills[1].tier = 3;
    
    // Active 3
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active3_lv2 && fighter.activeSkills[2] && fighter.activeSkills[2].tier < 2) fighter.activeSkills[2].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active3_lv3 && fighter.activeSkills[2] && fighter.activeSkills[2].tier < 3) fighter.activeSkills[2].tier = 3;

    // Active 4
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active4_lv2 && fighter.activeSkills[3] && fighter.activeSkills[3].tier < 2) fighter.activeSkills[3].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.active4_lv3 && fighter.activeSkills[3] && fighter.activeSkills[3].tier < 3) fighter.activeSkills[3].tier = 3;
    
    // Habilidades pasivas
    const passiveUnlockLevels = [
        SKILL_UNLOCK_LEVELS.passive1,
        SKILL_UNLOCK_LEVELS.passive2,
        SKILL_UNLOCK_LEVELS.passive3,
        SKILL_UNLOCK_LEVELS.passive4
    ];
    
    passiveUnlockLevels.forEach((level, index) => {
        if (fighter.level >= level && !fighter.passiveSkills[index] && fighter.skillPool.passive.length > 0) {
            const skill = fighter.skillPool.passive.shift();
            fighter.passiveSkills[index] = { ...skill, tier: 1 };
            showToast(`${fighter.name} aprendió ${skill.name} (pasiva)!`, 'success');
        }
    });
    
    // Subir nivel de habilidades pasivas
    // Passive 1
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive1_lv2 && fighter.passiveSkills[0] && fighter.passiveSkills[0].tier < 2) fighter.passiveSkills[0].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive1_lv3 && fighter.passiveSkills[0] && fighter.passiveSkills[0].tier < 3) fighter.passiveSkills[0].tier = 3;
    
    // Passive 2
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive2_lv2 && fighter.passiveSkills[1] && fighter.passiveSkills[1].tier < 2) fighter.passiveSkills[1].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive2_lv3 && fighter.passiveSkills[1] && fighter.passiveSkills[1].tier < 3) fighter.passiveSkills[1].tier = 3;
    
    // Passive 3
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive3_lv2 && fighter.passiveSkills[2] && fighter.passiveSkills[2].tier < 2) fighter.passiveSkills[2].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive3_lv3 && fighter.passiveSkills[2] && fighter.passiveSkills[2].tier < 3) fighter.passiveSkills[2].tier = 3;

    // Passive 4
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive4_lv2 && fighter.passiveSkills[3] && fighter.passiveSkills[3].tier < 2) fighter.passiveSkills[3].tier = 2;
    if (fighter.level >= SKILL_UNLOCK_LEVELS.passive4_lv3 && fighter.passiveSkills[3] && fighter.passiveSkills[3].tier < 3) fighter.passiveSkills[3].tier = 3;
}

/**
 * Verifica si el jugador sube de nivel de cuenta
 */
function checkAccountLevelUp() {
    while (gameState.player.level < 30) {
        const needed = getAccountExpNeeded(gameState.player.level);
        if (gameState.player.exp >= needed) {
            gameState.player.exp -= needed;
            gameState.player.level++;
            
            // Verificar nuevos slots
            if (gameState.player.level === 11 || gameState.player.level === 21) {
                showToast(`¡Nuevo slot de equipo desbloqueado!`, 'success');
            }
            
            showToast(`¡Tu cuenta subió a nivel ${gameState.player.level}!`, 'success');
        } else {
            break;
        }
    }
}

/**
 * Cambia la velocidad de batalla
 */
function toggleBattleSpeed() {
    // Ciclo: 1.5x (Normal) -> 2x -> 2.5x (Rápida) -> 1.5x...
    if (battleSpeed === 1.5) {
        battleSpeed = 2;
    } else if (battleSpeed === 2) {
        battleSpeed = 2.5;
    } else {
        battleSpeed = 1.5;
    }
    
    // Mostrar nombre de velocidad
    const speedName = battleSpeed === 1.5 ? 'Normal' : (battleSpeed === 2 ? '2x' : 'Rápida');
    document.getElementById('btn-speed').textContent = `⏩ ${speedName}`;
    
    // Reiniciar intervalo con nueva velocidad
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = setInterval(() => {
            battleTick();
        }, 100 / battleSpeed);
    }
}

/**
 * Huir de la batalla
 */
function fleeBattle() {
    showModal(
        'Huir de la Batalla',
        '<p>¿Seguro que quieres huir? No obtendrás recompensas.</p>',
        [
            { text: 'Cancelar', action: 'closeModal()' },
            { text: 'Huir', class: 'btn-danger', action: 'confirmFlee()' }
        ]
    );
}

/**
 * Confirma huir de la batalla
 */
function confirmFlee() {
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
    }
    battleState = null;
    closeModal();
    navigateTo('screen-main-menu');
    showToast('Has huido de la batalla', 'info');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Batalla de Héroes - Iniciando...');
    
    // Intentar cargar partida
    const hasGame = loadGame();
    
    // === Importar partida ===
    const importInput = document.getElementById('import-save-input');
    if (importInput) {
        importInput.addEventListener('change', importSaveGame);
    }
    
    if (hasGame && gameState.player.name) {
        // Ir al menú principal
        navigateTo('screen-main-menu');
    } else {
        // Mostrar pantalla de título
        navigateTo('screen-title');
    }
    
    // === Pantalla de Título ===
    document.getElementById('btn-new-game').addEventListener('click', () => {
        navigateTo('screen-create-account');
    });
    
    document.getElementById('btn-load-game').addEventListener('click', () => {
        // Abrir diálogo de selección de archivo
        const input = document.getElementById('import-save-input');
        if (input) {
            input.click();
        } else {
            console.error('Input file no encontrado');
            showToast('Error al abrir selector de archivos', 'error');
        }
    });
    
    // === Pantalla Crear Cuenta ===
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            gameState.player.gender = opt.dataset.gender;
        });
    });
    
    document.getElementById('btn-create-account').addEventListener('click', () => {
        const name = document.getElementById('player-name').value.trim();
        if (!name) {
            showToast('Por favor ingresa un nombre', 'error');
            return;
        }
        
        gameState.player.name = name;
        saveGame();
        showToast(`¡Bienvenido, ${name}!`, 'success');
        navigateTo('screen-main-menu');
    });
    
    // === Navegación genérica ===
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.target);
        });
    });
    
    document.querySelectorAll('.menu-card[data-target]').forEach(card => {
        card.addEventListener('click', () => {
            navigateTo(card.dataset.target);
        });
    });
    
    document.querySelectorAll('.btn-secondary[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.target);
        });
    });
    
    // === Reclutamiento ===
    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.addEventListener('click', () => selectGender(opt.dataset.gender));
    });
    
    document.getElementById('btn-recruit-confirm').addEventListener('click', recruitFighter);
    
    // === Stats ===
    document.querySelectorAll('.btn-stat-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addStatPoint(btn.dataset.stat);
        });
    });
    
    // === Batalla ===
    document.getElementById('btn-start-battle').addEventListener('click', runBattle);
    document.getElementById('btn-speed').addEventListener('click', toggleBattleSpeed);
    document.getElementById('btn-flee').addEventListener('click', fleeBattle);
    
    // === Arena ===
    const btnRefreshOpponents = document.getElementById('btn-refresh-opponents');
    if (btnRefreshOpponents) {
        btnRefreshOpponents.addEventListener('click', () => {
            generateAndStoreOpponents();
            initArenaScreen();
            showToast('Nuevos oponentes encontrados', 'success');
        });
    }
    
    // === Detalle de peleador ===
    document.getElementById('btn-remove-fighter').addEventListener('click', removeFighter);
    document.getElementById('btn-remove-from-team').addEventListener('click', removeCurrentFromTeam);
    
    // === Opciones ===
    document.getElementById('btn-export-save').addEventListener('click', exportSaveGame);
    
    document.getElementById('btn-import-save').addEventListener('click', () => {
        document.getElementById('import-save-input').click();
    });
    
    document.getElementById('btn-reset-game').addEventListener('click', () => {
        showModal(
            'Reiniciar Juego',
            '<p>¿Estás seguro? Se perderá todo tu progreso.</p>',
            [
                { text: 'Cancelar', action: 'closeModal()' },
                { text: 'Reiniciar', class: 'btn-danger', action: 'resetGame()' }
            ]
        );
    });
    
    // === Modal ===
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
    
    console.log('✅ Juego inicializado correctamente');
    
    // Inicializar sistema de tooltips
    setupTooltips();
});

/**
 * Configura el sistema de tooltips
 */
function setupTooltips() {
    // Crear elemento tooltip si no existe
    let tooltip = document.getElementById('game-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'game-tooltip';
        tooltip.className = 'game-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Event delegation para mostrar tooltip
    document.body.addEventListener('mouseover', (e) => {
        const trigger = e.target.closest('.skill-tooltip-trigger');
        if (trigger) {
            const title = trigger.dataset.tooltipTitle;
            const desc = trigger.dataset.tooltipDesc;
            const meta = trigger.dataset.tooltipMeta;
            
            if (title && desc) {
                tooltip.innerHTML = `
                    <h4>${title}</h4>
                    <p>${desc}</p>
                    ${meta ? `<div class="tooltip-meta">${meta}</div>` : ''}
                `;
                tooltip.classList.add('visible');
                
                // Posicionar inicialmente
                positionTooltip(e, tooltip);
            }
        }
    });
    
    // Ocultar tooltip
    document.body.addEventListener('mouseout', (e) => {
        const trigger = e.target.closest('.skill-tooltip-trigger');
        if (trigger) {
            tooltip.classList.remove('visible');
        }
    });
    
    // Mover tooltip con el mouse
    document.body.addEventListener('mousemove', (e) => {
        if (tooltip.classList.contains('visible')) {
            positionTooltip(e, tooltip);
        }
    });
}

/**
 * Posiciona el tooltip cerca del cursor pero sin salirse de la pantalla
 */
function positionTooltip(e, tooltip) {
    const x = e.clientX + 15;
    const y = e.clientY + 15;
    
    // Ajustar si se sale de la pantalla
    const rect = tooltip.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    
    let finalX = x;
    let finalY = y;
    
    if (x + rect.width > winWidth) {
        finalX = e.clientX - rect.width - 10;
    }
    
    if (y + rect.height > winHeight) {
        finalY = e.clientY - rect.height - 10;
    }
    
    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;
}

// Exponer funciones globales necesarias para onclick en HTML
window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.resetGame = resetGame;
window.addToTeam = addToTeam;
window.confirmRemoveFromTeam = confirmRemoveFromTeam;
window.removeCurrentFromTeam = removeCurrentFromTeam;
window.confirmRemoveCurrentFromTeam = confirmRemoveCurrentFromTeam;
window.confirmFlee = confirmFlee;
window.enterStage = enterStage;
window.openZoneStages = openZoneStages;
window.handleVictoryContinue = handleVictoryContinue;
window.handleDefeatReturn = handleDefeatReturn;
window.openEquipModal = openEquipModal;
window.selectFighterForEquip = selectFighterForEquip;
window.doEquipItem = doEquipItem;
window.removeFighter = removeFighter;
window.confirmRemoveFighter = confirmRemoveFighter;
window.startArenaFight = startArenaFight;
window.generateAndStoreOpponents = generateAndStoreOpponents;
window.equipItem = equipItem;
window.confirmEquipItem = confirmEquipItem;
window.unequipItem = unequipItem;
window.confirmImportSave = confirmImportSave;
