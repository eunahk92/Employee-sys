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
    // console.log("connected as id " + connection.threadId);
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
        }
    } catch(err) { console.log(err); }
}

init();

addNewEmployee = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        console.log(res);
        let currentRoles = res.map((role) => role.title);
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
                choices: currentRoles,
                validate: function(input) {
                    for (let i = 0; i < res.length; i++) {
                        if (input === res[i].title) {
                            console.log(res[i].id);
                        }
                    }
                }
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee`'s manager?",
                choices: ["chester"]
            }
        ]).then((resp => {
            const { first_name, last_name, role } = resp;
            connection.query("INSERT INTO employee (first_name, last_name) VALUES (?)", [first_name, last_name], (err, res) => {
                if (err) throw err;
                console.log(`Successfully added ${first_name}`);
                init();
            });
        }));
    });
}

addNewRole = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        let currentDept = res.map((dept) => `${dept.dept_name}`);
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
                choices: currentDept
            }
        ]).then((resp => {
            const { title, salary, dept } = resp;
            connection.query("INSERT INTO role (title, salary) VALUES (?)", [title, salary], (err, res) => {
                if (err) throw err;
                console.log(`Successfully added ${title} with a salary of ${salary}`);
                init();
            });
        }));
    });
}

addNewDept = () => {
    connection.query("SELECT dept_name FROM department", (err, res) => {
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
            connection.query("INSERT INTO department (dept_name) VALUES (?)", [dept_name], (err, res) => {
                if (err) throw err;
                console.log(`Successfully added ${dept_name} to the list of departments`);
                init();
            });
        }));
    });
}

viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No current departments. Please add a department.")
        } 
        const departments = res.map(dept => [dept.id, dept.dept_name]);
        console.table(['id', 'department'], departments);
    })
}
