const statRepository = {
    getAllStats: async function (pool) {
        const stats = await pool.query('SELECT * FROM stats');
        return stats[0];
    },
    addPlayersFromLobbyInStats: async function (pool, valueString) {
        await pool.query(`INSERT INTO stats (player_id,lobby_id,role_id) VALUES ${valueString}`);
    },
    getStatFromPlayerByIdInLobby: async function (pool, player_id, lobby_id) {
        const stat = await pool.query('SELECT * FROM stats WHERE player_id = ? AND lobby_id = ?', [player_id, lobby_id]);
        return stat[0];
    },
};

module.exports = statRepository;
