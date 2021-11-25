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
