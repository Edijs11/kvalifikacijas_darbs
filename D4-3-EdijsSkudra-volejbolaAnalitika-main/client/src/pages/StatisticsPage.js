import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { Container, Heading, Spinner } from "@chakra-ui/react";
import { useStatisticsQuery } from "../queries/statistics";

export function StatisticsPage() {
  const { isLoading, error, data: statistics } = useStatisticsQuery();
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
  //custom numbers under charts
  const mostProductivePlayers =
    statistics.mostProductivePlayers?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const mostProductiveAttackPlayers =
    statistics.mostProductiveAttackPlayers?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const mostProductiveServePlayers =
    statistics.mostProductiveServePlayers?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const mostProductiveBlockPlayers =
    statistics.mostProductiveBlockPlayers?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const mostProductiveDeceptionPlayers =
    statistics.mostProductiveDeceptionPlayers?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  return (
    /**
  <Grid
  h="200px"
  templateRows="repeat(2, 1fr)"
  templateColumns="repeat(5, 1fr)"
  gap={4}
>
  <GridItem rowSpan={2} colSpan={1} bg="tomato" />
  <GridItem colSpan={2} bg="papayawhip" />
  <GridItem colSpan={2} bg="papayawhip" />
  <GridItem colSpan={4} bg="tomato" />
     */
    <div>
      <Container>
        {mostProductivePlayers.length > 0 ? (
          <>
            <Heading my={4} mx={12}>
              Rezultatīvākie spēlētāji
            </Heading>
            <BarChart
              width={500}
              height={300}
              data={mostProductivePlayers}
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
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="points"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              >
                <LabelList dataKey="points" position="top" />
              </Bar>
            </BarChart>
          </>
        ) : null}

        {mostProductiveAttackPlayers.length > 0 ? (
          <>
            <Heading my={4} mx={12}>
              Labākie uzbrucēji
            </Heading>
            <BarChart
              width={500}
              height={300}
              data={mostProductiveAttackPlayers}
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
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="points"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              >
                <LabelList dataKey="points" position="top" />
              </Bar>
            </BarChart>
          </>
        ) : null}
        {mostProductiveServePlayers.length > 0 ? (
          <>
            <Heading my={4} mx={12}>
              Labākie servētāji
            </Heading>
            <BarChart
              width={500}
              height={300}
              data={mostProductiveServePlayers}
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
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="points"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              >
                <LabelList dataKey="points" position="top" />
              </Bar>
            </BarChart>
          </>
        ) : null}
        {mostProductiveBlockPlayers.length > 0 ? (
          <>
            <Heading my={4} mx={12}>
              Labākie aizsargi
            </Heading>
            <BarChart
              width={500}
              height={300}
              data={mostProductiveBlockPlayers}
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
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="points"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              >
                <LabelList dataKey="points" position="top" />
              </Bar>
            </BarChart>
          </>
        ) : null}
        {mostProductiveDeceptionPlayers.length > 0 ? (
          <>
            <Heading my={4} mx={12}>
              Labākie mānītāji
            </Heading>
            <BarChart
              width={500}
              height={300}
              data={mostProductiveDeceptionPlayers}
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
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="points"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              >
                <LabelList dataKey="points" position="top" />
              </Bar>
            </BarChart>
          </>
        ) : null}
      </Container>
    </div>
  );
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, firstName, lastName, points } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>Punkti: {points}</p>
        <p>Komanda: {name}</p>
        <p>
          Spēlētājs: {firstName} {lastName}
        </p>
      </div>
    );
  }

  return null;
};
