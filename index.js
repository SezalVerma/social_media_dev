const express = require("express");
const cookieParser = require("cookie-parser");
// all strategies for authentication
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const passportGithub = require("./config/passport-github");
// for session cookie
const session = require("express-session");
// to store cookie/session info in db
const MongoStore = require("connect-mongodb-session")(session);
// to convert scss to css
const sassMiddleware = require("node-sass-middleware");
// to flash notification on events
const flash = require("connect-flash");
// our own middleware
const middleware = require("./config/middleware");

const port = 8000;
const app = express();

// get db , it runs the page while requiring
const db = require("./config/mongoose");

/*get layouts & ask express to use it . mention before routes , as layouts to be rendered in views */
const express_layouts = require("express-ejs-layouts");
const { pass } = require("./config/mongoose");
app.use(express_layouts);
// extract script & style from sub pages & render in specific part in layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use sass middleware , when a particaular route is asked for in browser, its scss gets converted to scss at that time
app.use(
  sassMiddleware({
    // take scss files from source
    src: "./assets/scss",
    // convert & put css files in destination
    dest: "./assets/css",
    // show error while converting files (app in development mode)
    debug: true,
    // show converted css  in multiple lines (expanded)
    outputStyle: "expanded",
    // css files are in which folder (<link href="/prefix/home.css">)
    prefix: "/css",
  })
);

// refer static files for views in "assets" folder
app.use(express.static("./assets"));

// cookies be parsed & send with body
app.use(cookieParser());

// for parsing req body
app.use(express.urlencoded({ extended: true }));

// set up view engine & path of folder to render views from -- for all routes
app.set("view engine", "ejs");
app.set("views", "./views");

// express-session , encrypts the cookie
// name under which cookie stored , secret - key for encrypt/decrypt , maxAge - in millisec
app.use(
  session({
    name: "codeial",
    secret: "something",
    //    if user is not authenticated , dont initialise a cookie
    saveUninitialized: false,
    //    if already data saved in cookie, dont resave same
    resave: false,
    cookie: {
      //    100 min lifetime of cookie, after it destroys
      maxAge: 1000 * 60 * 100,
    },
    // mongo store is used to store the session cookie in the db ,even when session restarts cookie is present
    store: new MongoStore(
      {
        //  db stores -> mongoose.connection
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb store  setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash after session as it uses session cookies
app.use(flash());
// uses flash
app.use(middleware.setFlash);

// for any url ,use routes from
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error while firing the server at port : ${port}`);
    return;
  }

  console.log(` Server is successfully running at port : ${port}`);
});
