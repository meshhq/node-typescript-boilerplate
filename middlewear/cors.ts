
import { Request, Response } from 'express'
import * as cors from 'cors'

// Catch 302s from oauth login path
export default function (req: Request, res: Response, next: any) {
	const baseURLWhitelist = [
		'http://localhost:8888',
		'https://github.com',
		'http://dev.app.getstandup.com',
		'https://app.getstandup.com',
		'http://app.getstandup.com',
		'https://api.getstandup.com',
		'http://dev.api.getstandup.com',
		'https://api.stripe.com'
	]
	const headerWhitelist = [
		'Access-Control-Allow-Origin',
		'Accept-Encoding',
		'Accept-Language',
		'Authorization',
		'Content-Length',
		'Cookie',
		'Content-Type',
		'Content-Length',
		'MeshAuth',
		'Set-Cookie',
		'X-Redirect',
		'X-Web-Source'
	]
	const corsOptions = {
		allowedHeaders: headerWhitelist,
		credentials: true,
		exposedHeaders: headerWhitelist,
		origin: (origin: any, callback: any) => {
			if (!origin || baseURLWhitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS: ' + origin))
			}
		}
	}

	// Inject cors
	cors(corsOptions)(req, res, next)
}
