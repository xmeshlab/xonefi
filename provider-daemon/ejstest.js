// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Define middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to XOneFi Provider RESTful API!');
});

// CRUD operations for a hypothetical resource "items"
// Create item
app.post('/request', (req, res) => {
    // Your logic for creating an item goes here
    res.send(`Request received. Body: ${JSON.stringify(req.body)}`);
});

// // Get item
// app.get('/items/:id', (req, res) => {
//     // Your logic for retrieving an item goes here
//     res.send(`Item with id ${req.params.id} fetched!`);
// });
//
// // Update item
// app.put('/items/:id', (req, res) => {
//     // Your logic for updating an item goes here
//     res.send(`Item with id ${req.params.id} updated!`);
// });
//
// // Delete item
// app.delete('/items/:id', (req, res) => {
//     // Your logic for deleting an item goes here
//     res.send(`Item with id ${req.params.id} deleted!`);
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});