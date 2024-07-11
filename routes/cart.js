const express = require("express");
const { isLoggedIn } = require("../middleware");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PbQ2fEdFhMTqqmgABwFuUkvC8epnbcQ9xtsMKC3WqHBbFYCWBAwpnpwajBV1qSsgLmyjluXTfZUSpk3HlbjZ8MO004YG4Q9Af"
);

router.get("/user/cart", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let user = await User.findById(userId).populate("cart");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  res.render("cart/cart", { user, totalAmount });
});

router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
  let { productId } = req.params;
  let userId = req.user._id;
  let user = await User.findById(userId);
  let product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect("/user/cart");
});

router.get("/checkout/:id", async (req, res) => {
  let userId = req.params.id;
  let user = await User.findById(userId).populate("cart");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Amount to pay",
          },
          unit_amount: Math.floor(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4242/success",
    cancel_url: "http://localhost:4242/cancel",
  });

  res.redirect(303, session.url);
});

module.exports = router;
