// src/middleware/urlEncodedParser.js
import { urlencoded } from "express";

const urlEncodedParser = urlencoded({ limit: "5mb", extended: true });

export default urlEncodedParser;
