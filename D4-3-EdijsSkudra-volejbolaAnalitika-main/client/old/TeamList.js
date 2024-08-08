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
} from "@chakra-ui/react";
import { TeamAdd } from "./TeamAdd";

export default function TeamList(props) {
  const history = useHistory();

  const { teams } = props;

  const [sort, setSort] = React.useState(null);
  function onFieldSort(field) {
    setSort((currentValue) => {
      if (currentValue && currentValue.field === field) {
        if (currentValue.direction === "asc") {
          return { direction: "dsc", field: field };
        } else {
          return null;
        }
      }
      return { direction: "asc", field: field };
    });
  }

  let sortedTeams = [...teams];
  if (sort !== null) {
    if (sort.direction === "asc") {
      sortedTeams = sortedTeams.sort((a, b) => {
        if (a[sort.field] < b[sort.field]) {
          return -1;
        }
        if (a[sort.field] > b[sort.field]) {
          return 1;
        }
        return 0;
      });
    } else if (sort.direction === "dsc") {
      sortedTeams = sortedTeams.sort((a, b) => {
        if (a[sort.field] > b[sort.field]) {
          return -1;
        }
        if (a[sort.field] < b[sort.field]) {
          return 1;
        }
        return 0;
      });
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="TeamList">
      <Container maxW="6xl">
        <Flex justify="flex-end" my="4">
          <Button size="sm" colorScheme="blue" onClick={onOpen}>
            Pievienot komandu
          </Button>
        </Flex>
        <Flex justify="flex-end">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th onClick={() => onFieldSort("teamName")}>
                  Komandas nosaukums
                  {sort && sort.direction === "asc" && sort.field === "teamName"
                    ? "(A)"
                    : null}
                  {sort && sort.direction === "dsc" && sort.field === "teamName"
                    ? "(D)"
                    : null}
                </Th>
                <Th onClick={() => onFieldSort("gamesWon")}>
                  Uzvarētās spēles
                  {sort && sort.direction === "asc" && sort.field === "gamesWon"
                    ? "(A)"
                    : null}
                  {sort && sort.direction === "dsc" && sort.field === "gamesWon"
                    ? "(D)"
                    : null}
                </Th>
                <Th onClick={() => onFieldSort("gamesLost")}>
                  Zaudētās spēles
                  {sort &&
                  sort.direction === "asc" &&
                  sort.field === "gamesLost"
                    ? "(A)"
                    : null}
                  {sort &&
                  sort.direction === "dsc" &&
                  sort.field === "gamesLost"
                    ? "(D)"
                    : null}
                </Th>
                <Th onClick={() => onFieldSort("gamesTotal")}>
                  Spēles kopā
                  {sort &&
                  sort.direction === "asc" &&
                  sort.field === "gamesTotal"
                    ? "(A)"
                    : null}
                  {sort &&
                  sort.direction === "dsc" &&
                  sort.field === "gamesTotal"
                    ? "(D)"
                    : null}
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {sortedTeams.map((team) => {
                function onTeamClick() {
                  history.push("/teams/" + team.id);
                }
                return (
                  <Tr key={team.id} onClick={onTeamClick}>
                    <Td>{team.teamName}</Td>
                    <Td>{team.gamesWon}</Td>
                    <Td>{team.gamesLost}</Td>
                    <Td>{team.gamesTotal}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Container>

      <TeamAdd isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
