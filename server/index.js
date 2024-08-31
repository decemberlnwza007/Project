const mysql = require('mysql2/promise')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));


const port = 8000

const secret = 'secret'

app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'food',
        port: 3306
    })
}

app.post('/register', async (req, res) => {
    try {
        const { username, password, name, lastname, role, email } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const userData = { username, password: passwordHash, name, lastname, role, email }
        const [results] = await conn.query('INSERT INTO member SET ?', userData)
        res.json({ message: 'Register success', results })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: 'โปรดกรอกผู้ใช้ และ รหัสผ่าน' })
        }

        const [results] = await conn.query('SELECT id, password, role FROM member WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(400).send({ message: 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง' })
        }

        const member = results[0];
        const match = await bcrypt.compare(password, member.password);

        if (!match) {
            return res.status(400).send({ message: 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง' })
        }

        const token = jwt.sign({ username, role: member.role }, secret, { expiresIn: '1h' })
        res.send({ message: 'Login Successfully!', token, role: member.role })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' })
    }
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM member')
        res.json(rows)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal Server Error' })
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [results] = await conn.query('DELETE FROM member WHERE id = ?', [id]);
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(port, async () => {
    await initMySQL()
    console.log(`Server is running on port ${port}`)
})
