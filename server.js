const inquirer = require("inquirer");
const figlet = require("figlet");
const table = require("console.table");
const mainMenu = require("./util/mainMenu");
const queries = require("./util/queries");
const prompts = require("./util/prompts");
const connection = require("./util/connection");

let roles, roleTitles, employees, employeeNames, departments, departmentNames;

welcomeMsg = () => {
    console.log(figlet.textSync(`Company\n\n\nDatabase`, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));
}

async function pullUpdatedData() {
    try {
        roles = await queries.getData("roles");
        roleTitles = await getRoleTitles(roles);

        employees = await queries.getData("employees");
        employeeNames = await getEmployeeNames(employees);

        departments = await queries.getData("departments");
        departmentNames = await getDeptNames(departments);
    } catch (err) { if (err) throw (err) }
}

async function init() {
    try {
        pullUpdatedData();
        const { action } = await inquirer.prompt(mainMenu);
        switch (action) {
            case "View All Employees":
                return viewData("employees");
            case "View Employees By Department":
                return viewEmpData("department");
            case "View Employees By Manager":
                return viewEmpData("manager");
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
                connection.end();
        }
    } catch(err) { if (err) throw (err); }
}

async function addNewEmployee() {
    try {
        roleTitles = removeDuplicates(roleTitles, roleTitles);
        employeeNames.unshift("None");

        let { first_name, last_name, role, manager } = await prompts.addEmployee(roleTitles, employeeNames);

        let matchedManagerID, matchedRoleID;
        if (manager !== "None") {
            manager = manager.split(" ");
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
        roleTitles = removeDuplicates(roleTitles, roleTitles);
        departmentNames = removeDuplicates(departmentNames, departmentNames);

        let { title, salary, dept } = await prompts.addRole(departmentNames, roleTitles);
        let matchedDeptID = await filterDept(departments, dept);

        let result = await queries.addRole(title, salary, matchedDeptID);
        await console.log(`The role, ${title}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function addNewDept() {
    try {
        let { dept_name }  = await prompts.addDepartment();

        let result = await queries.addDept(dept_name);
        await console.log(`The department, ${dept_name}, has been added with an ID of ${result.insertId}.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeEmployee() {
    try {
        let { employee } = await prompts.removeData("employee", employeeNames);
        employee = employee.split(" ");

        let matchedEmployeeID = await filterEmployees(employees, employee);

        let result = await queries.deleteData("employees", "id", matchedEmployeeID);
        await console.log(`(${result.affectedRows}) employee has been deleted.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeRole() {
    try {
        let { role } = await prompts.removeData("role", roleTitles);
        let matchedRoleID = await filterRoles(roles, role);

        let result = await queries.deleteData("roles", "id", matchedRoleID);
        await console.log(`(${result.affectedRows}) role has been deleted.\n`);
        await init();

    } catch (err) { if (err) throw (err) }
}

async function removeDept() {
    try {
        let { department } = await prompts.removeData("department", departmentNames);
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

async function viewEmpData(type) {
    try {
        switch (type) {
            case ("department"):
                let { department } = await prompts.viewData("department", departmentNames);
                await queries.viewEmployeesByDepartments(department);
                break;
            case ("manager"):
                let result = await queries.getManagers();
                if (result.length === 0) {
                    console.log("You have no managers currently.");
                    break;
                }
                let managersArr = result.map(name => name.manager);
                let { manager } = await prompts.viewData("manager", managersArr);
                let newArr = result.filter(item => item.manager === manager);
                newArr = newArr.map(info => ({'emp. id': info.id, name: info.employee, role: info.title}));
                console.table(newArr);
                break;
        }
        init();
    } catch (err) { if (err) throw (err) }
}


async function updateEmployee() {
    try {
        let { employee, action, manager, role } = await prompts.updateData(roleTitles, employeeNames);
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

filterRoles = (arr, answer) => arr.filter(item => item.title === answer)[0].id;
filterDept = (arr, answer) => arr.filter(item => item.dept_name === answer)[0].id;
filterEmployees = (arr, answer) => arr.filter(item => item.first_name === answer[0] && item.last_name === answer[1])[0].id;

getRoleTitles = arr => arr.map(item => item.title);
getEmployeeNames = arr => arr.map(item => `${item.first_name} ${item.last_name}`);
getDeptNames = arr => arr.map(item => item.dept_name);

removeDuplicates = (arr) => {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if(!newArr.includes(arr[i])) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

welcomeMsg();
init();