"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const product_route_1 = __importDefault(require("./product.route"));
const color_route_1 = __importDefault(require("./color.route"));
const category_route_1 = __importDefault(require("./category.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const size_route_1 = __importDefault(require("./size.route"));
const cart_route_1 = __importDefault(require("./cart.route"));
const variant_route_1 = __importDefault(require("./variant.route"));
const coupon_route_1 = __importDefault(require("./coupon.route"));
const order_route_1 = __importDefault(require("./order.route"));
const rating_route_1 = __importDefault(require("./rating.route"));
const router = (0, express_1.Router)();
router.use('/auth', auth_route_1.default);
router.use('/products', product_route_1.default);
router.use('/category', category_route_1.default);
router.use('/users', user_route_1.default);
router.use('/colors', color_route_1.default);
router.use('/sizes', size_route_1.default);
router.use('/cart', cart_route_1.default);
router.use('/coupons', coupon_route_1.default);
router.use('/variant', variant_route_1.default);
router.use('/orders', order_route_1.default);
router.use('/ratings', rating_route_1.default);
exports.default = router;
