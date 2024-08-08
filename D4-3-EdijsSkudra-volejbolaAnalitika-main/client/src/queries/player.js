import { useQuery, useMutation } from "react-query";
import { API_URL } from "../constants";
import { queryClient } from "./index";

//spēlētāju iegūšana
export function usePlayerQuery(playerId) {
  const playerQuery = useQuery(["player", playerId], () => getPlayer(playerId));
  return playerQuery;
}

async function getPlayer(playerId) {
  const response = await fetch(API_URL + "/players/" + playerId);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēlētāja labošanas mutācija
export function useTeamPlayerEditMutation() {
  const teamPlayerEditMutation = useMutation(editTeamPlayer, {
    onSuccess: (player) => {
      queryClient.invalidateQueries("player");
    },
  });
  return teamPlayerEditMutation;
}

async function editTeamPlayer(player) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    age: player.age,
    number: player.number,
    genderId: player.genderId,
    backupPlayer: player.backupPlayer,
    teamId: player.teamId,
  });

  const response = await fetch(API_URL + "/players/" + player.id, {
    method: "PUT",
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēlētāja pievienošanas mutācija
export function usePlayerAddMutation(teamId) {
  const playerAddMutation = useMutation(postPlayer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["team", teamId]);
    },
  });
  return playerAddMutation;
}

async function postPlayer(player) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(player);

  const response = await fetch(API_URL + "/players", {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//punkti un kļūdu ieguve no visām spēlēm priekš spēlētāja (pēc id)
export function usePointMistakeStatisticsQuery(playerId) {
  const statisticsQuery = useQuery("pointMistakeStatistics", () =>
    getStatistics(playerId)
  );
  return statisticsQuery;
}

async function getStatistics(playerId) {
  const response = await fetch(API_URL + `/players/${playerId}/statistics`);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēlētāja dzēšana
export function useDeletePlayerMutation() {
  const playerDeleteMutation = useMutation(
    (playerId) => deletePlayer(playerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("team");
      },
    }
  );
  return playerDeleteMutation;
}

async function deletePlayer(playerId) {
  const response = await fetch(API_URL + "/players/" + playerId, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}
