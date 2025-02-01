function getWinner(player1, player2) {
  const choice1 = player1.toLowerCase();
  const choice2 = player2.toLowerCase();

  if (choice1 === choice2) {
    return "tie";
  }

  if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "scissors" && choice2 === "paper") ||
    (choice1 === "paper" && choice2 === "rock")
  ) {
    return "player1";
  } else if (
    (choice2 === "rock" && choice1 === "scissors") ||
    (choice2 === "scissors" && choice1 === "paper") ||
    (choice2 === "paper" && choice1 === "rock")
  ) {
    return "player2";
  }
}

module.exports = getWinner;
