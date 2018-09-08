/* @flow */
import React from "react"
import { render } from "react-dom"

import { Provider } from "react-redux"
import { ConnectedRouter } from "connected-react-router"

import { ThemeProvider } from "styled-components"

import theme from "./theme"

import store from "./store"
import history from "./history"
import Routes from "./routes"

const Root = () => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
)

const rootElement = document.getElementById("react-root")
if (rootElement instanceof Element) render(<Root />, rootElement)
