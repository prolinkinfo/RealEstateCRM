
import React from "react";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from "./paymentForm";
import Card from "components/card/Card";
import { Grid, GridItem } from "@chakra-ui/react";

const PUBLIC_KEY = "pk_test_51MRpvESGG380XDgW3sTuUA8417QttHST0TksijbHY70BEycOUHWMlYWBI6xxrPuuhhPVWaSN0bIR3jDh0zE3iSYN00wk5jkOTR"

const stirpeTestPromise = loadStripe(PUBLIC_KEY)

const StripeContainer = () => {
    return (

        <Grid templateColumns="repeat(12, 1fr)" gap={3}>

            <GridItem colSpan={{ base: 12, md: 6 }}>
                <Card>

                    <Elements stripe={stirpeTestPromise}>
                        <PaymentForm />
                    </Elements>
                </Card>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
                <Card>
                    <img src={require('../../../assets/img/pay.avif')} width="80%" />
                </Card>
            </GridItem>
        </Grid>

    );
};

export default StripeContainer;