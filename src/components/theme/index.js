import React from "react";
import { Row } from "react-bootstrap";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Theme() {
    return <>
        <Row className="m-0">
            <Navbar/>
            <Outlet />
        </Row>
    </>
}