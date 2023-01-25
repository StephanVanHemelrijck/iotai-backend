const statRepository = {
    getAllStats: async function (pool) {
        const stats = await pool.query('SELECT * FROM stats');
        return stats[0];
    },
    addPlayersFromLobbyInStats: async function (pool, valueString) {
        await pool.query(`INSERT INTO stats (player_id,lobby_id,role_id) VALUES ${valueString}`);
    },
};

module.exports = statRepository;
