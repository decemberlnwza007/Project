const routes = async (app) => {
    app.get('/users', async (req, res) => {
        const users = await getUsers()
        res.json(users)
    })
    app.post('/users', async (req, res) => {
        const newUser = req.body
        await createUser(newUser)
        res.status(201).json({ message: 'User created successfully'})
    })
}