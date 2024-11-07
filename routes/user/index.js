const { Router } = require("express");
const router = Router();
const file = require('../../fs/userFS');
const bcrypt = require('bcrypt');


router.post('/registration', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || typeof email !== 'string') return res.status(400).json({ message: "email is not correct" })
        if (!password) return res.status(400).json({ message: "password is not correct" })

        const result = await file.readFileUser(email)
        if (result.ok) return res.status(400).json({ message: "user with this email already exist" })

        const newUser = {
            email: email,
            password: password
        }

        const passwordEncrypted = await bcrypt.hash(password, 11)
        newUser.password = passwordEncrypted
        
        await file.createFileUser(email, newUser)
        return res.status(201).json({ message: "user was successfully created" })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})

router.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body

        if (!email || typeof email !== 'string') return res.status(400).json({ message: "email is not correct" })
        if (!password) return res.status(400).json({ message: "password is not correct" })

        const responseUser = await file.readFileUser(email)
        if (responseUser.ok === false) return res.status(404).json({ text: 'user does not exist or email is not correct' })

        const currentUser = responseUser.data;
        const ispassword = await bcrypt.compare(password, currentUser.password)
        if (!ispassword) return res.status(409).json({ text: 'password is not correct' })

        if(!currentUser.token) {
            const token = await file.createToken()
            currentUser.token = token;
            await file.writeFileToken(email, currentUser)
        }

        return res.status(200).json({ token : currentUser.token })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "server error" })
    }
})


module.exports = router