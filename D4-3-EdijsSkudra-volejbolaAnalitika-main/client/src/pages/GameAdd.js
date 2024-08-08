import React from "react";
import {
  Input,
  Select,
  Button,
  FormLabel,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  FormControl,
  FormErrorMessage,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useGameAddMutation } from "../queries/games";
import { useTeamsQuery } from "../queries/teams";
import DatePicker from "react-datepicker";

export function GameAdd(props) {
  const { isLoading, error, data: teams } = useTeamsQuery();
  const { mutateAsync } = useGameAddMutation();
  async function onSave(values, actions) {
    try {
      //kad ieplānota ar custom input laikam
      const plannedAt = new Date(values.date);
      plannedAt.setHours(values.timeHour);
      plannedAt.setMinutes(values.timeMinute);
      plannedAt.setSeconds(0);
      plannedAt.setMilliseconds(0);

      const serverValues = {
        teamA: Number(values.teamA),
        teamB: Number(values.teamB),
        plannedAt: plannedAt.toISOString(),
        category: 1,
        location: values.location,
      };
      const game = await mutateAsync(serverValues);
      console.log(game);

      actions.setSubmitting(false);
      props.onClose();
    } catch (error) {
      console.error("Failed to save player", error);
      actions.setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div>
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} size="sm">
      <DrawerOverlay>
        <Formik
          initialValues={{
            teamA: "",
            teamB: "",
            category: "",
            location: "",
            date: new Date(),
            timeHour: "09",
            timeMinute: "00",
          }}
          //validācija ar yup validatoru
          validationSchema={yup.object({
            category: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            location: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            date: yup.date().required("Šis lauks ir nepieciešams"),
            timeHour: yup.string().required("Šis lauks ir nepieciešams"),
            timeMinute: yup.string().required("Šis lauks ir nepieciešams"),
          })}
          onSubmit={onSave}
        >
          {(formikProps) => (
            <Form>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  Pievienot jaunu spēli
                </DrawerHeader>
                <DrawerBody>
                  <Stack spacing={2}>
                    <Field name="teamA">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.teamA && form.touched.teamA}
                        >
                          <FormLabel htmlFor="teamA">Komanda 1</FormLabel>
                          <Select {...field}>
                            <option value="" disabled>
                              Izvelies vertibu
                            </option>
                            {teams.map((teamA) => {
                              return (
                                <option value={teamA.id}>{teamA.name}</option>
                              );
                            })}
                          </Select>
                          <FormErrorMessage>
                            {form.errors.teamA}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="teamB">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.teamB && form.touched.teamB}
                        >
                          <FormLabel htmlFor="teamB">Komanda 2</FormLabel>
                          <Select {...field}>
                            <option value="" disabled>
                              Izvelies vertibu
                            </option>
                            {teams.map((teamB) => {
                              return (
                                <option value={teamB.id}>{teamB.name}</option>
                              );
                            })}
                          </Select>
                          <FormErrorMessage>
                            {form.errors.teamB}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="category">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.category && form.touched.category
                          }
                        >
                          <FormLabel htmlFor="category">Kategorija</FormLabel>
                          <Input {...field} id="category" />
                          <FormErrorMessage>
                            {form.errors.category}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="location">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.location && form.touched.location
                          }
                        >
                          <FormLabel htmlFor="location">
                            Atrašanās vieta
                          </FormLabel>
                          <Input {...field} id="location" />
                          <FormErrorMessage>
                            {form.errors.location}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Stack direction="row">
                      <Field name="date">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.date && form.touched.date}
                          >
                            <FormLabel htmlFor="date">Datums</FormLabel>
                            <DatePicker
                              {...field}
                              selected={field.value}
                              onChange={(value) => {
                                form.setFieldValue("date", value);
                              }}
                              dateFormat="dd/MM/yyyy"
                              customInput={<Input />}
                            ></DatePicker>
                            <FormErrorMessage>
                              {form.errors.date}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="timeHour">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.timeHour && form.touched.timeHour
                            }
                          >
                            <FormLabel htmlFor="timeHour">hh</FormLabel>
                            <Select id="timeHour" {...field}>
                              <option value="00">00</option>
                              <option value="01">01</option>
                              <option value="02">02</option>
                              <option value="03">03</option>
                              <option value="04">04</option>
                              <option value="05">05</option>
                              <option value="06">06</option>
                              <option value="07">07</option>
                              <option value="08">08</option>
                              <option value="09">09</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                              <option value="13">13</option>
                              <option value="14">14</option>
                              <option value="15">15</option>
                              <option value="16">16</option>
                              <option value="17">17</option>
                              <option value="18">18</option>
                              <option value="19">19</option>
                              <option value="20">20</option>
                              <option value="21">21</option>
                              <option value="22">22</option>
                              <option value="23">23</option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.timeHour}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="timeMinute">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.timeMinute && form.touched.timeMinute
                            }
                          >
                            <FormLabel htmlFor="timeMinute">mm</FormLabel>
                            <Select id="timeMinute" {...field}>
                              <option value="00">00</option>
                              <option value="15">15</option>
                              <option value="30">30</option>
                              <option value="45">45</option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.timeMinute}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                  </Stack>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={props.onClose}>
                    Atcelt
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={formikProps.isSubmitting}
                  >
                    Pievienot spēli
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Form>
          )}
        </Formik>
      </DrawerOverlay>
    </Drawer>
  );
}
