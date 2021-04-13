require("dotenv").config();
const models = require("./models");
const createError = require("http-errors");
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const roleRouter = require("./routes/roles");
const categoriesRouter = require("./routes/categories");
const statusesRouter = require("./routes/statuses");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const orderDetailsRouter = require("./routes/orderdetails");
const cartsRouter = require("./routes/carts");
const cartDetailsRouter = require("./routes/cartdetails");
const imagesRouter = require("./routes/images");
const reviewsRouter = require("./routes/reviews");
const provincesRouter = require("./routes/provinces");
const transRouter = require("./routes/trans");
const transactionsRouter = require("./routes/transactions");
const orderHistoriesRouter = require("./routes/orderHistories");
const statisticsRouter = require("./routes/statistics");
const checkoutRouter = require("./routes/checkout");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/roles", roleRouter);
app.use("/categories", categoriesRouter);
app.use("/statuses", statusesRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/order-details", orderDetailsRouter);
app.use("/carts", cartsRouter);
app.use("/cart-details", cartDetailsRouter);
app.use("/images", imagesRouter);
app.use("/reviews", reviewsRouter);
app.use("/provinces", provincesRouter);
app.use("/transportation", transRouter);
app.use("/transactions", transactionsRouter);
app.use("/order-histories", orderHistoriesRouter);
app.use("/statistics", statisticsRouter);
app.use("/payout", checkoutRouter);

app.post("/webhook", async (req, res) => {
	// console.log("app", req.body);
	const type = req.body.event_type;
	const paypalPayoutId = req.body.resource.payout_batch_id;
	const paypalTransactionId = req.body.resource.transaction_id;

	console.log(type, paypalPayoutId, req.body);
	var trans;
	switch (type) {
		case "PAYMENT.PAYOUTS-ITEM.SUCCEEDED":
			// await transactionController.updateSuccessfulTransaction(
			//   paypalPayoutId,
			//   paypalTransactionId
			// );
			trans = await models.Transaction.findOne({
				where: {
					payoutId: paypalPayoutId
				}
			});
			trans.status = "Thành công";
			trans.save();
			console.log(type, paypalPayoutId, req.body);
			break;
		case "PAYMENT.PAYOUTS-ITEM.UNCLAIMED":
			// await transactionController.updateUnclaimedTransaction(
			//   paypalPayoutId,
			//   paypalTransactionId
			// );
			console.log(type, paypalPayoutId, req.body);
			break;
		case "PAYMENT.PAYOUTS-ITEM.FAILED":
			// await transactionController.updateFailedTransaction(
			//   paypalPayoutId,
			//   paypalTransactionId
			// );
			trans = await models.Transaction.findOne({
				where: {
					payoutId: paypalPayoutId
				}
			});
			trans.status = "Thất bại";
			trans.save();
			console.log(type, paypalPayoutId, req.body);
			break;
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
