import express from 'express';

import {auth} from '../middleware/auth.js';
import {getuserforSidebar, getMessages, markMessagesSeen, sendMessage} from '../controllers/messagecontroller.js';
const router = express.Router();


messageRouter.get('/users', auth, getuserforSidebar);
messageRouter.get('/:id', auth, getMessages);
messageRouter.put('mark/:id', auth, markMessagesSeen);
messageRouter.post('/send/:id',auth,sendMessage);


export default messageRouter;
