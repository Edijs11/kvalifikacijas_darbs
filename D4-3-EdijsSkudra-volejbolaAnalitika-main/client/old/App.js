import React from "react";
import GamesList from "./GamesList";
import "./styles.css";
import TeamList from "./TeamList";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Team } from "./Team";
import { Game } from "./Game";
import { StartScreen } from "./StartScreen";
import { firebase, db } from "./firebase";
import { Login } from "./Login";
import { TeamPlayer } from "./TeamPlayer";
import {
  Button,
  Stack,
  HStack,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormLabel,
} from "@chakra-ui/react";

export default function App() {
  const [teams, setTeams] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      setIsLoggedIn(user ? true : false);
    });
  }, []);

  React.useEffect(() => {
    if (isLoggedIn) {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("teams")
        .onSnapshot((querySnapshot) => {
          const newTeams = [];
          querySnapshot.forEach((doc) => {
            newTeams.push({ id: doc.id, ...doc.data() });
          });
          setTeams(newTeams);
        });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login />;
  }
  function onLogout() {
    firebase.auth().signOut();
  }
  return (
    <Router>
      <div className="App">
        <Flex as="nav" bg="blue.500" justify="center">
          <Flex maxW="7xl" flex="1" p="3" justify="space-between">
            <HStack direction="row" spacing={10}>
              <Link to="/">Sākums</Link>
              <Link to="/teams">Komandas</Link>
              <Link to="/games">Spēles</Link>
            </HStack>
            <Button
              type="button"
              colorScheme="blue"
              size="sm"
              onClick={onLogout}
            >
              Sign out
            </Button>
          </Flex>
        </Flex>

        <Switch>
          <Route path="/" exact>
            <StartScreen />
          </Route>
          <Route path="/teams" exact>
            <TeamList teams={teams} />
          </Route>
          <Route path="/teams/:id" exact>
            <Team />
          </Route>
          <Route path="/teams/:teamId/players/:playerId" exact>
            <TeamPlayer />
          </Route>
          <Route path="/games" exact>
            <GamesList teams={teams} />
          </Route>
          <Route path="/games/:id">
            <Game teams={teams} />
          </Route>
          <Route path="/test">
            <Button colorScheme="teal" onClick={onOpen}>
              Kļūda
            </Button>
            <Drawer isOpen={isOpen} onClose={onClose} size="sm">
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">
                    Kļūda komandai {}
                  </DrawerHeader>
                  <DrawerBody>
                    <FormLabel my={2}>Kļūdas</FormLabel>
                    <Stack spacing={1}>
                      <Button size="sm" bg="red.400">
                        Bumba atsitas pret laukumu
                      </Button>
                      <Button size="sm" bg="red.400">
                        Pārkāpta vidus līnija
                      </Button>
                      <Button size="sm" bg="red.400">
                        Pieskāriens tīklam
                      </Button>
                      <Button size="sm" bg="red.400">
                        3+ darbības
                      </Button>
                      <Button size="sm" bg="red.400">
                        Ar bumbu aizskarti tīkla stabiņi
                      </Button>
                      <Button size="sm" bg="red.400">
                        Mesta bumba
                      </Button>
                      <Button size="sm" bg="red.400">
                        Bumba skarta 2x pēc kārtas
                      </Button>
                      <Button size="sm" bg="red.400">
                        Bumba skar griestus
                      </Button>
                      <Button size="sm" bg="red.400">
                        Blokā piedalās aizsargs
                      </Button>
                      <Button size="sm" bg="red.400">
                        Aizsargs gremdējot pārkāpis uzbrukuma līniju
                      </Button>
                      <Button size="sm" bg="red.400">
                        Servējot pārkāpta līnija
                      </Button>
                      <Button size="sm" bg="red.400">
                        Servētājs pārkāpj līniju
                      </Button>
                      <Button size="sm" bg="red.400">
                        Servētājs trāpa tīklā vai zem tā
                      </Button>
                      <Button size="sm" bg="red.400">
                        Bloks
                      </Button>

                      <FormLabel my={4}>Spēlētāji</FormLabel>
                      <Stack align="center" justify="center" height="15vh">
                        <Stack direction="row" mx={2}>
                          <Button size="lg">Nr.13</Button>
                          <Button size="lg">Nr.14</Button>
                          <Button size="lg">Nr.19</Button>
                        </Stack>
                        <Stack direction="row" mx={2}>
                          <Button size="lg">Nr.22</Button>
                          <Button size="lg">Nr.17</Button>
                          <Button size="lg">Nr.2</Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </DrawerBody>
                  <DrawerFooter borderTopWidth="1px">
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Atcelt
                    </Button>
                    <Button colorScheme="blue">Pievienot komandu</Button>
                  </DrawerFooter>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
