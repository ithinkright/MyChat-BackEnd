# MyChat-BackEnd
A project for MyChat to take part in software game

#### Code Structure

+ [x] config
  + mysql.js  (configuration file for mysql) This file is not upload because of secure


+ [x] controllers
  + Index.js (controllers root file)
  + users.js (user controller file)


+ [x] data (folder for user to save file, like mail, photo) This folder is not upload because of secure
+ [x] models (Communicate with mysql database, write sql sentences)
  + Index.js (models root file)
  + users.js(user model file)


+ [x] middlewares(middleware for koa)
  + Index.js(root file to load all middleware)
  + unifyData.js(unify  ctx.request.body , ctx.request.query, ctx.param as ctx.param)
  + unifyError.js(handle all error)


+ [x] public (provide static files) test for socket
+ [x] routers (routers for koa)
  + Index.js (root file)
  + users.js (users router file)


+ [x] services
  + db (connect to mysql, provide db service)
  + Mail (send mail, receive mail and notify user)
  + MyChatUtils (a units library for MyChat)
  + socket.io (provice socket service)


+ [x] package.json
+ [x] package-lock.json
+ [x] app.js (start the server)
+ [x] README.md

#### Usage
1. git clone
2. new a config folder and a data folder
3. npm run dev and go to localhost:3000