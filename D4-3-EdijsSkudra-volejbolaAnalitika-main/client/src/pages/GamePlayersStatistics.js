import { Container, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useGamePlayersStatisticsQuery } from "../queries/games";

export function GamePlayersStatistics(props) {
  const {
    isLoading,
    error,
    data: statistics,
  } = useGamePlayersStatisticsQuery(props.gameId);
  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load statistics</div>;
  }

  //grafikā stabiņa indeksa maiņa uz 1 2 3..
  const GamePlayersPointsStatistics =
    statistics.GamePlayersPointsStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const GamePlayersMistakesStatistics =
    statistics.GamePlayersMistakesStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];

  return (
    <Container>
      {GamePlayersPointsStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Rezultatīvākie spēlētāji
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={GamePlayersPointsStatistics}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis
              dataKey="index"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltipPoints />} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="points"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </>
      ) : null}
      {GamePlayersMistakesStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Kļūdainākie spēlētāji
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={GamePlayersMistakesStatistics}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis
              dataKey="index"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltipMistakes />} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="points"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </>
      ) : null}
    </Container>
  );
}
const CustomTooltipPoints = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log(payload);
    const { firstName, lastName, points } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>
          Spēlētājs: {firstName} {lastName}
        </p>
        <p>Punkti: {points}</p>
      </div>
    );
  }

  return null;
};
const CustomTooltipMistakes = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log(payload);
    const { firstName, lastName, points } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>
          Spēlētājs: {firstName} {lastName}
        </p>
        <p>kļūdas: {points}</p>
      </div>
    );
  }

  return null;
};
