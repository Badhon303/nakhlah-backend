"use strict";

/**
 * package-plan-detail controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::package-plan-detail.package-plan-detail",
  ({ strapi }) => ({
    async update(ctx) {
      const id = ctx.params.id;
      // @ts-ignore
      const { data } = ctx.request.body;
      try {
        if (
          data?.package_plan?.planName ||
          data?.package_plan?.planDescription
        ) {
          await strapi.db.query("api::package-plan.package-plan").update({
            where: {
              package_plan_detail: {
                id: id,
              },
            },
            data: {
              planName: data.package_plan.planName,
              planDescription: data.package_plan.planDescription,
            },
          });
        }
        const updateResult = await strapi.entityService.update(
          "api::package-plan-detail.package-plan-detail",
          id,
          {
            data,
            ...ctx.query,
          }
        );
        return await sanitize.contentAPI.output(
          updateResult,
          strapi.contentType("api::package-plan-detail.package-plan-detail"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Package Plan Details Update Error: ${err.message}`
        );
      }
    },
  })
);
