const inquirer = require("inquirer");

module.exports = {
    addEmployee(rolesTitle, employeeNames) {
        return inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
                filter: changeCapitalization
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
                filter: changeCapitalization
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
                message: "What is the role?",
                filter: changeCapitalization
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
                message: "What department would you like to add?",
                filter: changeCapitalization
            }
        ])
    },
    removeData(type, list) {
        return inquirer.prompt([
            {
                type: "list",
                name: `${type}`,
                message: `Which ${type} would you like to remove?`,
                choices: list,
                suffix: `\nWARNING: This will also remove all associated roles and employees`
            }
        ])
    },
    viewData(type, list) {
        return inquirer.prompt([
            {
                type: "list",
                name: `${type}`,
                message: `Which ${type} would you like to see?`,
                choices: list,
            }
        ])
    },
    updateData(list, employeeList) {
        return inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employeeList
            },
            {
                type: "list",
                name: "action",
                message: `What would you like to update for the employee?`,
                choices: ["Role", "Manager"]
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: list,
                when: input => input.action === "Role"
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's new manager?",
                choices: employeeList,
                when: input => input.action === "Manager"
            }
        ])
    }
}
changeCapitalization = (input) => {
    return input.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}