import { config } from "dotenv";
import app from "./app";
import "./database";
import "./socket";

config({
  path: ".env",
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
