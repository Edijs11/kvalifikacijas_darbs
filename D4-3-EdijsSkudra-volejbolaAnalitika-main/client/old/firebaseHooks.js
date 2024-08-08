import React from "react";
import { db, firebase } from "./firebase";

export function useTeamPlayers(teamId) {
  const [teamPlayers, setTeamPlayers] = React.useState([]);

  React.useEffect(() => {
    if (!teamId) {
      return;
    }

    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("teams")
      .doc(teamId)
      .collection("players")
      .get()
      .then((snapshot) => {
        const teamPlayers = [];
        snapshot.forEach((doc) => {
          const player = {
            ...doc.data(),
            id: doc.id,
          };
          teamPlayers.push(player);
        });
        setTeamPlayers(teamPlayers);
      });
  }, [teamId]);

  return teamPlayers;
}

export function useTeamAGames(teamId) {
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    if (!teamId) {
      return;
    }
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .where("teamA.id", "==", teamId)
      .get()
      .then((snapshot) => {
        const games = [];
        snapshot.forEach((doc) => {
          const game = {
            ...doc.data(),
            id: doc.id,
          };
          games.push(game);
        });
        setGames(games);
      });
  }, [teamId]);

  return games;
}
export function useTeamBGames(teamId) {
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    if (!teamId) {
      return;
    }
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .where("teamB.id", "==", teamId)
      .get()
      .then((snapshot) => {
        const games = [];
        snapshot.forEach((doc) => {
          const game = {
            ...doc.data(),
            id: doc.id,
          };
          games.push(game);
        });
        setGames(games);
      });
  }, [teamId]);

  return games;
}

export function useGamesByStatus(status, limit = 5) {
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .where("status", "==", status)
      .orderBy("gameStart", "desc")
      .limit(limit)
      .onSnapshot((querySnapshot) => {
        const games = [];
        querySnapshot.forEach((doc) => {
          games.push({ id: doc.id, ...doc.data() });
        });
        setGames(games);
      });
  }, [status, limit]);

  return games;
}
