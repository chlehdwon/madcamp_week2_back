import { Sequelize } from 'sequelize';
const sequelize_user = new Sequelize('loginDB', 'root', 'week2', {
    dialect: 'mysql',
    host: 'localhost', 
    define: {
        timestamps: false
    }
});
export default sequelize_user;

// const seq = require('sequelize')

// const sequelize = new seq('loginDB', 'root', 'week2', {
//     dialect: 'mysql',
//     host: 'localhost', 
//     define: {
//         timestamps: false
//     }
// });

// module.exports = sequelize