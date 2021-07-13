# AmateurHour-Server
Welcome to the server side of AmateurHour, a social media app to help non-career musicians keep playing! Checkout the deployed app => (https://client-amateurhour.herokuapp.com/)

### What is it?
This server has 3 tables that house user data, posts, and comments for the site. Additionally, it provides code for **22 endpoints** so users can Create, Read, Update, and Delete (CRUD) data on each table.

### Server tech
This app utilzes postgreSQL and express in order to translate JavaScript into language the server can read. It also uses the following dependencies:
    "bcryptjs": "^2.4.3",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "pg": "^8.6.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.6.4"

### Database Associations
The server uses several associations:

UserModel.hasMany(GigModel);
UserModel.hasMany(CommentModel);

GigModel.belongsTo(UserModel);
GigModel.hasMany(CommentModel);

CommentModel.belongsTo(GigModel);

### Security
The app fully encrypts and stores sensitive data salted and hashed. Data sensitive to the app is stored locally on a .env file (thanks dotenv!)
