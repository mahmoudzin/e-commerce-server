const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./models/db.js");
const dotenv = require("dotenv");
const app = express();
//securty middlewares

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
//MVC Routes
const mvcRoutes = require("./routes/mvcRoutes.js");
const productsRouter = require("./routes/productRoutes.js");
const categoriesRouter = require("./routes/categoryRouter.js");
const registerRouter = require("./routes/userRouter.js");
//API routes
const apiProductRouter = require("./routes/api/products.js");
const apiCategoryRouter = require("./routes/api/categories.js");
const apiUserRouter = require("./routes/api/user.js");
const protectedRoutes = require("./middleware/protectedRoutes.js");
const AppError = require("./utilities/appError.js");
const globalError = require("./middleware/globalError.js");

dotenv.config({ path: "./config.env" });
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//too many requests
//DOS attack => denial of servcice
// a burte force attack =>
// express-rate-limit

const limiter = rateLimit({
  max: 10,
  windowMS: 60 * 60 * 1000,
  message: "Too many rewquest, try again agter an hour",
});

// app.use(limiter);
//helmet => set header
app.use(helmet());
//express-mongo-sanitize
app.use(mongoSanitize());
//sql / NoSql injection
//XSS => Cross site scripting
//xss-clean
app.use(xss());
app.use(hpp());
//hpp
app.use(
  "/api",
  apiUserRouter,
  // protectedRoutes.protectedAPIRoutes,
  apiProductRouter,
  apiCategoryRouter
);
app.use(
  registerRouter,
  protectedRoutes.protectedMVCRoutes,
  mvcRoutes,
  productsRouter,
  categoriesRouter
);
app.all("*", (req, res, next) => {
  next(new AppError("this route is not valid", 404));
});

app.use(globalError);
//environemnt vairables
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(port));
db();
