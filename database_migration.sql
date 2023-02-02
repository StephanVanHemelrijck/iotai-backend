CREATE DATABASE iotai_db;

USE iotai_db;

CREATE TABLE players (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name CHAR(60),
    password CHAR(60),
    email CHAR(60),
	wins INT,
    played_games INT,
    avatar VARCHAR(60)
);

CREATE TABLE lobbies (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	player_limit INT NOT NULL,
	duration INT NOT NULL,
	invite_code VARCHAR(10),
    player_count INT,
    started BOOLEAN,
    ended BOOLEAN,
    meeting_is_active BOOLEAN
);

CREATE TABLE players_lobbies (
	players_id INT,
	lobbies_id INT
);

CREATE TABLE stats(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	player_id INT,
    lobby_id INT,
    role_id INT,
    isAlive BOOLEAN,
    hasWon BOOLEAN
);

CREATE TABLE roles(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    description VARCHAR(255)
);

CREATE TABLE tasks(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60),
    img VARCHAR(60),
    description VARCHAR(255),
    answer VARCHAR(60),
	positionX VARCHAR(60),
    positionY VARCHAR(60)
);

CREATE TABLE players_tasks(	
	task_id INT,
    player_id INT,
    lobby_id INT,
    isCompleted BOOLEAN
);



INSERT INTO tasks (name, description, img, answer, positionX, positionY)
	VALUES('Minerals','What mineral is this?', 'mineraal.jpg','Azurite','70px','50px');
INSERT INTO tasks (name, description, img, answer, positionX, positionY)
	VALUES('Magnification glass','What group of hominins do you see when looking through these goggles?','vergrootglas.jpg', 'Australopithecus','170px','190px');
INSERT INTO tasks (name, description, img, answer, positionX, positionY)
	VALUES('Mosasaur','The mosasaur is not a dinosaur. To which group of animals are they related?','mosasaurus.jpg','Snakes','60px','155px');
INSERT INTO tasks (name, description, img, answer, positionX, positionY)
	VALUES('Meteorite','Where did this meteorite fall?','meteoriet.jpg','Tintigny','125px','5px');
INSERT INTO tasks (name, description, img, answer, positionX, positionY)
	VALUES('Femur','How much did the dinosaur to which the third femur in the photo belongs weigh in KG?','dijbeen.jpg','563','90px','225px');

INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Stephan', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '5', '12','tree-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Rachelle', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '2', '4','waterlily-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Ryan', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '3', '14','t-rex-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Yoran', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '2', '7','diplodocus-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Lili', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '2', '7','quartz-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Nawfal', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '2', '7','diamond-g');
INSERT INTO players (name, password, email, wins, played_games,avatar)
    VALUES ('Cedric', '$2a$09$zW/1NgezlPvGd8SxxvY7ouCCXQPSoOZnYWE21tVxmt4/gAs1CGyky', 'myemail@outlook.com', '2', '7','baby-g');
    
INSERT INTO lobbies (player_limit, duration, invite_code,player_count,started,ended,meeting_is_active)
	VALUES (15,90,'GNHNTR',6,false,false,false);
    
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (2,1);
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (3,1);
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (4,1);
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (5,1);
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (6,1);
INSERT INTO players_lobbies (players_id,lobbies_id)
	VALUES (7,1);
    
INSERT INTO roles (name, description)
	VALUES ('Scientist', 'Complete your tasks and try to find out who the predators are');
INSERT INTO roles (name, description)
	VALUES ('Predator', "Eliminate the players and don't get caught");