const express = require("express");
const app = express();
const port = 8000;
const fs = require('fs');
const path = require('path');
const os = require('os');

app.use(express.json());


app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        // const token = authHeader.split(' ')[1];// if token is likr bearer token then Authentication middleware: expects 'Authorization: Bearer mysecrettoken'
        const token = authHeader;
        if (token === "mysecrettoken") {
            return res.status(200).json({ message: "Authorized: Valid token" });
        } else {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});