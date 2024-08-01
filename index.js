import express from 'express';

const app = express();
const port = 3000 ;


// Create a route for Home Page
app.get("/", (req,res) => {
    res.send('Hello World!');
});


// Created a route to fetch users
app.get("/api/v1/users", (req,res) => {
    res.json([{ id : 101 , name : "Bharath"}]);
});


//Server is listening to the port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

