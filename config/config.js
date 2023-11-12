require('dotenv').config();

const CONFIG = {
  app: process.env.APP_ENV, // production or development
  port: process.env.APP_PORT,
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    jwt_encryption: process.env.JWT_SECRET,
    dialect: process.env.DB_CONNECTION,
    email_verification_url: process.env.EMAIL_VERIFICATION_URL,
    forgot_password_url: process.env.FORGOT_PASSWORD_URL,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You may need to include this line if facing certificate issues
      },
    },
    pool: {
      handleDisconnects: true,
      max: 100,
      min: 1,
      idle: 10000,
      acquire: 20000,
    },
    timezone: '+05:30',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+05:30',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
    email_verification_url: process.env.EMAIL_VERIFICATION_URL,
    forgot_password_url: process.env.FORGOT_PASSWORD_URL,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    pool: {
      handleDisconnects: true,
      max: 100,
      min: 1,
      idle: 10000,
      acquire: 20000,
    },
    timezone: '+05:30',
  },
  CONFIG,
};

