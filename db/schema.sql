DROP DATABASE IF EXISTS ex_company_db;

CREATE DATABASE ex_company_db;

USE ex_company_db;

CREATE TABLE departments (
  id INT UNIQUE AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT UNIQUE AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT(15) NOT NULL,
  dept_id INT(10),
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT UNIQUE AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(5),
  manager_id INT(5),
  PRIMARY KEY (id)
);