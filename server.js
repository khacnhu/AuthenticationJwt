const express = require("express")
const app = express()
const db = require("./configdatabase/index")
db.connect()
require("dotenv").config()
const morgan = require("morgan")
const userRoute = require("./routes/user")
const helmet = require("helmet")
// const compress = require("compress")

const PORT = process.env.PORT

app.use(express.json())
app.use(morgan("combined"))
app.use(helmet())
// app.use(compress())


app.use("/users", userRoute)

app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING....${PORT}....`)
})