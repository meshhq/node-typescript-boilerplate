// External Dependencies
import { Express, Router } from 'express'

// Routes
import UserRoutes from './user'
import OrganizationRoutes from './organization'

export default class MeshRoutes {

	public static mountRoutes(app: Express) {
		// Generate routes
		const router = Router()

		UserRoutes(router)
		OrganizationRoutes(router)

		app.use('/', router)
	}
}
