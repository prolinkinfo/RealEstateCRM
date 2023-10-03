const stripeModule = require('stripe')


const index = async (req, res) => {
    const stripe = stripeModule(process.env.STRIPE_PRIVATE_KEY);
    try {
        const session = await stripe.paymentIntents.list({ limit: 100 });

        const paymentIntents = session.data;

        const paymentInfo = [];

        for (const paymentIntent of paymentIntents) {
            const paymentMethodId = paymentIntent.payment_method;
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

            // Extract card details
            const cardDetails = paymentMethod.card;
            const billingDetails = paymentMethod.billing_details;
            const expMonth = cardDetails.exp_month < 10 ? `0${cardDetails.exp_month}` : cardDetails.exp_month;
            const expYear = cardDetails.exp_year.toString().slice(-2); // Get the last two digits of the year

            const paymentData = {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                cardholderName: billingDetails.name,
                cardholderEmail: billingDetails.email,
                cardExp: `${expMonth}/${expYear}`,
                cardBrand: cardDetails.brand,
                cardNumber: `**** **** **** ${cardDetails.last4}`,
            };

            paymentInfo.push(paymentData);
        }

        res.status(200).json(paymentInfo);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }
}

const add = async (req, res) => {
    const stripe = stripeModule(process.env.STRIPE_PRIVATE_KEY);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.body.customer_email,
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            description: item.description,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: "https://real-estate-crm-jet.vercel.app/payments",
            cancel_url: "https://real-estate-crm-jet.vercel.app/payments",
        });
        res.json({ url: session.url });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }
}

module.exports = { add, index }

