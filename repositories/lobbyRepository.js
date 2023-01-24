const lobbyRepository = {
    getLobbyByInviteCode: async function (pool, code) {
        try {
            console.log(code);
            // const lobby = await pool.query(`SELECT * FROM lobbies WHERE invite_code = "${code}"`);
            const lobby = await pool.query(`SELECT * FROM lobbies WHERE invite_code = ?`, [code]);
            console.log(lobby[0]);
            return lobby[0];
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = lobbyRepository;
