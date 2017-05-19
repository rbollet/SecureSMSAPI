SecureSMSAPI - Send et receive a secure message with API Rest Node JS Express Socket.Io for application Swift 3
===============================================================================================================

HOW TO INSTALL :
----------------
- git config --global user.name "John Doe"
- git config --global user.email johndoe@example.com
- git clone https://github.com/rbollet/SecureSMSAPI.git
- cd SecureSMSApi
- npm install
- npm start
- Read config.dist.js and configDB.dist.js in private folder
- Go to localhost:3000

HOW TO CONNECT :
----------------
- Go to http://localhost:3000 to test
- Use client API Rest like Postman to test url

EXAMPLES URL :
--------------
- POST http://url:3000/users/create with param password (return json response : uid and contacts and cookie)
- POST http://url:3000/users/login with params uid and password
- POST http://url:3000/contacts/find/contact with param uid and token in headers. Return true/false
- POST http://url:3000/contacts/add/contact with param uid and token in headers. Return true/false
