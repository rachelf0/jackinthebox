const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
    //This is your host in MySQL
    host: "localhost",

    //This is your Port # in MySQL
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "101993Rlf",
    database: "tracker"

});

connection.connect(function(err) {
    if(err) throw err;

    const logoText = logo({ name: "EMPLOYEE TRACKER" }).render()
    console.log(logoText);
    promptUser()
})

// User prompts/questions
const promptUser = () => {
    inquirer.prompt([{
        name: 'choices',
        type: 'list',
        message: 'Please select an option:',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role'
        ]
    }])

    .then((answers) => {
        const {choices} = answers;

        if (choices === 'View All Employees') {
            viewAllEmployees();
        }

        if (choices === 'View All Roles') {
            viewAllRoles();
        }
        
        if (choices === 'View All Departments') {
            viewAllDepartments();
        }

        if (choices === 'View All Employees By Department') {
            viewAllEmployeesByDepartment();
        }

        if (choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }
    });
};

// View All Employees
const viewAllEmployees = () => {
    let sql =       `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.department_name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
            promptUser();
    });
};

// View all Roles
const viewAllRoles = () => {
    const sql =     `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        response.forEach((role) => {console.log(role.title);});
        promptUser();
    });
  };

// View all Departments
const viewAllDepartments = () => {
    const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.table(response);
      promptUser();
    });
};

// View all Employees by Department
const viewAllEmployeesByDepartment = () => {
    const sql =     `SELECT employee.first_name, 
                    employee.last_name, 
                    department.department_name AS department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.table(response);
        promptUser();
      });
  };

  // Add a New Employee
const addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
      }
    ])
      .then(answer => {
      const crit = [answer.fistName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error; 
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                crit.push(role);
                const managerSql =  `SELECT * FROM employee`;
                connection.query(managerSql, (error, data) => {
                  if (error) throw error;
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      crit.push(manager);
                      const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                      connection.query(sql, crit, (error) => {
                      if (error) throw error;
                      console.log("Employee has been added!")
                      viewAllEmployees();
                });
              });
            });
          });
       });
    });
  };

  // Add a New Role
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => {deptNamesArray.push(department.department_name);});
        deptNamesArray.push('Create Department');
        inquirer
          .prompt([
            {
              name: 'departmentName',
              type: 'list',
              message: 'Which department is this new role in?',
              choices: deptNamesArray
            }
          ])
          .then((answer) => {
            if (answer.departmentName === 'Create Department') {
              this.addDepartment();
            } else {
              addRoleResume(answer);
            }
          });
  
        const addRoleResume = (departmentData) => {
          inquirer
            .prompt([
              {
                name: 'newRole',
                type: 'input',
                message: 'What is the name of your new role?'
              },
              {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role?'
              }
            ])
            .then((answer) => {
              let createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
              });
  
              let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              let crit = [createdRole, answer.salary, departmentId];
  
              connection.query(sql, crit, (error) => {
                if (error) throw error;
                console.log(chalk.yellow.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Role successfully created!`));
                console.log(chalk.yellow.bold(`====================================================================================`));
                viewAllRoles();
              });
            });
        };
      });
    };

    // Add a New Department
const addDepartment = () => {
    inquirer
      .prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of your new Department?'
        }
      ])
      .then((answer) => {
        let sql =     `INSERT INTO department (department_name) VALUES (?)`;
        connection.query(sql, answer.newDepartment, (error, response) => {
          if (error) throw error;
          console.log(``);
          console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
          console.log(``);
          viewAllDepartments();
        });
      });
};

// ------------------------------------------------- UPDATE -------------------------------------------------------------------------

// Update an Employee's Role
const updateEmployeeRole = () => {
    let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      let sql =     `SELECT role.id, role.title FROM role`;
      connection.query(sql, (error, response) => {
        if (error) throw error;
        let rolesArray = [];
        response.forEach((role) => {rolesArray.push(role.title);});

        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArray
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;

            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            response.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });

            let sqls =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            connection.query(
              sqls,
              [newTitleId, employeeId],
              (error) => {
                if (error) throw error;
                console.log(chalk.greenBright.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(chalk.greenBright.bold(`====================================================================================`));
                promptUser();
              }
            );
          });
      });
    });
  };