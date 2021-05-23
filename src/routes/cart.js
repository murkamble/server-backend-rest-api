const express = require('express');
const router = express.Router();
const {
    addItemToCart,
    addToCart,
    getCartItems,
    removeCartItems,
  } = require("../controller/cart");
const { requireSignin, userMiddleware } = require('../common-middleware/index');

router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart);

router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
//new update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;