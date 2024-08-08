import { useMutation, useQuery } from "react-query";
import { API_URL } from "../constants";
import { queryClient } from "./index";

//iegūst visas komandas
export function useTeamsQuery(props) {
  const teamsQuery = useQuery("teams", getTeams);
  return teamsQuery;
}

async function getTeams() {
  const response = await fetch(API_URL + "/teams");
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//iegūst komandu pēc id
export function useTeamQuery(id) {
  const teamsQuery = useQuery(["team", id], () => getTeam(id));
  return teamsQuery;
}

async function getTeam(id) {
  const response = await fetch(API_URL + "/teams/" + id);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//komandas pievienošana
export function useTeamAddMutation() {
  const teamAddMutation = useMutation(postTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries("teams");
    },
  });
  return teamAddMutation;
}

async function postTeam(team) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(team);

  const response = await fetch(API_URL + "/teams", {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//komandas uzvaru / zaužu statistika
export function useTeamWonLossStatisticsQuery(teamId) {
  const wonLossStatistics = useQuery("statistics", ["team", teamId], () =>
    getStatistics(teamId)
  );
  return wonLossStatistics;
}

export function useTeamStatistics(teamId) {
  return useQuery(["team/statistics", teamId], () => getStatistics(teamId));
}

//komandas statistikas dati
async function getStatistics(teamId) {
  const response = await fetch(API_URL + `/teams/${teamId}/statistics`);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//komandas nosaukuma labošanai
export function useTeamEditMutation() {
  const teamEditMutation = useMutation(editTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries("teams");
    },
  });
  return teamEditMutation;
}

async function editTeam(team) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({ id: team.id, name: team.name });

  const response = await fetch(API_URL + "/teams/" + team.id, {
    method: "PUT",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//dzēšanas mutācija
export function useDeleteTeamMutation() {
  const teamDeleteMutation = useMutation((teamId) => deleteTeam(teamId), {
    onSuccess: () => {
      queryClient.invalidateQueries("teams");
    },
  });
  return teamDeleteMutation;
}

async function deleteTeam(teamId) {
  const response = await fetch(API_URL + "/teams/" + teamId, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}
