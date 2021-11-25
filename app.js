// IMPORT all dependencies --inquirer, console.table and db connection from ./db/connection

const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

// CONNECT to sql database, if error, log error, else run manageEmployees function

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  //call function to start app
  manageEmployees();
});

// Main prompt inquirer

//write function to start app - inquirer "list" of question, then return outcome for each selection
const manageEmployees = () => {
  console.log(`
    
  `);
  inquirer
    .prompt([
      {
        type: "list",
        name: "interface",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View Department Employee Budgets",
        ],
      },
    ])
    .then((choice) => {
      //deconstruct "name:" and save as choice parameter
      const { interface } = choice;

      //view all employees
      if (interface === "View All Employees") {
        return viewAllEmployees();
        //view all departments
      } else if (interface === "View All Departments") {
        return viewAllDepartments();
        //view all roles
      } else if (interface === "View All Roles") {
        return viewAllRoles();
        //view employees by department
      } else if (interface === "View All Employees By Department") {
        return viewAllByDepartment();
        //view employees by manager
      } else if (interface === "View All Employees By Manager") {
        return viewAllByManager();
        //add new Employees
      } else if (interface === "Add Employee") {
        return addNewEmployee();
        //add new departments
      } else if (interface === "Add Department") {
        return addNewDepartment();
        //add new roles
      } else if (interface === "Add Role") {
        return addNewRole();
        //remove existing employees
      } else if (interface === "Remove Employee") {
        return removeEmployee();
        //update employee role
      } else if (interface === "Update Employee Role") {
        return updateEmplRole();
        //update employee manager
      } else if (interface === "Update Employee Manager") {
        return updateEmplManager();
      } else if (interface === "View Department Employee Budgets") {
        return deptEmplBudget();
      }
    })
    //catch errors in returns if exists
    .catch((err) => {
      console.log(err);
    });
};

//                --View All Employees Function (QUERY)--
// -----------------------------------------------------------------------

const viewAllEmployees = () => {
  //save mysql query as sql to use in actual query below
  const sql = `SELECT employee.id AS ID,
                        employee.first_name,
                        employee.last_name,
                        role.title AS Role,
                        department.dept_name AS Department,
                        role.salary AS Salary,
                        CONCAT (manager.first_name, " ",manager.last_name) AS Manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  //databse query (sql query, callback function)
  db.query(sql, (err, res) => {
    //catch errors if any exist
    if (err) {
      console.log(err);
    }
    //construct table in node.js from query
    console.table(res);
    //call initializing function to return to inquirer prompt
    manageEmployees();
  });
};

//                --View All Departments Function (QUERY)--
// -----------------------------------------------------------------------

const viewAllDepartments = () => {
  //save mysql query as sql to use in actual query below
  const sql = `SELECT department.id AS ID,
                      department.dept_name AS Department
               FROM department`;
  //database query (sql query, callback function)
  db.query(sql, (err, res) => {
    //catch errors if any exist
    if (err) {
      console.log(err);
    }
    //construct table in node.js from query
    console.table(res);
    //call initializing function to return to inquirer prompt
    manageEmployees();
  });
};

//                --View All Roles Function (QUERY)--
// -----------------------------------------------------------------------

const viewAllRoles = () => {
  //save mysql query as sql to use in actual query below
  const sql = `SELECT role.id AS ID,
                      role.title AS Role,
                      department.dept_name AS Department,
                      role.salary AS Salary
               FROM role
                      LEFT JOIN Department ON role.department_id = department.id`;
  //database query (sql query, callback function)
  db.query(sql, (err, res) => {
    //catch errors if any exist
    if (err) {
      console.log(err);
    }
    //construct table in node.js from query
    console.table(res);
    //call initializing function to return to inquirer prompt
    manageEmployees();
  });
};

//                --View Employees by Department (QUERY)--
// -----------------------------------------------------------------------

const viewAllByDepartment = () => {
  //mysql query : Select All from department table
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) {
      console.log(err);
    }
    //create new array with key and value for each department
    const chooseDept = res.map(({ id, dept_name }) => ({
      name: dept_name,
      value: id,
    }));

    //prompt user with a list of departments to choose from
    inquirer
      .prompt({
        type: "list",
        name: "department",
        message: "Which department would you like to see?",
        //call chooseDept array for choices
        choices: chooseDept,
      })
      .then((choice) => {
        //deconstruct "name:" and save as choice parameter
        const { department } = choice;
        //save SQL query as sql
        const sql = `SELECT CONCAT(first_name," ",last_name) AS Name
                  FROM employee
                    LEFT JOIN role ON role.id = employee.role_id
                    LEFT JOIN department ON department.id = role.department_id
                    WHERE department_id=?`;

        //mysql query
        db.query(sql, department, (err, res) => {
          if (err) {
            console.log(err);
          }
          //construct table in node.js from query
          console.table(res);
          //call initializing function to return to inquirer prompt
          manageEmployees();
        });
      });
  });
};

//                --View Employees by Manager (QUERY)--
// -----------------------------------------------------------------------

const viewAllByManager = () => {
  //save sql query - SELECT all from employee where manager ID = 36 OR NULL (see db/seeds - will make sense)
  const sql = `SELECT * FROM employee WHERE manager_id > 38 OR manager_id is NULL`;

  //database query
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    //create new array with key and value for each manager
    const chooseManager = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    //prompt user with list of managers to choose from
    inquirer
      .prompt({
        type: "list",
        name: "managerList",
        message: "Which manager's team would you like to see?",
        choices: chooseManager,
      })
      .then((choice) => {
        //deconstruct "name:" and save as choice parameter
        const { managerList } = choice;
        //save sql query to be used : concat first and last name of employee where manager id=?
        const sql = `SELECT CONCAT(first_name," ",last_name) AS Name FROM employee WHERE manager_id=?`;
        db.query(sql, managerList, (err, res) => {
          if (err) {
            console.log(err);
          }
          //construct table in node.js from query
          console.table(res);
          //call initializing function to return to inquirer prompt
          manageEmployees();
        });
      });
  });
};

//                   --Add New Employee Function (QUERY)--
// -----------------------------------------------------------------------
const addNewEmployee = () => {
  //prompt user with question to generate new employee in database
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter the new employee's first name.",
        //validate - a value must be entered
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("The employee's first name must be entered!");
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "Please enter the new employee's last name.",
        //validate - a value must be entered
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("The employee's last name must be entered!");
          }
        },
      },
    ])
    .then((names) => {
      //deconstruct "name:" and save as choice parameter
      const newEmplArray = [names.first_name, names.last_name];
      //query to select role id and title from role table
      const sql = `SELECT role.id, role.title FROM role`;
      //databse query
      db.query(sql, (err, res) => {
        if (err) {
          console.log(err);
        }
        //create new array with key and value for role to choose from
        const chooseRole = res.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        //prompt user with list of roles available in database
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "Select a role ",
              //choices : chooseRole array
              choices: chooseRole,
            },
          ])

          .then((choice) => {
            //save choice.role as empRole
            const role = choice.role;
            //push role to employee array
            newEmplArray.push(role);
            //save sql query - choose list of managers
            const sql = `SELECT * FROM employee WHERE manager_id > 38 OR manager_id is NULL`;
            //sql query
            db.query(sql, (err, res) => {
              if (err) {
                console.log(err);
              }
              //create new array with key and value for role to choose from
              const chooseManager = res.map(
                ({ id, first_name, last_name }) => ({
                  name: first_name + " " + last_name,
                  value: id,
                })
              );

              //prompt user with a list of managers to choose from if new Employee has a manager

              inquirer
                .prompt([
                  {
                    //does new employee have a manager?
                    type: "confirm",
                    name: "addManager",
                    message: "Does the new Employee have a manager?",
                    default: false,
                  },
                  {
                    type: "list",
                    name: "managers",
                    message: "Please select from this list of managers",
                    choices: chooseManager,
                    //only prompted when 1st prompt is true
                    when: function (managers) {
                      return managers.addManager === true;
                    },
                  },
                ])
                .then((choice) => {
                  //declare empty variable to use in if statement
                  let chosenManager;
                  if (choice.manager) {
                    //let chosenManager = choice
                    chosenManager = choice.manager;
                  } else {
                    //let chosen manager = null
                    chosenManager = null;
                  }
                  //push chosenManager to Employee Array
                  newEmplArray.push(chosenManager);
                  //sql variable to use in db.query - INSERT INTO employee(.....)
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                  Values (?, ?, ?, ?)`;
                  //database query - use newEmplArray as paramater to INSERT employee into db
                  db.query(sql, newEmplArray, (err, res) => {
                    if (err) {
                      console.log(err);
                    }
                    //If successfull, print success message for user
                    console.log("Employee successfully added to roster!");
                    //call initializing function to return to main inquirer prompt
                    manageEmployees();
                  });
                });
            });
          });
      });
    });
};

//                --Add New Department Function (QUERY)--
// -----------------------------------------------------------------------

const addNewDepartment = () => {
  //prompt user to enter a new Department name
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter new Department",
        //department name must be entered
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("A department name is required!");
          }
        },
      },
    ])
    .then((choice) => {
      //save info as array to be used as param in query
      const deptInfo = [choice.department];
      //sql - INSERT INTO department - params = ?
      const sql = `INSERT INTO department (dept_name) Values (?)`;
      db.query(sql, deptInfo, (err, res) => {
        if (err) {
          console.log(err);
        }
        //If successfull, print success message for user
        console.log("The new department was successfully added!");
        //call initializing function to return to main inquirer prompt
        manageEmployees();
      });
    });
};

//                  --Add New Role Function (QUERY)--
// -----------------------------------------------------------------------

const addNewRole = () => {
  //sql select department Id and name
  const sql = `SELECT department.id, 
                      department.dept_name 
                FROM department`;
  //db query with sql from above
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    //create new array with key and value for role to choose from
    const chooseDept = res.map(({ id, dept_name }) => ({
      name: dept_name,
      value: id,
    }));

    //prompt user to select a department to update role in
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "The role belongs to which department?",
          choices: chooseDept,
        },
        {
          type: "input",
          name: "role",
          message: "What is the new role called?",
          //input is required
          validate: (role) => {
            if (role) {
              return true;
            } else {
              console.log("A role name is required!");
            }
          },
        },
        {
          type: "number",
          name: "salary",
          message: "Enter the new role's salary",
          //input is required
          validate: (salary) => {
            if (salary) {
              return true;
            } else {
              console.log("You must enter a salary ($/year) for the new role!");
            }
          },
        },
      ])
      .then((answer) => {
        //save role info as array to use as param in sql INSERT
        const roleInfo = [answer.department, answer.role, answer.salary];
        //sql insert into role (.......)
        const sql = `INSERT INTO role (department_id, title, salary) 
        Values (?, ?, ?)`;
        //database query , use sql query and roleInfo as params
        db.query(sql, roleInfo, (err, res) => {
          if (err) {
            console.log(err);
          }
          //If successfull, print success message for user
          console.log("Role successfully added!");
          //call initializing function to return to main inquirer prompt
          manageEmployees();
        });
      });
  });
};
//                --Remove Employee Function (QUERY)--
// -----------------------------------------------------------------------

const removeEmployee = () => {
  //database query using sql to select all employee
  db.query(`SELECT * FROM employee`, (err, res) => {
    if (err) {
      console.log(err);
    }
    //create new array with key and value for role to choose from
    const chooseEmployee = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    //prompt user with list of employee to choose from
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: chooseEmployee,
        },
      ])
      .then((choice) => {
        const { employee } = choice;
        const sql = `DELETE FROM employee WHERE id = ?`;
        db.query(sql, employee, (err, res) => {
          console.log(err);
        });
        //If successfull, print success message for user
        console.log(`Employee was deleted from the database!`);
        //call initializing function to return to main prompt
        manageEmployees();
      });
  });
};

//              --Update Employee Role Function (QUERY)--
// -----------------------------------------------------------------------

const updateEmplRole = () => {
  //db query with SQL to select all employees
  db.query(`SELECT * FROM employee`, (err, res) => {
    if (err) {
      console.log(err);
    }
    //create new array with key and value for role to choose from
    const chooseEmployee = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    //prompt user to with list of all employees
    inquirer
      //select which employee
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: chooseEmployee,
        },
      ])
      .then((choice) => {
        //save into insertion array
        const emplInfo = [choice.employee];
        //db query to select all roles
        db.query(`SELECT * FROM role`, (err, res) => {
          if (err) {
            console.log(err);
          }
          //create new array with key and value for role to choose from
          const chooseRole = res.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          //prompt user with list of roles to choose from
          inquirer
            .prompt({
              type: "list",
              name: "role",
              message: "Select the employee's new role",
              choices: chooseRole,
            })
            .then((choice) => {
              //add role to start of emplInfo array to keep correct order
              emplInfo.unshift(choice.role);
              //update the employee's role
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              // db query using sql variable and new employee info
              db.query(sql, emplInfo, (err, res) => {
                if (err) {
                  console.log(err);
                }
                //If successfull, print success message for user
                console.log("The employee's role was successfully updated!");
                //call initializing function to return to main prompt
                manageEmployees();
              });
            });
        });
      });
  });
};
