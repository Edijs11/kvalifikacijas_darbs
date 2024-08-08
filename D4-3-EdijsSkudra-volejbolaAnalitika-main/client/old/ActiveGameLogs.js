import React from "react";
import { Table, Tr, Td, Th, Thead, Tbody } from "@chakra-ui/react";
import { pointTypes } from "./constants";

const gameEventTypes = {
  gameStart: "Spēles sākums",
  point: "Punkts",
  timeout: "Pārtraukums",
  timeoutEnd: "Pārtraukuma beigas",
  gameEnd: "Spēles beigas",
  setEnd: "Seta beigas",
};

export default function ActiveGameLogs(props) {
  return (
    <div className="ActiveGameLogs">
      <Table>
        <Thead>
          <Tr>
            <Th>Laiks</Th>
            <Th>Tips</Th>
            <Th>Komentārs</Th>
          </Tr>
        </Thead>

        <Tbody>
          {props.events
            .slice()
            .reverse()
            .map((event) => {
              let teamPlayers = [];

              if (event.team === props.teamA.id) {
                teamPlayers = props.teamAPlayers;
              }
              if (event.team === props.teamB.id) {
                teamPlayers = props.teamBPlayers;
              }

              // const player = teamPlayers.find(
              //   (teamPlayer) => teamPlayer.id === event.teamPlayer
              // );

              if (event.type === "point") {
                return (
                  <PointEventTableRow
                    event={event}
                    teamPlayers={teamPlayers}
                    teamA={props.teamA}
                    teamB={props.teamB}
                  />
                );
              }

              const time = new Date(event.timeStamp).toLocaleTimeString();
              const eventType = gameEventTypes[event.type];

              if (event.type === "setEnd") {
                const comment =
                  event.team === props.teamA.id
                    ? props.teamA.teamName
                    : props.teamB.teamName;
                return (
                  <EventTableRow
                    time={time}
                    eventType={eventType}
                    comment={comment}
                  />
                );
              }

              return <EventTableRow time={time} eventType={eventType} />;
              // return (
              //   <Tr>
              //     <Td>{new Date(event.timeStamp).toLocaleTimeString()}</Td>
              //     <Td>{gameEventTypes[event.type]}</Td>
              //     {/* <Td>
              //       {event.type === "point" && event.team === props.teamA.id
              //         ? "1"
              //         : ""}
              //     </Td>
              //     <Td>
              //       {event.type === "point" && event.team === props.teamB.id
              //         ? "1"
              //         : ""}
              //     </Td> */}
              //     <Td>
              //       {pointTypes[event.pointType]}{" "}
              //       {player
              //         ? ` | ${player.firstName} ${player.lastName} (${player.number})`
              //         : ""}
              //       {event.type === "setEnd" && event.team === props.teamA.id
              //         ? props.teamA.teamName
              //         : ""}
              //       {event.type === "setEnd" && event.team === props.teamB.id
              //         ? props.teamB.teamName
              //         : ""}
              //     </Td>
              //   </Tr>
              // );
            })}
        </Tbody>
      </Table>
    </div>
  );
}

function EventTableRow(props) {
  return (
    <Tr>
      <Td>{props.time}</Td>
      <Td>{props.eventType}</Td>
      <Td>{props.comment}</Td>
    </Tr>
  );
}

function PointEventTableRow(props) {
  const time = new Date(props.event.timeStamp).toLocaleTimeString();
  const eventType = gameEventTypes[props.event.type];
  const team =
    props.event.team === props.teamA.id
      ? props.teamA.teamName
      : props.teamB.teamName;
  const pointType = pointTypes[props.event.pointType];
  const teamPlayer = props.teamPlayers.find(
    (teamPlayer) => teamPlayer.id === props.event.teamPlayer
  );
  const player = teamPlayer
    ? `${teamPlayer.firstName} ${teamPlayer.lastName} (${teamPlayer.number})`
    : "";

  return (
    <EventTableRow
      time={time}
      eventType={`${eventType} (${team})`}
      comment={`${pointType} | ${player}`}
    />
  );
}
