const roleRepository = {
    getAllRoles: async function (pool) {
        const roles = await pool.query('SELECT * FROM roles');
        return roles[0];
    },
    getRoleById: async function (pool, id) {
        const role = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
        return role[0];
    },
};

module.exports = roleRepository;
