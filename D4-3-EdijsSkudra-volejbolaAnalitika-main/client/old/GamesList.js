import React from "react";
import { useHistory } from "react-router-dom";
import { db, firebase } from "./firebase";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { GameAdd } from "./GameAdd";
import { format } from "date-fns";
export default function GamesList(props) {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [games, setGames] = React.useState([]);
  const [sort, setSort] = React.useState(null);
  React.useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .onSnapshot((querySnapshot) => {
        const newGames = [];
        querySnapshot.forEach((doc) => {
          newGames.push({ id: doc.id, ...doc.data() });
        });
        setGames(newGames);
      });
  }, []);

  function onFieldSort(field) {
    setSort((currentValue) => {
      if (currentValue && currentValue.field === field) {
        if (currentValue.direction === "asc") {
          return { direction: "dsc", field: field };
        } else {
          return null;
        }
      }
      return { direction: "asc", field: field };
    });
  }

  let sortedGames = [...games];
  if (sort !== null) {
    if (sort.direction === "asc") {
      sortedGames = sortedGames.sort((a, b) => {
        if (a[sort.field] < b[sort.field]) {
          return -1;
        }
        if (a[sort.field] > b[sort.field]) {
          return 1;
        }
        return 0;
      });
    } else if (sort.direction === "dsc") {
      sortedGames = sortedGames.sort((a, b) => {
        if (a[sort.field] > b[sort.field]) {
          return -1;
        }
        if (a[sort.field] < b[sort.field]) {
          return 1;
        }
        return 0;
      });
    }
  }
  return (
    <div className="GamesList">
      <Container maxW="6xl">
        <Flex justify="flex-end" my="4">
          <Button size="sm" colorScheme="blue" type="button" onClick={onOpen}>
            Pievienot spēli
          </Button>
        </Flex>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th onClick={() => onFieldSort("teamA")}>
                Komanda 1
                {sort && sort.direction === "asc" && sort.field === "teamA"
                  ? "(A)"
                  : null}
                {sort && sort.direction === "dsc" && sort.field === "teamA"
                  ? "(D)"
                  : null}
              </Th>
              <Th onClick={() => onFieldSort("teamB")}>
                Komanda 2
                {sort && sort.direction === "asc" && sort.field === "teamB"
                  ? "(A)"
                  : null}
                {sort && sort.direction === "dsc" && sort.field === "teamB"
                  ? "(D)"
                  : null}
              </Th>

              <Th onClick={() => onFieldSort("category")}>
                Kategorija
                {sort && sort.direction === "asc" && sort.field === "category"
                  ? "(A)"
                  : null}
                {sort && sort.direction === "dsc" && sort.field === "category"
                  ? "(D)"
                  : null}
              </Th>
              <Th onClick={() => onFieldSort("location")}>
                Spēles atrašanās vieta
                {sort && sort.direction === "asc" && sort.field === "location"
                  ? "(A)"
                  : null}
                {sort && sort.direction === "dsc" && sort.field === "location"
                  ? "(D)"
                  : null}
              </Th>
              <Th>Spēles sākums</Th>
            </Tr>
          </Thead>

          <Tbody>
            {sortedGames.map((game) => {
              console.log(game);
              function onGameClick() {
                history.push("/games/" + game.id);
              }
              return (
                <Tr key={game.id} onClick={onGameClick}>
                  <Td>{game.teamA.teamName}</Td>
                  <Td>{game.teamB.teamName}</Td>
                  <Td>{game.category}</Td>
                  <Td>{game.location}</Td>
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
      </Container>
      <GameAdd isOpen={isOpen} onClose={onClose} teams={props.teams} />
    </div>
  );
}
