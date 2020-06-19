const inquirer = require("inquirer");
const mainMenu = require("./util/mainMenu");
const table = require("console.table");
const queries = require("./util/queries");
const prompts = require("./util/prompts");

async function init() {
    try {
        const { action } = await inquirer.prompt(mainMenu);
        switch (action) {
            case "View employees":
                viewEmployees();
                break;
            case "Add an employee":
                addNewEmployee();
                break;
            case "Remove an employee":
                removeEmployee();
                break;
            case "View roles":
                viewRoles();
                break;
            case "Add a role":
                addNewRole();
                break;
            case "Remove a role":
                removeRole();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View employees by department":
                viewEmployeesByDept();
                break;
            case "Add a department":
                addNewDept();
                break;
            case "Remove a department":
                removeDept();
                break;
            case "Quit":
                return console.log("Goodbye.");
                break;
        }
    } catch(err) { console.log(err); }
}

async function addNewEmployee() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = getRoleTitles(roles);

        let employees = await queries.getData("employees");
        let employeeNames = getEmployeeNames(employees);

        let answers = await prompts.addEmployee(roleTitles, employeeNames);
        let { first_name, last_name, role, manager } = answers;

        let chosenRoleID = roles.filter(item => item.title.toLowerCase() === role.toLowerCase())[0].id;
        manager = manager.toLowerCase().split(" ");
        let chosenManagerID = employees.filter(item => item.first_name.toLowerCase() === manager[0] && item.last_name.toLowerCase() === manager[1])[0].id;
        
        let result = await queries.addEmployee(first_name, last_name, chosenRoleID, chosenManagerID);
        await console.log(`${first_name} ${last_name} has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function addNewRole() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = getDeptNames(departments);

        let answers = await prompts.addRole(departmentNames);
        const { title, salary, dept } = answers;

        let chosenDeptID = departments.filter(item => item.dept_name === dept)[0].id;

        let result = await queries.addRole(title, salary, chosenDeptID);
        await console.log(`The role, ${title}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function addNewDept() {
    try {
        let answers = await prompts.addDepartment();
        const { dept_name } = answers;

        let result = await queries.addDept(dept_name);
        await console.log(`The department, ${dept_name}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function removeEmployee() {
    try {
        let employees = await queries.getData("employees");
        let employeeNames = getEmployeeNames(employees);

        let answer = await prompts.removeEmployee(employeeNames);
        let { employee } = answer;
        employee = employee.toLowerCase().split(" ");

        let chosenEmployeeID = employees.filter(item => item.first_name === employee[0] && item.last_name === employee[1])[0].id;

        let result = await queries.deleteData("employees", "id", chosenEmployeeID);
        await console.log(`${employee[0]} ${employee[1]} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function removeRole() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = getRoleTitles(roles);

        let answer = await prompts.removeRole(roleTitles);
        let { role } = answer;

        let chosenRoleID = roles.filter(item => item.title.toLowerCase() === role.toLowerCase())[0].id;

        let result = await queries.deleteData("roles", "id", chosenRoleID);
        await console.log(`${role} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function removeDept() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = getDeptNames(departments);

        let answer = await prompts.removeDept(departmentNames);
        let { department } = answer;
        let chosenDeptID = departments.filter(item => item.dept_name === department)[0].id;

        let result = await queries.deleteData("departments", "id", chosenDeptID);
        await console.log(`${department} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

getRoleTitles = arr => { return arr.map(item => item.title) }

getEmployeeNames = arr => { return arr.map(item => `${item.first_name} ${item.last_name}`) }

getDeptNames = arr => { return arr.map(item => item.dept_name) }

init();