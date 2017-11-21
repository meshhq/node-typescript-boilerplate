// Constatns for SES Service
export const CHARSET_UTF_8 = 'UTF-8'
export const AWS_REGION = 'us-west-2'

// App Constants
export const APP_NAME = process.env.NODE_ENV === 'production' ? 'Standup' : 'CommitHub_Dev'

// Session Config
export const SESSION_SECRET = 'CommitHubYall'
export const SESSION_PREFIX = 'StandupSession'

// Github Service Constants
export const GITHUB_SERVICE_FILE = 'GithubServiceFile'
export const TWO_WEEKS_IN_SEC = 60 * 60 * 24 * 14
export const UNMODIFED_STATUS: string = '304 Not Modified'
export const ETAG_HEADER_KEY: string = 'If-None-Match'
export const HTTP_METHOD = {
	delete: 'DELETE',
	get: 'GET',
	post: 'POST',
	put: 'PUT'
}
export const WEBHOOK_NAME = 'web'
export const WEBHOOK_CONTENT_TYPE = 'json'
export const WEBHOOK_PUSH_EVENT = 'push'

export const GITHUB_WEBHOOK_URL = () => {
	switch (process.env.NODE_ENV) {
		case 'production':
			return 'https://api.getstandup.com/hooks/github'
		case 'test':
			return 'https://www.getstandup.com/hooks/githubtest'
		case 'development':
			return 'http://www.api.getstandup.com.ngrok.io/hooks/githubdevelopment'
		default:
			return 'https://www.getstandup.com/hooks/githubdefault'
	}
}
