import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'
import App from "./App";
import "./styles.scss";

// @ts-ignore
const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
