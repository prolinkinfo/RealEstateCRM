
import React from "react";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from "./paymentForm";
import Card from "components/card/Card";

const PUBLIC_KEY = "pk_test_51MRpvESGG380XDgW3sTuUA8417QttHST0TksijbHY70BEycOUHWMlYWBI6xxrPuuhhPVWaSN0bIR3jDh0zE3iSYN00wk5jkOTR"

const stirpeTestPromise = loadStripe(PUBLIC_KEY)

const StripeContainer = () => {
    return (
        <Card>

            <Elements stripe={stirpeTestPromise}>
                <PaymentForm />
            </Elements>
        </Card>
    );
};

export default StripeContainer;