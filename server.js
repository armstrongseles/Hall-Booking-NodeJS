const express = require("express")
const fs = require("fs")
const path = require("path");
const bodyParser =require("body-parser");


const app = express()
const port = 3000;

const rooms = [
    {
        "roomId" : 1,
        "roomName" :"Conference Room 1",
        "seats" :60,
        "amenities": ["AC", "projector", "whiteboard"],
        "pricePerHour": 75
    },
    {
        "roomId" : 2,
        "roomName" :"Meetin Hall 2",
        "seats" :30,
        "amenities": ["projector", "whiteboard"],
        "pricePerHour": 100
    },
    {
        "roomId" : 3,
        "roomName" :"BoardRoom A",
        "seats" :10,
        "amenities": [ "teleconference", "projector"],
        "pricePerHour": 110
    },
    {
        "roomId" : 4,
        "roomName" :"Training Room 1",
        "seats" :60,
        "amenities": ["White Board", "Computers"],
        "pricePerHour": 120
    },
    {
        "roomId" : 5,
        "roomName" :"Meetin Hall 4",
        "seats" :60,
        "amenities": ["AC", "projector"],
        "pricePerHour": 80
    }
]

const bookings = [
    {
        "roomId": 1,
        "bookingId": 1,
        "roomName" : "Conference Room 1",
        "customerName": "Michel Smith",
        "date": "2023-02-05",
        "startTime": "09:00",
        "endTime": "01:00"
    },
    {
        "roomId": 4,
        "bookingId": 2,
        "roomName" : "Meetin Hall 4",
        "customerName": "Santhosh Raj",
        "date": "2023-02-05",
        "startTime": "01:00",
        "endTime": "04:00"
    },
    {
        "roomId": 5,
        "bookingId": 3,
        "roomName" : "Meetin Hall 2",
        "customerName": "Jonathanan",
        "date": "2023-03-02",
        "startTime": "10:00",
        "endTime": "12:00"
    },
    {
        "roomId": 3,
        "bookingId": 4,
        "roomName" : "Training Room 1",
        "customerName": "Kusalan",
        "date": "2023-04-04",
        "startTime": "02:00",
        "endTime": "04:00"
    },
    {
        "roomId": 2,
        "bookingId": 5,
        "roomName" : "BoardRoom A",
        "customerName": "Will Smith",
        "date": "2023-03-05",
        "startTime": "11:00",
        "endTime": "02:00"
    },

]

app.use(bodyParser.json())
//Home Page Design
app.get("/",(req,res)=>{
    res.send(`
    
    <div style="text-align: center; padding: 50px; background-color: #3498db; color: #fff;">
    <h1 style="font-family: 'Arial', sans-serif; font-size: 28px;">
        Welcome to Elegant Hotel Bookings
    </h1>
    <div style="margin-top: 20px;">
        <a href="/rooms/booked" style="text-decoration: none; background-color: #2ecc71; color: #fff; padding: 15px 30px; border-radius: 5px;">
            View Rooms with Bookings
        </a>
    </div>
    <div style="margin-top: 20px;">
        <a href="/customers/booked" style="text-decoration: none; background-color: #e74c3c; color: #fff; padding: 15px 30px; border-radius: 5px;">
            View Customers with Booked Rooms
        </a>
    </div>
    <div style="margin-top: 20px;">
        <a href="/customers/Will%20Smith/booking-history" style="text-decoration: none; background-color: #f39c12; color: #fff; padding: 15px 30px; border-radius: 5px;">
            View Cusomer Booking History with Booked Rooms
        </a>
    </div>
</div>

    `)
})



//create Rooms API
app.post('/rooms', (req, res)=> {
    const newRoom= {
        roomId: rooms.length+1,
        roomName: req.body.roomName,
        bookedStatus: false,
        seats: req.body.seats,
        amenities: req.body.amenities,
        pricePerHour: req.body.pricePerHour,
    };
    rooms.push(newRoom);
    res.send({message: 'Room Created Sucessfully',newRoom})
})

//Booking Room API
app.post("/booking", (req,res) => {
    const newBooking = {
        roomId: req.body.roomId,
        bookingId : bookings.length+1,
        customerName: req.body.customerName,
        roomName: req.body.roomName,
        bookedStatus: true,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    };
    bookings.push(newBooking);
    res.send({message: 'Room Booked Successfully', newBooking})
})

// To get a rooms with booked data

app.get("/rooms/booked", (req, res) => {
    const bookedRooms = bookings.map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId);
        return {
            "roomName": booking.roomName,
            "bookedStatus": "confirmed",
            "customerName": booking.customerName,
            "date": booking.date,
            "startTime": booking.startTime,
            "endTime": booking.endTime,
        }
    });
    res.send(bookedRooms);
    
    
})

// To get a customers details with booked data

app.get("/customers/booked", (req, res) => {
    const bookedCustomer = bookings.map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId)

        return {
            customerName: booking.customerName,
            roomName: booking.roomName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        }
    })
    res.json(bookedCustomer)
})

// To get a customer Booking History by rooms booking

app.get('/customers/:customerName/booking-history', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookingHistory = bookings
      .filter((booking) => booking.customerName === customerName)
      .map((booking) => {
        const room = rooms.find((r) => r.roomId === booking.roomId);
        return {
          roomName: booking.roomName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          bookingId: booking.bookingId,
          bookingDate: new Date().toISOString(),
          bookingStatus: 'Confirmed',
        };
      });
    res.json({customerName,Booking_History : customerBookingHistory});
  });
  
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
