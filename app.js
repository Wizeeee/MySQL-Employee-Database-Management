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
