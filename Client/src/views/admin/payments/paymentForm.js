
import { FormLabel, GridItem, Input, Text } from "@chakra-ui/react"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useFormik } from "formik"
import { useEffect, useState } from 'react'


export default function PaymentForm() {
    const [price, setPrice] = useState(false)



    const initialValues = {
        name: "",
        amount: '1000',
    }


    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: phoneCallSchema,
        // onSubmit: (handleSubmit)
        onSubmit: (values, { resetForm }) => {
            handleSubmit();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, setFieldValue } = formik

    const handleSubmit = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URL}api/payment/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    items: [{ quantity: 1, price: values.amount, name: values.name }],
                }),
            }
        )
            .then((res) => {
                if (res.ok) return res.json();
                return res.json().then((json) => Promise.reject(json));
            })
            .then(({ url }) => {
                window.open(url);
            })
            .catch((e) => {
                console.log(e.error);
            });
    }
    return (
        <>
            <GridItem colSpan={{ base: 12, md: 6 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Name
                </FormLabel>
                <Input
                    type="text"
                    fontSize='sm'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    name="name"
                    fontWeight='500'
                    borderColor={errors?.name && touched?.name ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Amount
                </FormLabel>
                <Input
                    type="number"
                    fontSize='sm'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.amount}
                    name="amount"
                    fontWeight='500'
                    borderColor={errors?.amount && touched?.amount ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.amount && touched.amount && errors.amount}</Text>
            </GridItem>

            <button style={{ margin: "14px 0 0 0" }} onClick={handleSubmit}>Pay</button>
            {/* // <form
                //     onSubmit={handleSubmit}
                // >
                //     <fieldset className="FormGroup">
                //         <div className="FormRow">
                //             <CardElement options={CARD_OPTIONS} />
                //         </div>
                //     </fieldset>
                //     <button style={{ margin: "14px 0 0 0" }}>Pay</button>
                // </form> */}



        </>
    )
}
