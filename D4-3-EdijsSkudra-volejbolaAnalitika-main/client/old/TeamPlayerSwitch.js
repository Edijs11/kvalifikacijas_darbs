import { Stack, Select } from "@chakra-ui/react";

export function TeamPlayerSwitch(props) {
  return (
    <Stack spacing={2}>
      <Select placeholder="">
        {props.teamAPlayers.map((teamAPlayer) => (
          <option key={teamAPlayer}>{teamAPlayer}</option>
        ))}
      </Select>
    </Stack>
  );
}
