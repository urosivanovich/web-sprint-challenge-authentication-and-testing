const Users = require('./auth-model')

const checkUsernameExist = async  (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password){
        res.status(401).json({message: 'username and password required'})
    } else {
        const [user] = await Users.findBy({username})
        if(user){
            res.status(401).json({message: 'username taken'})
        } else {
            next()
        }
    }
}

const checkLogin = async (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password){
        res.status(401).json({message: 'username and password required'})
    } else {
        const [user] = await Users.findBy({username})
        if(!user){
            res.status(401).json({message: 'invalid credentials'})
        } else {
            next()
        }
    }
}


module.exports = {
    checkUsernameExist,
    checkLogin
}




// const user = await Users.findBy({username: req.body.username}).first()
//     if(!user){
//         next()
//     }else{
//         res.status()
//     }