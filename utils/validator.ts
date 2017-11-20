// External Dependencies
import { Request, Response } from 'express'

// Logger
import Logger from './logger'

export default class Validator {
	public bodyParams: any[]

	constructor(bodyParams: any[]) {
		this.bodyParams = bodyParams
	}

	public ValidateRequest(req: Request) {
		switch (req.method) {
			case 'POST':
				return this.validateBody(req)
			case 'GET':
				return true
			case 'PUT':
				return this.validateBody(req)
			case 'DELETE':
				return true
		}
		return false
	}

	private validateBody(req: Request) {
		if (Object.keys(req.body).length == 0) {
			return false;
		}
		for (let key of Object.keys(req.body)) {
			if (this.bodyParams.indexOf(key) == -1) {
				return false
			}
		}
		return true
	}
}