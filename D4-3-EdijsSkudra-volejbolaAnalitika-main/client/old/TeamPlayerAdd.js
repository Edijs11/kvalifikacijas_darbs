import React from "react";
import {
  Input,
  Select,
  Button,
  Switch,
  FormLabel,
  useToast,
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
} from "@chakra-ui/react";
import { db, firebase } from "./firebase";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { genders } from "./constants";

export function TeamPlayerAdd(props) {
  const toast = useToast();

  function onSave(values, actions) {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("teams")
      .doc(props.teamId)
      .collection("players")
      .add({
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        number: values.number,
        gender: values.gender,
        backupPlayer: values.backupPlayer,
      })
      .then(() => {
        actions.setSubmitting(false);
        props.onClose();
        toast({
          title: "Spēlētājs pievienots.",
          description: "Jūs pievienojāt spēlētāju.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
  }

  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} size="sm">
      <DrawerOverlay>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            age: "",
            number: "",
            gender: "",
            backupPlayer: false,
          }}
          validationSchema={yup.object({
            firstName: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            lastName: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            age: yup
              .number()
              .integer("Lauka vērtībai jābūt skaitlim")
              .required("Šis lauks ir nepieciešams")
              .min(1, "Vecums nevar saturēt mazāk nekā 1 ciparu!")
              .max(99, "Vecums nevar saturēt vairāk kā 99 ciparus!"),
            number: yup
              .number()
              .integer("Lauka vērtībai jābūt skaitlim")
              .required("Šis lauks ir nepieciešams")
              .min(1, "Vecums nevar saturēt mazāk nekā 1 ciparu!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 ciparus!"),
            gender: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            backupPlayer: yup.boolean(),
          })}
          onSubmit={onSave}
        >
          {(formikProps) => (
            <Form>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  Pievienot jaunu spēlētāju
                </DrawerHeader>
                <DrawerBody>
                  <Stack spacing={2}>
                    <Field name="firstName">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.firstName && form.touched.firstName
                          }
                        >
                          <FormLabel htmlFor="firstName">Vārds</FormLabel>
                          <Input {...field} id="firstName" />
                          <FormErrorMessage>
                            {form.errors.firstName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="lastName">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.lastName && form.touched.lastName
                          }
                        >
                          <FormLabel htmlFor="lastName">Uzvārds</FormLabel>
                          <Input {...field} id="lastName" />
                          <FormErrorMessage>
                            {form.errors.lastName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="age">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.age && form.touched.age}
                        >
                          <FormLabel htmlFor="age">Vecums</FormLabel>
                          <Input {...field} id="age" />
                          <FormErrorMessage>{form.errors.age}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="number">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.number && form.touched.number}
                        >
                          <FormLabel htmlFor="number">Numurs</FormLabel>
                          <Input {...field} id="number" />
                          <FormErrorMessage>
                            {form.errors.number}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="gender">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.gender && form.touched.gender}
                        >
                          <FormLabel htmlFor="gender">Dzimums</FormLabel>
                          <Select
                            {...field}
                            id="gender"
                            placeholder="Izvēlies vērtību"
                          >
                            {Object.values(genders).map((gender) => (
                              <option key={gender.value} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {form.errors.gender}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="backupPlayer">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.backupPlayer &&
                            form.touched.backupPlayer
                          }
                        >
                          <FormLabel htmlFor="backupPlayer">
                            Rezerves spēlētājs
                            <Switch mx={2} {...field} id="backupPlayer" />
                          </FormLabel>
                          <FormErrorMessage>
                            {form.errors.backupPlayer}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
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
                    Pievienot spēlētāju
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
