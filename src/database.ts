import { connect } from "mongoose";
import { config } from "dotenv";

config({ path: ".env" });

const MONGO_URI = (process.env?.MONGO_HOST || "").replace(
  "<password>",
  process.env?.MONGO_PW || ""
);

connect(MONGO_URI, {
  socketTimeoutMS: 10000,
})
  .then(() => console.log("Connected with MongoDB successfully"))
  .catch((err) => console.error("Failed to connected to MongoDB", err));
