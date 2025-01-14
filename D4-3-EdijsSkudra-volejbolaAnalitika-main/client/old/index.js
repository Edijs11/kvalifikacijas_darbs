import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react"

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
    <App />
    </ChakraProvider>
  </React.StrictMode>,
  rootElement
);
