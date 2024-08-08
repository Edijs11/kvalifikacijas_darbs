import React from "react";
import {
  Button,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormLabel,
  Radio,
  RadioGroup,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { pointTypes } from "./constants";

export function GamePointAdd(props) {
  const [addPointState, setAddPointState] = React.useState({
    isOpen: false,
    teamName: undefined,
    teamId: undefined,
    team: undefined,
  });

  let teamPlayers = [];

  if (addPointState.team === "teamA") {
    teamPlayers = props.teamAPlayers;
  }

  if (addPointState.team === "teamB") {
    teamPlayers = props.teamBPlayers;
  }

  function onAddTeamAPoint() {
    setAddPointState({
      isOpen: true,
      teamName: props.game.teamA.teamName,
      teamId: props.game.teamA.id,
      team: "teamA",
    });
  }

  function onAddTeamBPoint() {
    setAddPointState({
      isOpen: true,
      teamName: props.game.teamB.teamName,
      teamId: props.game.teamB.id,
      team: "teamB",
    });
  }

  const toast = useToast();
  function onSave(values, actions) {
    props.eventsCollection
      .add({
        timeStamp: new Date().toISOString(),
        type: "point",
        team: addPointState.teamId,
        teamPlayer: values.teamPlayer,
        pointType: values.pointType,
      })
      .then(() => {
        actions.setSubmitting(false);
        setAddPointState({ isOpen: false });
        toast({
          title: "Punkts pievienots",
          description: "Jūs pievienojāt punktu",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
  }
  return (
    <div className="GamePointAdd">
      <Stack spacing={2} direction="row" justifyContent="center">
        <Button
          colorScheme="teal"
          onClick={onAddTeamAPoint}
          disabled={
            !props.isGameStarted || props.isTimeoutStarted || props.isGameEnded
          }
        >
          Punkts {props.game.teamA.teamName}
        </Button>
        <Button
          colorScheme="teal"
          onClick={onAddTeamBPoint}
          disabled={
            !props.isGameStarted || props.isTimeoutStarted || props.isGameEnded
          }
        >
          Punkts {props.game.teamB.teamName}
        </Button>
      </Stack>

      <Drawer
        isOpen={addPointState.isOpen}
        onClose={() => {
          setAddPointState({ isOpen: false });
        }}
        size="sm"
      >
        <DrawerOverlay>
          <Formik
            initialValues={{
              teamPlayer: "",
              pointType: "",
            }}
            validationSchema={yup.object({
              teamPlayer: yup.string().required("Šis lauks ir nepieciešams"),
              pointType: yup.string().required("Šis lauks ir nepieciešams"),
            })}
            onSubmit={onSave}
          >
            {(formikProps) => (
              <Form>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">
                    Punkts komandai {addPointState.teamName}
                  </DrawerHeader>
                  <DrawerBody>
                    <FormLabel htmlFor="pointType">
                      Iegūtais punkta veids
                    </FormLabel>
                    <Field name="pointType">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.pointType && form.touched.pointType
                          }
                        >
                          <RadioGroup
                            {...field}
                            onChange={(value) =>
                              form.setFieldValue("pointType", value)
                            }
                          >
                            <Stack spacing={4}>
                              {Object.entries(pointTypes).map(
                                ([value, label]) => (
                                  <Radio
                                    key={value}
                                    value={value}
                                    colorScheme="green"
                                  >
                                    {label}
                                  </Radio>
                                )
                              )}
                            </Stack>
                          </RadioGroup>
                          <FormErrorMessage>
                            {form.errors.pointType}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="teamPlayer">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.teamPlayer && form.touched.teamPlayer
                          }
                        >
                          <FormLabel htmlFor="teamPlayer">Spēlētājs</FormLabel>

                          <RadioGroup
                            {...field}
                            onChange={(value) =>
                              form.setFieldValue("teamPlayer", value)
                            }
                          >
                            <Stack spacing={4}>
                              {teamPlayers
                                .filter(
                                  (teamPlayer) =>
                                    teamPlayer.backupPlayer !== true
                                )
                                .map((teamPlayer) => {
                                  return (
                                    <Radio
                                      key={teamPlayer.id}
                                      value={teamPlayer.id}
                                    >
                                      {teamPlayer.firstName}{" "}
                                      {teamPlayer.lastName} ({teamPlayer.number}
                                      )
                                    </Radio>
                                  );
                                })}
                            </Stack>
                          </RadioGroup>

                          <FormErrorMessage>
                            {form.errors.teamPlayer}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </DrawerBody>
                  <DrawerFooter borderTopWidth="1px">
                    <Button
                      variant="outline"
                      mr={3}
                      onClick={() => {
                        setAddPointState({ isOpen: false });
                      }}
                    >
                      Atcelt
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isLoading={formikProps.isSubmitting}
                    >
                      Pievienot komandu
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Form>
            )}
          </Formik>
        </DrawerOverlay>
      </Drawer>
    </div>
  );
}
