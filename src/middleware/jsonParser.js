// src/middleware/jsonParser.js
import { json } from "express";

const jsonParser = json({ limit: "5mb" });

export default jsonParser;
