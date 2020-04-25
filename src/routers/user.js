const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth= require('../middleware/auth')

router.post('/users' ,async (req, res) => {
    const user = new User(req.body)

    try {
        //await user.save()
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login' ,async (req,res)=>{
    try {
        
        const user = await User.findByCredentials(req.body.email , req.body.password)
       // console.log(user);
        
        const token= await user.generateAuthToken()
       
         // res.send(user)
       res.send({user,token})
    } catch (error) {
        console.log('Exception coming',error);
        
        res.status(400).send()
    }
})

//Logging out current user
router.post('/users/logout',auth, async(req, res)=>{

    try{
        req.user.tokens= req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token

        })
        await req.user.save()
        res.send()
    }catch(e){

        res.status(500).send()
    }
})

//Logging out all tokens for current user
router.post('/users/logoutAll',auth, async(req, res)=>{

    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){

        res.status(500).send()
    }

    
})


router.get('/users/me', auth,async (req, res) => {
    res.send(req.user)
})



router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
       // const user= await User.findById(req.params.id);
       const user = req.user
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth,async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.params.id)

        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router