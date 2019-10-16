INSERT INTO users VALUES (1, 'Eva Stanley', 'this@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users VALUES (2, 'ELouisa Meyer', 'this@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users VALUES (3, 'Dominic Parks', 'this@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password ) VALUES ( 'Dominic Parks', 'this@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties VALUES (1, 3, 'Speed Lamp', 'description', 'https://web.compass.lighthouselabs.ca/days/w05d3/activities/955', 'https://web.compass.lighthouselabs.ca/days/w05d3/activities/955', 930.61, 6, 4, 8,'Canada', '536 Namsub Highway', 'Sotboske', 'Quebec', 28142, true);

INSERT INTO reservations VALUES(1, '2018-09-11', '2018-09-26', 1, 2);

INSERT INTO property_reviews VALUES(1,1, 1, 1, 4, 'message')