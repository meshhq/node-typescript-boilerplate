// External Deps
const gulpcopy = require('gulp-copy')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const plumber = require('gulp-plumber')
const cache = require('gulp-cached')
const shell = require('gulp-shell')
const tslint = require('gulp-tslint')
const sequelize = require('sequelize')
const del = require('del')
const fs = require('fs')
const path = require('path')
const jeditor = require("gulp-json-editor");
const jsonToYaml = require('gulp-json-to-yaml');
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const async = require('async');
const DotENV = require('dotenv');

// Setup config
DotENV.config()

// Internal Deps
const tsProject = ts.createProject('tsconfig.json', { noImplicitAny: true, outDir: 'dist' })

// Constant
const IMAGE_NAME = 'meshstudios/typescript-boilerplate'

// Args
var options = process.argv.slice(2)

// ECS Specific
const taggedImage = `${IMAGE_NAME}:${Date.now()}`

// Source
const filesToWatch = [
	'./**/*.ts',
	'./**/*.test.ts',
	'!./node_modules/**/*.ts', 
	'!./dist/**/*.ts',
	'!./typings/**/*.ts'
]

/**
 * Cleaning commands
 */
const cleanDistFolder = 'clean:dist'
gulp.task(cleanDistFolder, function () {
  return del([
    'dist/**/*'
  ])
})

/**
 * Gulp Transpiling
 */

// Copies non-ts files to dist
const copyStaticResources = 'copyStaticResources'
gulp.task(copyStaticResources, () => {
	let emailTemplatesSouce = ['lib/emailTemplates/*.html']
	return gulp.src(emailTemplatesSouce)
	.pipe(gulpcopy('./dist/'))
})

const transpileTS = 'transpileTS'
gulp.task(transpileTS, [cleanDistFolder], () => {
	// Kick off the copy
	gulp.start(copyStaticResources)

	// Begin Transpile
	return tsProject.src()
	.pipe(plumber())
	.pipe(cache('transpileTS'))
	.pipe(tsProject())
	.once("error", function () {
		if (options.indexOf('--force') === -1) {
			this.once("finish", () => process.exit(1))
		}
  	})
	.js.pipe(gulp.dest('dist'))
})

/**
 * Server Start
 */
const startServer = 'startServer'
const serverStartCommand = 'node --trace-warnings ./bin/www'
gulp.task(startServer, [transpileTS], shell.task(serverStartCommand))

/**
 *  TSLint
 */
gulp.task('tslint', () => {
	return gulp
	.src(filesToWatch)
	.pipe(tslint())
	.pipe(tslint.report({ emitError: false }))
})

/**
 * Registers the new container w/ the container
 * registry (dockerhub for now)
 */
const buildContainer = 'buildContainer'
gulp.task(buildContainer, [transpileTS], (cb) => {
	return gulp.src('*.js', {read: false})
	.pipe(shell([
		    'eval $(docker-machine env)',
			`docker build -t ${IMAGE_NAME} .`,
			`docker tag ${IMAGE_NAME} ${taggedImage}`,
			`docker push ${taggedImage}`
	]))
})


/**
 * Set ENV
 */
var setProdENV = '__setProdENV'
gulp.task(setProdENV, () => {
	process.env.NODE_ENV = 'production'
})

var setDevENV = '__setDevENV'
gulp.task(setDevENV, (done) => {
	process.env.NODE_ENV = 'development'
	done()
})

var setTestENV = '__setTestENV'
gulp.task(setTestENV, (done) => {
	process.env.NODE_ENV = 'test'
	done()
})

/**
 * Watcher
 */
const watchTS = 'watchTS';
gulp.task(watchTS, [setDevENV, transpileTS, startServer], function () {
    return gulp.watch(filesToWatch, [transpileTS, startServer])
})

/**
 * Flush DB and Schema
 */
var __flushDB = '__flushDB'
gulp.task(__flushDB, [transpileTS], (done) => {
	const db = require('./dist/config/db')

	const modelsDir = `${__dirname}/dist/model`
	fs.readdirSync(modelsDir)
	.forEach(function(file) {
		// Require each model, which will load it into memory and populate
		// the related sequelize shared instance with the schema def
		require(path.join(modelsDir, file))
	})
	
	// Return the sync promise
	db.default.SharedInstance.sync({force: true}).then(() => {
	  done()
	})
	done()
})

/**
 * Gulp Tasks
 */
gulp.task('default', [watchTS])
gulp.on('stop', () => { process.exit(0); });
gulp.on('err', () => { process.exit(1); });
