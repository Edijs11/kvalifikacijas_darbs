import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Flex,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { useGamesByStatus } from "./firebaseHooks";

export function StartScreen(props) {
  const history = useHistory();

  const activeGames = useGamesByStatus("active");
  const plannedGames = useGamesByStatus("planned");
  const completedGames = useGamesByStatus("completed");
  return (
    <div className="StartScreen">
      <Container maxW="6xl" my="2">
        <h1>Aktīvās spēles</h1>
        <Flex my="4">
          <Table size="sm">
            <Thead>
              <Th>Komanda 1</Th>
              <Th>Komanda 2</Th>
              <Th>Spēles rezultāts</Th>
            </Thead>
            <Tbody>
              {activeGames.map((activeGame) => {
                function onActiveGameClick() {
                  history.push("/games/" + activeGame.id);
                }
                return (
                  <Tr key={activeGame.id} onClick={onActiveGameClick}>
                    <Td>{activeGame.teamA.teamName}</Td>
                    <Td>{activeGame.teamB.teamName}</Td>
                    <Td></Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
        <h1>Spēles drīzumā</h1>
        <Flex my="4">
          <Table size="sm">
            <Thead>
              <Th>Komanda 1</Th>
              <Th>Komanda 2</Th>
              <Th>Spēles sākums</Th>
            </Thead>
            <Tbody>
              {plannedGames.map((plannedGame) => {
                function onPlannedGameClick() {
                  history.push("/games/" + plannedGame.id);
                }
                return (
                  <Tr key={plannedGame.id} onClick={onPlannedGameClick}>
                    <Td>{plannedGame.teamA.teamName}</Td>
                    <Td>{plannedGame.teamB.teamName}</Td>
                    <Td>
                      {plannedGame.gameStart
                        ? format(
                            new Date(plannedGame.gameStart),
                            "MM/dd/yyyy hh:mm"
                          )
                        : ""}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
        <h1>Aizvadītās spēles</h1>
        <Flex my="4">
          <Table size="sm">
            <Thead>
              <Th>Komanda 1</Th>
              <Th>Komanda 2</Th>
              <Th>Rezultāts</Th>
            </Thead>
            <Tbody>
              {completedGames.map((completedGame) => {
                function onCompletedGameClick() {
                  history.push("/games/" + completedGame.id);
                }
                return (
                  <Tr key={completedGame.id} onClick={onCompletedGameClick}>
                    <Td>{completedGame.teamA.teamName}</Td>
                    <Td>{completedGame.teamB.teamName}</Td>
                    <Td></Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </div>
  );
}
