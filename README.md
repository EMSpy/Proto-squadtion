# Proto-squadtion

## Real-Time Chat App Prototype

A lightweight real-time chat prototype built with WebSockets. It allows users to join the chat with a username, send messages instantly, and see all messages updated live. Designed to demonstrate the core functionality of a chat system, including message broadcasting, event handling, and a clean, minimal UI.



##  How to create user db

```sql

CREATE DATABASE "ix-core-chat";

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
password TEXT NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
message TEXT NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
id SERIAL PRIMARY KEY,
sender VARCHAR(50) NOT NULL,
receiver VARCHAR(50) NOT NULL,
message TEXT NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


PG_USER=postgres
PG_PASSWORD=
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ix-core-chat
JWT_SECRET=

