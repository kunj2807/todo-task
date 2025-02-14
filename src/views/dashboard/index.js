import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TaskForm from "../../components/TaskForm";
import TaskGrid from "../../components/TaskGrid";

export default function Dashboard() {
    const [formModal, setFormModal] = useState(false)
    return <div>
        <div align='end' className="p-3">
            <Button variant="info" onClick={() => setFormModal(true)}>+ Add new task</Button>
        </div>
        <div  className="border rounded p-3">
            <TaskGrid/>
        </div>

        <Modal show={formModal} onHide={() => setFormModal(false)}>
            <TaskForm setFormModal={setFormModal}/>
        </Modal>
    </div>
}