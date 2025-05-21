const express = require('express');
const PORT = 3000;
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const {sequelize} = require('./utils/database'); //create a connection to the db
const cookieParser = require('cookie-parser');
const session =  require('express-session');
const routes = require('./routes/index');
const SequelizeStore = require('express-session-sequelize')(session.Store); 

app.use(cookieParser());

var sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval:15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
});

app.use(session({
  secret: process.env.SEESION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie:{secure:false,
    expires: new Date(Date.now() + 360000)
 }
}));

app.use(cors());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",routes);

app.get('/',(request , response , next) =>{
    response.send('hello ');
    response.end();
});

app.listen(PORT ,async() => {
    console.log('server started');
 });