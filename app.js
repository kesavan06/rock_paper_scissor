const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { Socket } = require("dgram");
const getWinner = require("./utils/rock_paper_scissor");

const app = express();

const pubDir = path.join(__dirname, "/public");
const viewPath = path.join(__dirname, "/views");

app.set("view engine", "ejs");
app.set("views", viewPath);
app.use(express.static(pubDir));

const server = http.createServer(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/game", (req, res) => {
  res.render("game");
});
let roomnames = [];
let roomChoices = {};
io.on("connection", (serverSocket) => {
  console.log("New user connected: id-> " + serverSocket.id);

  serverSocket.on("newroom", async (roomObj) => {
    console.log("Room name:", roomObj.room);
    console.log("All rooms: " + roomnames);

    let roomSockets = await io.in(roomObj.room).fetchSockets();
    console.log("length:" + roomSockets.length);
    if (!roomnames.includes(roomObj.room)) {
      roomnames.push(roomObj.room);
      console.log(roomnames);

      serverSocket.join(roomObj.room);
      console.log("room joined");
      serverSocket.emit("room joined", roomObj.room);
      serverSocket.on("restart", (msg) => {
        io.to(roomObj.room).emit("start game", roomObj.room);
      });
      serverSocket.on("choice", (choice) => {
        serverSocket.emit("choiceImg1", choice);
        console.log(roomObj.room);
        if (!roomChoices[roomObj.room]) {
          roomChoices[roomObj.room] = [];
        }
        roomChoices[roomObj.room].push(choice);
        if (roomChoices[roomObj.room].length == 2) {
          console.log(roomChoices);
          let firstChoice = roomChoices[roomObj.room][0];
          let secondChoice = roomChoices[roomObj.room][1];
          io.to(roomObj.room).emit("finalImg1", [secondChoice, firstChoice]);
          let result = getWinner(
            roomChoices[roomObj.room][1],
            roomChoices[roomObj.room][0]
          );
          console.log(result);
          roomChoices[roomObj.room] = [];
          io.to(roomObj.room).emit("result1", result);
        }
      });
      serverSocket.on("home", (msg) => {
        io.to(roomObj.room).emit("reload", "Reload the page");
      });
    } else {
      console.log("room already exist");
      serverSocket.emit("room exist", "Room already exist");
    }
  });

  serverSocket.on("joinroom", async (roomname) => {
    let roomSockets = await io.in(roomname.joinRoom).fetchSockets();
    console.log("length:" + roomSockets.length);

    if (
      roomnames.includes(roomname.joinRoom) &&
      roomSockets.length >= 0 &&
      roomSockets.length < 2
    ) {
      serverSocket.join(roomname.joinRoom);
      console.log("socket joined to the " + roomname.joinRoom);

      io.to(roomname.joinRoom).emit("start game", roomname.joinRoom);

      serverSocket.on("restart", (msg) => {
        io.to(roomname.joinRoom).emit("start game", roomname.joinRoom);
      });

      serverSocket.on("choice", (choice) => {
        serverSocket.emit("choiceImg2", choice);
        console.log(roomname.joinRoom);
        if (!roomChoices[roomname.joinRoom]) {
          roomChoices[roomname.joinRoom] = [];
        }
        roomChoices[roomname.joinRoom].push(choice);

        if (roomChoices[roomname.joinRoom].length == 2) {
          let firstChoice = roomChoices[roomname.joinRoom][0];
          let secondChoice = roomChoices[roomname.joinRoom][1];
          io.to(roomname.joinRoom).emit("finalImg2", [
            firstChoice,
            secondChoice,
          ]);
          let result = getWinner(
            roomChoices[roomname.joinRoom][0],
            roomChoices[roomname.joinRoom][1]
          );
          console.log(result);
          roomChoices[roomname.joinRoom] = [];
          io.to(roomname.joinRoom).emit("result2", result);
        }
      });
      serverSocket.on("home", (msg) => {
        io.to(roomname.joinRoom).emit("reload", "Reload the page");
      });
    } else {
      console.log("Room is not present or full");
    }
  });

  // serverSocket.on("newroom", async (roomObj) => {
  //   console.log("Room name:", roomObj.room);
  //   console.log(allRooms);
  //   let roomSockets = await io.in(roomObj.room).fetchSockets();
  //   console.log("length:" + roomSockets.length);
  //   if (roomSockets.length >= 0 && roomSockets.length < 2) {
  //     serverSocket.join(roomObj.room);
  //     roomnames.push(roomObj.room);
  //     console.log("room joined");
  //   } else {
  //     console.log("More than 2 sockets");
  //   }
  // });
});

server.listen(3014, () => {
  console.log("Connected: http://localhost:3014");
});
