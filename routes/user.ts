// External Dependencies
import { Router } from 'express'
import * as passport from 'passport'

// Controller
import UserController from '../controllers/user'

// Middleware
import PassportMiddleware from '../middleware/passport'

export default function createUserRoutes(router: Router) {

	router.post('/register', UserController.registerUser, passport.authenticate('local'), (req, res) => {
		res.status(201).send()
	})

	router.post('/login', passport.authenticate('local'), (req, res) => {
		res.status(201).send()
	})

	router.get('/users', UserController.getListOfUsers)
	router.post('/users', UserController.createUser)
	router.put('/users/:user_id', UserController.updateUser)
	router.delete('/users/:user_id', UserController.deleteUser)
}
