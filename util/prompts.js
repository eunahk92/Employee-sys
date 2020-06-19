const inquirer = require("inquirer");


module.exports = {
    addEmployee(rolesTitle, employeeNames) {
        return inquirer.prompt([
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
                choices: rolesTitle
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employeeNames
            }
        ])
    },
    addRole(departmentNames) {
        return inquirer.prompt([
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
                choices: departmentNames
            }
        ])
    },
    addDepartment() {
        return inquirer.prompt([
            {
                type: "input",
                name: "dept_name",
                message: "What department would you like to add?"
            }
        ])
    },
    removeEmployee(employeeNames) {
        return inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to remove?",
                choices: employeeNames
            }
        ])
    },
    removeRole(roleTitles) {
        return inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Which role would you like to remove?",
                choices: roleTitles
            }
        ])
    },
    removeDept(departmentNames) {
        return inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department would you like to remove?",
                choices: departmentNames
            }
        ])
    }
}