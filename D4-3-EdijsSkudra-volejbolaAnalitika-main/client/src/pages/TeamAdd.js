import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useTeamAddMutation } from "../queries/teams";
import * as yup from "yup";

export function TeamAdd(props) {
  const { mutateAsync } = useTeamAddMutation();

  async function onSave(values, actions) {
    try {
      const team = await mutateAsync(values);
      console.log(team);

      actions.setSubmitting(false);
      props.onClose();
    } catch (error) {
      console.error("Failed to load team", error);
      actions.setSubmitting(false);
    }
  }

  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} size="sm">
      <DrawerOverlay>
        <Formik
          initialValues={{ name: "" }}
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
                  Pievienot jaunu komandu
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
                  <Button variant="outline" mr={3} onClick={props.onClose}>
                    Atcelt
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
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
  );
}
