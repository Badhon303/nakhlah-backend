const { sanitize, validate } = require("@strapi/utils");

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

  plugin.controllers.user.find = async (ctx) => {
    const schema = strapi.getModel("plugin::users-permissions.user");
    const { auth } = ctx.state;
    await validate.contentAPI.query(ctx.query, schema, { auth });

    let sanitizedQueryParams = await sanitize.contentAPI.query(
      ctx.query,
      schema,
      { auth }
    );
    //cheating here, because currently user findPage only accept page & pageSize, not pagination object.
    sanitizedQueryParams = {
      ...sanitizedQueryParams,
      // @ts-ignore
      ...sanitizedQueryParams.pagination,
    };
    const { results, pagination } = await strapi.entityService.findPage(
      "plugin::users-permissions.user",
      sanitizedQueryParams
    );
    const users = await Promise.all(
      results.map((user) => sanitize.contentAPI.output(user, schema, { auth }))
    );
    ctx.body = {
      data: users,
      meta: {
        pagination: pagination,
      },
    };
  };

  return plugin;
};
