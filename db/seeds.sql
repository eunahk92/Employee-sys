USE ex_company_db;

INSERT INTO departments (dept_name)
VALUES 
    ("Sales"),
    ("Human Resources"),
    ("Marketing"),
    ("IT");

INSERT INTO roles (title, salary, dept_id)
VALUES 
	("Event Sales", 80500, 1),
	("Event Coordinator", 66000, 1),
	("Admin", 60000, 2),
	("Payroll Specialist", 71000, 2),
	("Public Relations", 86000, 3),
	("Graphic Designer", 87500, 3),
	("Software Developer", 115000, 4),
	("Full Stack Developer", 105000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
	("Chester", "Kim", 1, 5),
	("Yoshi", "Nguyen", 2, 6),
	("Patrick", "Star", 3, 7),
	("Harry", "Potter", 4, 8);
    
INSERT INTO employees (first_name, last_name, role_id)
VALUES
	("Peter", "Pan", 1),
	("Spongebob", "Squarepants", 2),
	("Heromine", "Granger", 3),
	("Cardi", "B", 4);