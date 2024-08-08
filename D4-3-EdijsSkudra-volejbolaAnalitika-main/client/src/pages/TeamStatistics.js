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
import { useTeamStatistics } from "../queries/teams";

export function TeamStatistics(props) {
  const {
    isLoading,
    error,
    data: statistics,
  } = useTeamStatistics(props.teamId);
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

  const pointTypeOneStatistics =
    statistics.pointTypeOneStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const pointTypeTwoStatistics =
    statistics.pointTypeTwoStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const pointTypeTreeStatistics =
    statistics.pointTypeTreeStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];
  const pointTypeFourStatistics =
    statistics.pointTypeFourStatistics?.map((player, index) => {
      return {
        ...player,
        index: index + 1,
      };
    }) ?? [];

  return (
    <Container>
      {pointTypeOneStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Top 5 uzbrucēji
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={pointTypeOneStatistics}
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
            <Bar dataKey="points" fill="#8884d8" background={{ fill: "#eee" }}>
              <LabelList dataKey="points" position="top" />
            </Bar>
          </BarChart>
        </>
      ) : null}
      {pointTypeTwoStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Top 5 servētāji
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={pointTypeTwoStatistics}
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
            <Bar dataKey="points" fill="#8884d8" background={{ fill: "#eee" }}>
              <LabelList dataKey="points" position="top" />
            </Bar>
          </BarChart>
        </>
      ) : null}
      {pointTypeTreeStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Top 5 aizsargi
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={pointTypeTreeStatistics}
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
            <Bar dataKey="points" fill="#8884d8" background={{ fill: "#eee" }}>
              <LabelList dataKey="points" position="top" />
            </Bar>
          </BarChart>
        </>
      ) : null}
      {pointTypeFourStatistics.length > 0 ? (
        <>
          <Heading my={4} mx={12}>
            Top 5 mānītāji
          </Heading>
          <BarChart
            width={500}
            height={300}
            data={pointTypeFourStatistics}
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
            <Bar dataKey="points" fill="#8884d8" background={{ fill: "#eee" }}>
              <LabelList dataKey="points" position="top" />
            </Bar>
          </BarChart>
        </>
      ) : null}
    </Container>
  );
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { firstName, lastName, points } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>Izdevušies uzbrukumi: {points}</p>
        <p>
          Spēlētājs: {firstName} {lastName}
        </p>
      </div>
    );
  }

  return null;
};
