import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { HStack, Flex } from "@chakra-ui/react";
import { HomePage } from "./pages/HomePage";
import { TeamsPage } from "./pages/TeamsPage";
import { TeamPage } from "./pages/TeamPage";
import { TeamPlayerPage } from "./pages/TeamPlayerPage";
import { GamesPage } from "./pages/GamesPage";
import { GamePage } from "./pages/GamePage";
import { StatisticsPage } from "./pages/StatisticsPage";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

export default function App() {
  return (
    <Router>
      <Flex as="nav" bg="blue.500" justify="center">
        <Flex maxW="7xl" flex="1" p="3" justify="space-between">
          <HStack direction="row" spacing={10}>
            <Link to="/">Sākums</Link>
            <Link to="/teams">Komandas</Link>
            <Link to="/games">Spēles</Link>
            <Link to="/statistics">Statistika</Link>
          </HStack>
        </Flex>
      </Flex>

      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/teams" exact>
          <TeamsPage />
        </Route>
        <Route path="/teams/:id" exact>
          <TeamPage />
        </Route>
        <Route path="/teams/:teamId/players/:playerId" exact>
          <TeamPlayerPage />
        </Route>
        <Route path="/games" exact>
          <GamesPage />
        </Route>
        <Route path="/games/:id" exact>
          <GamePage />
        </Route>
        <Route path="/statistics" exact>
          <StatisticsPage />
        </Route>
        <Route path="/">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}
