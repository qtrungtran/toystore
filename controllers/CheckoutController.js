const _ = require("lodash");
const models = require("../models");
const paginate = require("../utils/paginate");
const getUserInfo = require("../utils/getUserInfo");
const paypal = require("@paypal/payouts-sdk");
class CheckoutController {
	async payout(req, res) {
		let clientId = "AQAbunPoq-8ZpQ_rIzKBO96RfBgjXEtjzTKsk3hbCrTp5Bf4P2yZMbsMunmwZOYBDf24lA2ICfTitROj";
		let clientSecret = "EL2Q-3on6Tq3yBGeAJLCAUKiseejV8SXYsIeitUdGO-TNvoFCB2dAnFvJ4Q0PBbZj6WjgDSL3ZFRXoyt";
		let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
		let client = new paypal.core.PayPalHttpClient(environment);

		const now = new Date();
		const key = now.getTime();
		const amount = Number(req.body.amount);
		let requestBody = {
			sender_batch_header: {
				recipient_type: "EMAIL",
				email_message: "SDK payouts test txn",
				note: "Enjoy your Payout!!",
				sender_batch_id: key,
				email_subject: "This is a test transaction from SDK",
			},
			items: [
				{
					note: "Your 5$ Payout!",
					amount: {
						currency: "USD",
						value: amount,
					},
					receiver: "sb-pnsqh6362630@business.example.com",
					sender_item_id: key,
				},
			],
		};

		// Construct a request object and set desired parameters
		// Here, PayoutsPostRequest() creates a POST request to /v1/payments/payouts
		let request = new paypal.payouts.PayoutsPostRequest();
		request.requestBody(requestBody);

		// Call API with your client and get a response for your call
		let createPayouts = async function () {
			let response = await client.execute(request);
			console.log(`Response: ${JSON.stringify(response)}`);
			// If call returns body in response, you can get the deserialized version from the result attribute of the response.
			console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
			return response.result.batch_header.payout_batch_id;
		};
		const r = await createPayouts();
		console.log({ r });
		return res.status(200).json(r);
	}
}

module.exports = new CheckoutController();
