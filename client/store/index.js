import Cookie from "cookie";

export const state = () => ({
  snackbar: {
    show: false,
    timeOut: 2000,
    text: ""
  }
});

export const mutations = {
  SET_SNACKBAR(state, snackbar) {
    state.snackbar = snackbar;
  }
};

export const actions = {
  nuxtServerInit({ dispatch }, context) {
    let token = null;
    let userId = null;

    if (process.server) {
      const { req } = context;

      if (req) {
        if (req.headers.cookie) {
          const cookies = Cookie.parse(req.headers.cookie || "");
          const cleanUserId = cookies["userId"].replace(/"/g, "");

          token = cookies["token"];
          userId = cleanUserId;
        }
      }

      if (token && userId) {
        Promise.all([
          dispatch("auth/attempt", {
            token,
            userId
          })
        ]);
      }
    }
  },

  updatSnackBarAction({ commit }, snackbar) {
    commit("SET_SNACKBAR", snackbar);
  }
};
