const mongoose = require("mongoose");
const express = require("express");

require("dotenv").config();

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfullyy..");
  } catch (error) {
    console.error(Error);
    console.log("Error Connecting DB...");
    process.exit(1);
  }
};
module.exports = connectDB;
