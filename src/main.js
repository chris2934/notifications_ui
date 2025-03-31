import { createApp } from "vue"
import { Amplify } from "aws-amplify"
import awsconfig from "./aws-exports"

Amplify.configure(awsconfig)

import App from "./App.vue"
import client from "@/graphql/subscriptionClient.js"
import "@fontsource/material-symbols-outlined"
import "material-symbols"

// Create and mount the app
const app = createApp(App)
app.config.globalProperties.$wsClient = client
app.mount("#app")
