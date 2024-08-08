import React from "react";
import { useParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { db, firebase } from "./firebase";
import { genders } from "./constants";
export function TeamPlayer() {
  const { teamId, playerId } = useParams();
  const [notFound, setNotFound] = React.useState(false);
  const [player, setPlayer] = React.useState();

  React.useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("teams")
      .doc(teamId)
      .collection("players")
      .doc(playerId)
      .get()
      .then((teamSnapshot) => {
        if (teamSnapshot.exists) {
          setPlayer(teamSnapshot.data());
        } else {
          setNotFound(true);
        }
      });
  });

  if (notFound) {
    return <div>Spēlētājs netika atrasts</div>;
  }
  if (!player) {
    return <div>Loading...</div>;
  }
  return (
    <div className="TeamPlayer">
      <Flex direction="column" m="10px">
        <div>
          <strong>Vārds: </strong>
          {player.firstName}
        </div>
        <div>
          <strong>Uzvārds: </strong>
          {player.lastName}
        </div>
        <div>
          <strong>Vecums: </strong>
          {player.age}
        </div>
        <div>
          <strong>Dzimums: </strong>
          {genders[player.gender] ? genders[player.gender].label : ""}
          {/* {genders[player.gender]?.label} */}
        </div>
        <div>
          <strong>Spēlētāja Numurs: </strong>
          {player.number}
        </div>
        <div>
          <strong>Rezervists: </strong>
          {player.backupPlayer ? "Jā" : "Nē"}
        </div>
      </Flex>
    </div>
  );
}
