"use strict";

/**
 * learner-journey controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-journey.learner-journey",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      try {
        const learnerInfoData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!learnerInfoData) {
          return ctx.notFound("No learner information found.");
        }
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }
        const result = await strapi.entityService.create(
          "api::learner-journey.learner-journey",
          {
            data: {
              ...ctx.request.body,
              learner_info: learnerInfoData.id,
            },
            ...ctx.query,
          }
        );
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::learner-journey.learner-journey"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Journey Create Error: ${err.message}`);
      }
    },
  })
);
