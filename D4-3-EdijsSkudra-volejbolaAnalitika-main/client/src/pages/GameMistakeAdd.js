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
import { useGameMistakeAddMutation } from "../queries/games";

export function GameMistakeAdd(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTeam, setActiveTeam] = React.useState();

  const { isLoading, error, data: classifiers } = useClassifiersQuery();
  const { mutateAsync } = useGameMistakeAddMutation(String(props.game.id));

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

  //priekš komandas kurai būs kļūda
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
        mistakeTypeId: Number(values.mistakeType),
      };
      const gameMistake = await mutateAsync(serverValues);
      console.log(gameMistake);

      actions.setSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Failed to save player", error);
      actions.setSubmitting(false);
    }
  }

  //atrod visus komandas spēlētājus, ja tādu nav atgriež tuksu masivu
  const players = activeTeam ? props.game[activeTeam].players : [];

  return (
    <div className="GameMistakeAdd">
      <Stack spacing={2} my={2} direction="row" justifyContent="center">
        <Button
          colorScheme="red"
          onClick={onTeamAClick}
          disabled={
            props.isGameFinished || !props.isGameStarted || props.isTimeout
          }
        >
          Kļūda {props.game.teamA.name}
        </Button>
        <Button
          colorScheme="red"
          onClick={onTeamBClick}
          disabled={
            props.isGameFinished || !props.isGameStarted || props.isTimeout
          }
        >
          Kļūda {props.game.teamB.name}
        </Button>
      </Stack>

      <Drawer size="sm" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <Formik
            initialValues={{
              teamPlayer: "",
              mistakeType: "",
            }}
            validationSchema={yup.object({
              teamPlayer: yup.string().required("Šis lauks ir nepieciešams"),
              mistakeType: yup.string().required("Šis lauks ir nepieciešams"),
            })}
            onSubmit={onSave}
          >
            {(formikProps) => (
              <Form>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">
                    Kļūda komandai
                  </DrawerHeader>
                  <DrawerBody>
                    <FormLabel htmlFor="mistakeType">
                      Zaudētais punkta veids
                    </FormLabel>
                    <Field name="mistakeType">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.mistakeType && form.touched.mistakeType
                          }
                        >
                          <RadioGroup
                            {...field}
                            onChange={(value) =>
                              form.setFieldValue("mistakeType", value)
                            }
                          >
                            <Stack spacing={4}>
                              {classifiers.mistakeTypes.map((mistakeType) => (
                                <Radio
                                  key={mistakeType.id}
                                  value={String(mistakeType.id)}
                                  colorScheme="green"
                                >
                                  {mistakeType.name}
                                </Radio>
                              ))}
                            </Stack>
                          </RadioGroup>
                          <FormErrorMessage>
                            {form.errors.mistakeType}
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
                      Pievienot kļūdu
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
