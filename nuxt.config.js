export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Nuxt-Basic-App",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  srcDir: "client/",

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // { ssr: false, src: "~/plugins/authenticate.client" }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ["@nuxtjs/vuetify"],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios"
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    /**
     * API_URL initial the value in the .env file
     */

    baseUrl: "http://localhost:3000"
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  //default value is handler: "~/api/index.js"
  serverMiddleware: [{ path: "/api", handler: "../src/app/app.js" }],

  server: {
    /**
     * enable [host: "0.0.0.0"] for LAN testing
     */
    // host: "0.0.0.0",
    host: process.env.HOST,
    port: process.env.PORT
  },
  // uncomment this to disable loading bar
  // loading: false
  loading: {
    color: "blue",
    height: "5px"
  }
};
