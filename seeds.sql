USE ex_company_db;

INSERT INTO departments (dept_name)
VALUES ("IT");

INSERT INTO departments (dept_name)
VALUES ("HR");

INSERT INTO departments (dept_name)
VALUES ("Marketing");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Software Engineer", 100000, 1);

INSERT INTO roles (title, salary, dept_id)
VALUES ("Payroll Specialist", 70000, 2);

INSERT INTO roles (title, salary, dept_id)
VALUES ("PR", 70000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Chester", "Kim", 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Yoshi", "Nguyen", 1);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Harry", "Potter", 3);
