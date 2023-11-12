require('dotenv').config();
const express = require('express');
const { mainRouter } = require('./routes');
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use('/transactions',mainRouter)


app.get('/',(req,res)=>{
   res.send('Sudharsan Server is Running')
})

const port = process.env.port || 3700


app.listen(port,()=>{
    console.log(`Server Started And Running At http://localhost:${port}`);
})