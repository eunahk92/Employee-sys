const inquirer = require("inquirer");
const mysql = require("mysql");
const dotenv = require("dotenv");
const mainMenu = require("./public/mainMenu");
const table = require("console.table");

dotenv.config();
const { DB_HOST, PORT, DB_USER, DB_PASSWORD } = process.env;

const connection = mysql.createConnection({
    host: DB_HOST,
    port: PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "ex_company_db"
});
  
connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    init();
});

async function init() {
    try {
        const { action } = await inquirer.prompt(mainMenu);
        switch (action) {
            case "Add an employee":
                addNewEmployee();
                break;
            case "Add a role":
                addNewRole();
                break;
            case "Add a department":
                addNewDept();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View employees by department":
                viewEmployeesByDept();
                break;
            case "Quit":
                return console.log("Goodbye.");
        }
    } catch(err) { console.log(err); }
}

addNewEmployee = () => {
    let query = "SELECT * FROM roles AS r INNER JOIN employees AS e ON r.id = e.role_id";
    connection.query(query, (err, res) => {
        let currentRoles = res.map((role) => role.title);
        console.log(currentRoles);
        const currentEmployees = res.map((employee) => `${employee.first_name} ${employee.last_name}`);
        console.log(currentEmployees);
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: currentRoles
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: ["chester"]
            }
        ]).then((answer => {
            const roleID = res
                .filter(role => role.title === answer.role)
                .map(role => role.id);
            const role_id = roleID[0];
            console.log(role_id);
            // console.log(answer.manager);
            const { first_name, last_name } = answer;
            connection.query("INSERT INTO employees SET ?", {first_name, last_name, role_id}, (err, res) => {
                if (err) throw err;
                console.log(`Successfully added ${first_name} ${last_name} to the database`);
                init();
            });
        }));
    });
}

addNewRole = () => {
    connection.query("SELECT * FROM departments", (err, res) => {
        const currentDepartments = res.map((dept) => `${dept.dept_name}`);
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the role?"
            },
            {
                type: "input",
                name: "salary",
                message: "How much is the salary for the role?"
            },
            {
                type: "list",
                name: "dept",
                message: "What department is that role in?",
                choices: currentDepartments
            }
        ]).then((answer => {
            const deptID = res
                .filter(department => department.dept_name === answer.dept)
                .map(department => department.id);
            const dept_id = deptID[0];
            const { title, salary } = answer;
            connection.query("INSERT INTO roles SET ?", {title, salary, dept_id}, (err, data) => {
                    if (err) throw err;
                    console.log(`Successfully added ${title} role to the database`);
                    init();
                });
        }));
    });
}

addNewDept = () => {
    connection.query("SELECT dept_name FROM departments", (err, res) => {
        let currentDept = res.map((dept) => dept.dept_name);
        if (err) throw err;
        inquirer.prompt([{
            type: "input",
            name: "dept_name",
            message: "What department would you like to add?"
        }]).then((resp => {
            const { dept_name } = resp;
            for (let i = 0; i < currentDept.length; i++) {
                if (dept_name === currentDept[i]) {
                    console.log("Department already exists.");
                    return init();
                }
            }
            connection.query("INSERT INTO departments (dept_name) VALUES (?)", [dept_name], (err, res) => {
                if (err) throw err;
                console.log(`Successfully added ${dept_name} to the database`);
                init();
            });
        }));
    });
};

viewEmployeesByDept = () => {
    connection.query("SELECT dept_name FROM departments", (err, res) => {
        let currentDept = res.map((dept) => dept.dept_name);
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "department",
            message: "Which department would you like to view?",
            choices: currentDept
        }]).then((resp => {
            const { department } = resp;
            let query = "SELECT e.id AS id, e.first_name AS 'first name', e.last_name AS 'last name', r.title AS role, r.salary AS salary, e.manager_id AS manager " 
            query += "FROM employees AS e INNER JOIN roles AS r ON r.id = e.role_id "
            query += "INNER JOIN departments AS d ON r.dept_id = d.id "
            query += "WHERE dept_name = ?"
            connection.query(query, [department], (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            });
        }));
    });
};

viewDepartments = () => {
    let query = "SELECT d.id AS id, d.dept_name AS department "
    // query += ", r.salary AS 'utilized budget' ";
    query += "FROM departments AS d INNER JOIN roles AS r ON d.id = r.dept_id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No current departments. Please add a department.")
        } 
        console.table(res);
        init();
    })
}

viewEmployees = () => {
    let query = "SELECT e.id AS id, e.first_name AS 'first name', e.last_name AS 'last name', ";
    query += "r.title AS role, d.dept_name AS department, r.salary AS salary, CONCAT(e.first_name, ' ', e.last_name) AS manager ";
    query += "FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id ";
    query += "LEFT JOIN departments AS d ON r.dept_id = d.id ";
    query += "ORDER BY e.id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No current employees. Please add an employee.");
        }
        console.table(res);
        init();
    })
}

viewRoles = () => {
    let query = "SELECT r.id AS id, r.title AS title, d.dept_name AS department, r.salary AS salary "
    query += "FROM roles AS r INNER JOIN departments AS d ON r.dept_id = d.id ";
    query += "ORDER BY r.id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No current employees. Please add an employee.");
        }
        console.table(res);
        init();
    })
}

