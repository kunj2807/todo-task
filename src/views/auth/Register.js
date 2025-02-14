import { Formik } from "formik";
import React from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as yup from 'yup';
import { registerUser } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";
export default function Register() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const validation = yup.object({
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(5),
    })
    return (
        <Row className="m-0 justify-content-center p-3">
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: ""
                }}
                validationSchema={validation}
                onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                    setSubmitting(true)
                    try {
                        await dispatch(registerUser(values)).unwrap()
                        resetForm()
                        navigate('/')
                    } catch (error) {
                        setFieldError('general', error)
                    }
                    finally {
                        setSubmitting(false)
                    }
                }}
            >
                {
                    ({ values, handleChange, handleSubmit, touched, isSubmitting, errors }) => {
                        return <Col md={6} lg={4} className="border rounded p-3">
                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                                <h3>Register</h3>
                                {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                                <Form.Group className="mb-3" >
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name="name" value={values.name} onChange={handleChange} placeholder="Enter name" />
                                    {errors.name && touched.name && <small className="text-danger">{errors.name}</small>}
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name='email' placeholder="Enter email" value={values.email} onChange={handleChange} />
                                    {errors.email && touched.email && <small className="text-danger">{errors.email}</small>}
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name='password' placeholder="Password" value={values.password} onChange={handleChange} />
                                    {errors.password && touched.password && <small className="text-danger">{errors.password}</small>}
                                </Form.Group>
                                <div align='end' className="d-flex flex-column align-items-end">
                                    <Button variant="success" type="submit" disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                    <Link to='/login'>Have an account? Login</Link>
                                </div>
                            </Form>
                        </Col>
                    }
                }
            </Formik>
        </Row>
    )
}