# Mesh Typescript Boilerplate

This repository contains the source code for a React/Redux boilerplate application written in Typescript. 

## Rationale

Setting up and configuring a new Node application built with modern frameworks demands a decent amount of time and cognitive overhead.

The goal of this project is simple: **to provide developers with a pre-configured, standardized application starting point that allows them to start writing feature code immediately.**

This project will save developers time and headache when getting started with a new project. It will also provide them with a standardized project strucutre and configuration that can be used across all of their applications.

## Getting Started

To get started, clone the application to your local machine.

```
git clone git@meshhg/react-redux-boilerplate.git
```

Install the application dependencies. 

```
npm install
```

Once all dependecies are installed, the application can be run locally via the following

```
npm start
```

## Functionality

This application intentionally contains minimal functionality, as it is meant to be a starting poing for a project. The only APIs this application exposes is user registration and login.

## Project Structure 

This project is built using the Mesh reccomended Typescript project structure. It is organized as detailed in the table below:

| Path              | Type              | Contains                                                                   |
| ------------------|-------------------|----------------------------------------------------------------------------|
| `bin`           	| Directory         | Source code for running the actual application process                     |
| `config`         	| Directory         | Configuration files for the application.					                 |
| `controllers`     | Directory         | Controller files responsible for processing HTTP requests.                 |
| `dist`            | Directory         | Contains transpiled JavaScript code files.                                 |
| `logs`          	| Directory         | Log generated output files.						                         |
| `middlewear`      | Directory         | Middlewear files responsible for processing HTTP requests.                 |
| `model`           | Directory         | Model files that declare the schema for the application.                   |
| `node_modules`    | Directory         | Source code for the application's dependencies.                            |
| `routes`          | Directory     	| Route files responsible for routing HTTP requests.	                     |
| `test`            | Directory     	| Unit and integration test files.						                     |
| `utils`           | Directory        	| Utility files containing helper modules and functions.                     |
| `.babelrc`      	| JSON text        	| 
| `.env`            | ASCII text        | 
| `.gitignore`      | ASCII text 		| 
| `gulpfile.js`    	| Glupfile spec     | 
| `package.json`	| Project spec      | 
| `README.md`       | Markdown text     | 
| `server.ts`       | Typescript code   | 
| `tsconfig.json`   | JSON text   		| 
| `tslint.json`     | JSON text   		| 
| `yarn.lock`       | JSON text   		| 