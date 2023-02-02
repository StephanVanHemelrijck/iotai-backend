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
    updateStartedState: async function (pool, started, lobby) {
        const updateLobby = await pool.query('UPDATE lobbies SET started = ? WHERE id = ?', [started, lobby.id]);
    },
    updateEndedState: async function (pool, ended, lobby) {
        const updateLobby = await pool.query('UPDATE lobbies SET ended = ? WHERE id = ?', [ended, lobby.id]);
    },
    assignPlayerToLobby: async function (pool, player, lobby) {
        const assignPlayerToLobby = await pool.query('INSERT INTO players_lobbies (players_id,lobbies_id) VALUES (?, ?)', [player[0].id, lobby[0].id]);
    },
    isPlayerInLobby: async function (pool, player, lobby) {
        const isPlayerInLobby = await pool.query('SELECT * FROM players_lobbies WHERE players_id = ? AND lobbies_id = ?', [player[0].id, lobby[0].id]);
        return isPlayerInLobby[0];
    },
    getAllPlayersInLobby: async function (pool, lobby) {
        const allPlayersInLobby = await pool.query('SELECT * FROM players_lobbies INNER JOIN players ON players_id = id WHERE lobbies_id = ?;', [lobby.id]);
        let players = [];
        allPlayersInLobby[0].forEach((player) => {
            const playerObject = {
                players_id: player.players_id,
                lobbies_id: lobby.id,
                name: player.name,
                email: player.email,
                wins: player.wins,
                played_games: player.played_games,
                avatar: player.avatar,
            };
            players.push(playerObject);
        });
        return players;
    },
    startMeeting: async function (pool, lobby) {
        const meeting = await pool.query('UPDATE lobbies SET meeting_is_active = 1 WHERE id = ?', [lobby[0].id]);
    },
    endMeeting: async function (pool, lobby) {
        const meeting = await pool.query('UPDATE lobbies set meeting_is_active = 0 WHERE id = ?', [lobby[0].id]);
    },
};

module.exports = lobbyRepository;
