// src/app.js
import express from "express";

// Import Routers
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import serverUptimeRoutes from "./routes/serverUptimeRoutes.js";

// Import Middleware Modules
import corsMiddleware from "./middleware/corsMiddleware.js";
import jsonParser from "./middleware/jsonParser.js";
import urlEncodedParser from "./middleware/urlEncodedParser.js";
import errorHandler from "./middleware/errorHandler.js";
import authenticateApiKey from "./middleware/authenticateApiKey.js";

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(jsonParser);
app.use(urlEncodedParser);

// Registered Routes
app.use("/category", authenticateApiKey, categoryRoutes);
app.use("/item", authenticateApiKey, itemRoutes);
app.use("/outfit", authenticateApiKey, outfitRoutes);
app.use("/user", authenticateApiKey, userRoutes);
app.use("/health", serverUptimeRoutes);

// Middleware Error Handler
app.use(errorHandler);

export default app;
