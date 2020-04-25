const jwt= require('jsonwebtoken')
const User= require('../models/user')


const auth = async(req, res, done)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
         //const token = req.header('Authorization')
        console.log(token);
        
        const decoded= jwt.verify(token, 'secret')
        user= await User.findOne({_id:decoded._id,'tokens.token':token})
      
       if(!user){
           throw new Error()
       }
       req.user=user
       
        
    done()
    } catch(e){
    console.log(e);
        
        res.status(401).send('Error: Please authenticate')
    }

}

module.exports= auth



