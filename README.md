
# Census Node.js API

Census Node.js is an API for communicating with the Android app. The database management system used on the backend is PostgreSQL

## Features
- Receives data from the client (Android app) and stores it on the database server.
- Extract data from the database and send it to the client in JSON format.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all necesary dependencies.

```bash
npm install census-node-js-backend
```

## Usage
Run the following command: 
```bash 
npm start 
``` 
## ER diagram 
![Screenshot_20230222_015728](https://user-images.githubusercontent.com/66331277/220614301-09cac902-dcaa-4824-832e-83f6f2786aea.png)





 ## Dependencies 

 Census app server requires the following dependencies: 

 * [express.js](https://www.npmjs.com/package/express) - ^1.0.0 

 * [fs](https://www.npmjs.com/package/fs) - ^0.0.1-security 

 * [json](https://www.npmjs.com/package/json) - ^11.0.0 

 * [path](https://www.npmjs.com/package/path) - ^0,12,7 

 * [pg](https://www,npmjs,com/package/pg) - ^8,9,0  

 ## License 

 Census Node, js Backend is licensed under the ISC license
