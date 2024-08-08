import { firebase, db } from "./firebase";
import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  Button,
  Flex,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { TeamPlayerAdd } from "./TeamPlayerAdd";
import { useTeamAGames, useTeamBGames, useTeamPlayers } from "./firebaseHooks";
import { format } from "date-fns";
import { genders } from "./constants";
export function Team(props) {
  const { id } = useParams();
  const [team, setTeam] = React.useState();
  const [notFound, setNotFound] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const teamPlayers = useTeamPlayers(id);

  React.useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("teams")
      .doc(id)
      .get()
      .then((teamSnapshot) => {
        if (teamSnapshot.exists) {
          setTeam(teamSnapshot.data());
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  const gamesOfTeamA = useTeamAGames(id);
  const gamesOfTeamB = useTeamBGames(id);
  console.log(gamesOfTeamA, gamesOfTeamB);

  if (notFound) {
    return <div className="Team">Komanda nav atrasta</div>;
  }
  if (!team) {
    return <div className="Team">Loading...</div>;
  }
  console.log(teamPlayers);
  return (
    <div className="Team">
      <Container maxW="6xl">
        <Flex my="6">
          <span>
            <strong>Nosaukums</strong>
            <div className="output">{team.teamName}</div>
          </span>
          <span>
            <strong>Uzvarētās spēles</strong>
            <div className="output">{team.gamesWon}</div>
          </span>
          <span>
            <strong>Zaudētās spēles</strong>
            <div className="output">{team.gamesLost}</div>
          </span>
          <span>
            <strong>Spēles kopā</strong>
            <div className="output">{team.gamesTotal}</div>
          </span>
        </Flex>
        <Flex justify="flex-end" my="-4">
          <Button size="sm" colorScheme="blue" type="button" onClick={onOpen}>
            Pievienot spēlētāju
          </Button>
        </Flex>
        <h1>Spēlētāju saraksts</h1>
        <Flex justify="flex-end">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Vārds</Th>
                <Th>Uzvārds</Th>
                <Th>Vecums</Th>
                <Th>Dzimums</Th>
                <Th>Spēlētāja numurs</Th>
                <Th>Rezerves Speletajs</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teamPlayers.map((teamPlayer) => {
                function onPlayerClick() {
                  history.push("/teams/" + id + "/players/" + teamPlayer.id);
                }
                return (
                  <Tr key={teamPlayer.id} onClick={onPlayerClick}>
                    <Td>{teamPlayer.firstName}</Td>
                    <Td>{teamPlayer.lastName}</Td>
                    <Td>{teamPlayer.age}</Td>
                    <Td>
                      {genders[teamPlayer.gender]
                        ? genders[teamPlayer.gender].label
                        : ""}
                    </Td>
                    <Td>{teamPlayer.number}</Td>
                    <Td>{teamPlayer.backupPlayer ? "Jā" : "Nē"}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
        <h1>Komandas spēles</h1>
        <Flex justify="flex-end">
          <Table size="sm">
            <Thead>
              <Th>Pretinieku komanda</Th>
              <Th>Uzvara/zaude</Th>
              <Th>Datums</Th>
            </Thead>
            <Tbody>
              {gamesOfTeamA.map((game) => {
                function onPlannedGameClick() {
                  history.push("/games/" + game.id);
                }

                return (
                  <Tr key={game.id} onClick={onPlannedGameClick}>
                    <Td>{game.teamB.teamName}</Td>
                    <Td>?</Td>
                    <Td>
                      {game.gameStart
                        ? format(new Date(game.gameStart), "MM/dd/yyyy hh:mm")
                        : ""}
                    </Td>
                  </Tr>
                );
              })}
              {gamesOfTeamB.map((game) => {
                function onPlannedGameClick() {
                  history.push("/games/" + game.id);
                }
                return (
                  <Tr key={game.id} onClick={onPlannedGameClick}>
                    <Td>{game.teamA.teamName}</Td>
                    <Td>?</Td>
                    <Td>
                      {game.gameStart
                        ? format(new Date(game.gameStart), "MM/dd/yyyy hh:mm")
                        : ""}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Container>

      <TeamPlayerAdd isOpen={isOpen} onClose={onClose} teamId={id} />
    </div>
  );
}
// function querryTeamGames(teamId){
//   return db.collection("games")
//   .where("teamA", "==", teamId)
// }
