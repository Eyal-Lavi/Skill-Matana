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
const xss = require('xss-clean');
const helmet = require('helmet');
app.use(cookieParser());
app.use(xss());
app.use(helmet());

var sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval:15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
});

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  rolling:true,
  store: sessionStore,
  cookie:{secure:false,
    expires: new Date(Date.now() + 360000)
 }
}));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

app.listen(PORT ,async() => {
    console.log('server started');
 });