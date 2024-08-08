"use strict";

const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const { PrismaClient } = require("@prisma/client");
const { required } = require("joi");
const prisma = new PrismaClient();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    routes: { cors: { origin: ["*"] } },
  });

  server;
  // priekš šīs problēmas: https://github.com/hapijs/hapi/issues/2839
  server.ext({
    type: "onPostStop",
    method: async (server) => {
      prisma.$disconnect();
    },
  });

  //visi classifiers
  server.route([
    {
      method: "GET",
      path: "/classifiers",
      handler: async (request, h) => {
        try {
          const genders = await prisma.gender.findMany();
          const gameStatuses = await prisma.gameStatus.findMany();
          const pointTypes = await prisma.pointType.findMany();
          const mistakeTypes = await prisma.mistakeType.findMany();

          const classifiers = {
            genders,
            gameStatuses,
            pointTypes,
            mistakeTypes,
          };
          return h.response(classifiers);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/teams",
      handler: async (request, h) => {
        try {
          //atrod visas neizdzēstās komandas
          const teams = await prisma.team.findMany({
            where: { isDeleted: false },
          });
          //saskaita uzvaras / zaudes
          const teamsWithGamesCount = await Promise.all(
            teams.map(async (team) => {
              const gamesWon = await prisma.game.findMany({
                where: {
                  winningTeamId: team.id,
                },
              });
              const gamesLost = await prisma.game.findMany({
                where: {
                  statusId: 3, // Pabeigta
                  NOT: {
                    winningTeamId: team.id,
                  },
                  OR: [{ teamAId: team.id }, { teamBId: team.id }],
                },
              });
              const games = await prisma.game.findMany({
                where: { OR: [{ teamAId: team.id }, { teamBId: team.id }] },
              });
              const gamesWonCount = gamesWon.length;
              const gamesLostCount = gamesLost.length;
              const gamesTotalCount = games.length;
              return {
                ...team,
                gamesWonCount,
                gamesLostCount,
                gamesTotalCount,
              };
            })
          );
          return h.response(teamsWithGamesCount);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/teams",
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const teamData = request.payload;

        try {
          const team = await prisma.team.create({
            data: teamData,
          });
          return h.response(team).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "PUT",
      path: "/teams/{teamId}",
      options: {
        validate: {
          payload: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const teamData = request.payload;
        const teamId = teamData.id;

        try {
          const team = await prisma.team.update({
            where: {
              id: teamId,
            },
            data: teamData,
          });
          return h.response(team);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/teams/{teamId}",
      handler: async (request, h) => {
        const teamId = Number(request.params.teamId);
        try {
          const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
              players: {
                where: {
                  isDeleted: false,
                },
                include: {
                  gender: true,
                },
              },
              teamAGame: true,
              teamBGame: true,
            },
          });
          if (team) {
            const gamesWon = await prisma.game.findMany({
              where: {
                winningTeamId: teamId,
              },
            });
            const gamesLost = await prisma.game.findMany({
              where: {
                statusId: 3, // Pabeigta
                NOT: {
                  winningTeamId: teamId,
                },
                OR: [{ teamAId: team.id }, { teamBId: team.id }],
              },
            });
            const games = await prisma.game.findMany({
              where: { OR: [{ teamAId: teamId }, { teamBId: teamId }] },
              include: { status: true, teamA: true, teamB: true },
            });
            const gamesWonCount = gamesWon.length;
            const gamesLostCount = gamesLost.length;
            const gamesTotalCount = games.length;
            return h.response({
              ...team,
              games,
              gamesWonCount,
              gamesLostCount,
              gamesTotalCount,
            });
          }

          return h
            .response({
              statusCode: 404,
              error: "Not Found",
              message: `Team with an id ${teamId} was not found`,
            })
            .code(404);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //delete team
  server.route([
    {
      method: "DELETE",
      path: "/teams/{teamId}",
      options: {
        validate: {
          params: Joi.object({
            teamId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const teamId = Number(request.params.teamId);
        try {
          const team = await prisma.team.update({
            where: {
              id: teamId,
            },
            data: {
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            },
          });

          return h.response(team);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/players",
      handler: async (request, h) => {
        try {
          const players = await prisma.player.findMany({
            where: {
              isDeleted: false,
            },
          });
          return h.response(players);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/players",
      options: {
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            age: Joi.number().required(),
            number: Joi.number().required(),
            genderId: Joi.number().required(),
            backupPlayer: Joi.boolean().required(),
            teamId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const playerData = request.payload;

        try {
          const player = await prisma.player.create({
            data: playerData,
          });
          return h.response(player).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "PUT",
      path: "/players/{playerId}",
      options: {
        validate: {
          payload: Joi.object({
            id: Joi.number().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            age: Joi.number().required(),
            number: Joi.number().required(),
            genderId: Joi.number().required(),
            backupPlayer: Joi.boolean().required(),
            teamId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const playerData = request.payload;
        const playerId = playerData.id;

        try {
          const player = await prisma.player.update({
            where: {
              id: playerId,
            },
            data: playerData,
          });
          return h.response(player);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/players/{playerId}",
      handler: async (request, h) => {
        const playerId = Number(request.params.playerId);
        try {
          const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: { gender: true, team: true },
          });
          if (player) {
            return h.response(player);
          }

          return h
            .response({
              statusCode: 404,
              error: "Not Found",
              message: `Team with an id ${playerId} was not found`,
            })
            .code(404);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  /* player delete */
  server.route([
    {
      method: "DELETE",
      path: "/players/{playerId}",
      options: {
        validate: {
          params: Joi.object({
            playerId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const playerId = Number(request.params.playerId);
        try {
          const player = await prisma.player.update({
            where: {
              id: playerId,
            },
            data: {
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            },
          });

          return h.response(player);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/games",
      handler: async (request, h) => {
        try {
          const games = await prisma.game.findMany({
            where: {
              isDeleted: false,
            },
            include: {
              category: true,
              teamA: true,
              teamB: true,
            },
          });
          return h.response(games);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/games/{gameId}",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);
        try {
          const game = await prisma.game.findUnique({
            where: {
              id: gameId,
            },
            include: {
              category: true,
              teamA: {
                include: {
                  //padod spēlei spēlētājus
                  players: true,
                },
              },
              teamB: {
                include: {
                  players: true,
                },
              },
              events: {
                include: {
                  type: true,
                  team: true,
                  player: true,
                  pointType: true,
                  mistakeType: true,
                },
              },
            },
          });

          if (game) {
            return h.response(game);
          }

          return h
            .response({
              statusCode: 404,
              error: "Not Found",
              message: `Game with an id ${gameId} was not found`,
            })
            .code(404);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //delete game
  server.route([
    {
      method: "DELETE",
      path: "/games/{gameId}",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);
        try {
          const game = await prisma.game.update({
            where: {
              id: gameId,
            },
            data: {
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            },
          });

          return h.response(game);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/games/grouped-by-status",
      handler: async (request, h) => {
        try {
          const plannedGames = await prisma.game.findMany({
            //pārbauda vai spēle nav dzēsta
            where: { statusId: 1, isDeleted: false },
            include: {
              teamA: true,
              teamB: true,
            },
          });
          const activeGames = await prisma.game.findMany({
            where: { statusId: 2, isDeleted: false },
            include: {
              teamA: true,
              teamB: true,
            },
          });
          const completedGames = await prisma.game.findMany({
            where: { statusId: 3, isDeleted: false },
            include: {
              teamA: true,
              teamB: true,
            },
          });

          return h.response({ plannedGames, activeGames, completedGames });
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/games",
      options: {
        validate: {
          payload: Joi.object({
            plannedAt: Joi.date().iso().required(),
            location: Joi.string().required(),
            category: Joi.number().required(),
            teamA: Joi.number().required(),
            teamB: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameData = request.payload;

        try {
          const game = await prisma.game.create({
            data: {
              plannedAt: gameData.plannedAt,
              location: gameData.location,
              gameCategoryId: gameData.category,
              teamAId: gameData.teamA,
              teamBId: gameData.teamB,
              statusId: 1,
            },
          });
          return h.response(game).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/start",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 1, // Spēles sākums
              gameId,
            },
          });
          await prisma.game.update({
            where: {
              id: gameId,
            },
            data: {
              statusId: 2, // Aktīva
            },
          });
          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/end",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 2, // Spēles beigas
              gameId,
            },
          });
          await prisma.game.update({
            where: {
              id: gameId,
            },
            data: {
              statusId: 3, // pabeigta
            },
          });
          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);
  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/timeout",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 3, // Pārtaukums
              gameId,
            },
          });
          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);
  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/timeout-end",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 4, // Pārtaukuma beigas
              gameId,
            },
          });
          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/point",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
          payload: Joi.object({
            teamId: Joi.number().required(),
            playerId: Joi.number().required(),
            pointTypeId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);
        const { teamId, playerId, pointTypeId } = request.payload;

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 5, // Punkts
              gameId,
              teamId,
              playerId,
              pointTypeId,
            },
          });
          const game = await prisma.game.findUnique({
            where: { id: gameId },
          });
          if (game.teamAId === teamId) {
            const { teamASets, teamBSets, teamAPoints, teamBPoints } = game;
            let isGameFinished = false;
            let winningTeamId;
            const totalSets = teamASets + teamBSets;
            const setEndPoints = totalSets === 5 ? 15 : 25; // 5 setā punkti līdz 15 ar 2 punktu pārsvaru
            let newTeamAPoints = teamAPoints + 1;
            let newTeamASets = teamASets;
            let newTeamBPoints = teamBPoints;
            if (
              newTeamAPoints >= setEndPoints &&
              newTeamAPoints - teamBPoints >= 2
            ) {
              newTeamASets += 1;
              newTeamAPoints = 0;
              newTeamBPoints = 0;
              await prisma.gameEvent.create({
                data: {
                  typeId: 7, // Seta beigas
                  gameId,
                  teamId,
                  teamAPoints: teamAPoints + 1,
                  teamBPoints,
                },
              });

              if (newTeamASets >= 3 && newTeamASets - teamBSets > 2) {
                //3 setu pārsvaram
                isGameFinished = true;
                winningTeamId = game.teamAId;
                await prisma.gameEvent.create({
                  data: {
                    typeId: 2, // Spēles beigas
                    gameId,
                    teamId,
                  },
                });
              }
            }

            const updatedGameData = {
              teamAPoints: newTeamAPoints,
              teamASets: newTeamASets,
              teamBPoints: newTeamBPoints,
            };

            if (isGameFinished) {
              updatedGameData.statusId = 3; // Pabeigta
              updatedGameData.winningTeamId = winningTeamId;
            }

            await prisma.game.update({
              where: {
                id: gameId,
              },
              data: updatedGameData,
            });
          }
          if (game.teamBId === teamId) {
            const { teamASets, teamBSets, teamAPoints, teamBPoints } = game;
            let isGameFinished = false;
            const totalSets = teamBSets + teamASets;
            const setEndPoints = totalSets === 5 ? 15 : 25;
            let newTeamBPoints = teamBPoints + 1;
            let newTeamBSets = teamBSets;
            let newTeamAPoints = teamAPoints;
            if (
              newTeamBPoints >= setEndPoints &&
              newTeamBPoints - teamAPoints >= 2
            ) {
              winningTeamId = game.teamBId;
              newTeamBSets += 1;
              newTeamBPoints = 0;
              newTeamAPoints = 0;
              await prisma.gameEvent.create({
                data: {
                  typeId: 7, // Seta beigas
                  gameId,
                  teamId,
                  teamAPoints,
                  teamBPoints: teamBPoints + 1,
                },
              });
              //pārbauda vai 3 setu pārsvars
              if (newTeamBSets >= 3 && newTeamBSets - teamASets > 2) {
                isGameFinished = true;
                await prisma.gameEvent.create({
                  data: {
                    typeId: 2, // Spēles beigas
                    gameId,
                    teamId,
                  },
                });
              }
            }

            const updatedGameData = {
              teamBPoints: newTeamBPoints,
              teamBSets: newTeamBSets,
              teamAPoints: newTeamAPoints,
            };

            if (isGameFinished) {
              updatedGameData.statusId = 3; // Pabeigta
              updatedGameData.winningTeamId = winningTeamId;
            }

            await prisma.game.update({
              where: {
                id: gameId,
              },
              data: updatedGameData,
            });
          }

          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);
  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/mistake",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
          payload: Joi.object({
            teamId: Joi.number().required(),
            playerId: Joi.number().required(),
            mistakeTypeId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);
        const { teamId, playerId, mistakeTypeId } = request.payload;

        try {
          const gameEvent = await prisma.gameEvent.create({
            data: {
              typeId: 6, // Kluda
              gameId,
              teamId,
              playerId,
              mistakeTypeId,
            },
          });
          const game = await prisma.game.findUnique({
            where: { id: gameId },
          });
          if (game.teamAId === teamId) {
            const { teamASets, teamBSets, teamAPoints, teamBPoints } = game;
            let isGameFinished = false;
            let winningTeamId;
            const totalSets = teamASets + teamBSets;
            const setEndPoints = totalSets === 5 ? 15 : 25;
            let newTeamAMistake = teamBPoints + 1;
            let newTeamBSets = teamBSets;
            if (
              newTeamAMistake >= setEndPoints &&
              teamBPoints - teamAPoints >= 2
            ) {
              newTeamBSets += 1;
              newTeamAMistake = 0;
              await prisma.gameEvent.create({
                data: {
                  typeId: 7, // Seta beigas
                  gameId,
                  teamId,
                  teamAPoints,
                  teamBPoints: teamBPoints + 1,
                },
              });

              if (newTeamBSets >= 3 && newTeamBSets - teamBSets > 2) {
                isGameFinished = true;
                winningTeamId = game.teamBId;
                await prisma.gameEvent.create({
                  data: {
                    typeId: 2, // Spēles beigas
                    gameId,
                    teamId,
                  },
                });
              }
            }

            await prisma.game.update({
              where: {
                id: gameId,
              },
              data: {
                statusId: isGameFinished ? 3 : game.statusId, // Pabeigta
                teamBPoints: newTeamAMistake,
                teamBSets: newTeamBSets,
              },
            });
          }
          if (game.teamBId === teamId) {
            const { teamASets, teamBSets, teamAPoints, teamBPoints } = game;
            let isGameFinished = false;
            const totalSets = teamASets + teamBSets;
            const setEndPoints = totalSets === 5 ? 15 : 25;
            let newTeamBMistake = teamAPoints + 1;
            let newTeamASets = teamASets;
            if (
              newTeamBMistake >= setEndPoints &&
              teamAPoints - teamBPoints >= 2
            ) {
              newTeamASets += 1;
              newTeamBMistake = 0;
              await prisma.gameEvent.create({
                data: {
                  typeId: 7, // Seta beigas
                  gameId,
                  teamId,
                  teamAPoints: teamAPoints + 1,
                  teamBPoints,
                },
              });

              if (newTeamASets >= 3 && newTeamASets - teamASets > 2) {
                isGameFinished = true;
                winningTeamId = game.teamAId;
                await prisma.gameEvent.create({
                  data: {
                    typeId: 2, // Spēles beigas
                    gameId,
                    teamId,
                  },
                });
              }
            }

            const updatedGameData = {
              teamAPoints: newTeamBMistake,
              teamASets: newTeamASets,
            };

            if (isGameFinished) {
              updatedGameData.statusId = 3; // Pabeigta
              updatedGameData.winningTeamId = winningTeamId;
            }

            await prisma.game.update({
              where: {
                id: gameId,
              },
              data: updatedGameData,
            });
          }
          return h.response(gameEvent).code(201);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //delete last game events
  server.route([
    {
      method: "POST",
      path: "/games/{gameId}/events/cancelLast",
      options: {
        validate: {
          params: Joi.object({
            gameId: Joi.number().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const gameId = Number(request.params.gameId);
        try {
          let {
            statusId,
            teamAId,
            teamAPoints,
            teamBPoints,
            teamASets,
            teamBSets,
          } = await prisma.game.findUnique({ where: { id: gameId } });
          // Atrod spēles pēdējos 3 eventus un sakārto dilstošā secībā pēc id
          const lastEvents = await prisma.gameEvent.findMany({
            where: { gameId },
            take: 3,
            orderBy: {
              id: "desc",
            },
          });

          let eventIdsToDelete = [];

          // Speles sakums
          if (lastEvents[0].typeId === 1) {
            eventIdsToDelete.push(lastEvents[0].id);
            statusId = 1;
          }

          // Spēles beigas
          if (lastEvents[0].typeId === 2) {
            // Pēdējie 3 eventi
            eventIdsToDelete.push(lastEvents[0].id);
            eventIdsToDelete.push(lastEvents[1].id);
            eventIdsToDelete.push(lastEvents[2].id);
            statusId = 2;

            if (lastEvents[2].teamId === teamAId) {
              // Punkts
              if (lastEvents[2].typeId === 5) {
                teamASets = teamASets - 1;
                teamAPoints = lastEvents[1].teamAPoints - 1;
                teamBPoints = lastEvents[1].teamBPoints;
              }

              // Kluda
              if (lastEvents[2].typeId === 6) {
                teamBSets = teamBSets - 1;
                teamAPoints = lastEvents[1].teamAPoints;
                teamBPoints = lastEvents[1].teamBPoints - 1;
              }
            } else {
              // Punkts
              if (lastEvents[2].typeId === 5) {
                teamBSets = teamBSets - 1;
                teamAPoints = lastEvents[1].teamAPoints;
                teamBPoints = lastEvents[1].teamBPoints - 1;
              }

              // Kluda
              if (lastEvents[2].typeId === 6) {
                teamASets = teamASets - 1;
                teamAPoints = lastEvents[1].teamAPoints - 1;
                teamBPoints = lastEvents[1].teamBPoints;
              }
            }
          }

          // Pārtraukums
          if (lastEvents[0].typeId === 3) {
            eventIdsToDelete.push(lastEvents[0].id);
          }
          // Pārtraukuma beigas
          if (lastEvents[0].typeId === 4) {
            eventIdsToDelete.push(lastEvents[0].id);
          }
          // Punkts
          if (lastEvents[0].typeId === 5) {
            eventIdsToDelete.push(lastEvents[0].id);

            if (lastEvents[0].teamId === teamAId) {
              teamAPoints = teamAPoints - 1;
            } else {
              teamBPoints = teamBPoints - 1;
            }
          }
          // Kļūda
          if (lastEvents[0].typeId === 6) {
            eventIdsToDelete.push(lastEvents[0].id);

            if (lastEvents[0].teamId === teamAId) {
              teamBPoints = teamBPoints - 1;
            } else {
              teamAPoints = teamAPoints - 1;
            }
          }

          // Seta beigas
          if (lastEvents[0].typeId === 7) {
            eventIdsToDelete.push(lastEvents[0].id);
            eventIdsToDelete.push(lastEvents[1].id);

            if (lastEvents[1].teamId === teamAId) {
              // Punkts
              if (lastEvents[1].typeId === 5) {
                teamASets = teamASets - 1;
                teamAPoints = lastEvents[0].teamAPoints - 1;
                teamBPoints = lastEvents[0].teamBPoints;
              }

              // Kluda
              if (lastEvents[1].typeId === 6) {
                teamBSets = teamBSets - 1;
                teamAPoints = lastEvents[0].teamAPoints;
                teamBPoints = lastEvents[0].teamBPoints - 1;
              }
            } else {
              // Punkts
              if (lastEvents[1].typeId === 5) {
                teamBSets = teamBSets - 1;
                teamAPoints = lastEvents[0].teamAPoints;
                teamBPoints = lastEvents[0].teamBPoints - 1;
              }

              // Kluda
              if (lastEvents[1].typeId === 6) {
                teamASets = teamASets - 1;
                teamAPoints = lastEvents[0].teamAPoints - 1;
                teamBPoints = lastEvents[0].teamBPoints;
              }
            }
          }

          await prisma.game.update({
            where: { id: gameId },
            data: {
              statusId,
              teamAPoints,
              teamBPoints,
              teamASets,
              teamBSets,
            },
          });
          const deletedEvents = await prisma.gameEvent.deleteMany({
            where: {
              id: {
                in: eventIdsToDelete,
              },
            },
          });

          return h.response(deletedEvents);
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //statistics page
  server.route([
    {
      method: "GET",
      path: "/statistics",
      handler: async (request, h) => {
        try {
          const mostProductivePlayers = await prisma.$queryRaw(
            "SELECT Team.id, Team.name, Player.id, Player.firstName, Player.lastName, Player.number, count(*) AS points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId INNER JOIN Team on Team.id = GameEvent.teamId WHERE typeId = 5 GROUP BY playerId ORDER BY points DESC LIMIT 5;"
          );
          const mostProductiveAttackPlayers = await prisma.$queryRaw(
            "SELECT Team.id, Team.name, Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Team on Team.id = GameEvent.teamId INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 1 GROUP BY playerId ORDER BY points DESC LIMIT 5;"
          );
          const mostProductiveServePlayers = await prisma.$queryRaw(
            "SELECT Team.id, Team.name, Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Team on Team.id = GameEvent.teamId INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 2 GROUP BY playerId ORDER BY points DESC LIMIT 5;"
          );
          const mostProductiveBlockPlayers = await prisma.$queryRaw(
            "SELECT Team.id, Team.name, Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Team on Team.id = GameEvent.teamId INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 3 GROUP BY playerId ORDER BY points DESC LIMIT 5;"
          );
          const mostProductiveDeceptionPlayers = await prisma.$queryRaw(
            "SELECT Team.id, Team.name, Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Team on Team.id = GameEvent.teamId INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 4 GROUP BY playerId ORDER BY points DESC LIMIT 5;"
          );
          return h.response({
            mostProductivePlayers,
            mostProductiveAttackPlayers,
            mostProductiveServePlayers,
            mostProductiveBlockPlayers,
            mostProductiveDeceptionPlayers,
          });
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //player statistics
  server.route([
    {
      method: "GET",
      path: "/players/{playerId}/statistics",
      handler: async (request, h) => {
        try {
          const playerId = request.params.playerId;
          const playerEffectivity = await prisma.$queryRaw(
            `SELECT count(CASE WHEN typeId = 5 THEN 1 ELSE null END) AS punkti, count(CASE WHEN typeId = 6 THEN 1 ELSE null END) AS kļūdas FROM GameEvent WHERE playerId = ${playerId}`
          );
          const points = await prisma.$queryRaw(
            `SELECT pointTypeId as id, PointType.name as name, count(*) as count FROM GameEvent INNER JOIN PointType ON GameEvent.pointTypeId = PointType.id WHERE playerId = ${playerId} AND typeId = 5 GROUP BY pointTypeId`
          );
          const mistakes = await prisma.$queryRaw(
            `SELECT mistakeTypeId as id, MistakeType.name as name, count(*) as count FROM GameEvent INNER JOIN MistakeType ON GameEvent.mistakeTypeId = MistakeType.id WHERE playerId = ${playerId} AND typeId = 6 GROUP BY mistakeTypeId`
          );
          return h.response({ playerEffectivity, points, mistakes });
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //game points / mistakes charts
  server.route([
    {
      method: "GET",
      path: "/games/{gameId}/statistics",
      handler: async (request, h) => {
        try {
          const gameId = request.params.gameId;
          const GamePlayersPointsStatistics = await prisma.$queryRaw(
            `SELECT Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE typeId = 5 AND gameId = ${gameId} GROUP BY playerId ORDER BY points DESC LIMIT 5`
          );
          const GamePlayersMistakesStatistics = await prisma.$queryRaw(
            `SELECT Player.id, Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE typeId = 6 AND gameId = ${gameId} GROUP BY playerId ORDER BY points DESC LIMIT 5`
          );
          return h.response({
            GamePlayersPointsStatistics,
            GamePlayersMistakesStatistics,
          });
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  //team - top players
  server.route([
    {
      method: "GET",
      path: "/teams/{teamId}/statistics",
      handler: async (request, h) => {
        try {
          const teamId = request.params.teamId;
          const pointTypeOneStatistics = await prisma.$queryRaw(
            `SELECT Player.id , Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 1 AND GameEvent.teamId = ${teamId} GROUP BY Player.id ORDER BY points DESC LIMIT 5`
          );
          const pointTypeTwoStatistics = await prisma.$queryRaw(
            `SELECT Player.id , Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 2 AND GameEvent.teamId = ${teamId} GROUP BY Player.id ORDER BY points DESC LIMIT 5`
          );
          const pointTypeTreeStatistics = await prisma.$queryRaw(
            `SELECT Player.id , Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 3 AND GameEvent.teamId = ${teamId} GROUP BY Player.id ORDER BY points DESC LIMIT 5`
          );
          const pointTypeFourStatistics = await prisma.$queryRaw(
            `SELECT Player.id , Player.firstName, Player.lastName, Player.number, count(*) as points FROM GameEvent INNER JOIN Player on Player.id = GameEvent.playerId WHERE PointTypeId = 4 AND GameEvent.teamId = ${teamId} GROUP BY Player.id ORDER BY points DESC LIMIT 5`
          );
          return h.response({
            pointTypeOneStatistics,
            pointTypeTwoStatistics,
            pointTypeTreeStatistics,
            pointTypeFourStatistics,
          });
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
