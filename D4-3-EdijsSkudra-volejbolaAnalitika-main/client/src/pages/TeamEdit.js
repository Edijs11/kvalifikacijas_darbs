import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useTeamEditMutation } from "../queries/teams";
import * as yup from "yup";

export function TeamEdit(props) {
  const { mutateAsync } = useTeamEditMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function onSave(values, actions) {
    try {
      const team = await mutateAsync(values);
      console.log(team);

      actions.setSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Failed to load team", error);
      actions.setSubmitting(false);
    }
  }

  return (
    <div>
      <Flex justify="flex-end" my={6}>
        <Button size="sm" colorScheme="green" type="button" onClick={onOpen}>
          Labot komandas nosaukumu
        </Button>
      </Flex>

      <Drawer isOpen={isOpen} onClose={onClose} size="sm">
        <DrawerOverlay>
          <Formik
            initialValues={props.team}
            validationSchema={yup.object({
              name: yup
                .string()
                .required("Šis lauks ir nepieciešams")
                .min(3, "Tekstam jāsatur vismaz 3 burti!")
                .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            })}
            onSubmit={onSave}
          >
            {(formikProps) => (
              <Form>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">
                    Labot komandas nosaukumu
                  </DrawerHeader>
                  <DrawerBody>
                    <Stack spacing={2}>
                      <Field name="name">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor="name">
                              Komandas nosaukums
                            </FormLabel>
                            <Input {...field} id="name" />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                  </DrawerBody>
                  <DrawerFooter borderTopWidth="1px">
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Atcelt
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={formikProps.isSubmitting}
                    >
                      Labot
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
