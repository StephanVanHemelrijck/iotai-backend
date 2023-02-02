const taskRepository = {
    getAllTasks: async function (pool) {
        const allTasks = await pool.query('SELECT * FROM tasks');
        return allTasks[0];
    },
    saveTask: async function (pool, task) {
        const newTask = await pool.query('INSERT INTO tasks (name, description) VALUES (?, ?)', [task.name, task.description]);
        return newTask[0];
    },
    updateTask: async function (pool, task) {
        const updatedTask = await pool.query('UPDATE tasks SET name = ?, description = ? WHERE id = ?', [task.name, task.description, task.id]);
        return updatedTask[0];
    },
    deleteTaskByName: async function (pool, task_name) {
        const deletedTask = await pool.query('DELETE FROM tasks WHERE name = ?', [task_name]);
        return deletedTask[0];
    },
    deleteTaskById: async function (pool, task_id) {
        const deletedTask = await pool.query('DELETE FROM tasks WHERE id = ?', [task_id]);
        return deletedTask[0];
    },
    getTaskById: async function (pool, task_id) {
        const task = await pool.query('SELECT * FROM tasks WHERE id = ?', [task_id]);
        return task[0];
    },
    getTaskByName: async function (pool, task_name) {
        const task = await pool.query('SELECT * FROM tasks WHERE name = ?', [task_name]);
        return task[0];
    },
    assignTasksToPlayer: async function (pool, player_id, lobby_id, tasks) {
        let actualTasks = [];
        for (i = 0; i < tasks.length; i++) {
            const actualTask = await this.getTaskById(pool, tasks[i] + 1);
            actualTasks.push(actualTask[0]);
            // Assign in DB
            const assignToPlayer = await pool.query('INSERT INTO players_tasks (task_id,player_id,lobby_id,isCompleted) VALUES (?,?,?,0)', [
                tasks[i] + 1,
                player_id,
                lobby_id,
            ]);
        }
        return actualTasks;
    },
    getUnfinishedTasksForPlayer: async function (pool, player, lobby) {
        let actualTasks = [];
        const tasks = await pool.query('SELECT * FROM players_tasks WHERE player_id = ? AND lobby_id = ? AND isCompleted = 0', [player[0].id, lobby[0].id]);
        for (let i = 0; i < tasks[0].length; i++) {
            const actualTask = await this.getTaskById(pool, tasks[0][i].task_id);
            actualTasks.push(actualTask[0]);
        }
        return actualTasks;
    },
    completeTask: async function (pool, task, player, lobby) {
        const completedTask = await pool.query('UPDATE players_tasks SET isCompleted = ? WHERE task_id = ? AND player_id = ? AND lobby_id = ?', [
            1,
            task.id,
            player.id,
            lobby.id,
        ]);
        return completedTask;
    },
    taskBelongsToPlayer: async function (pool, player, task, lobby) {
        const taskOfPlayer = await pool.query('SELECT * FROM players_tasks WHERE player_id = ? AND task_id = ? AND lobby_id = ?', [
            player.id,
            task.id,
            lobby.id,
        ]);
        if (taskOfPlayer.length != 0) return true;
        return false;
    },
    getAllTasksForPlayerById: async function (pool, player, lobby) {
        const tasks = await pool.query('SELECT * FROM players_tasks WHERE player_id = ? AND lobby_id = ?', [player[0].id, lobby[0].id]);
        const actualTasks = [];
        console.log(tasks[0]);
        for (let i = 0; i < tasks[0].length; i++) {
            const actualTask = await this.getTaskById(pool, tasks[0][i].task_id);
            actualTasks.push(actualTask[0]);
        }
        return actualTasks;
    },
    getAllCompletedTasksInLobby: async function (pool, lobby) {
        const tasks = await pool.query('SELECT * FROM players_tasks WHERE lobby_id = ? AND isCompleted = 1 ', [lobby[0].id]);
        return tasks[0];
    },
    getAllUnfinishedTasksInLobby: async function (pool, lobby) {
        const tasks = await pool.query('SELECT * FROM players_tasks WHERE lobby_id = ? AND isCompleted = 0 ', [lobby[0].id]);
        return tasks[0];
    },
    getAllTasksInLobby: async function (pool, lobby) {
        const tasks = await pool.query('SELECT * FROM players_tasks WHERE lobby_id = ? ', [lobby[0].id]);
        return tasks[0];
    },
};

module.exports = taskRepository;
