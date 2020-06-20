const inquirer = require("inquirer");
const figlet = require("figlet");
const mainMenu = require("./util/mainMenu");
const table = require("console.table");
const queries = require("./util/queries");
const prompts = require("./util/prompts");

welcomeMsg = () => {
    console.log(figlet.textSync(`Company\n\n\nDatabase`, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));
}

welcomeMsg();

async function init() {
    try {
        const { action } = await inquirer.prompt(mainMenu);
        switch (action) {
            case "View All Employees":
                return viewData("employees");
            case "View Employees By Department":
                return viewEmployeesByDept();
            case "Add A New Employee":
                return addNewEmployee();
            case "Update An Employee's Info":
                return updateEmployee();
            case "Remove An Employee":
                return removeEmployee();
            case "View All Roles":
                return viewData("roles");
            case "Add A New Role":
                return addNewRole();
            case "Remove A Role":
                return removeRole();
            case "View All Departments":
                return viewData("departments");
            case "Add A New Department":
                return addNewDept();
            case "Remove A Department":
                return removeDept();
            default:
                console.log("Goodbye.");
                return;
        }
    } catch(err) { if (err) throw (err); }
}

async function addNewEmployee() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = await getRoleTitles(roles);

        let employees = await queries.getData("employees");
        let employeeNames = await getEmployeeNames(employees);
        employeeNames.unshift("None");
        let answers = await prompts.addEmployee(roleTitles, employeeNames);
        let { first_name, last_name, role, manager } = answers;
        let matchedManagerID, matchedRoleID;
        if (manager !== "None") {
            manager = manager.toLowerCase().split(" ");
            matchedManagerID = await filterEmployees(employees, manager);
        } else {
            matchedManagerID = null;
        }
        matchedRoleID = await filterRoles(roles, role);
        let result = await queries.addEmployee(first_name, last_name, matchedRoleID, matchedManagerID);
        await console.log(`${first_name} ${last_name} has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function addNewRole() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = await getDeptNames(departments);

        let answers = await prompts.addRole(departmentNames);
        const { title, salary, dept } = answers;

        let matchedDeptID = await filterDept(departments, dept);

        let result = await queries.addRole(title, salary, matchedDeptID);
        await console.log(`The role, ${title}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function addNewDept() {
    try {
        let answers = await prompts.addDepartment();
        const { dept_name } = answers;

        let result = await queries.addDept(dept_name);
        await console.log(`The department, ${dept_name}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeEmployee() {
    try {
        let employees = await queries.getData("employees");
        let employeeNames = await getEmployeeNames(employees);

        let answer = await prompts.removeData("employee", employeeNames);
        let { employee } = answer;
        employee = employee.toLowerCase().split(" ");

        let matchedEmployeeID = await filterEmployees(employees, employee);

        let result = await queries.deleteData("employees", "id", matchedEmployeeID);
        await console.log(`(${result.affectedRows}) employee has been deleted.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeRole() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = getRoleTitles(roles);

        let answer = await prompts.removeData("role", roleTitles);
        let { role } = answer;

        let matchedRoleID = await filterRoles(roles, role);

        let result = await queries.deleteData("roles", "id", matchedRoleID);
        await console.log(`(${result.affectedRows}) role has been deleted.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeDept() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = await getDeptNames(departments);

        let answer = await prompts.removeData("department", departmentNames);
        let { department } = answer;
        let matchedDeptID = await filterDept(departments, department);

        let result = await queries.deleteData("departments", "id", matchedDeptID);
        await console.log(`(${result.affectedRows}) department has been deleted.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function viewData(method) {
    try {
        let result;
        switch (method) {
            case ("employees"):
                result = await queries.viewEmployees();
                break;
            case ("roles"):
                result = await queries.viewRoles();
                break;
            case ("departments"):
                result = await queries.viewDepartments();
                break;
        }
        init();
    } catch (err) { if (err) throw (err) }
}

async function viewEmployeesByDept() {
    try {
        let departments = await queries.getData("departments");
        let departmentNames = await getDeptNames(departments);
        let { department } = await prompts.listDepartments(departmentNames);
        await queries.viewEmployeesByDepartments(department);
        await init();
    } catch (err) { if (err) throw (err) }
}

async function updateEmployee() {
    try {
        let roles = await queries.getData("roles");
        let roleTitles = await getRoleTitles(roles);
        let employees = await queries.getData("employees");
        let employeeNames = await getEmployeeNames(employees);
    
        let answer = await prompts.updateData(roleTitles, employeeNames);
        let { employee, action, manager, role } = answer;
        employee = await employee.split(" ");    
        let matchedEmployeeID = await filterEmployees(employees, employee);

        let result;
        switch (action) {
            case ("Role"):
                let matchedRoleID = await filterRoles(roles, role);
                result = await queries.updateEmployee("employees", "role_id", matchedRoleID, "id", matchedEmployeeID);
                break;
            case ("Manager"):
                manager = await manager.split(" ");
                let newManagerID = await filterEmployees(employees, manager);
                result = await queries.updateEmployee("employees", "manager_id", newManagerID, "id", matchedEmployeeID);
                break;
        }
        await console.log(`(${result.affectedRows}) employee has been updated.\n`);
        init();
    } catch (err) { if (err) throw (err) }
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