import React from "react";
import { useTeamsQuery } from "../queries/teams";
import { useHistory } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
  useDisclosure,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import "./TeamsPage.css";
import { TeamAdd } from "./TeamAdd";

export function TeamsPage() {
  const history = useHistory();
  const { isLoading, error, data: teams } = useTeamsQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  console.log(teams);
  return (
    <div>
      <Container maxW="6xl" my={4}>
        <Flex justify="flex-end" my="4">
          <Button size="sm" colorScheme="blue" onClick={onOpen}>
            Pievienot komandu
          </Button>
        </Flex>
        <Heading size="lg" mx={2} my={4}>
          Komandu saraksts
        </Heading>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Komandas</Th>
              <Th>Uzvarētās spēles</Th>
              <Th>Zaudētās spēles</Th>
              <Th>Spēles kopā</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => {
              function onTeamClick() {
                history.push("/teams/" + team.id);
              }
              return (
                <Tr key={team.id} onClick={onTeamClick}>
                  <Td>{team.name}</Td>
                  <Td>{team.gamesWonCount}</Td>
                  <Td>{team.gamesLostCount}</Td>
                  <Td>{team.gamesTotalCount}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Container>

      <TeamAdd isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
