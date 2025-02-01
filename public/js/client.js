const clientSocket = io();

let mainContainer = document.getElementById("mainContainer");
let roomName = document.getElementById("roomname");
let numberOfPoints = document.querySelectorAll("input[type='radio']");
let createBtn = document.getElementById("createRoomBtn");
let closeCreateRoom = document.getElementById("closeCreateRoom");
let closeJoinRoomPopup = document.getElementById("closejoinRoom");
let createRoomPopup = document.getElementById("createRoomPopup");
let joinRoomPopup = document.getElementById("joinRoomPopup");

let createRoomPopupBtn = document.getElementById("createRoom");
let joinRoomPopupBtn = document.getElementById("joinRoom");

let joinBtn = document.getElementById("JoinBtn");
let joinRoomName = document.getElementById("joinRoomName");

let roomExistBox = document.getElementById("errorBox");

let gameBox = document.getElementById("displayGame");

let waitElement = document.getElementById("wait");

let gameBtnBoxes = document.getElementById("gameButtonsBox");
let gameButtons = document.querySelectorAll(".round");

let waitingBoard = document.getElementById("waitingBoard");

let resultBox = document.getElementById("resultBox");
let winMsg = document.getElementById("winMsg");

let againBtn = document.getElementById("againBtn");
let home = document.getElementById("homeBtn");

let rock = document.getElementById("rock");
let paper = document.getElementById("paper");
let scissors = document.getElementById("scissors");

home.addEventListener("click", () => {
  clientSocket.emit("home", "back to home");
});

clientSocket.on("reload", (msg) => {
  window.location.reload();
});

let score = 0;

// let selectedPoint = "10";

// for (let radio of numberOfPoints) {
//   radio.addEventListener("change", () => {
//     if (radio.checked == true) {
//       selectedPoint = radio.id;
//     }
//     console.log(selectedPoint);
//   });
// }

createRoomPopupBtn.addEventListener("click", () => {
  createRoomPopup.style.display = "flex";
  mainContainer.style.filter = "blur(10px)";
  mainContainer.style.pointerEvents = "none";
});

closeCreateRoom.addEventListener("click", () => {
  createRoomPopup.style.display = "none";
  mainContainer.style.filter = "blur(0)";
  mainContainer.style.pointerEvents = "auto";
  roomName.value = "";
});

joinRoomPopupBtn.addEventListener("click", () => {
  joinRoomPopup.style.display = "flex";
  mainContainer.style.filter = "blur(10px)";
  mainContainer.style.pointerEvents = "none";
});

closeJoinRoomPopup.addEventListener("click", () => {
  joinRoomPopup.style.display = "none";
  mainContainer.style.filter = "blur(0)";
  mainContainer.style.pointerEvents = "auto";
});

clientSocket.emit("createRoom");

createBtn.addEventListener("click", function () {
  if (roomName.value.length != 0) {
    let room = roomName.value;
    clientSocket.emit("newroom", { room });
    console.log("Hello");
  }
  roomName.value = "";
});

joinBtn.addEventListener("click", function () {
  if (joinRoomName.value.length != 0) {
    let joinRoom = joinRoomName.value;
    clientSocket.emit("joinroom", { joinRoom });
    console.log("join hello");
  }
  joinRoomName.value = "";
});

clientSocket.on("room exist", (msg) => {
  roomExistBox.style.display = "inline";
});

clientSocket.on("room joined", (roomname) => {
  mainContainer.style.display = "none";
  createRoomPopup.style.display = "none";
  joinRoomPopup.style.display = "none";
  gameBox.style.display = "inline";
  waitElement.style.display = "inline";
  waitingBoard.style.display = "none";
  gameBtnBoxes.style.display = "none";
  resultBox.style.display = "none";
});

clientSocket.on("start game", (roomname) => {
  mainContainer.style.display = "none";
  createRoomPopup.style.display = "none";
  joinRoomPopup.style.display = "none";
  gameBox.style.display = "inline";
  waitElement.style.display = "none";
  waitingBoard.style.display = "none";
  gameBtnBoxes.style.display = "flex";
  resultBox.style.display = "none";
  giveChoices();
});

function giveChoices() {
  let count = 0;
  for (let gameBtn of gameButtons) {
    console.log(++count);
    gameBtn.onclick = () => {
      let choice = gameBtn.id;
      console.log("btn clicked");
      console.log(clientSocket.id);
      console.log(choice);
      clientSocket.emit("choice", choice);
      gameBtnBoxes.style.display = "none";
      waitingBoard.style.display = "flex";
      resultBox.style.display = "none";
    };
  }
}

clientSocket.on("choiceImg1", (choice) => {
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");

  player1.style.backgroundImage = `url('/assets/icon-${choice}.svg')`;
  player2.style.backgroundImage = "none";
});

clientSocket.on("choiceImg2", (choice) => {
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");
  player1.style.backgroundImage = "none";
  player2.style.backgroundImage = `url('/assets/icon-${choice}.svg')`;
});

clientSocket.on("result1", (resultMsg) => {
  console.log(resultMsg + ": result");

  resultBox.style.display = "flex";
  if (resultMsg == "tie") {
    winMsg.textContent = "TIE";
  } else if (resultMsg == "player1") {
    winMsg.textContent = "Player One WIN";
  } else if (resultMsg == "player2") {
    winMsg.textContent = "Player Two WIN";
  }
});

clientSocket.on("result2", (resultMsg) => {
  console.log(resultMsg + ": result");
  resultBox.style.display = "flex";
  if (resultMsg == "tie") {
    winMsg.textContent = "TIE";
  } else if (resultMsg == "player1") {
    winMsg.textContent = "Player One WIN";
  } else if (resultMsg == "player2") {
    winMsg.textContent = "Player Two WIN";
  }
});

clientSocket.on("finalImg1", (imgs) => {
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");
  player1.style.backgroundImage = `url('/assets/icon-${imgs[0]}.svg')`;
  player2.style.backgroundImage = `url('/assets/icon-${imgs[1]}.svg')`;
});

clientSocket.on("finalImg2", (imgs) => {
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");
  player1.style.backgroundImage = `url('/assets/icon-${imgs[0]}.svg')`;
  player2.style.backgroundImage = `url('/assets/icon-${imgs[1]}.svg')`;
});

againBtn.addEventListener("click", () => {
  let player2 = document.getElementById("player2");
  let player1 = document.getElementById("player1");
  player1.style.backgroundImage = "none";
  player2.style.backgroundImage = "none";

  clientSocket.emit("restart", "Restart the game");
  clientSocket.on("start game", (roomname) => {
    mainContainer.style.display = "none";
    createRoomPopup.style.display = "none";
    joinRoomPopup.style.display = "none";
    gameBox.style.display = "inline";
    waitElement.style.display = "none";
    waitingBoard.style.display = "none";
    gameBtnBoxes.style.display = "flex";
    resultBox.style.display = "none";
  });
});

// mainContainer.style.display = "none";
// createRoomPopup.style.display = "none";
// joinRoomPopup.style.display = "none";
// gameBox.style.display = "inline";
