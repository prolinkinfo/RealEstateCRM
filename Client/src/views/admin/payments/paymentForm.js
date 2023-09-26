
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useState } from 'react'


const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#000",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" }
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        },
        InputElement: {
            color: "#000"
        }
    }
}

export default function PaymentForm() {
    const [success, setSuccess] = useState(false)
    const stripe = useStripe()
    const elements = useElements()



    const handleSubmit = async () => {
        // try {
        //     setIsLoding(true)
        //     let response = await postApi('api/stripe/create-checkout-session', values)
        //     if (response.status === 200) {
        //         if (res.ok) return res.json();
        //         return res.json().then((json) => Promise.reject(json));
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
        // finally {
        //     setIsLoding(false)
        // }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const { error, paymentMethod } = await stripe.createPaymentMethod({
    //         type: "card",
    //         card: elements.getElement(CardElement)
    //     })


    //     if (!error) {
    //         try {
    //             const { id } = paymentMethod
    //             const response = await axios.post("http://localhost:4000/payment", {
    //                 amount: 1000,
    //                 id
    //             })

    //             if (response.data.success) {
    //                 console.log("Successful payment")
    //                 setSuccess(true)
    //             }

    //         } catch (error) {
    //             console.log("Error", error)
    //         }
    //     } else {
    //         console.log(error.message)
    //     }
    // }

    return (
        <>
            {!success ?
                <form onSubmit={handleSubmit}>
                    <fieldset className="FormGroup">
                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <button style={{ margin: "14px 0 0 0" }}>Pay</button>
                </form>
                :
                <div>
                    <h2>You just bought a sweet spatula congrats this is the best decision of you're life</h2>
                </div>
            }

        </>
    )
}
