module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/user-profiles",
      handler: "user-profile.update",
    },
    {
      method: "DELETE",
      path: "/user-profiles",
      handler: "user-profile.delete",
    },
  ],
};
