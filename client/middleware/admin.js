export default function({ store, redirect }) {
  const loggedIn = store.getters["auth/loggedIn"];

  store.dispatch("auth/updateViewLayout", "admin");

  if (!loggedIn) {
    return redirect("/sign-in");
  }
}
