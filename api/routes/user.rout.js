
import express  from 'express';

const router = express.Router();
import { test } from '../controllers/user.controller.js';

// Define a test route for the user controller

router.get('/test', test);

router.get('/', (req, res) => {
    res.send('User route is working!');
}
);

export default router;