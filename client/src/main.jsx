import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

const styles = {
  global: (props) => ({
    body: {
      bg: "#F1F4F9", 
      color: "#0C1024", 
    },
 
    ".chakra-button:hover, .chakra-icon-button:hover, .chakra-menu-item:hover": {
      backgroundColor: "transparent", 
      boxShadow: "none",
    },

    '.post': {
      backgroundColor: "#FFFFFF", 
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: 'sm', 
    },
   
    '.sidebar': {
      color: "#0C1024",
      bg:"#0000000" ,
    },

    ".chakra-icon": {
      color: "black", 
    },
  }),
};

// Theme configuration
const config = {
  initialColorMode: "light", 
  useSystemColorMode: false,
};


const theme = extendTheme({ config, styles });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
