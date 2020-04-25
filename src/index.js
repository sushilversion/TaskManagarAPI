const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next)=>{
//     console.log(req.method, req.path);
//    // res.set('X-Powered-By','')
//     next()
    
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const jwt= require('jsonwebtoken')

// const myfunction= async()=>{
//     const token = jwt.sign({_id:'1234'},'secret',{expiresIn:'7 days'})
//     console.log(token);
//     const data= jwt.verify(token,'secret')
//     console.log(data);
    
    
// }

// myfunction()