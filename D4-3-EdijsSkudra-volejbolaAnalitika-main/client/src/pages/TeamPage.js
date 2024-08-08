import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDeleteTeamMutation, useTeamQuery } from "../queries/teams";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Flex,
  Heading,
  Stack,
  Button,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialog,
  AlertDialogFooter,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { TeamPlayerAdd } from "./TeamPlayerAdd";
import { TeamEdit } from "./TeamEdit";
import { TeamStatistics } from "./TeamStatistics";

export function TeamPage() {
  const { id } = useParams();
  const history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const { isLoading, error, data: team } = useTeamQuery(id);

  const teamDeleteMutation = useDeleteTeamMutation();

  function isDeleteButtonClicked() {
    setIsOpen(true);
  }

  async function onDelete() {
    try {
      await teamDeleteMutation.mutateAsync(id);
      onClose();
      history.push("/teams/");
      toast({
        title: "Komanda dzēsta",
        description: "Jūs idzēsāt komandu " + team.name,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Dzēst komandu",
        description: "Neizdevās izdzēst komandu",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load team with an id: {id}</div>;
  }

  return (
    <div>
      <Container maxW="6xl" my={4}>
        <Flex mx={2}>
          <Stack spacing={8} direction="row">
            <span>
              <strong>Nosaukums</strong>
              <div>{team.name}</div>
            </span>
            <span>
              <strong>Uzvarētās spēles</strong>
              <div>{team.gamesWonCount}</div>
            </span>
            <span>
              <strong>Zaudētās spēles</strong>
              <div>{team.gamesLostCount}</div>
            </span>
            <span>
              <strong>Spēles kopā</strong>
              <div>{team.gamesTotalCount}</div>
            </span>
          </Stack>
        </Flex>
        <TeamEdit team={team} />
        <TeamPlayerAdd />
        <Flex justify="flex-end" my="6">
          <Button
            size="sm"
            colorScheme="red"
            type="button"
            onClick={isDeleteButtonClicked}
            isLoading={teamDeleteMutation.isLoading}
          >
            Dzēst komandu
          </Button>
        </Flex>
        <Heading size="lg" mx={2} my={4}>
          Spēlētāju saraksts
        </Heading>
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
            {team.players.map((player) => {
              function onTeamClick() {
                history.push("/teams/" + team.id + "/players/" + player.id);
              }
              return (
                <Tr key={player.id} onClick={onTeamClick}>
                  <Td>{player.firstName}</Td>
                  <Td>{player.lastName}</Td>
                  <Td>{player.age}</Td>
                  <Td>{player.gender.name}</Td>
                  <Td>{player.number}</Td>
                  <Td>{player.backupPlayer ? "Jā" : "Nē"}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Heading size="lg" mx={2} my={4}>
          Komandas spēles
        </Heading>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Pretinieku komanda</Th>
              <Th>Status</Th>
              <Th>Datums</Th>
            </Tr>
          </Thead>
          <Tbody>
            {team.games.map((game) => {
              function onGameClick() {
                history.push("/games/" + game.id);
              }
              return (
                <Tr key={game.id} onClick={onGameClick}>
                  <Td>
                    {team.id === game.teamAId
                      ? game.teamB.name
                      : game.teamA.name}
                  </Td>
                  <Td>{game.status.name}</Td>
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
      <TeamStatistics teamId={team.id} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Komandas dzēsšana
            </AlertDialogHeader>

            <AlertDialogBody>
              Vai tiešām vēlaties dzēst komandu?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Atcelt
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Dzēst
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}
