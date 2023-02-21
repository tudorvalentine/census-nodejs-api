const express = require('express')
const app = express()

const port = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const router = require("./routes/routes")

app.use('/app', router)

app.listen(port,()=>{
    console.log(`Server started on ${port} . . .`)
})