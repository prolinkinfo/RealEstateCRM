const stripeModule = require('stripe')


const add = async (req, res) => {
    const stripe = stripeModule(process.env.STRIPE_PRIVATE_KEY);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: "http://localhost:3000/payments",
            cancel_url: "http://localhost:3000/payments",
        });
        console.log(session)
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = { add }

