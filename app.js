import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { MyQueue } from "./queue.js";
import { stock } from "./queue.js";

const app = express();

const server = http.createServer(app);
const PORT = 4000;

// Socket IO Setup
export const Io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const ValidateStock = (_, res, next) => {
  if (stock > 0) return next();
  else res.status(400).json({ message: "Sorry, we running out the stock" });
};

const MyServer = async () => {
  try {
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.post("/buy", ValidateStock, async (req, res) => {
      let email = req.body.email;
      if (!email) throw Error("Required Email");
      MyQueue.add({ email });
      res.status(200).json({ message: "Your Order has been process" });
    });
    server.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
  } catch (error) {
    throw Error(error);
  }
};

MyServer();
