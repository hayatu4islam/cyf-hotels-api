const express = require("express");
const app = express();
const port = 5000;
// const cors = require("cors");
// app.use(cors());

app.use(express.json());
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "cyf_hotels",
    password: "sharifa",
    port: 5432
});

app.get("/", (req, res) => {
    res.json("Welcome to CYF HOTELS API");
})

app.get("/hotels", function(req, res) {
    const hotelNameQuery = req.query.name;
    let query = 'SELECT * FROM hotels ORDER BY name';
    let params = [];
    if(hotelNameQuery){
        query = 'SELECT * FROM hotels WHERE name LIKE $1 ORDER BY name';
        params.push(`%${hotelNameQuery}%`);
    }

    pool.query(query, params)
    .then((result) => res.json(result.rows))
    .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });

});

app.get("/hotels/:hotelId", function(req, res){
    const hotelId = req.params.hotelId;

    pool.query("SELECT * FROM hotels WHERE id=$1", [hotelId])
        .then((result) => res.json(result.rows))
        .catch((error) => {
            console.error(error);
            res.status(500).json(error);
        });
});

app.get("/customers", function(req, res){
    const customerNameQuery = req.query.name;
    let query = "SELECT * FROM customers ORDER BY name";
    let params = [];
    if (customerNameQuery) {
      query = "SELECT * FROM customers WHERE name LIKE $1 ORDER BY name";
      params.push(`%${customerNameQuery}%`);
    }

    pool.query(query, params)
      .then((result) => res.json(result.rows))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
});

app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers INNER JOIN  WHERE id=$1 ", [customerId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});


// app.post("/hotels", function(req, res){
//     const newHotelName = req.body.name;
//     const newHotelRooms = req.body.rooms;
//     const newHotelPostcode = req.body.postcode;

//     if(!Number.isInteger(newHotelRooms) || newHotelRooms <= 0){
//         return res.status(400).send("The number of rooms should be a positive integer.");
//     }

//     const query = "INSERT INTO hotels (id, name, rooms, postcode) VALUES ($1, $2, $3, $4)";
//     pool.query(query, [newHotelName, newHotelRooms, newHotelPostcode])
//     .then(() => res.send("Hotel created!"))
//     .catch((error) => {
//         console.error(error);
//         res.status(500).json(error);
//     });
// });

app.listen(port, function () {
    console.log("Server is listening on port "+port+". Ready to accept requests!");
});
