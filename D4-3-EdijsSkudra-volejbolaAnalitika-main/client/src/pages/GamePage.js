import {
  Button,
  Container,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useGameQuery,
  useGameStartMutation,
  useGameEndMutation,
  useGameTimeoutMutation,
  useGameTimeoutEndMutation,
  useDeleteGameMutation,
  useCancelLastGameEventMutation,
} from "../queries/games";
import { GamePointAdd } from "./GamePointAdd";
import { GameMistakeAdd } from "./GameMistakeAdd";
import { GamePlayersStatistics } from "./GamePlayersStatistics";

export function GamePage(props) {
  const { id } = useParams();
  const history = useHistory();
  const { isLoading, error, data: game } = useGameQuery(id);
  const gameStartMutation = useGameStartMutation(id);
  const gameEndMutation = useGameEndMutation(id);
  const gameTimeoutMutation = useGameTimeoutMutation(id);
  const gameTimeoutEndMutation = useGameTimeoutEndMutation(id);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    React.useState(false); //priekš dzēšanas alerta
  const onGameDeleteConfirmClose = () => setIsDeleteConfirmationOpen(false); //dzēšanas noraidīšana
  const toast = useToast();
  const gameDeleteMutation = useDeleteGameMutation();
  const cancelLastGameEventMutation = useCancelLastGameEventMutation(id);

  function onDeleteButtonClick() {
    setIsDeleteConfirmationOpen(true);
  }

  async function onDelete() {
    try {
      //dzēšot spēli
      await gameDeleteMutation.mutateAsync(id);
      history.push("/games/");
      onGameDeleteConfirmClose();
      toast({
        title: "Spēle dzēsta",
        description:
          "Jūs idzēsāt spēli " + game.teamA.name + " pret " + game.teamB.name,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      //neizdevās
      toast({
        title: "Dzēst spēli",
        description: "Neizdevās izdzēst spēli",
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
    return <div>Failed to load game</div>;
  }

  //priekš pogu disable
  const lastEvent = game.events[game.events.length - 1];
  const isTimeout = lastEvent?.typeId === 3;
  const isGameStarted = game.statusId === 2;
  const isGameFinished = game.statusId === 3;

  function openGameEndAlert() {
    setIsOpen(true);
  }
  function onGameEndAlertAccept() {
    gameEndMutation.mutate();
    onClose();
  }

  return (
    <div>
      <Flex justify="flex-end" my="4" mx="6">
        <Button
          size="sm"
          colorScheme="red"
          type="button"
          onClick={onDeleteButtonClick}
          isLoading={gameDeleteMutation.isLoading}
        >
          Dzēst spēli
        </Button>
      </Flex>
      <Stack justify="center" spacing={2} direction="row" my={6}>
        {isGameStarted && !isGameFinished ? (
          <Button
            type="button"
            colorScheme="blue"
            onClick={openGameEndAlert}
            disabled={isGameFinished}
          >
            Spēles beigas
          </Button>
        ) : (
          <Button
            type="button"
            colorScheme="blue"
            onClick={gameStartMutation.mutate}
            disabled={isGameStarted || isGameFinished}
          >
            Sākt spēli
          </Button>
        )}

        {isTimeout ? (
          <Button
            type="button"
            colorScheme="blue"
            onClick={gameTimeoutEndMutation.mutate}
          >
            Atsākt spēli
          </Button>
        ) : (
          <Button
            type="button"
            colorScheme="blue"
            onClick={gameTimeoutMutation.mutate}
            disabled={!isGameStarted || isGameFinished}
          >
            Pārtraukums
          </Button>
        )}
      </Stack>
      <GamePointAdd
        game={game}
        isGameFinished={isGameFinished}
        isGameStarted={isGameStarted}
        isTimeout={isTimeout}
      />
      <GameMistakeAdd
        game={game}
        isGameFinished={isGameFinished}
        isGameStarted={isGameStarted}
        isTimeout={isTimeout}
      />
      <Stack>
        <Center>
          <Text fontSize="3xl">
            {game.teamAPoints} - {game.teamBPoints}
          </Text>
        </Center>
        <Center>
          <Text fontSize="xl">
            {game.teamASets} - {game.teamBSets}
          </Text>
        </Center>
      </Stack>
      <Flex justify="flex-end" my="4" mx="6">
        <Button
          size="sm"
          colorScheme="red"
          type="button"
          onClick={() => cancelLastGameEventMutation.mutate(id)}
          isLoading={cancelLastGameEventMutation.isLoading}
        >
          Atcelt pedejo darbibu
        </Button>
      </Flex>
      <Container maxW="6xl">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Laiks</Th>
              <Th>Tips</Th>
              <Th>Komentārs</Th>
            </Tr>
          </Thead>

          <Tbody>
            {[...game.events].reverse().map((event) => {
              //rāmis
              const time = new Date(event.createdAt).toLocaleTimeString();
              let type = event.type.name;
              let comment = "";

              // Punkta izvades gadījums
              if (event.type.id === 5) {
                type = `${type} (${event.team?.name ?? ""})`;
                const player = `${event.player.firstName} ${event.player.lastName} (${event.player.number})`;
                comment = `${event.pointType?.name ?? ""} | ${player}`;
              }

              // kļūdas izvades gadījums
              if (event.type.id === 6) {
                type = `${type} (${event.team?.name ?? ""})`;
                const player = `${event.player.firstName} ${event.player.lastName} (${event.player.number})`;
                comment = `${event.mistakeType?.name ?? ""} | ${player}`;
              }
              return (
                <Tr key={event.id}>
                  <Td>{time}</Td>
                  <Td>{type}</Td>
                  <Td>{comment}</Td>
                </Tr>
              );
            })}
            {game.events.length === 0 && (
              <EmptyGameList title="Spēle nav sākusies" />
            )}
          </Tbody>
        </Table>
      </Container>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Beigt spēli
            </AlertDialogHeader>

            <AlertDialogBody>Vai tiešām vēlaties beigt spēli</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Nē</Button>
              <Button colorScheme="red" onClick={onGameEndAlertAccept} ml={3}>
                Jā
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={onGameDeleteConfirmClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Beigt spēli
            </AlertDialogHeader>

            <AlertDialogBody>Vai tiešām vēlaties beigt spēli</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onGameDeleteConfirmClose}>Nē</Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Jā
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <GamePlayersStatistics gameId={game.id} />
    </div>
  );
}
function EmptyGameList({ title }) {
  //tukša saraksta gadījums
  return (
    <Tr>
      <Td colSpan={3} rowSpan={3} textAlign="center">
        <Text p={4}>{title}</Text>
      </Td>
    </Tr>
  );
}
