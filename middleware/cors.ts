
import { Request, Response } from 'express'
import * as cors from 'cors'

// Catch 302s from oauth login path
export default function (req: Request, res: Response, next: any) {
	const baseURLWhitelist = [
		'http://localhost:8080',
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
