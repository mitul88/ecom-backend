const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
module.exports = (app) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
