import { db, firebase } from "./firebase";

export function gameEventsRef(gameId) {
  return db
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("games")
    .doc(gameId)
    .collection("events");
}
