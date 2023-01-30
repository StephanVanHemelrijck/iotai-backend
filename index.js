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
const statRepository = require('./repositories/statsRepository.js');
const roleRepository = require('./repositories/roleRepository.js');
const taskRepository = require('./repositories/taskRepository.js');

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

/**
 *  End point that returns all players
 *
 * @returns players - list of all players
 */
app.get('/players', async (req, res) => {
    try {
        const results = await playerRepository.getAllPlayers(pool);
        res.status(200).send(results);
    } catch (err) {
        res.send(err);
    }
});

/**
 *  Endpoint that returns a specific player by their ID
 *
 * @params id
 * @returns player
 */
app.get('/player/:id', async (req, res) => {
    try {
        const player = await playerRepository.getPlayerByID(pool, req.params.id);
        res.status(200).send(player);
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that allows you to register a new player
 *
 * @body name - desired nickname, doesn't have to be real name
 * @body email
 * @body password
 * @returns success_message
 */
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
            res.status(200).send({ status: 200, message: 'Player created.' });
        }
    } catch (err) {
        res.send(err);
    }
});

/**
 * Endpoint that updates the player's avatar
 *
 * @body avatar - avatar name without mime type
 * @body player_id - id of player
 * @returns OK
 */
app.put('/player/avatar/update', async (req, res) => {
    try {
        const updateAvatar = await playerRepository.updateAvatar(pool, req.body.avatar, req.body.player_id);
        res.status(200).send('OK');
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that logins the player in.
 *
 * @body name - optional*
 * @body email - optional*
 * @body password
 * @returns player
 *
 * *optional: Only one of the above is required, either name or email, not both.
 *
 */
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
        if (player.length == 0) return res.status(400).send({ status: 400, message: 'Account does not exist.' });
        comparePassword(player);

        function comparePassword(result) {
            if (bcrypt.compareSync(validation.args.get('password'), result[0].password))
                return res.status(200).send({
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                    wins: result[0].wins,
                    played_games: result[0].played_games,
                });
            else return res.status(200).send({ status: 400, message: 'Wrong password.' });
        }
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that returns all lobbies
 *
 * @returns lobbies - list of all lobbies
 */
app.get('/lobbies', async (req, res) => {
    try {
        const lobbies = await lobbyRepository.getAllLobbies(pool);
        res.status(200).send(lobbies);
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that creates a new lobby
 *
 * @returns lobby
 */
app.post('/lobby', async (req, res) => {
    try {
        async function createRandomInviteCode(length) {
            let randomInviteCode = '';
            let duplicateLobby;
            // CHECK FOR DUPLICATE INVITE CODE
            do {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (let i = 0; i < length; i++) {
                    randomInviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                duplicateLobby = await lobbyRepository.getLobbyByInviteCode(pool, randomInviteCode);
            } while (duplicateLobby.length != 0);
            return randomInviteCode;
        }

        const lobby = {
            player_limit: 15,
            duration: 90,
            invite_code: await createRandomInviteCode(6),
        };

        await lobbyRepository.saveLobby(pool, lobby);

        res.status(200).send(lobby);
    } catch (err) {
        console.log(err);
    }
});

/**
 * Endpoint that returns a certain lobby based on their invite code
 *
 * @params code - Lobby's invite code
 */
app.get('/lobby/:code', async (req, res) => {
    try {
        const lobby = await lobbyRepository.getLobbyByInviteCode(pool, req.params.code);
        // Get players in lobby
        const players = await lobbyRepository.getAllPlayersInLobby(pool, lobby[0]);

        lobby[0].players = players;

        res.send(lobby[0]);
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that lets a player join a certain lobby
 *
 * @params code - Lobby's invite code
 * @body player_id
 */
app.post('/lobby/:code/join', async (req, res) => {
    try {
        // Find lobby to join based off invite code
        const lobby = await lobbyRepository.getLobbyByInviteCode(pool, req.params.code);
        if (lobby.length == 0) return res.status(400).send({ status: 400, message: 'Lobby does not exist' });

        // Check if player exists
        const player = await playerRepository.getPlayerByID(pool, req.body.player_id);
        if (player.length == 0) return res.status(400).send({ status: 400, message: 'Player does not exist' });

        // Prevent joining full lobby
        if (lobby[0].player_count == lobby[0].player_limit) return res.status(400).send({ status: 400, message: 'Lobby is full' });

        // Check for double entries
        //      => Player cannot join lobby if they're already in lobby
        const isPlayerInLobby = await lobbyRepository.isPlayerInLobby(pool, player, lobby);
        if (isPlayerInLobby.length != 0) return res.status(400).send({ status: 400, message: `${player[0].name} is already in lobby ${lobby[0].invite_code}` });

        await joinLobby(player, lobby);

        // UPDATE LOBBY PLAYER COUNT
        async function joinLobby(player, lobby) {
            await lobbyRepository.updatePlayerCount(pool, lobby);
            await lobbyRepository.assignPlayerToLobby(pool, player, lobby);
        }

        res.status(200).send({ status: 200, message: `${player[0].name} joined lobby "${lobby[0].invite_code}"` });
    } catch (err) {
        console.log(err);
    }
});

/**
 * Endpoint that starts the lobby
 *
 * @params lobbyID
 *
 */
app.post('/lobby/:lobbyIC/start', async (req, res) => {
    // TODO: prevent lobby from starting more than once

    // Get lobby by id
    const lobby = await lobbyRepository.getLobbyByInviteCode(pool, req.params.lobbyIC);
    if (lobby.length == 0) return res.status(400).send({ status: 400, message: 'Lobby does not exist' });
    const players = await lobbyRepository.getAllPlayersInLobby(pool, lobby[0]);

    // Generate roles 1 predator and 4 scientist per 5 players
    let amountOfPredators = lobby[0].player_count > 5 ? Math.floor(lobby[0].player_count / 5) : 1;
    let assignedPredators = 0;

    const newPlayers = players.map((player) => {
        return {
            players_id: player.players_id,
            lobbies_id: player.lobbies_id,
            role_id: 1,
        };
    });

    do {
        // Random number between rage of 0 and player count
        const number = Math.ceil(Math.random() * (players.length - 1) + 0);
        if (newPlayers[number].role_id == 2) break;
        newPlayers[number].role_id = 2;
        assignedPredators++;
    } while (amountOfPredators != assignedPredators);

    // Prep VALUE string for query
    let values = '';
    newPlayers.forEach((player, index) => {
        values += `(${player.players_id},${player.lobbies_id},${player.role_id})`;
        if (index == players.length - 1) values += ';';
        else values += ',';
    });
    await statRepository.addPlayersFromLobbyInStats(pool, values);

    // Update lobby to start state
    //  => 1 // TRUE
    //  => 0 // FALSE
    lobbyRepository.updateStartedState(pool, 1, lobby[0]);

    res.status(200).send(newPlayers);
});

app.get('/roles', async (req, res) => {
    try {
        const roles = await roleRepository.getAllRoles(pool);
        res.status(200).send(roles);
    } catch (err) {
        console.log(err);
    }
});

app.get('/role/:id', async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).send({ status: 400, message: 'No ID given' });
        const role = await roleRepository.getRoleById(pool, req.params.id);
        if (!role) return res.status(400).send({ status: 400, message: 'Role not found' });
        res.status(200).send(role);
    } catch (err) {
        console.log(err);
    }
});

app.get('/role/:lobbyID/:playerID', async (req, res) => {
    try {
        const playerRole = await statRepository.getStatFromPlayerByIdInLobby(pool, req.params.playerID, req.params.lobbyID);
        const role = await roleRepository.getRoleById(pool, playerRole[0].role_id);
        res.status(200).send(role);
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that  returns all tasks stored in the database
 *
 * @returns tasks
 */
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskRepository.getAllTasks(pool);
        if (tasks.length == 0) return res.status(400).send({ status: 400, message: 'There are currently no tasks stored in the database.' });
        res.status(200).send(tasks);
    } catch (err) {
        console.log(err);
    }
});

/**
 *  Endpoint that returns a certain task based on the id given.
 *
 * @params id - task id
 */
app.get('/task/:id', async (req, res) => {
    try {
        const task = await taskRepository.getTaskById(pool, req.params.id);
        if (task.length == 0) return res.status(400).send({ status: 400, message: `Task with id ${req.params.id} not found.` });
        res.status(200).send(task[0]);
    } catch (err) {
        console.log(res);
    }
});

/**
 *  Endpoint that creates a new task
 *
 * @body name - task name (has to be unique)
 * @body description - task description
 *
 * @returns task - returns created task
 */
app.post('/task', async (req, res) => {
    try {
        // Validation for user input
        const map = new Map();
        map.set('name', req.body.name);
        map.set('description', req.body.description);

        const validation = validator.validateUserInput(map);
        if (validation.status == 400) return res.status(validation.status).send({ status: validation.status, message: validation.message });

        // Check if task with given name already exists
        const duplicateTask = await taskRepository.getTaskByName(pool, req.body.name);
        if (duplicateTask.length != 0) return res.status(400).send({ status: 400, message: `Task with name ${req.body.name} already exists.` });

        // Create task
        const newTask = { name: req.body.name, description: req.body.description };

        // Save task to DB
        const saveTask = await taskRepository.saveTask(pool, newTask);

        res.status(200).send(newTask);
    } catch (err) {
        console.log(err);
    }
});

/**
 * Endpoint that deletes certain task based on given name OR id
 *
 * @body name - Optional*
 * @body id - Optional*
 *
 * @returns message - Says if deletion was successful or not
 *
 * *Optional: One of the parameters is required, or both can be given but name has priority.
 */
app.delete('/task', async (req, res) => {
    try {
        if (!req.body.id && !req.body.name) {
            return res.status(400).send({ status: 400, message: 'Please provide either id or name.' });
        } else if (req.body.name) {
            const task = await taskRepository.getTaskByName(pool, req.body.name);
            if (task.length == 0) return res.status(400).send({ status: 400, message: `Task with name ${req.body.name} doesn't exist` });
            const deletedTask = await taskRepository.deleteTaskByName(pool, req.body.name);
            return res.status(200).send({ status: 200, message: `Task with name ${req.body.name} successfully deleted.` });
        } else if (req.body.id) {
            const task = await taskRepository.getTaskById(pool, req.body.id);
            if (task.length == 0) return res.status(400).send({ status: 400, message: `Task with id ${req.body.id} doesn't exist` });
            const deletedTask = await taskRepository.deleteTaskById(pool, req.body.id);
            return res.status(200).send({ status: 200, message: `Task with id ${req.body.id} successfully deleted.` });
        }
    } catch (err) {
        console.log(err);
    }
});

/**
 * Endpoint that updates a task identified by id
 *
 * @params id
 *
 * Body parameters only required if they are meant to be updated.
 * @body name - name to update to
 * @body description - description u want to update to
 *
 * @returns message - Success message with the updated task
 *
 */
app.put('/task/:id', async (req, res) => {
    try {
        const map = new Map();
        map.set('name', req.body.name);
        map.set('description', req.body.description);
        const validation = validator.validateUserInput(map);

        // Get task by id
        const task = await taskRepository.getTaskById(pool, req.params.id);
        if (task.length == 0) return res.status(400).send({ status: 400, message: `Task with id ${req.params.id} does not exist` });

        // Assign values
        const name = req.body.name == undefined || req.body.name == '' ? task[0].name : req.body.name;
        const description = req.body.description == undefined || req.body.description == '' ? task[0].description : req.body.description;

        // Create updated task
        const updatedTask = { name, description, id: req.params.id };

        await taskRepository.updateTask(pool, updatedTask);

        return res.status(200).send({ status: 200, message: `Task with id ${req.params.id} successfully updated.`, updated_task: updatedTask });
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
