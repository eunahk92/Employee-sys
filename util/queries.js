const connection = require("./connection");
const util = require("util");

connection.query = util.promisify(connection.query);

module.exports = {
    // Gets employees, roles, or departments table
    getData(tableName) {
        return connection.query("SELECT * FROM ??", [tableName]);
    },
    // getRoles: function() {
    //     return connection.query("SELECT * FROM roles");
    // },
    // getManagers: function(id) {
    //     return connection.query("SELECT * FROM employees WHERE role_id = ?", [id]);
    // },
    // getDepartments: function() {
    //     return connection.query("SELECT * FROM departments");
    // },

    // Adds employees
    addEmployee(firstName, lastName, roleId, managerId) {
        return connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId]);
    },

    // Adds roles
    addRole(title, salary, deptId) {
        return connection.query("INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)", [title, salary, deptId]);
    },

    // Adds departments
    addDept(dept_name) {
        return connection.query("INSERT INTO departments (dept_name) VALUES (?)", [dept_name]);
    },

    // Removes employees, roles, or departments
    deleteData(tableName, colName, colValue) {
        return connection.query("DELETE FROM ?? WHERE ?? = ?", [tableName, colName, colValue]);
    }

}