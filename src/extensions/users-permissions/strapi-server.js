module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;
  const originalRegister = plugin.controllers.auth.register;

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

  plugin.controllers.auth.register = async (ctx) => {
    // Modify the request body to ensure username is not required
    if (!ctx.request.body.username) {
      // You can set username to be equal to email or any unique identifier
      ctx.request.body.username = ctx.request.body.email;
    }
    // Perform the original registration process
    await originalRegister(ctx);

    // After the original registration logic, the user is registered
    // and ctx.body should contain the user object and JWT token
    if (ctx.body.user && ctx.body.jwt) {
      // Fetch the complete user information including the role
      const userWithRole = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.body.user.id,
        {
          populate: ["role"],
        }
      );

      if (userWithRole && userWithRole.role) {
        // Append the role information to the response object
        ctx.body.user.role = userWithRole.role.type;
      }
    }
  };

  return plugin;
};
