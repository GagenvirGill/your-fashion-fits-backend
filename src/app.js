// src/app.js
import express from "express";

// Import Auth
import passport from "passport";
import "./config/passport.js";

// Import Routers
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import serverUptimeRoutes from "./routes/serverUptimeRoutes.js";

// Import Middleware Modules
import corsMiddleware from "./middleware/corsMiddleware.js";
import jsonParser from "./middleware/jsonParser.js";
import urlEncodedParser from "./middleware/urlEncodedParser.js";
import errorHandler from "./middleware/errorHandler.js";
import authenticateJwt from "./middleware/authenticateJwt.js";

const app = express();
app.use(passport.initialize());

// Middlewares
app.use(corsMiddleware);
app.use(jsonParser);
app.use(urlEncodedParser);

// Registered Routes
app.use("/category", authenticateJwt, categoryRoutes);
app.use("/item", authenticateJwt, itemRoutes);
app.use("/outfit", authenticateJwt, outfitRoutes);
app.use("/auth", authRoutes);
app.use("/health", serverUptimeRoutes);

// Middleware Error Handler
app.use(errorHandler);

export default app;
