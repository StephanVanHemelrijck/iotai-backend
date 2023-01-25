const lobbyRepository = {
    getAllLobbies: async function (pool) {
        const lobbies = await pool.query('SELECT * FROM lobbies');
        return lobbies[0];
    },
    getLobbyByInviteCode: async function (pool, code) {
        try {
            const lobby = await pool.query(`SELECT * FROM lobbies WHERE invite_code = ? LIMIT 1`, [code]);
            return lobby[0];
        } catch (err) {
            console.log(err);
        }
    },
    saveLobby: async function (pool, lobby) {
        const saveLobby = await pool.query(`INSERT INTO lobbies SET ?`, [lobby]);
    },
    updatePlayerCount: async function (pool, lobby) {
        const updateLobby = await pool.query('UPDATE lobbies SET player_count = ? WHERE id = ?', [lobby[0].player_count + 1, lobby[0].id]);
    },
    assignPlayerToLobby: async function (pool, player, lobby) {
        const assignPlayerToLobby = await pool.query('INSERT INTO players_lobbies (players_id,lobbies_id) VALUES (?, ?)', [player[0].id, lobby[0].id]);
    },
    isPlayerInLobby: async function (pool, player, lobby) {
        const isPlayerInLobby = await pool.query('SELECT * FROM players_lobbies WHERE players_id = ? AND lobbies_id = ?', [player[0].id, lobby[0].id]);
        return isPlayerInLobby[0];
    },
};

module.exports = lobbyRepository;
