import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import { usePointMistakeStatisticsQuery } from "../queries/player";
import { Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";

export function PlayerStatistics(props) {
  const {
    isLoading,
    isLoadingError,
    data: statistics,
  } = usePointMistakeStatisticsQuery(props.playerId);
  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (isLoadingError || !statistics) {
    return <div>Failed to load statistics</div>;
  }

  const { points } = statistics;
  const { mistakes } = statistics;
  console.log(statistics);
  const playerEffectivity =
    Object.entries(statistics.playerEffectivity[0]).map(([name, value]) => {
      return {
        name,
        value,
      };
    }) ?? [];
  /*
    {points: 1, mistakes: 2}

    [
      ["points", 1],
      ["mistakes", 2]
    ]

    [
      {name:"points", value: 1},
      {name:"mistakes", value: 2},
    ]
    0: {name: "points", value: 11}
  1: {name: "mistakes", value: 1}  
  */
  return (
    <>
      <Grid
        h="200px"
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
      >
        <GridItem>
          {playerEffectivity.length > 0 ? (
            <>
              <Heading>Punkti / kļūdas</Heading>
              <PieChart width={220} height={220}>
                <Pie
                  dataKey="value"
                  data={playerEffectivity}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip dataKey="name" />
              </PieChart>
            </>
          ) : null}
        </GridItem>
        <GridItem>
          {points.length > 0 ? (
            <>
              <Heading>Punkti</Heading>
              <PieChart width={220} height={220}>
                <Pie
                  dataKey="count"
                  data={points}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip dataKey="name" />
              </PieChart>
            </>
          ) : null}
        </GridItem>
        <GridItem>
          {mistakes.length > 0 ? (
            <>
              <Heading>Kļūdas</Heading>
              <PieChart width={220} height={220}>
                <Pie
                  dataKey="count"
                  data={mistakes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip dataKey="name" />
              </PieChart>
            </>
          ) : null}
        </GridItem>
      </Grid>
    </>
  );
}
