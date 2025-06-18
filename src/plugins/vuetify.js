import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { aliases, mdi } from "vuetify/iconsets/mdi"
import "@fontsource/material-symbols-outlined"
import { h } from "vue"

export default createVuetify({
  icons: {
    defaultSet: "material-symbols-outlined",
    aliases,
    sets: {
      mdi,
      "material-symbols-outlined": {
        component: (props) => {
          const { icon, ...rest } = props
          return h(
            "span",
            {
              class: ["material-symbols-outlined"],
              ...rest,
            },
            icon,
          )
        },
      },
    },
  },
  components,
  directives,
})
