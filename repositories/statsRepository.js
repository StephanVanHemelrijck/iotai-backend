const statRepository = {
    getAllStats: async function (pool) {
        const stats = await pool.query('SELECT * FROM stats');
        return stats[0];
    },
    addPlayersFromLobbyInStats: async function (pool, valueString) {
        await pool.query(`INSERT INTO stats (player_id,lobby_id,role_id,isAlive) VALUES ${valueString}`);
    },
    getStatFromPlayerByIdInLobby: async function (pool, player_id, lobby_id) {
        const stat = await pool.query('SELECT * FROM stats WHERE player_id = ? AND lobby_id = ?', [player_id, lobby_id]);
        return stat[0];
    },
    getPredatorsInLobby: async function (pool, lobby) {
        const predators = await pool.query('SELECT * FROM stats WHERE lobby_id = ? AND role_id = 2', [lobby.id]);
        return predators;
    },
    getScientistsInLobby: async function (pool, lobby) {
        const scientists = await pool.query('SELECT * FROM stats WHERE lobby_id = ? AND role_id = 1', [lobby.id]);
        return scientists;
    },
    getAlivePredatorsInLobby: async function (pool, lobby) {
        const predators = await pool.query('SELECT * FROM stats WHERE lobby_id = ? AND role_id = 2 AND isAlive = 1', [lobby.id]);
        return predators;
    },
    getAliveScientistsInLobby: async function (pool, lobby) {
        const scientists = await pool.query('SELECT * FROM stats WHERE lobby_id = ? AND role_id = 1 AND isAlive = 1', [lobby.id]);
        return scientists;
    },
    updateIsPlayerAlive: async function (pool, player_id, lobby_id, isAlive) {
        const updatePlayer = await pool.query('UPDATE stats SET isAlive = ? WHERE player_id = ? AND lobby_id = ?', [isAlive, player_id, lobby_id]);
    },
};

module.exports = statRepository;
