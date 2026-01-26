import { createApp } from "vue"
import { Amplify } from "aws-amplify"
import vuetify from "./plugins/vuetify"
import App from "./App.vue"
import client from "@/graphql/subscriptionClient.js"
import "@fontsource/material-symbols-outlined"
import "material-symbols"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Kn0qP7lmU", // PASTE YOUR USER POOL ID HERE
      userPoolClientId: "76584kqfa7fa7c7jdgjkpo6dih", // PASTE YOUR CLIENT ID HERE
      loginWith: {
        email: true,
      },
    },
  },
})

// Create and mount the app
const app = createApp(App)
app.config.globalProperties.$wsClient = client
app.use(vuetify)
app.mount("#app")
