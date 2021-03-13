export default function({ store, redirect }) {
  const loggedIn = store.getters["auth/loggedIn"];

  if (loggedIn) {
    if (store.state.auth.roles.indexOf("role_admin") !== -1) {
      return redirect("/backoffice");
    } else if (store.state.auth.roles.indexOf("role_customer") !== -1) {
      return redirect("/");
    }
  }
}
