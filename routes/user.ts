// External Dependencies
import { Router } from 'express'
import * as passport from 'passport'

// Controller
import UserController from '../controllers/user'

export default function createUserRoutes(router: Router) {

	router.post('/register', UserController.registerUser, passport.authenticate('local'), function (req, res) {
		res.status(201).send();
	});

	router.post('/login', passport.authenticate('local'), function (req, res) {
		res.status(201).send();
	});

	router.get('/users', UserController.getUsers)
	router.get('/users/:user_id', UserController.getUser)
	router.put('/users/:user_id', UserController.updateUser)
	router.delete('/users/:user_id', UserController.deleteUser)
}
