# transactions backend
 
Here's a brief Information of how it works This will help you understand how it's organized:

## Folder Structure Explanation
- **Config**: This folder contains configuration files for your Node.js application. It contains Infomation related to databases, environment variables.
- **Migrations**: This Foler Contains the information regarding changes that we made in database, its like git it tracks all changes made in database.
- **Controllers**: Handles what the app does when users ask for something.
- **Routes**: this folder contains all routes these are api end points and each will make execute certain controller.
- **Models**: This folder contains the databse schema definitions and database interactions for your application. and how it's stored/retrieved.
- **Helpers**: The helpers folder typically contains utility functions or helper modules that can be reused throughout your application.
- **Middleware**: it contains Authentication related thing because we have to verify every time access token so it will be easier i we use it as middle we use  it where ever its needed.
- **Dotenv** : The .env file typically contains all Passwords that are related to third party npm packages and sensitive information that your application needs.
- **app.js**: The main file that server starts and controls the entire app.
- **Package.json**: It contains about the project, like its name, version, author, and dependencies used inormation its like identity for app.
- **Package-lock.json**: this folder contains the versions of dependencies and it will make to use of same version of dependecies every time.
- **Postman Collection**: Contains saved API requests and responses for testing.
- **Database Design**: it contains database design like draw.io file.

## Dependencies used
- **Express**: A web framework for building the API.
- **pg**: Helps interact with postgres, database.
- **dotenv**: Loads environment variables from a .env file.
- **body-parser**: Parses incoming request data.
- **jsonwebtoken**: Creates and verifies JSON Web Tokens (JWT).
- **sequelize**: used for querying with database.


## Getting Started
1. Clone this repo.
2. Install dependencies with `npm install`.
3. Change The Database credentials in Dot env file.
4. run migration command with `npx sequelize-cli db:migrate` so database will be migrated.
5. Run the app with `npm start`.

## Postman Collection
- Import the Postman Collection JSON file to your postman for testing.
- setup environment in postman url key value as `http://localhost:3673`.
