import * as process from 'node:process';

process.env.PORT = '3000';
process.env.DATABASE_USERNAME = 'user';
process.env.DATABASE_NAME = 'orders';
process.env.DATABASE_PASSWORD = 'senha123';
process.env.DATABASE_PORT = '3001';
process.env.DATABASE_HOST = 'http://localhost/db';
process.env.DATABASE_CONNECTION_TIMEOUT = '100000';
