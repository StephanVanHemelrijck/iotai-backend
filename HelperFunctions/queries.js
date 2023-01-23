const query = {
    getPlayerByID: function (connection, id) {
        connection.query('SELECT * FROM players WHERE id = ? LIMIT 1', id, (err, result) => {
            if (err) console.log(err);
            if (result) {
                nextStep(result);
            }
        });
        function nextStep(p) {
            return (player = p[0]);
        }
        return player;
    },
    getLobbyByInviteCode: function (connection, code) {
        connection.query('SELECT * FROM lobbies WHERE invite_code = ?', code, (err, result) => {
            if (err) console.log(err);
            if (result) {
                nextStep(result);
            }
        });
        function nextStep(lobbies) {
            return (lobby = lobbies[0]);
        }
        return lobby;
    },
};

module.exports = query;
