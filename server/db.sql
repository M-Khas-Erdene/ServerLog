CREATE DATABASE serverdb;

CREATE TABLE servers(
    id SERIAL PRIMARY KEY,
    name varchar(100),
    status varchar(50)
);
CREATE TABLE servers (
    id SERIAL PRIMARY KEY,
    server_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    system_running VARCHAR(255),
    internal_address INET NOT NULL,
    external_address INET NOT NULL,
    reason_for_failure TEXT,
    date_of_failure TIMESTAMP,
    date_of_startup TIMESTAMP,
    status varchar(50);
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);


