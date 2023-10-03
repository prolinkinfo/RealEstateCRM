
import React from "react";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from "./paymentForm";
import Card from "components/card/Card";
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const PUBLIC_KEY = "pk_test_51Nx0ulSFr3y25H3gtYaIaVQDwcMVg1USXhA8DCu2sApXlLDf6vhCRLqqBNj2gKoeO2O5SiF5SZ1zCukR1IMztGFK00WeIq8rz3"

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
                    <Flex justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'}>
                        <img src={require('../../../assets/img/pay.avif')} />
                    </Flex>
                </Card>
            </GridItem>
            <GridItem colStart={12} textAlign={"right"}>
                <Button leftIcon={<AddIcon />} variant="brand">Add</Button>
            </GridItem>
        </Grid>

    );
};

export default StripeContainer;