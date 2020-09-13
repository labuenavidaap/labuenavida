## LA BUENA VIDA APP

[See the website deployed](https://la-buena-vida.herokuapp.com/home)

### Webpage developed with Express and MongoDB

- [Installation and use](#installation-and-use)
- [Technologies used](#tools)
- [Life application](#live-demo)

### Installation and use:
- Once you have cloned the repository and move to the folder install the dependencies:
```
npm install
```

- Also install nodemon as DevDependency:
```
npm install nodemon --save-dev
```

- After that to populate the database exeute:
```
npm run seeds
```

- Finally once your database is running, run the application:
```
npm run dev
```
This will execute "dev": "nodemon -e hbs,js,css app.js" so you won't need to stop and run the app everytime you change anything in hbs or css.

### Tools:
- Express - 4.17.1
- MongoDB (Mongoose - ^5.10.0)
- HBS - ^4.1.1
- Axios
- Stripe -  ^8.92.0
- Other dependencies:
    - bcrypt - 5.0.0
    - cloudinary - ^1.22.0
    - connect-mongo - ^3.2.0
    - cookie-parser - ^1.4.5
    - dotenv - ^8.2.0
    - express-session - ^1.17.1
    - morgan: ^1.10.0"
    - multer: ^1.4.2
    - multer-storage-cloudinary: ^4.0.0
    - nodemailer - ^6.4.11
    - passport - ^0.4.1
    - passport-google-oauth20 - ^2.0.0"

### Developed by:
[Fernando Marín](https://github.com/fermarinsanchez)
[Miguel Valle](https://github.com/MiguelValle94)

![La Buena Vida App](https://res.cloudinary.com/difhe4gl3/image/upload/v1599598714/laBuenaVida/web-img/VERSION_MOBILE_eycumk.png)