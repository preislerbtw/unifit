const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const mysql = require("mysql2/promise");

const hostLocal = ["localhost", "127.0.0.1"].includes(process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: hostLocal ? undefined : { minVersion: "TLSv1.2", rejectUnauthorized: true },

  waitForConnections: true,
  connectionLimit: 3, // serverless: poucas conexões por instância
  queueLimit: 0,
});

module.exports = pool;