const connection = require("./connection");
const util = require("util");

connection.query = util.promisify(connection.query);

module.exports = {
    getData(table) {
        return connection.query("SELECT * FROM ??", [table]);
    },
    deleteData(table, colName, colValue) {
        return connection.query("DELETE FROM ?? WHERE ?? = ?", [table, colName, colValue]);
    },
    addEmployee(firstName, lastName, roleId, managerId) {
        return connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId]);
    },
    updateEmployee(table, colOne, valOne, colTwo, valTwo) {
        return connection.query("UPDATE ?? SET ?? = ? WHERE ?? = ?", [table, colOne, valOne, colTwo, valTwo]);
    },
    addRole(title, salary, deptId) {
        return connection.query("INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)", [title, salary, deptId]);
    },
    addDept(dept_name) {
        return connection.query("INSERT INTO departments (dept_name) VALUES (?)", [dept_name]);
    },
    viewEmployees() {
        let query = "SELECT e.id AS id, e.first_name AS 'first name', e.last_name AS 'last name', ";
        query += "r.title AS role, d.dept_name AS department, r.salary AS salary ";
        query += "FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id ";
        query += "LEFT JOIN departments AS d ON d.id = r.dept_id ";
        query += "ORDER BY e.id ASC";
        return connection.query(query).then(res => {
            if (res.length === 0) {
                console.log("No current employees. Please add an employee.");
            }
            console.table(res);
        })
    },
    viewRoles() {
        let query = "SELECT r.id AS id, r.title AS title, d.dept_name AS department, r.salary AS salary "
        query += "FROM roles AS r LEFT JOIN departments AS d ON r.dept_id = d.id ";
        query += "ORDER BY r.id ASC";
        return connection.query(query).then(res => {
            if (res.length === 0) {
                console.log("No current roles. Please add a role.");
            }
            console.table(res);
        })
    },
    viewDepartments() {
        let query = "SELECT d.id AS id, d.dept_name AS department "
        // query += ", r.salary AS 'utilized budget' ";
        query += "FROM departments AS d LEFT JOIN roles AS r ON d.id = r.dept_id";
        return connection.query(query).then(res => {
            if (res.length === 0) {
                console.log("No current departments. Please add a department.");
            }
            console.table(res);
        })
    }
}