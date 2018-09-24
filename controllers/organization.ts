// External Dependencies
import { Request, Response } from 'express'

// Models
import Organization from '../model/organization'

// Logger
import Logger from '../utils/logger'
import RequestError from '../utils/error'

export default class OrganizationController {

	/**
	 * Creates a new Organization.
	 * @param req Express Request
	 * @param req.body The payload containing organization information.
	 * @param req.body.name The name for the organization.
	 * @param res Express Response
	 */
	public static createOrganization = (req: Request, res: Response) => {
		const name = req.body.name
		if (!name) {
			const err = new RequestError(422, `Failed to create organization. Req parameters are invalid.`)
			return RequestError.handle(err, req, res)
		}

		// Check for a organization with the supplied name.
		Logger.info(`Checking for existing organization with name: ${name}`)
		Organization.findByName(name).then((organization: Organization) => {
			if (organization) {
				throw new RequestError(401, `Conflict. Organization with email: ${req.params.organization_id} already exists.`)
			}
			Logger.info(`Creating new organization with email: ${req.body.email}`)
			const newOrganization = OrganizationController.buildOrganization(req.body)
			return newOrganization.save()
		}).then((organization: Organization) => {
			Logger.info(`Save Organization with Name ${name}`)
			res.status(201).json(organization)
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	// /**
	//  * Gets all Organization for a organization constrained by the supplied query parameters.
	//  * @param req Express Request
	//  * @param req.query The query values to be used in the query.
	//  * @param res Express Response
	//  */
	// public static getOrganizations(req: Request, res: Response) {
	// 	const valid = validator.ValidateRequest(req)
	// 	if (!valid) {
	// 		const err = new RequestError(422, `Failed to find organizations. Req parameters are invalid: ${req}`)
	// 		return RequestError.handle(err, req, res)
	// 	}

	// 	Logger.info('Find all Organizations for Organization: ', req.organization.githubHandle)
	// 	Organization.find({ where: req.query }).then((organizations: Organization[]) => {
	// 		if (organizations.length === 0) {
	// 			throw new RequestError(404, `Failed to find organizations for query: ${req.query}`)
	// 		}
	// 		Logger.info(`Found organizations: ${organizations} for query: ${req.query} `)
	// 		res.status(200).json(organizations)
	// 	}).catch((err: Error) => {
	// 		RequestError.handle(err, req, res)
	// 	})
	// }

	// /**
	//  * Gets all Organization for a organization constrained by the supplied query parameters.
	//  * @param req Express Request
	//  * @param req.params.organization_id The organizationID for the organization to be fetched.
	//  * @param res Express Response
	//  */
	// public static getOrganization(req: Request, res: Response) {
	// 	const valid = validator.ValidateRequest(req)
	// 	if (!valid) {
	// 		const err = new RequestError(422, `Failed to find organization. Req parameters are invalid: ${req}`)
	// 		return RequestError.handle(err, req, res)
	// 	}

	// 	Logger.info(`Fetching organization with id: ${req.params.organization_id}`)
	// 	Organization.findOneById(req.params.organization_id).then((organization: Organization) => {
	// 		if (!organization) {
	// 			throw new RequestError(404, `Failed to find organization with id: ${req.params.organization_id}`)
	// 		}
	// 		Logger.info(`Found organization: ${organization}`)
	// 		res.status(200).json(organization)
	// 	}).catch((err: Error) => {
	// 		RequestError.handle(err, req, res)
	// 	})
	// }

	// /**
	//  * Updates an Organization with the supplied information.
	//  * @param req Express Request
	//  * @param req.params.organization_id The organizationID for the organization to be updated.
	//  * @param req.body The paylod containg update information for the organization.
	//  * @param res Express Response
	//  */
	// public static async updateOrganization(req: Request, res: Response) {
	// 	const valid = req.params.organization_id && validator.ValidateRequest(req)
	// 	if (!valid) {
	// 		const err = new RequestError(422, `Failed to update organization. Req parameters are invalid: ${req}`)
	// 		return RequestError.handle(err, req, res)
	// 	}

	// 	Logger.info(`Fetching organization with id: ${req.params.organization_id}`)
	// 	Organization.findOneById(req.params.organization_id).then((organization: Organization) => {
	// 		if (!organization) {
	// 			throw new RequestError(404, `Failed to find organization with id: ${req.params.organization_id}`)
	// 		}
	// 		Logger.info(`Updating organization with ID ${req.params.organization_id}`)
	// 		Organization.updateById(req.params.organization_id, req.body)
	// 	}).then(() => {
	// 		Logger.info(`Updated Organization with ID ${req.params.organization_id}`)
	// 		res.status(200).json()
	// 	}).catch((err: Error | RequestError) => {
	// 		Logger.error('Failed updating organization.')
	// 		RequestError.handle(err, req, res)
	// 	})
	// }

	// /**
	//  * Get a single Organization the authorized organization belongs to
	//  * @param req Express Request - will contain the Authorized Organization info
	//  * @param req.params.organization_id The organizationID for the organization to be deleted.
	//  * @param res Express Response
	//  */
	// public static async deleteOrganization(req: Request, res: Response) {
	// 	const valid = req.params.organization_id
	// 	if (!valid) {
	// 		const err = new RequestError(422, `Failed to delete organizations.Req parameters are invalid: ${req}`)
	// 		return RequestError.handle(err, req, res)
	// 	}

	// 	Logger.info(`Fetching organization with id: ${req.params.organization_id}`)
	// 	Organization.findOneById(req.params.organization_id).then((organization: Organization) => {
	// 		if (!organization) {
	// 			throw new RequestError(404, `Failed to find organization with id: ${req.params.organization_id}`)
	// 		}
	// 		Logger.info(`Deleting organization with ID ${req.params.organization_id} `)
	// 		Organization.removeById(req.params.organization_id)
	// 	}).then(() => {
	// 		Logger.info(`Deleted organization with ID: ${req.params.organization_id} `)
	// 		res.status(200).json()
	// 	}).catch((err: Error) => {
	// 		Logger.error('Failed deleting organization.')
	// 		RequestError.handle(err, req, res)
	// 	})
	// }

	public static buildOrganization(body: any): Organization {
		const organization = Organization.create()
		organization.name = body.name
		return organization
	}
}
