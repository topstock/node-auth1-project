const authRouter = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
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
    const hash = bcrypt.hashSync(password, 8) // 2^10
    const user = await User.add({username, password: hash })

    res.status(201).json({user_id: user[0]['user_id'], username:  user[0]['username']}) 
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', checkUsernameExists, async(req, res, next) => {
  try {
    const {password} = req.body
    if ( bcrypt.compareSync(password, req.user.password)) {
      // make it so the cookie is set on the client 
          // a special header.travels with the response
      // make it so server stores a session with a session id
          // 
      req.session.user = req.user
      res.status(200).json({ message: `Welcome ${req.user.username}!`})
    } else {
      res.status(401).json({'message': 'Invalid credentials'})
    }   
  } catch(err) { 
    next(err) 
  }
})

authRouter.get('/logout', (req, res, next) => {
  if (req.session.user)  {
    req.session.destroy(err => {
      if (err) {
        next(err)
      } else {
        res.json({ message: 'logged out'})
      }
    })
  } else {
    res.json({ message: 'no session'})
  }
})
/**
  1 [POST] /api/auth/register { 'username': 'sue', 'password': '1234' }

  response:
  status 200
  {
    'user_id': 2,
    'username': 'sue'
  }

  response on username taken:
  status 422
  {
    'message': 'Username taken'
  }

  response on password three chars or less:
  status 422
  {
    'message': 'Password must be longer than 3 chars'
  }
 */


/**
  2 [POST] /api/auth/login { 'username': 'sue', 'password': '1234' }

  response:
  status 200
  {
    'message': 'Welcome sue!'
  }

  response on invalid credentials:
  status 401
  {
    'message': 'Invalid credentials'
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    'message': 'logged out'
  }

  response for not-logged-in users:
  status 200
  {
    'message': 'no session'
  }
 */

 
// Don't forget to add the authRouter to the `exports` object so it can be required in other modules
module.exports = authRouter;