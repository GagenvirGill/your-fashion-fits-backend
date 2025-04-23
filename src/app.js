// src/app.js
import express from "express";
import fs from "fs";
import envConfig from "./config/envConfig.js";

// Import Routers
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Import Middleware Modules
import corsMiddleware from "./middleware/corsMiddleware.js";
import jsonParser from "./middleware/jsonParser.js";
import urlEncodedParser from "./middleware/urlEncodedParser.js";
import errorHandler from "./middleware/errorHandler.js";
import ensureAuth from "./middleware/authenticate.js";

// Import Auth
import session from "express-session";
import passport from "passport";
import "./config/passport.js";

const app = express();

app.use(
	session({
		secret: envConfig.sessionSecret,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

const uploadFolder = envConfig.uploadsFolder;
if (!fs.existsSync(uploadFolder)) {
	fs.mkdirSync(uploadFolder);
}

// Middlewares
app.use(corsMiddleware);
app.use(jsonParser);
app.use(urlEncodedParser);

// Uploaded Image Static Access
app.use("/uploads", express.static(uploadFolder));

// Registered Routes
app.use("/category", ensureAuth, categoryRoutes);
app.use("/item", ensureAuth, itemRoutes);
app.use("/outfit", ensureAuth, outfitRoutes);
app.use("/auth", authRoutes);

// Middleware Error Handler
app.use(errorHandler);

export default app;
