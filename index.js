const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Make connection with MySQL database
const DBConnection = require('./HelperFunctions/connection.js');

const server = express();

// Middleware
server.use(cors());
server.use(bodyParser.json());
server.use(express.static(__dirname + '/docs'));

server.get('/', (req, res) => {
    console.log('redirecting');
    res.status(300).redirect('/info.html');
});

server.get('/players', (req, res) => {
    try {
        DBConnection.query('SELECT * FROM players', function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } catch (err) {
        res.send(err);
    }
});

server.post('/player/register', async (req, res) => {
    console.log('Endpoint post player register');
    try {
        // Validation
        if (!req.body.name || !req.body.password || !req.body.email) throw new Error('Missing arguments.');

        // Unique name
        DBConnection.query('SELECT * FROM players WHERE name = ? OR email = ?', [req.body.name, req.body.email], function (err, result) {
            if (err) console.log('Error: ' + err);
            if (result) {
                /*
                To iterate over a RowDataPacket (result is that datatype), you have to parse the RDP into an array of objects
                Found here: https://stackoverflow.com/questions/55292615/how-to-loop-data-in-rowdatapacket
          */
                result = JSON.parse(JSON.stringify(result));
                if (result.length != 0) handleDuplicatePlayer(result);
                else registerPlayer();
            }
        });

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

        function registerPlayer() {
            // Hash password
            const salt = bcrypt.genSaltSync(parseInt(process.env.PW_SALT));
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // Save to DB
            const data = {
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
            };

            DBConnection.query(`INSERT INTO players SET ?`, [data], function (error, results, fields) {
                if (error) throw error;
            });
            // Send success message back
            res.status(200).send('Player created');
        }
    } catch (err) {
        res.send(err);
    }
});

server.post('/player/login', async (req, res) => {});

server.listen(1337, () => {
    console.log(`Listening on port 1337 at http://localhost:1337`);
});
