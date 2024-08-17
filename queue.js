import Queue from "bull";
import { Io } from "./app.js";

export const MyQueue = new Queue("my-queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

export let stock = 5;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

MyQueue.process(async (job) => {
  // process the requests
  await delay(5000);
  if (stock > 0) {
    Io.emit(`${job.data.email}-send`, "Your order has been approved");
    stock -= 1;
  } else {
    Io.emit(`${job.data.email}-send`, "Sorry, we running out the stock");
  }
});
