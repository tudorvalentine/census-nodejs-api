const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'tudor1903',
    port: 5432,
    database: 'recensamant'
})
    // const pool = new Pool({
    //     connectionString: process.env.DATABASE_URL,
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // })

module.exports = pool