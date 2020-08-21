INSERT INTO departments (dept_name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Marketing'),
    ('HR');

INSERT INTO roles (role_title, salary, department_id)
VALUES    
    ('Senior Engineer', 125000, 1),
    ('Sales Executive', 60000, 2),
    ('Senior Communications', 68000, 3),
    ('Payroll Director', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Scott', 1, 1),
    ('Pam', 'Beasley', 2, NULL),
    ('Jim', 'Halpert', 3, NULL),
    ('Toby', 'Flenderson', 4, 1);