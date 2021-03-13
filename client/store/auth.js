export const state = () => ({
  token: null,
  user: null,
  userId: null,
  roles: null,
  layout: "client"
});

export const getters = {
  loggedIn(state) {
    return state.token !== null && state.user !== null;
  },
  user(state) {
    return state.user;
  },
  username(state) {
    return `${state.user?.firstname} ${state.user?.lastname}`;
  }
};

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    if (token) {
      //This will set the header in all axios call
      // once the token is available at the store
      this.$axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (process.client) {
        localStorage.setItem("token", token);
      }
    } else {
      this.$axios.defaults.headers.common["Authorization"] = null;
      if (process.client) {
        localStorage.removeItem("token");
      }
    }
  },

  SET_USER(state, data) {
    state.user = data;
  },

  SET_ROLES(state, data) {
    state.roles = data;
  },

  SET_USERID(state, id) {
    state.userId = id;

    if (id) {
      if (process.client) {
        localStorage.setItem("userId", id);
      }
    } else {
      if (process.client) {
        localStorage.removeItem("userId");
      }
    }
  },

  SET_LAYOUT(state, layout) {
    state.layout = layout;
  }
};

export const actions = {
  async signIn({ dispatch }, credentials) {
    let { data } = await this.$axios.post(
      "/api/users/client/signIn",
      credentials
    );

    return dispatch("attempt", {
      token: data.token,
      userId: data.userId
    });
  },

  async attempt({ commit, state }, data) {
    const { token, userId } = data;

    if (token) {
      commit("SET_TOKEN", token);
      commit("SET_USERID", userId);
    }

    if (!state.token) {
      return;
    }

    try {
      let { data } = await this.$axios.get(`/api/users/${userId}`);

      commit("SET_USER", {
        userId: data.user.userId,
        firstname: data.user.firstname,
        lastname: data.user.lastname
      });

      commit("SET_ROLES", data.user.roles);
    } catch (e) {
      commit("SET_TOKEN", null);
      commit("SET_USER", null);
      commit("SET_USERID", null);
      commit("SET_ROLES", null);
    }
  },

  async signOut({ commit }) {
    return this.$axios.post("/api/users/signOut").then(function() {
      commit("SET_TOKEN", null);
      commit("SET_USER", null);
      commit("SET_USERID", null);
      commit("SET_ROLES", null);
    });
  },

  updateViewLayout({ commit }, layout) {
    commit("SET_LAYOUT", layout);
  }
};
