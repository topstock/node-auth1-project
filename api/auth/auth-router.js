const authRouter = require('express').Router()
const User = require('../users/users-model')
const {
  checkUsernameFree, 
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


authRouter.post(
  '/register', 
  checkUsernameFree,  
  checkPasswordLength,
  async (req, res, next) => {
    try {
    const {username, password} = req.body
    const user = await User.add({username, password })
    console.log('User Added')

    const newUser = { 
      user_id: user.user_id, 
      username: user.username 
    }
    res.status(200).json(newUser) 
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', checkUsernameExists, async(req, res, next) => {
  console.log("starting to login")
  try {
    const user = await User.findBy({ username: req.body.username })
    const {username} = user
    if (username !== undefined) {
      res.status(200).json( {
        "message": `Welcome ${user.username}!`
      })  
    } else { 
      res.status(404).json({"message": "Invalid credentials"})
    } 
  } catch(err) { 
    next(err) 
  }
})

authRouter.get('/logout', (req, res, next) => {
  console.log("starting to logout")
  res.status(200).json({ message: 'logged out'})
})
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the authRouter to the `exports` object so it can be required in other modules
module.exports = authRouter;