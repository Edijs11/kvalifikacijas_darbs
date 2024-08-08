import { useQuery, useMutation } from "react-query";
import { API_URL } from "../constants";
import { queryClient } from "./index";

//query kurā spēles sagrupētas pēc statusa
export function useGamesGroupedByStatusQuery() {
  const gamesGroupedByStatusQuery = useQuery(
    "games-grouped-by-status",
    getGroupedGames
  );
  return gamesGroupedByStatusQuery;
}

//iegūst sagrupētās spēles pēc statusa
async function getGroupedGames() {
  const response = await fetch(API_URL + "/games/grouped-by-status");
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//iegūst spēles
export function useGamesQuery() {
  const gamesQuery = useQuery("games", getGames);
  return gamesQuery;
}

async function getGames() {
  const response = await fetch(API_URL + "/games");
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//iegūst spēli kura tika izvēlēta spēļu sarakstā pēc id
export function useGameQuery(id) {
  console.log("Game", id);
  const gameQuery = useQuery(["games", id], () => getGame(id));
  return gameQuery;
}

async function getGame(id) {
  const response = await fetch(API_URL + "/games/" + id);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēles pievienošanas mutācija
export function useGameAddMutation() {
  const gameAddMutation = useMutation(postGame, {
    onSuccess: () => {
      queryClient.invalidateQueries("games");
    },
  });
  return gameAddMutation;
}

//pievieno spēli
async function postGame(game) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(game);

  const response = await fetch(API_URL + "/games", {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//priekš spēles notikuma - sākums
export function useGameStartMutation(gameId) {
  const addGameStart = useMutation(() => postGameStart(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games", gameId]);
    },
  });
  return addGameStart;
}

async function postGameStart(gameId) {
  const response = await fetch(API_URL + "/games/" + gameId + "/events/start", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

// spēles beigas
export function useGameEndMutation(gameId) {
  const addGameEnd = useMutation(() => postGameEnd(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games", gameId]);
    },
  });
  return addGameEnd;
}

async function postGameEnd(gameId) {
  const response = await fetch(API_URL + "/games/" + gameId + "/events/end", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//pārtraukums
export function useGameTimeoutMutation(gameId) {
  const addGameTimeout = useMutation(() => postGameTimeout(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games", gameId]);
    },
  });
  return addGameTimeout;
}

async function postGameTimeout(gameId) {
  const response = await fetch(
    API_URL + "/games/" + gameId + "/events/timeout",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//pārtraukuma beigas
export function useGameTimeoutEndMutation(gameId) {
  const addGameTimeoutEnd = useMutation(() => postGameTimeoutEnd(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games", gameId]);
    },
  });
  return addGameTimeoutEnd;
}

async function postGameTimeoutEnd(gameId) {
  const response = await fetch(
    API_URL + "/games/" + gameId + "/events/timeout-end",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//punkta pievienošana
export function useGamePointAddMutation(gameId) {
  console.log("Point", gameId);
  const gameAddMutation = useMutation(
    (gamePoint) => postGamePoint(gameId, gamePoint),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games", gameId]);
      },
    }
  );
  return gameAddMutation;
}

async function postGamePoint(gameId, gamePoint) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(gamePoint);

  const response = await fetch(API_URL + "/games/" + gameId + "/events/point", {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//kļūdas pievienošana
export function useGameMistakeAddMutation(gameId) {
  console.log("Mistake", gameId);
  const gameAddMutation = useMutation(
    (gameMistakes) => postGameMistake(gameId, gameMistakes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["games", gameId]);
      },
    }
  );
  return gameAddMutation;
}

//pēdēja notikuma atcelšanai
export function useCancelLastGameEventMutation(gameId) {
  return useMutation((gameId) => cancelLastGameEvent(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["games", gameId]);
    },
  });
}

async function cancelLastGameEvent(gameId) {
  const response = await fetch(
    API_URL + "/games/" + gameId + "/events/cancelLast",
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēlē priekš spēlētāju statistikas
export function useGamePlayersStatisticsQuery(gameId) {
  const statisticsQuery = useQuery("statistics", () => getStatistics(gameId));
  return statisticsQuery;
}

async function getStatistics(gameId) {
  const response = await fetch(API_URL + `/games/${gameId}/statistics`);
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

async function postGameMistake(gameId, gameMistake) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(gameMistake);

  const response = await fetch(
    API_URL + "/games/" + gameId + "/events/mistake",
    {
      method: "POST",
      headers,
      body,
    }
  );

  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}

//spēles dzēšana
export function useDeleteGameMutation() {
  const gameDeleteMutation = useMutation((gameId) => deleteGame(gameId), {
    onSuccess: () => {
      queryClient.invalidateQueries("games");
    },
  });
  return gameDeleteMutation;
}

async function deleteGame(gameId) {
  const response = await fetch(API_URL + "/games/" + gameId, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}
