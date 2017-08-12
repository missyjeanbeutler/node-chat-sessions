const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const session = require('express-session');
const createInitialSession = require('./middlewares/session.js');
const filter = require('./middlewares/filter.js');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10000 }
}));

// app.use((req, res, next) => {
//   createInitialSession(req, res, next)
// },
// (req, res, next) => {
//   const { method } = req;
//   if ( method === "POST" || method === "PUT" ) {
//     filter( req, res, next );
//   } else {
//     next();
//   }
// })
app.use(createInitialSession,
(req, res, next) => {
  const { method } = req;
  if ( method === "POST" || method === "PUT" ) {
    filter( req, res, next );
  } else {
    next();
  }
})


const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.get(messagesBaseUrl + '/history', mc.history)
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );