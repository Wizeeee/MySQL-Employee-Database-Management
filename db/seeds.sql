INSERT INTO department (dept_name)
VALUES
("Front Line CSR"),
("AIT CSR Tech"),
("Tech cancel"),
("Assist Support"),
("Managers"),
("VP's");

INSERT INTO role (title, salary, department_id)
VALUES

("Customer service", 37000, 1),
("Service Rep Tech", 39000, 1),
("Snr service Rep", 41000, 2),
("Agent Tech", 43000, 2),
("Snr Agent Tech", 45000, 3),
("Service Rep Tech2", 48000, 3),
("RA", 55000, 4),
("Snr RA", 56500, 4),
("Manager", 70000, 5),
("Snr Manager", 80000, 5),
("VP", 100000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Joe", "Bi", 1, 35),
("Alen", "Key", 1, 35),
("Alicia", "Keys", 1, 35),
("Alisha", "Nancy", 1, 35),
("Alin", "Sam", 1, 35),
("Jack", "Me", 1, 35),
("Cames", "Car", 2, 35),
("Motor", "elle", 2, 35),
("Lan", "Greek", 2, 35),
("Mizeee", "Wan", 1, 35),
("Jeans", "Mcarier", 2, 35),
("Lorry", "Loney", 3, 35),
("Stephany", "Fagne", 3, 35),
("York", "Corval", 3, 35),
("Nat", "Osas", 4, 35),
("Larrek", "Mingos", 4, 36),
("Lamber", "Pat", 5, 36),
("Yunh", "Ho", 5, 36),
("Daniel", "Fren", 5, 36),
("Michel", "Wall", 5, 36),
("Rachel", "Rumas", 5, 36),
("Jacob", "Bank", 6, 36),
("Imade", "Vincent", 6, 36),
("Justin", "Powers", 6, 36),
("John", "Connor", 3, 35),
("Joseph", "Stalline", 6, 36),
("Manuel", "Macron", 7, 37),
("Moreen", "Trudeau", 7, 37),
("Trump", "Putin", 7, 37),
("Elizabeth", "Donald", 7, 37),
("Boris", "Johnson", 7, 37),
("Stephane", "Labonte", 8, 38),
("Jacques", "Pelletier", 8, 38),
("Denis", "Lefebvre", 8, 38),
("Steve", "McQueen", 9, 40),
("Robert", "Plant", 9, 40),
("James", "Page", 10, 40),
("Wizee", "Mann", 10, 40),
("Wize", "Man", 5, 35),
("Mike", "O", 11, NULL);

