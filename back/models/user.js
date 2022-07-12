import { Sequelize } from 'sequelize';
import sequelize_user from '../utils/database_user.js';

// const Sequelize = require('sequelize')
// const sequelize = require('../utils/database.js')



const User = sequelize_user.define('users', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
});

// module.exports = User
export default User;