import { Button, FormLabel, GridItem, Input, Text } from "@chakra-ui/react"
import { useFormik } from "formik"
import * as yup from 'yup'


export default function PaymentForm() {

    const initialValues = {
        name: "",
        amount: '',
        email: '',
    }
    const validation = yup.object({
        name: yup.string().min(2).required('First Name is required'),
        amount: yup.number().max(999999.99, 'total amount due must be no more than ₹999,999.99.').required('Amount is required'),
        email: yup.string().email().required('Email is required'),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validation,
        onSubmit: (values, { resetForm }) => {
            addPayment();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit } = formik

    const addPayment = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URL}api/payment/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify({
                    items: [
                        { quantity: 1, price: values.amount, name: values.name, description: 'send to Prolink' },
                    ],
                    customer_email: values.email,
                }),
            }
        )
            .then((res) => {
                if (res.ok) return res.json();
                localStorage.setItem('res', res)
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
            <GridItem display='flex' justifyContent="center" padding="10px 0 50px 0">
                <img src={require('../../../assets/img/masterCard.png')} width="100px" />
                <img src={require('../../../assets/img/american-express.png')} width="100px" />
                <img src={require('../../../assets/img/visa.png')} width="100px" />
            </GridItem>
            <GridItem sx={{ m: 1, width: '100%' }} >
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
                    placeholder="Enter name"
                    fontWeight='500'
                    borderColor={errors?.name && touched?.name ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.name && touched.name && errors.name}</Text>
            </GridItem>
            <GridItem sx={{ m: 1, width: '100%' }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Email
                </FormLabel>
                <Input
                    type="text"
                    fontSize='sm'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    placeholder="Enter Email"
                    fontWeight='500'
                    borderColor={errors?.email && touched?.email ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.email && touched.email && errors.email}</Text>
            </GridItem>
            <GridItem sx={{ m: 1, width: '100%' }} >
                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                    Amount
                </FormLabel>
                <Input
                    type="number"
                    fontSize='sm'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.amount}
                    placeholder="Enter Amount"
                    name="amount"
                    fontWeight='500'
                    borderColor={errors?.amount && touched?.amount ? "red.300" : null}
                />
                <Text mb='10px' color={'red'}> {errors.amount && touched.amount && errors.amount}</Text>
            </GridItem>
            <Button onClick={handleSubmit} variant="brand" size="sm">Pay</Button>
        </>
    )
}
