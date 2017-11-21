// External Dependencies
import { Express, Router } from 'express'

// Routes
import UserRoutes from './user'

export default class MeshRoutes {

	public static mountRoutes(app: Express) {
		// Generate routes
		const router = Router()

		UserRoutes(router)

		app.use('/', router)
	}
}
