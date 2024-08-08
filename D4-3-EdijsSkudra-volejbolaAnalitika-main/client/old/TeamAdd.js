import React from "react";
import {
  Input,
  Button,
  FormLabel,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  Textarea,
  FormControl,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import { db, firebase } from "./firebase";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

export function TeamAdd(props) {
  const toast = useToast();

  function onSave(values, actions) {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("teams")
      .add({
        teamName: values.name,
        gamesWon: 0,
        gamesLost: 0,
        gamesTotal: 0,
        comment: values.comment,
      })
      .then(() => {
        actions.setSubmitting(false);
        props.onClose();
        toast({
          title: "Komanda pievienota.",
          description: "Jūs izveidojāt komandu.",
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
          initialValues={{ name: "", comment: "" }}
          validationSchema={yup.object({
            name: yup
              .string()
              .required("Šis lauks ir nepieciešams")
              .min(3, "Tekstam jāsatur vismaz 3 burti!")
              .max(20, "Teksts nevar saturēt vairāk kā 20 burtus!"),
            comment: yup
              .string()
              .max(250, "Teksts nevar saturēt vairāk kā 250 burtus!"),
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
                    <Field name="comment">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.comment && form.touched.comment
                          }
                        >
                          <FormLabel htmlFor="comment">Komentārs</FormLabel>
                          <Textarea {...field} id="comment" />
                          <FormErrorMessage>
                            {form.errors.comment}
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
