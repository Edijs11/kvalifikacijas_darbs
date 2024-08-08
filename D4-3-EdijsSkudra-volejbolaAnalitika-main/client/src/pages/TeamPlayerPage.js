import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  useToast,
  Spinner,
  Stack,
  Container,
} from "@chakra-ui/react";
import { useDeletePlayerMutation, usePlayerQuery } from "../queries/player";
import { useParams, useHistory } from "react-router-dom";
import { PlayerStatistics } from "./PlayerStatistics";
import { TeamPlayerEdit } from "./TeamPlayerEdit";

export function TeamPlayerPage() {
  const { playerId } = useParams();
  const history = useHistory();
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const { isLoading, error, data: player } = usePlayerQuery(playerId);

  const playerDeleteMutation = useDeletePlayerMutation();

  function onGameDeleteButtonClick() {
    setIsOpen(true);
  }

  async function onDelete() {
    try {
      await playerDeleteMutation.mutateAsync(playerId);
      history.push("/teams/" + player.team.id);
      toast({
        title: "Dzēsts spēlētājs",
        description: "Jūs idzēsāt " + player.firstName + " " + player.lastName,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Dzēst spēlētāju",
        description: "Neizdevās izdzēst spēlētāju",
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
    return <div>Failed to load player with an id: {playerId}</div>;
  }

  return (
    <div>
      <Container maxW="6xl" my={4}>
        <Flex mx={2}>
          <Stack spacing={8} direction="row">
            <span>
              <div>
                <strong>Vārds: </strong>
                <div>{player.firstName}</div>
              </div>
            </span>
            <div>
              <strong>Uzvārds: </strong>
              <div>{player.lastName}</div>
            </div>
            <div>
              <strong>Vecums: </strong>
              <div>{player.age}</div>
            </div>
            <div>
              <strong>Dzimums: </strong>
              <div>{player.gender.name}</div>
            </div>
            <div>
              <strong>Spēlētāja Numurs: </strong>
              <div>{player.number}</div>
            </div>
            <div>
              <strong>Rezervists: </strong>
              <div>{player.backupPlayer ? "Jā" : "Nē"}</div>
            </div>
          </Stack>
        </Flex>

        <TeamPlayerEdit player={player} />
        <Flex justify="flex-end" my={2}>
          <Button
            size="sm"
            colorScheme="red"
            type="button"
            onClick={onGameDeleteButtonClick}
            isLoading={playerDeleteMutation.isLoading}
          >
            Dzēst spēlētāju
          </Button>
        </Flex>
        <div margin="-20px">
          <PlayerStatistics playerId={player.id} />
        </div>

        <Flex direction="column" m={2}></Flex>

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
      </Container>
    </div>
  );
}
