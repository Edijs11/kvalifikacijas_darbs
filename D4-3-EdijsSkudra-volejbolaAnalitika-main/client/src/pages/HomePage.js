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
  Text,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { useGamesGroupedByStatusQuery } from "../queries/games";

export function HomePage(props) {
  const history = useHistory();
  const { isLoading, error, data } = useGamesGroupedByStatusQuery();

  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load teams</div>;
  }

  const { plannedGames, activeGames, completedGames } = data;
  console.log(data);
  return (
    <div className="StartScreen">
      <Container maxW="6xl" my="2">
        <Heading size="lg" mx={2} my={4}>
          Aktīvās spēles
        </Heading>
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
                    <Td>{activeGame.teamA.name}</Td>
                    <Td>{activeGame.teamB.name}</Td>
                    <Td>
                      ({activeGame.teamASets}) {activeGame.teamAPoints} -
                      {activeGame.teamBPoints} ({activeGame.teamBSets})
                    </Td>
                  </Tr>
                );
              })}
              {activeGames.length === 0 && (
                <EmptyGameList title="Šobrīd nav aktīvu spēļu" />
              )}
            </Tbody>
          </Table>
        </Flex>
        <Heading size="lg" mx={2} my={4}>
          Spēles drīzumā
        </Heading>
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
                    <Td>{plannedGame.teamA.name}</Td>
                    <Td>{plannedGame.teamB.name}</Td>
                    <Td>
                      {plannedGame.plannedAt
                        ? format(
                            new Date(plannedGame.plannedAt),
                            "MM/dd/yyyy hh:mm"
                          )
                        : ""}
                    </Td>
                  </Tr>
                );
              })}
              {plannedGames.length === 0 && (
                <EmptyGameList title="Šobrīd nav plānotu spēļu" />
              )}
            </Tbody>
          </Table>
        </Flex>
        <Heading size="lg" mx={2} my={4}>
          Aizvadītās spēles
        </Heading>
        <Flex my="4">
          <Table size="sm">
            <Thead>
              <Th>Komanda 1</Th>
              <Th>Komanda 2</Th>
              <Th>Spēles rezultāts</Th>
            </Thead>
            <Tbody>
              {completedGames.map((completedGame) => {
                function onCompletedGameClick() {
                  history.push("/games/" + completedGame.id);
                }
                return (
                  <Tr key={completedGame.id} onClick={onCompletedGameClick}>
                    <Td>{completedGame.teamA.name}</Td>
                    <Td>{completedGame.teamB.name}</Td>
                    <Td>
                      {completedGame.teamASets} - {completedGame.teamBSets}
                    </Td>
                  </Tr>
                );
              })}
              {completedGames.length === 0 && (
                <EmptyGameList title="Šobrīd nav aizvadītu spēļu" />
              )}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </div>
  );
}

function EmptyGameList({ title }) {
  return (
    <Tr>
      <Td colSpan={3} textAlign="center">
        <Text p={4}>{title}</Text>
      </Td>
    </Tr>
  );
}
