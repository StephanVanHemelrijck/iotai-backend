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
        }
        return actualTasks;
    },
};

module.exports = taskRepository;
