import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <App subgraphUri={subgraphUri} />
    </ChakraProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
