# MERN Stack Chat App  

#### Introduction

This repo consists of a Chat Application built with the MERN stack. 

This is a full-stack chat application with full user authentication and a functional database. 

Front End: The Front End is built by utilizing React + Hooks for component reusability and modularity. Navigation between UI pages was implemented with React-Router, persistent authentication by storing JWT’s in local storage, and executed client connection through SocketIOClient.

Back End: The Back End Utilizes mongoDB for its ease of scalability in a small-medium sized web app. I stored user accounts, conversations and messages in MongoDB, and handled REST API endpoints using Express. Real time communication was implemented using Socket.io, and added user authentication by validating JWT’s.

#### Features
This application provides users with the following features

- Authentication by validating JWT Tokens
- A Global Chat which can be used by anyone using the application to broadcast messages to everyone else.
- A Private Chat functionality where users can chat with other users privately.
- Real-time updates to the user list, conversation list, and conversation messages
- Active Status is displayed in users list based on the users last sent messages in either the global or any private chat. 
- Message Notifications are implemented using the useSnackbar function from the notistack module, and unread messages are calculated dynamically and displayed in the conversations list. 
- Users can add or modify their account information, or add a profile photo (via multer) in the account tab in the navbar dropdown. 


#### Global Chat 

![Global Screenshot](https://github.com/james2kim/chating-application/blob/main/assets/global-screenshot.png)



#### Private Chat 
![Private Screenshot](https://github.com/james2kim/chatting-application/blob/main/assets/private.png)



#### Login
![Login Screenshot](https://github.com/james2kim/chatting-application/blob/main/assets/login-screenshot.png)



#### Signup
![Signup Screenshot](https://github.com/james2kim/chatting-application/blob/main/assets/signup-screenshot.png)



#### Account
![Account Screenshot](https://github.com/james2kim/chatting-application/blob/main/assets/account-screenshot.png)



#### Update Profile Photo
![Update Profile Photo Screenshot](https://github.com/james2kim/chatting-application/blob/main/assets/updateaccount-screenshot.png)



#### How To Use

You can have this application up and running with just a few steps because the app is server side rendered through express. An optimal build mode has already been made, so just follow the steps below to do so.


##### Clone this repo
Once you have the repo, you need to install its dependencies. So using a terminal, move into the root directory of the project and execute npm install to install the dependencies of the Node.js server and then navigate into the client directory and run npm install to install the front end dependencies. 

This application uses MongoDB as its Database. So make sure you have it installed. You can find detailed guides on how to do so [here](https://docs.mongodb.com/manual/administration/install-community/). Once installed, make sure that your local MongoDB server is not protected by any kind of authentication. If there is authentication involved, make sure you edit the mongoURI in the config/keys.js file. 

Additionally you must connect the MongoDB in a seperate terminal. 

The download is a zip file. Unzip the contents, change the folder name to “mongodb”, and move it to your users home directory. From there, create a “mongodb-data” directory in your user directory to store the database data.

Example of what to type in terminal: 
/Users/jameskim/mongodb/bin/mongod --dbpath=/Users/jameskim/mongodb-data

Finally, all you have to do is open simply run npm run dev in your main terminal. Naviate to localhost:3001 to test this application. 

