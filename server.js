const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const addressRoute = require("./routes/address");
const categoryRoute = require("./routes/category");
const newsletterRoute = require("./routes/newsletter");
const contactRoute = require("./routes/contact");
const paymentRoute = require("./routes/payment");
const heroRoute = require("./routes/hero");
const footerRoute = require("./routes/footer");
const cardRoute = require("./routes/card");
const colorRoute = require("./routes/color");

dotenv.config();
const app = express();
const session = require("express-session");
app.use(
  session({
    key: "userid",
    secret: "subscribe",
    resave: false,
    saveUninitialized: true,
    save: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

//mongoose;
mongoose
.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.then(() => {
  console.log("db connected successfully");
})
.catch((err) => {
  console.log(err);
});

//middleware;
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/hero", heroRoute);
app.use("/api/footer", footerRoute);
app.use("/api/card", cardRoute);
app.use("/api/pay", paymentRoute);
app.use("/api/users", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/newsletter", newsletterRoute);
app.use("/api/contact", contactRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/address", addressRoute);
app.use("/api/color", colorRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("api is runing");
});
