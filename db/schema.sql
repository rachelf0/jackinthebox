CREATE DATABASE tracker;

USE tracker;

CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    dept_name VARCHAR(30),
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    role_title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
);

