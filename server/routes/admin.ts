import { User, Admin, Course } from '../db/model';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { authenticate, secretKey } from '../middleware/auth'

const router = express.Router();

// Admin routes
router.post('/signup', async (req, res) => {
    try {
        // res.send('Hi')
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).send('Invalid Credentails')
        }
        const user = await Admin.findOne({ username })

        if (user) {
            return res.status(403).send('User already Exists');
        } else {
            const obj = {
                "username": username,
                "password": password
            }
            const newAdmin = new Admin(obj);
            await newAdmin.save()
            console.log('Admin saved');

            // const secretKey = 'mysecretkey';
            // const payload = { userId: '12345', role: 'admin' };
            // const options = { expiresIn: '1h' };
            // const token = jwt.sign(payload, secretKey, options);

            const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, secretKey, { expiresIn: '1h' })

            return res.status(201).json(token);
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Admin.findOne({ username, password })

        if (user) {
            const token = jwt.sign({ id: user._id, role: 'admin' }, secretKey, { expiresIn: '1h' })
            return res.status(200).json(token);
        } else {
            return res.status(403).send('Invalid Credentials');
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
});

router.post('/courses', authenticate, async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        console.log(req.body);
        await newCourse.save();

        return res.status(201).send({ message: 'Course created successfully', courseId: newCourse.id })
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
});

// router.put('/courses/:courseId', authenticate, (req, res) => {

// });

router.get('/courses', authenticate, async (req, res) => {
    try {
        const courses = await Course.find();

        const obj = {
            "course": courses
        }
        return res.status(200).json(obj);
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
});

export default router;