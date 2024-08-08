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
  FormControl,
  FormErrorMessage,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useClassifiersQuery } from "../queries/classifiers";
import { useGamePointAddMutation } from "../queries/games";

export function GamePointAdd(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTeam, setActiveTeam] = React.useState();

  const { isLoading, error, data: classifiers } = useClassifiersQuery();
  const { mutateAsync } = useGamePointAddMutation(String(props.game.id));

  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load classifiers</div>;
  }

  //punkta pievienošanas katrai komandai
  function onTeamAClick() {
    setActiveTeam("teamA");
    onOpen();
  }

  function onTeamBClick() {
    setActiveTeam("teamB");
    onOpen();
  }

  async function onSave(values, actions) {
    try {
      const serverValues = {
        teamId: Number(props.game[activeTeam].id),
        playerId: Number(values.teamPlayer),
        pointTypeId: Number(values.pointType),
      };
      const gamePoint = await mutateAsync(serverValues);
      console.log(gamePoint);

      actions.setSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Failed to save player", error);
      actions.setSubmitting(false);
    }
  }
  // izvelk visus spēlētājus, ja nav tad atgriež tukšu masīvu
  const players = activeTeam ? props.game[activeTeam].players : [];

  return (
    <div className="GamePointAdd">
      <Stack spacing={2} direction="row" justifyContent="center">
        <Button
          colorScheme="teal"
          onClick={onTeamAClick}
          disabled={
            props.isGameFinished || !props.isGameStarted || props.isTimeout
          }
        >
          Punkts {props.game.teamA.name}
        </Button>
        <Button
          colorScheme="teal"
          onClick={onTeamBClick}
          disabled={
            props.isGameFinished || !props.isGameStarted || props.isTimeout
          }
        >
          Punkts {props.game.teamB.name}
        </Button>
      </Stack>

      <Drawer size="sm" isOpen={isOpen} onClose={onClose}>
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
                    Punkts komandai
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
                              {classifiers.pointTypes.map((pointType) => (
                                <Radio
                                  key={pointType.id}
                                  value={String(pointType.id)}
                                  colorScheme="green"
                                >
                                  {pointType.name}
                                </Radio>
                              ))}
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
                              {players.map((player) => (
                                <Radio
                                  key={player.id}
                                  value={String(player.id)}
                                >
                                  {player.firstName} {player.lastName} (
                                  {player.number})
                                </Radio>
                              ))}
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
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Atcelt
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isLoading={formikProps.isSubmitting}
                    >
                      Pievienot punktu
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
