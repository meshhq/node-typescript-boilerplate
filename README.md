# Mesh Node TypeScript Boilerplate

[![CircleCI](https://circleci.com/gh/meshhq/node-typescript-boilerplate/tree/master.svg?style=svg&circle-token=15f15775c51f602d6fc70b9dda1ca8a40336833c)](https://circleci.com/gh/meshhq/node-typescript-boilerplate/tree/master)

This repository contains the source code for a `Node` `Express` boilerplate application written in `TypeScript`. 

## Rationale

Setting up and configuring a new JavaScript application built with modern frameworks demands a significant amount of time and cognitive overhead.

While the combination of Node, Express and Typescript provide a wonderful stack for writing modern server applicaitons, even experienced developers can struggle when getting started with a new application.

## Objective

The goal of this project is simple: **to provide developers with a pre-configured, standardized application starting point that allows them to start writing feature code immediately.**

This project will save developers time and headache when getting started with a new project. It will also provide them with a standardized project strucutre and configuration that can be used across all of their applications.

## Tooling 

[Node](https://nodejs.org/en/) - a `JavaScript` runtime built on Chrome's V8 JavaScript engine. `Uses` an event-driven, non-blocking I/O model that makes it lightweight and efficient.
[Express](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
[TypeScript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript, that compiles to plain JavaScript. Types enable JavaScript developers to use highly-productive development tools and practices like static checking and code refactoring.

## Getting Started

To get started, clone the application to your local machine.

```
git@github.com:meshhq/node-typescript-boilerplate.git
```

Install the application dependencies. 

```
npm install
```

Once all dependecies are installed, the application can be run locally via the following

```
npm start
```

This project also contains comprehensive unit tests which can be run via the following: 

```
npm test
```

## Functionality

This application intentionally contains minimal functionality, as it is meant to be a starting poing for a project. The only APIs this application exposes are user registration and login.

## Project Structure 

This project is built using the Mesh reccomended Typescript project structure. It is organized as detailed in the table below:

| Path              | Type              | Contains                                                      |
| ------------------|-------------------|---------------------------------------------------------------|
| `bin`           	| Directory         | Source code for running the actual application process        |
| `config`         	| Directory         | Configuration files for the application.					    |
| `controllers`     | Directory         | Controller files responsible for processing HTTP requests.    |
| `dist`            | Directory         | Contains transpiled JavaScript code files.                    |
| `logs`          	| Directory         | Log generated output files.						            |
| `middlewear`      | Directory         | Middlewear files responsible for processing HTTP requests.    |
| `model`           | Directory         | Model files that declare the schema for the application.      |
| `routes`          | Directory     	| Route files responsible for routing HTTP requests.	        |
| `test`            | Directory     	| Unit and integration test files.						        |
| `utils`           | Directory        	| Utility files containing helper modules and functions.        |
| `.env`            | ASCII text        | Environment configuration file for the application.			|
| `.gitignore`      | ASCII text 		| Tells git which files/directories to ignore.					|
| `gulpfile.js`    	| Glup spec     	| Gulp automation tasks file.									|
| `package.json`	| Project spec      | NPM configuration file for the application.					|
| `README.md`       | Markdown text     | This comprehensive README file.								|
| `server.ts`       | Typescript code   | The server file for the application.							|
| `tsconfig.json`   | JSON text   		| TypeScript configuration and compiler options.				|
| `tslint.json`     | JSON text   		| Configuration file for TSLint.								|
