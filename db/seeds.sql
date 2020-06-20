USE ex_company_db;

INSERT INTO departments (dept_name)
VALUES ("IT");

INSERT INTO departments (dept_name)
VALUES ("HR");

INSERT INTO departments (dept_name)
VALUES ("Marketing");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Software Engineer", 90000, 1);

INSERT INTO roles (title, salary, dept_id)
VALUES ("Admin", 50000, 2);

INSERT INTO roles (title, salary, dept_id)
VALUES ("PR", 60000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Chester", "Kim", 2, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Yoshi", "Nguyen", 1, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Harry", "Potter", 3);
