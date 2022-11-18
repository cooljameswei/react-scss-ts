import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default Routers;