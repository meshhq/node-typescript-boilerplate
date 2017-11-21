// External Dependencies
import { Request, Response } from 'express'

// Logger
import Logger from './logger'

export default class RequestError extends Error {
	public code: number

	public constructor(code: number, message: string) {
		super(message)

		this.code = code
	}

	public static handle(err: RequestError | Error, req: Request, res: Response) {
		Logger.error(err.message)
		if (err instanceof RequestError) {
			res.status(err.code).send(err.message)
		} else {
			res.status(500).send(err.message)
		}
	}
}