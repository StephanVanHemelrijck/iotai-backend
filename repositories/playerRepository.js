const playerRepository = {
    getAllPlayers: async function (pool) {
        const players = await pool.query('SELECT * FROM players');
        return players[0];
    },
    getPlayerByID: async function (pool, id) {
        const player = await pool.query('SELECT * FROM players WHERE id = ? LIMIT 1', id);
        return player[0];
    },
    getPlayerByNameOrEmail: async function (pool, name, email) {
        const player = await pool.query(`SELECT * FROM players WHERE name = ? OR email = ?`, [name, email]);
        return player[0];
    },
    isPlayerUnique: async function (pool, name, email) {
        const player = await pool.query('SELECT * FROM players WHERE name = ? OR email = ?', [name, email]);
        return player[0];
    },
    savePlayer: async function (pool, player) {
        const savePlayer = await pool.query('INSERT INTO players SET ?', [player]);
    },
};

module.exports = playerRepository;
