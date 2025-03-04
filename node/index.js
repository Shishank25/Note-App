require('dotenv').config();
// const SECRET_KEY = 'a7b3c9d1e5f2g8h4i6j0k3l9m1n5o2p8q4r0s7t3u9v6w2x0y4z6';
const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require("./utilities");

const User = require('./models/user-model');
const Note = require('./models/note-model');

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);

app.get('/', ( req, res ) => {
    res.json({ data: 'Hello, World!' });
})

// Create Account
app.post('/create-account', async ( req, res ) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
        .status(400)
        .json({ error: true, message: 'Full Name is required' });
    }

    if (!email) {
        return res
        .status(400)
        .json({ error: true, message: 'Email is required' });
    }

    if (!password) {
        return res
        .status(400)
        .json({ error: true, message: 'Password is required' });
    }

    const isUser = await User.findOne({ email: email });

    

    if (isUser) {
        
        return res.json({
            error: true,
            message: 'Email already exists',
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();
    
    const accessToken = jwt.sign({ user }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '1h',
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration successful',
    })
});

// Login
app.post('/login', async ( req, res ) => {
    const { email, password } = req.body;

    if (!email) { 
        return res.status(400).json({ message: "Email is required"});
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required"});
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found, please register" });
    }

    if(userInfo.email == email && userInfo.password == password) {

        const user = { user: userInfo };
        const  accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "36000m" });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });

    } else {

        return res.status(400).json({ 
            error: true,
            message: "Password is Incorrect", 
        });
    }
});

// Get User
app.get('/get-user', authenticateToken, async ( req, res ) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.status(400).json({ message: "User not found" });
    }

    return res.json({
        user: {
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
}) 

// Add Note
app.post('/add-note', authenticateToken, async ( req, res ) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const note = new Note({
            title,
            content: content || '',
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Added Successfully",
        });
    } catch (err) {
        return res.status(400).json({ 
            error: true,
            message: "Failed to add note" 
        }); 
    }
});

// Edit Note
app.put('/edit-note/:noteId', authenticateToken, async ( req, res ) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if ( !title && !content && !tags ) {
        return res
        .status(400)
        .json({ error: true, message: "No Changes" });
    }

    try { 
        const noteIdObject = new mongoose.Types.ObjectId(noteId);
        const userIdString = user._id;
        const note = await Note.findOne({ _id: noteIdObject, userId: userIdString });

        if(!note) {
            return res.status(404).json({ error: true, message: "Note Not Found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully",
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

// Get All Notes 
app.get('/get-all-notes/', authenticateToken, async ( req, res ) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id })
        .sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "Notes Retrieved Successfully",
        });

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

});

// Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    const noteIdObject = new mongoose.Types.ObjectId(noteId)

    try {
        const note = await Note.findOne({
            _id: noteIdObject,
            userId: user._id
        });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note Not Found"
            });
        }

        await Note.deleteOne({
            _id: noteIdObject,
            userId: user._id
        });

        return res.json({
            error: false,
            message: "Note Deleted Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });

    }
});

// Update isPinned
app.put('/update-pin/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try { 
        const noteIdObject = new mongoose.Types.ObjectId(noteId);
        const userIdString = user._id;
        const note = await Note.findOne({ _id: noteIdObject, userId: userIdString });

        if(!note) {
            return res.status(404).json({ error: true, message: "Note Not Found" });
        }

        note.isPinned = !note.isPinned;

        const noteState = note.isPinned ? "Pinned" : "Unpinned";

        await note.save();

        return res.json({
            error: false,
            note,
            message: `Note ${noteState}`,
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

// Search Notes
app.get('/search-notes', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if(!query) {
        return res
        .status(400)
        .json({
            error: true,
            message: "Please provide a search query",
        });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, 'i' ) } },
                { content: { $regex: new RegExp(query, 'i' ) } },
                ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes Found Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Find Pinned messages
app.get('/get-pinned-notes', authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            isPinned: true
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Pinned Notes Found Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Update User Name
app.put('/change-name', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { newName } = req.body;

    try {
        const isUser = await User.findOne({ _id: user._id });
        if (!isUser) {
            return res.status(400).json({ message: "User not found" });
        }

        if ( newName ) { isUser.fullName = newName; }

        await isUser.save();

        return res.json({
            error: false,
            message: "Username Updated!",
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Update Password
app.put('/change-password', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { newPassword } = req.body;

    try {
        const isUser = await User.findOne({ _id: user._id });
        if (!isUser) {
            return res.status(400).json({ message: "User not found" });
        }

        if ( newPassword ) { 
            if ( isUser.password !== newPassword ) {
                isUser.password = newPassword;
            } else {
                return res.status(400).json({ error: true ,message: "New Password cannot be same as Old Password" });
            }
        }

        await isUser.save();

        return res.json({
            error: false,
            message: "Password Updated!",
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


app.listen(8000);

module.exports = app;