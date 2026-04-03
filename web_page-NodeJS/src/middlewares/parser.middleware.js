const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const parserMiddleware = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "../public")));
};

module.exports = parserMiddleware;
