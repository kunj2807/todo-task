import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
// import { loginUser, registerUser } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";
import task, { addTask, getTaskById, getUserTaks, updateTask } from "../store/task";
import moment from "moment";
import { toast } from "react-toastify";

export default function TaskForm(props) {
    const currentTask  = useSelector(state=>state.task.currentTask)
    const taskId = props.taskId || 0
    const dispatch = useDispatch()
    const validation = yup.object({
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
        dueDate: yup.date().required('Date is required')
    })
    useEffect(() => {
        if (taskId) {
            dispatch(getTaskById(taskId))
        }
    },[])
    return (
        <Row className="m-0 justify-content-center p-3 w-100">
            {(currentTask || !props.taskId) && <Formik
                initialValues={{
                    title: currentTask?.title || "",
                    dueDate: currentTask?.dueDate || moment().format('YYYY-MM-DD'),
                    description: currentTask?.description || "",
                }}
                validationSchema={validation}
                onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                    setSubmitting(true)
                    try {
                        if (taskId) {
                            await dispatch(updateTask({ ...currentTask, ...values })).unwrap()
                        } else {
                            await dispatch(addTask(values)).unwrap()
                        }
                        dispatch(getUserTaks())
                        resetForm()
                        toast.success(`Successfully ${taskId?"updated":"submited"}`)
                        props.setFormModal(false)
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
                        return <Col className="border rounded p-3">
                            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
                                <h3>{taskId ? 'Update' : 'Add'} Task</h3>
                                {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                                <Form.Group className="mb-3" >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name='title' placeholder="Enter title" value={values.title} onChange={handleChange} />
                                    {errors.title && touched.title && <small className="text-danger">{errors.title}</small>}
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" name='dueDate' value={values.dueDate} onChange={handleChange} />
                                    {errors.dueDate && touched.dueDate && <small className="text-danger">{errors.dueDate}</small>}
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" name='description' placeholder="Enter description" value={values.description} onChange={handleChange} />
                                    {errors.description && touched.description && <small className="text-danger">{errors.description}</small>}
                                </Form.Group>
                                <div align='end' className="d-flex justify-content-end gap-2">

                                    <Button variant="info" type="submit" disabled={isSubmitting}>
                                        {taskId ? 'Update' : "Submit"}
                                    </Button>
                                    <Button variant="primary" onClick={() => props.setFormModal(false)}>
                                        close
                                    </Button>

                                </div>
                            </Form>
                        </Col>
                    }
                }
            </Formik>}
        </Row>
    )
}