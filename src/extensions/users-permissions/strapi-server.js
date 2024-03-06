module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    // Call the original callback function
    await originalCallback(ctx);

    // At this point, ctx.body contains the original login response
    // Let's add the user role to that response
    if (ctx.body.user && ctx.body.jwt) {
      const userWithRole = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.body.user.id,
        {
          populate: ["role"],
        }
      );

      if (userWithRole && userWithRole.role) {
        ctx.body.user.role = userWithRole.role.type;
      }
    }
  };

  return plugin;
};
