import React from "react";
import { useHistory } from "react-router-dom";
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
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useGamesQuery } from "../queries/games";
import { format } from "date-fns";
import { GameAdd } from "./GameAdd";

export function GamesPage() {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, error, data: games } = useGamesQuery();

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

  return (
    <div className="GamesPage">
      <Container maxW="6xl">
        <Flex justify="flex-end" my="4">
          <Button size="sm" colorScheme="blue" type="button" onClick={onOpen}>
            Pievienot spēli
          </Button>
        </Flex>
        <Heading size="lg" mx={2} my={4}>
          Spēļu saraksts
        </Heading>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Komanda 1</Th>
              <Th>Komanda 2</Th>
              <Th>Kategorija</Th>
              <Th>Atrašanās vieta</Th>
              <Th>Spēles sākums</Th>
            </Tr>
          </Thead>

          <Tbody>
            {games.map((game) => {
              console.log(game);
              function onGameClick() {
                history.push("/games/" + game.id);
              }
              return (
                <Tr key={game.id} onClick={onGameClick}>
                  <Td>{game.teamA.name}</Td>
                  <Td>{game.teamB.name}</Td>
                  <Td>{game.category.name}</Td>
                  <Td>{game.location}</Td>
                  <Td>
                    {game.plannedAt
                      ? format(new Date(game.plannedAt), "MM/dd/yyyy hh:mm")
                      : ""}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Container>
      <GameAdd isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
