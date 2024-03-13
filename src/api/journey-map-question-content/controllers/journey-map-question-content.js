"use strict";

/**
 * journey-map-question-content controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::journey-map-question-content.journey-map-question-content"
  // ({ strapi }) => ({
  //   async find(ctx) {
  //     console.log("ctx.query: ", { ...ctx.query });
  //     let results;
  //     try {
  //       if (ctx.state.user.role.name === "Admin") {
  //         results = await strapi.entityService.findMany(
  //           "api::learner-info.learner-info",
  //           {
  //             ...ctx.query,
  //           }
  //         );
  //       } else {
  //         results = await strapi.entityService.findMany(
  //           "api::learner-info.learner-info",
  //           {
  //             filters: {
  //               users_permissions_user: ctx.state.user.id,
  //             },
  //             ...ctx.query,
  //           }
  //         );
  //       }

  //       if (!results || results.length === 0) {
  //         return ctx.notFound("No learner information found.");
  //       }

  //       return await sanitize.contentAPI.output(
  //         results,
  //         strapi.contentType("api::learner-info.learner-info"),
  //         {
  //           auth: ctx.state.auth,
  //         }
  //       );
  //     } catch (err) {
  //       return ctx.badRequest(`User Learner info Error: ${err.message}`);
  //     }
  //   },
  // })
);
