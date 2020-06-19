const inquirer = require("inquirer");
const mainMenu = require("./util/mainMenu");
const table = require("console.table");
const queries = require("./util/queries");
const prompts = require("./util/prompts");

async function init() {
    try {
        const { action } = await inquirer.prompt(mainMenu);
        switch (action) {
            case "View All Employees":
                viewData("employees");
                break;
            case "View Employees By Department":
                viewEmployeesByDept();
                break;
            case "Add A New Employee":
                addNewEmployee();
                break;
            case "Update An Employee's Info":
                updateEmployee();
                break;
            case "Remove An Employee":
                removeEmployee();
                break;
            case "View All Roles":
                viewData("roles");
                break;
            case "Add A New Role":
                addNewRole();
                break;
            case "Remove A Role":
                removeRole();
                break;
            case "View All Departments":
                viewData("departments");
                break;
            case "Add A New Department":
                addNewDept();
                break;
            case "Remove A Department":
                removeDept();
                break;
            default:
                console.log("Goodbye.");
                return;
        }
    } catch(err) { console.log(err); }
}

async function addNewEmployee() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = await getRoleTitles(roles);

        let employees = await queries.getData("employees");
        let employeeNames = await getEmployeeNames(employees);

        let answers = await prompts.addEmployee(roleTitles, employeeNames);
        let { first_name, last_name, role, manager } = answers;

        let chosenRoleID = await filterRoles(roles, role);

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
        let departmentNames = await getDeptNames(departments);

        let answers = await prompts.addRole(departmentNames);
        const { title, salary, dept } = answers;

        let chosenDeptID = await filterDept(departments, dept);

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
        let employeeNames = await getEmployeeNames(employees);

        let answer = await prompts.removeData("employee", employeeNames);
        let { employee } = answer;
        employee = employee.toLowerCase().split(" ");

        let chosenEmployeeID = await filterEmployees(employees, employee);

        let result = await queries.deleteData("employees", "id", chosenEmployeeID);
        await console.log(`${employee[0]} ${employee[1]} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function removeRole() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = getRoleTitles(roles);

        let answer = await prompts.removeData("role", roleTitles);
        let { role } = answer;

        let chosenRoleID = await filterRoles(roles, role);

        let result = await queries.deleteData("roles", "id", chosenRoleID);
        await console.log(`${role} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function removeDept() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = getDeptNames(departments);

        let answer = await prompts.removeData("department", departmentNames);
        let { department } = answer;
        let chosenDeptID = await filterDept(departments, department);

        let result = await queries.deleteData("departments", "id", chosenDeptID);
        await console.log(`${department} has been deleted.\n`);
        await init();

    } catch (err) { console.log(err) }
}

async function viewData(method) {
    try {
        let result;
        switch (method) {
            case ("employees"):
                result = await queries.viewEmployees();
                init();
                break;
            case ("roles"):
                result = await queries.viewRoles();
                init();
                break;
            case ("departments"):
                result = await queries.viewDepartments();
                init();
                break;
        }
    } catch (err) { console.log(err) }
}

async function updateEmployee() {
    // list of role titles
    let roles = await queries.getData("roles");
    let roleTitles = await getRoleTitles(roles);
    // list of employee names
    let employees = await queries.getData("employees");
    let employeeNames = await getEmployeeNames(employees);
    // asks prompts & destructure answers
    let answer = await prompts.updateData(roleTitles, employeeNames);
    let { employee, action, manager, role } = answer;
    // changes employee name to an array [first name, last name]
    employee = await employee.split(" ");
    // looks for an employee id where it matches name
    let chosenEmployeeID = await filterEmployees(employees, employee);

    switch (action) {
        case ("Role"):
            let chosenRoleID = await filterRoles(roles, role);

            let result1 = await queries.updateEmployee("employees", "role_id", chosenRoleID, "id", chosenEmployeeID);
            await console.log(`${employee[0]} ${employee[1]}'s role has been changed to: ${role}.\n`);
            init();
            break;
        case ("Manager"):
            manager = await manager.split(" ");
            let chosenManagerID = await filterEmployees(employees, employee);

            let result2 = await queries.updateEmployee("employees", "manager_id", chosenManagerID, "id", chosenEmployeeID, );
            await console.log(`${employee[0]} ${employee[1]}'s manager has been changed to: ${manager}.\n`);
            init();
            break;
    }
}

filterRoles = (arr, answer) => {
    return arr.filter(item => item.title.toLowerCase() === answer.toLowerCase())[0].id;
}

filterDept = (arr, answer) => {
    return arr.filter(item => item.dept_name === answer)[0].id;
}

filterEmployees = (arr, answer) => {
    return arr.filter(item => item.first_name.toLowerCase() === answer[0].toLowerCase() && item.last_name.toLowerCase() === answer[1].toLowerCase())[0].id;
}

getRoleTitles = arr => { return arr.map(item => item.title) }

getEmployeeNames = arr => { return arr.map(item => `${item.first_name} ${item.last_name}`) }

getDeptNames = arr => { return arr.map(item => item.dept_name) }

init();