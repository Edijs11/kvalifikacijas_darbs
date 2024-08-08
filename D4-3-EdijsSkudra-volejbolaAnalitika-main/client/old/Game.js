import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, firebase } from "./firebase";
import ActiveGameLogs from "./ActiveGameLogs";
import {
  Button,
  Stack,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { GamePointAdd } from "./GamePointAdd";
import { useTeamPlayers } from "./firebaseHooks";
import { totalPoints } from "./TeamPoints";
import { teamSetsWon } from "./TeamSetsWon";
// import { TeamPlayerSwitch } from "./TeamPlayerSwitch";

export function Game(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { id } = useParams();
  const [game, setGame] = React.useState();
  const [events, setEvents] = React.useState([]);

  const teamAPlayers = useTeamPlayers(game ? game.teamA.id : "");
  const teamBPlayers = useTeamPlayers(game ? game.teamB.id : "");

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .get()
      .then((doc) => {
        setGame(doc.data());
      });
  }, [id]);

  useEffect(() => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .collection("events")
      .orderBy("timeStamp")
      .onSnapshot((snapshot) => {
        const newEvents = [];
        snapshot.forEach((doc) => {
          newEvents.push({ id: doc.id, ...doc.data() });
        });
        setEvents(newEvents);
      });
  }, [id]);

  const points = totalPoints(events);
  const sets = teamSetsWon(events);

  useEffect(() => {
    Object.entries(points).forEach(([team, points]) => {
      if (points === 25) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("games")
          .doc(id)
          .collection("events")
          .add({
            timeStamp: new Date().toISOString(),
            type: "setEnd",
            team: team,
          })
          .then(() => console.log("setEnd"));
      }
    });
  }, [points, id]);

  function onStartGame() {
    const timeStamp = new Date().toISOString();
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .collection("events")
      .add({
        timeStamp,
        type: "gameStart",
      });
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .update({ status: "active" });
  }

  function onTimeout() {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .collection("events")
      .add({
        timeStamp: new Date().toISOString(),
        type: "timeout",
      });
  }
  function onTimeoutEnd() {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .collection("events")
      .add({
        timeStamp: new Date().toISOString(),
        type: "timeoutEnd",
      });
  }

  function onGameEnd() {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .collection("events")
      .add({
        timeStamp: new Date().toISOString(),
        type: "gameEnd",
      });
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("games")
      .doc(id)
      .update({ status: "completed" });
    onClose();
  }

  const isGameStarted = events.find((event) => event.type === "gameStart")
    ? true
    : false;

  const lastEvent = events[events.length - 1];
  const isTimeoutStarted = lastEvent && lastEvent.type === "timeout";
  const isGameEnded = lastEvent && lastEvent.type === "gameEnd";

  const eventsCollection = db
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("games")
    .doc(id)
    .collection("events");

  if (!game) {
    return <Spinner size="xl" />;
  }
  return (
    <div className="Game">
      <Stack justify="center" spacing={2} direction="row" my={6}>
        <Button
          type="button"
          colorScheme="blue"
          onClick={onStartGame}
          disabled={isGameStarted}
        >
          Sākt spēli
        </Button>
        {isTimeoutStarted ? (
          <Button type="button" onClick={onTimeoutEnd}>
            Atsākt spēli
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onTimeout}
            disabled={!isGameStarted || isGameEnded}
          >
            Pārtraukums
          </Button>
        )}
        <Button
          type="button"
          colorScheme="blue"
          onClick={onOpen}
          disabled={!isGameStarted || isGameEnded}
          my="5px"
        >
          Spēles beigas
        </Button>
      </Stack>
      <h1>
        <strong>
          {game.teamA.teamName} - {game.teamB.teamName}
        </strong>
      </h1>
      <h2>
        {points[game.teamA.id] ?? 0} - {points[game.teamB.id] ?? 0}
      </h2>
      <p>
        {sets[game.teamA.id] ?? 0} - {sets[game.teamB.id] ?? 0}
      </p>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Spēles beigas</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Vai tiešām vēlaties beigt spēli?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Nē
            </Button>
            <Button colorScheme="red" onClick={onGameEnd} ml={3}>
              Jā
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <GamePointAdd
        game={game}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        eventsCollection={eventsCollection}
        isGameEnded={isGameEnded}
        isGameStarted={isGameStarted}
        isTimeoutStarted={isTimeoutStarted}
      />
      {/* <Flex justifyContent="center">
        <Stack direction="row" spacing={4}>
          <Box> */}
      {/* <TeamPlayerSwitch teamAPlayers={teamAPlayers} /> */}
      {/* </Box>
          <Box> */}
      <ActiveGameLogs
        id={id}
        teamA={game.teamA}
        teamB={game.teamB}
        events={events}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
      />
      {/* </Box>
          <Box>
            <Stack spacing={2}>
              <TeamPlayerSwitch teamBPlayers={teamBPlayers} />
            </Stack>
          </Box>
        </Stack>
      </Flex> */}
    </div>
  );
}
