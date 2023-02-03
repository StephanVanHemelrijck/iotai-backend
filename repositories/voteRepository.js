const voteRepository = {
    voteInLobby: async function (pool, voter, votedPlayer, lobby) {
        const vote = await pool.query('INSERT INTO votes (voter_id, voted_player_id, lobby_id) VALUES (?,?,?)', [voter[0].id, votedPlayer[0].id, lobby[0].id]);
    },
    getMostVotedPlayerInLobby: async function (pool, lobby) {
        const votes = await pool.query('SELECT COUNT(voter_id) AS amount_votes,voted_player_id, lobby_id FROM votes GROUP BY voted_player_id');
        return votes[0];
    },
    getVoteCount: async function (pool, lobby) {
        const votes = await pool.query('SELECT * FROM votes WHERE lobby_id = ?', [lobby[0].id]);
        return votes[0];
    },
    deleteVotesFromLobby: async function (pool, lobby) {
        console.log(lobby[0]);
        const votes = await pool.query('DELETE FROM votes WHERE lobby_id = ?', [lobby[0].id]);
    },
};

module.exports = voteRepository;
