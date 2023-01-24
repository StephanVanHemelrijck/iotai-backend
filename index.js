const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const http = require('http');

// Make connection with MySQL database
const pool = require('./HelperFunctions/connection.js');
const validator = require('./HelperFunctions/validation.js');

// Repositories
const playerRepository = require('./repositories/playerRepository.js');
const lobbyRepository = require('./repositories/lobbyRepository.js');

// Express APP
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
});

app.get('/players', async (req, res) => {
    try {
        const results = await playerRepository.getAllPlayers(pool);
        res.status(200).send(results);
    } catch (err) {
        res.send(err);
    }
});

app.get('/player/:id', async (req, res) => {
    try {
        const player = await playerRepository.getPlayerByID(pool, req.params.id);
        res.status(200).send(player);
    } catch (err) {
        console.log(err);
    }
});

app.post('/player/register', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        if (!name || !password || !email) throw new Error('Missing arguments.');

        // Check if username or mail are already in use
        const duplicatePlayer = await playerRepository.isPlayerUnique(pool, name, email);
        if (duplicatePlayer.length != 0) {
            handleDuplicatePlayer(duplicatePlayer);
        } else registerPlayer();

        function handleDuplicatePlayer(duplicatePlayer) {
            if (duplicatePlayer[0].name == req.body.name && duplicatePlayer[0].email == req.body.email) {
                res.status(406).send({
                    error: 'This combination of name and email are already in use. Login instead',
                    code: 406,
                });
                return;
            }
            if (duplicatePlayer[0].name == req.body.name) {
                res.status(406).send({
                    error: 'This name already exists, try a new unique name.',
                    code: 406,
                });
                return;
            }
            if (duplicatePlayer[0].email == req.body.email) {
                res.status(406).send({
                    error: 'This email is already in use.',
                    code: 406,
                });
                return;
            }
        }

        async function registerPlayer() {
            // Hash password
            const salt = bcrypt.genSaltSync(parseInt(process.env.PW_SALT));
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // Save to DB
            const newPlayer = {
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
            };
            await playerRepository.savePlayer(pool, newPlayer);
            // Send success message back
            res.status(200).send('Player created');
        }
    } catch (err) {
        res.send(err);
    }
});

app.post('/login', async (req, res) => {
    try {
        // Prep map (Key => Value)
        const map = new Map();
        // Check if EITHER name OR email is given
        if (!req.body.name && !req.body.email) {
            return res.status(400).send({ status: 400, message: 'Fill in either name or email.' });
        } else if (!req.body.name && req.body.email) {
            // Given email
            map.set('email', req.body.email);
        } else if (req.body.name && !req.body.email) {
            // Given name
            map.set('name', req.body.name);
        }
        map.set('password', req.body.password);
        // VALIDATE USER INPUT
        const validation = validator.validateUserInput(map);
        if (validation.status != 200) return res.status(validation.status).send({ status: validation.status, message: validation.message });

        // GET PLAYER BY NAME OR EMAIL

        const player = await playerRepository.getPlayerByNameOrEmail(pool, req.body.name, req.body.email);
        comparePassword(player);

        function comparePassword(result) {
            if (bcrypt.compareSync(validation.args.get('password'), result[0].password))
                return res.status(200).send({ name: result[0].name, email: result[0].email, wins: result[0].wins, played_games: result[0].played_games });
            else return res.status(200).send({ status: 400, message: 'Wrong password.' });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/lobby', async (req, res) => {
    try {
        function createRandomInviteCode(length) {
            let randomInviteCode = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                randomInviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return randomInviteCode;
        }

        const lobby = {
            player_limit: 15,
            duration: 90,
            invite_code: createRandomInviteCode(6),
        };

        pool.query('INSERT INTO lobbies SET ?', lobby, (err) => {
            if (err) console.log(err);
        });

        res.status(200).send(lobby);
    } catch (err) {
        console.log(err);
    }
});

app.get('/lobby/:code', async (req, res) => {
    try {
        const lobby = await lobbyRepository.getLobbyByInviteCode(pool, req.params.code);
        res.send(lobby);
    } catch (err) {
        console.log(err);
    }
});

app.post('/lobby/:code', async (req, res) => {
    try {
        // TODO: ADD SAFETY METHOD SO A PLAYER CANT JOIN SAME LOBBY TWICE

        // Find lobby to join based off invite code
        const lobby = await lobbyRepository.getLobbyByInviteCode(pool, req.params.code);
        console.log(lobby);
        // const lobby_id = lobby.id;
        // if (lobby.player_count == lobby.player_limit) {
        //     return console.log('Lobby is full');
        // }
        // pool.query(`UPDATE lobbies SET player_count = ${lobby.player_count + 1}`);
        // // Find player based of ID
        // const player = playerRepository.getPlayerByID(pool, req.body.player_id);
        // console.log(player);
        // const player_id = player.id;
        // assignPlayerToLobby(player_id, lobby_id);
        // // assign player name to lobby id in seperate table (many to many)
        // function assignPlayerToLobby(p_id, l_id) {
        //     pool.query(`INSERT INTO players_lobbies (players_id, lobbies_id) VALUES (${p_id},${l_id})`, (err) => {
        //         if (err) console.log(err);
        //     });
        // }
        // res.send(`${player.name} joined lobby "${lobby.invite_code}"`);
        res.send('ok');
    } catch (err) {
        console.log(err);
    }
});

// Change string based on deployment environment
// -> local/dev: localhost
// -> Render: 0.0.0.0
server.listen(1337, '0.0.0.0');

server.on('listening', function () {
    console.log(`Listening on port ${server.address().port} at ${server.address().address}`);
});
