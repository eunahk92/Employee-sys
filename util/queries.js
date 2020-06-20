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
    getManagers() {
        let query = "SELECT m.id AS 'manager id', CONCAT(m.first_name, ' ', m.last_name) AS manager, "
        query += "e.id AS 'id', CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title ";
        query += "FROM employees e INNER JOIN employees m ON m.id = e.manager_id "
        query += "LEFT JOIN roles AS r ON e.role_id = r.id ORDER BY e.id ASC"
        return connection.query(query);
    },
    viewEmployees() {
        let query = "SELECT e.id AS 'emp. id', e.first_name AS 'first name', e.last_name AS 'last name', ";
        query += "r.title AS role, d.dept_name AS department, ";
        query += "CONCAT(m.first_name, ' ', m.last_name) AS manager, r.salary AS salary ";
        query += "FROM employees AS e LEFT JOIN employees m ON m.id = e.manager_id " 
        query += "LEFT JOIN roles AS r ON e.role_id = r.id ";
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
        query += "FROM roles AS r LEFT JOIN departments AS d ON r.dept_id = d.id";
        return connection.query(query).then(res => {
            if (res.length === 0) {
                console.log("No current roles. Please add a role.");
            }
            console.table(res);
        })
    },
    viewDepartments() {
        let query = "SELECT d.id AS id, d.dept_name AS department FROM departments as d";
        return connection.query(query).then(res => {
            if (res.length === 0) {
                console.log("No current departments. Please add a department.");
            }
            console.table(res);
        })
    },
    viewEmployeesByDepartments(department) {
        let query = "SELECT e.id AS 'emp. id', e.first_name AS 'first name', e.last_name AS 'last name', r.title AS role, ";
        query += "CONCAT(m.first_name, ' ', m.last_name) AS manager, r.salary AS salary ";
        query += "FROM employees AS e LEFT JOIN employees m ON m.id = e.manager_id " 
        query += "LEFT JOIN roles AS r ON r.id = e.role_id ";
        query += "LEFT JOIN departments AS d ON r.dept_id = d.id ";
        query += "WHERE dept_name = ?"
        return connection.query(query, [department]).then(res => {
            if (res.length === 0) {
                console.log("No current employees in the department. Please add an employee.");
            }
            console.table(res);
        })
    }
}