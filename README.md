# Mesh Typescript Boilerplate

This repository contains the source code for a React/Redux boilerplate application written in Typescript. 

### Rationale

Setting up and configuring a new Node application built with modern frameworks demands a decent amount of time and cognitive overhead.

The goal of this project is simple -- to provide developers with a pre-configured, standardized application starting point that allows them to start writing feature code immediately. 

This project will save developers time and headache when getting started with a new project. It will also provide them with a standardized project strucutre and configuration that can, and should, be used across all of their applications. 

### Project Structure 

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

########################

Open sourcing Mesh Boilerplate

We start a lot of new software projects at Mesh. Whether we are kicking of a new project for a customer, or prototyping a new internal project, we need our engineers to get productive as quickly as possible. 

Modern applications unfortunately require a decent amount of configuration and setup before developers can start writting application code. In an effort to speed up this process, we have developer internal "boilerplate" project for several languages and development platforms. Today, we are very excited to open source two of those projects **react-redux-boiler-plate** and **node-typescript-boilerplate**. 

## React + Redux + Typescript

It is somewhat mindblowing how much project configuration and setup is need to get up and running with a react/redux project written in typescript. For starers, all three frameworks must be installed into an environment. Typescript mus then be configured via a tslint.config file. Webpack must be installed to transpiles Webpack code into vanilla js. 

## Express + Sequelize + Typescript

## Contributions Welcome 

While these boilerplate applications represent how Mesh reccomends projects be configured, we are always open to feedback and contributions from the broader development community. We welcome any and all pull requests. 



