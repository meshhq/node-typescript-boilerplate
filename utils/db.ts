
import { Sequelize, Options, SyncOptions, Promise as Bluebird } from 'sequelize'
import * as url from 'url'

const connectionConfig: Options = {
	dialect: 'postgres',
	logging: false,
	pool: {
		max: 5,
		min: 0
	},
	protocol: 'tcp'
}

export default class DBClient extends Sequelize {
	private static _instance: DBClient

	private static getDatabaseClientURL(): string {
		const baseURL = 'postgres://localhost:5432/commithub'
		let fullURL
		switch (process.env.NODE_ENV) {
			case 'production':
				fullURL = `postgres://${process.env.PG_URL}`
				break
			case 'test':
				fullURL = `${baseURL}_test`
				break
			default:
				fullURL = `${baseURL}_dev`
				break
		}
		return fullURL
	}

	private constructor(uri: string, opts: Options) {
		if (process.env.PG_USER && process.env.PG_PASS && process.env.PG_NAME) {
			const pgURL = url.parse(uri)
			opts.host = pgURL.hostname
			opts.port = Number(pgURL.port)
			super(process.env.PG_NAME, process.env.PG_USER, process.env.PG_PASS, opts)
		} else {
			super(uri, opts)
		}
	}

	public static get SharedInstance() {
		if (!DBClient._instance) {
			const databaseURL = this.getDatabaseClientURL()
			DBClient._instance = new this(databaseURL, connectionConfig)
		}
		return DBClient._instance
	}

	public sync(options?: SyncOptions): Bluebird<any> {
		if (process.env.NODE_ENV === 'test') {
			if (!options) {
				options = {}
			}
			options.force = true
		}
		if (!options) {
			options = {}
		}
		options.force = true

		return super.sync(options)
	}
}
