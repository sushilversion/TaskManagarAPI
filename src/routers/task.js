const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const auth= require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
   const task = new Task({
       ...req.body,
       owner:req.user._id
   })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks',auth, async (req, res) => {
    try {
      //  const tasks = await Task.find({})
        const user= await User.findById(req.user._id)
       // console.log(user);
        
        
        await user.populate('tasks').execPopulate()

        res.send(user.tasks)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth,  async (req, res) => {
    const _id = req.params.id

    try {
      //  const task = await Task.findById(_id)
      const task = await Task.findOne({_id, owner: req.user.id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//Update the given task for current owner
router.patch('/tasks/:id', auth , async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const task= await Task.findById(req.params.id)
        const task = await Task.findOne({_id, owner: req.user.id})
       
        
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update]=req.body[update])
       
        await task.save();

       

        res.send(task)
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id

    try {
       // const task = await Task.findByIdAndDelete(req.params.id)
       const task = await Task.findOne({_id, owner: req.user.id})

        if (!task) {
            res.status(404).send()
        }

        await task.remove()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router