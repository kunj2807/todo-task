import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Col, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { deleteTask, getUserTaks } from "../store/task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";

export default function DraggableBox({ data }) {
    const statusColor = {
        'todo': { color: "info", title: "To do" },
        'inprogress': { color: "primary", title: "In progress" },
        'done': { color: "success", title: "Done" },
    }
    const [formModal, setFormModal] = useState(false)
    const dispatch = useDispatch()
    const handleDelete = async () => {
        try {
            await dispatch(deleteTask(data.id)).unwrap()
            dispatch(getUserTaks())
            toast.success('Successfully deleted')
        } catch (error) {
            toast.error(error.message)

        }
    }
    const handleUpdate = () => {
        setFormModal(true)
    }
    return <Col className="border rounded p-3 cursor-pointer position-relative p-0" >

        <div className="d-flex justify-content-between align-items-center">
            <h5>{data.title}</h5>
            <Badge bg={statusColor[data.status]}>{data.status}</Badge>
        </div>
        <h6 className="">{data.description}</h6>
        <p>Due date : <b>{moment(data.dueDate).format('DD/MM/YYYY')} </b></p>
        <div className=" d-flex gap-2 h-0 editingButtons justify-content-end">
            <Button variant="warning" size="sm" onClick={handleDelete}>
                <FaTrashAlt />
            </Button >
            <Button variant="danger" size="sm" onClick={handleUpdate}>
                <FaRegPenToSquare />
            </Button>

        </div>
        <Modal show={formModal} onHide={() => setFormModal(false)}>
            <TaskForm setFormModal={setFormModal} taskId={data.id} />
        </Modal>
    </Col>
}