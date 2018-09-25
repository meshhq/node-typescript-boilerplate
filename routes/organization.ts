// External Dependencies
import { Router } from 'express'

// Controller
import OrganizationController from '../controllers/organization'

export default function createOrganizationRoutes(router: Router) {
	router.post('/organizations', OrganizationController.createOrganization)
	router.get('/organizations', OrganizationController.getOrganizations)
	router.get('/organizations/:organization_id', OrganizationController.getOrganization)
	// router.put('/organizations/:organization_id', OrganizationController.updateOrganization)
	router.delete('/organizations/:organization_id', OrganizationController.deleteOrganization)
}
