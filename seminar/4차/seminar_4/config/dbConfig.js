const mysql = require('promise-mysql');

const dbConfig = {
    host: 'suzzang.c0pwmgqdtrez.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'suzzang',
    password: 'chltnwjd77',
    database: '24SoptServer',
}

module.exports = mysql.createPool(dbConfig);