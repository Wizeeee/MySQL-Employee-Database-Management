-- If table exists, drop it for seemless update --
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- create department table --
CREATE TABLE department (
    -- department id, PK, auto-incrementing --
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    -- department name, cannot be null --
    dept_name VARCHAR(30) NOT NULL
);


-- create role table --
CREATE TABLE role (
    -- role id, PK, auto incrementing --
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    -- role titles cannot be null --
    title VARCHAR(30) NOT NULL,
    -- role salaries, cannot be null --
    salary DECIMAL NOT NULL,
    -- department id --
    department_id INTEGER,
    -- FK link department_id to department table PK --
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- create employee table -- 
CREATE TABLE employee (
    -- employee id, PK and auto incrementing -- 
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    -- employee first name, max of 30 variable character, cannot be null --
    first_name VARCHAR(30) NOT NULL,
    -- employee last name, max of 30 variable character, cannot be null --
    last_name VARCHAR(30) NOT NULL,
    -- employee role-ID --
    role_id INTEGER,
    -- employee's manager ID if exists --
    manager_id INTEGER,
    -- -- FK link role_id to role table PK --
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    -- -- FK link manager_id to role table PK --
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

-- removes error 1452 (23000) when reloading seeds
SET FOREIGN_KEY_CHECKS=0;