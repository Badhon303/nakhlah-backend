"use strict";

/**
 * exam controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController("api::exam.exam", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    try {
      if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
        return ctx.badRequest("Invalid request body");
      }

      // @ts-ignore
      let { learning_journey_level } = ctx.request.body;

      const learningJourneyLevelExists = await strapi.db
        .query("api::exam.exam")
        .findOne({
          where: {
            learning_journey_level: learning_journey_level?.connect[0],
          },
        });
      if (learningJourneyLevelExists) {
        return ctx.badRequest("Exam already completed");
      }
      // Dates Gain By Exam
      const LearnerGamificationStockDetailsOfDate = await strapi.db
        .query("api::learner-gamification-stock.learner-gamification-stock")
        .findOne({
          where: {
            gamification_type: {
              typeName: "Date",
            },
            users_permissions_user: user.id,
          },
        });
      const LearnerGamificationStockDetailsOfInjaz = await strapi.db
        .query("api::learner-gamification-stock.learner-gamification-stock")
        .findOne({
          where: {
            gamification_type: {
              typeName: "Injaz",
            },
            users_permissions_user: user.id,
          },
        });
      if (!LearnerGamificationStockDetailsOfDate) {
        return ctx.badRequest("Something went wrong");
      }
      try {
        await strapi.entityService.update(
          "api::learner-gamification-stock.learner-gamification-stock",
          LearnerGamificationStockDetailsOfDate.id,
          {
            data: {
              gamification_type: 5,
              stock:
                LearnerGamificationStockDetailsOfDate.stock +
                learning_journey_level.dates *
                  (learning_journey_level.passMark / 100),
              users_permissions_user: user.id,
            },
          }
        );
        await strapi.entityService.update(
          "api::learner-gamification-stock.learner-gamification-stock",
          LearnerGamificationStockDetailsOfInjaz.id,
          {
            data: {
              gamification_type: 5,
              stock:
                LearnerGamificationStockDetailsOfInjaz.stock +
                learning_journey_level.injaz,
              users_permissions_user: user.id,
            },
          }
        );
      } catch (error) {
        return ctx.badRequest(`Something went wrong ${error}`);
      }
      //Create Exam
      const result = await strapi.entityService.create("api::exam.exam", {
        // @ts-ignore
        data: {
          ...ctx.request.body,
          users_permissions_user: user.id,
        },
        ...ctx.query,
      });
      return await sanitize.contentAPI.output(
        result,
        strapi.contentType("api::exam.exam"),
        {
          auth: ctx.state.auth,
        }
      );
    } catch (err) {
      return ctx.badRequest(`Exam Create Error: ${err.message}`);
    }
  },

  async find(ctx) {
    const user = ctx.state.user;
    let results;
    try {
      if (ctx.state.user.role.name === "Admin") {
        results = await strapi.entityService.findMany("api::exam.exam", {
          ...ctx.query,
        });
      } else {
        results = await strapi.entityService.findMany("api::exam.exam", {
          filters: {
            users_permissions_user: user.id,
          },
          ...ctx.query,
        });
      }
      return await sanitize.contentAPI.output(
        results,
        strapi.contentType("api::exam.exam"),
        {
          auth: ctx.state.auth,
        }
      );
    } catch (err) {
      return ctx.badRequest(`Exam Error: ${err.message}`);
    }
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    const id = ctx.params.id;
    let findOneResults;
    try {
      if (ctx.state.user.role.name === "Admin") {
        findOneResults = await strapi.entityService.findOne(
          "api::exam.exam",
          id,
          {
            ...ctx.query,
          }
        );
      } else {
        const result = await strapi.entityService.findOne(
          "api::exam.exam",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );

        if (user.id === result.users_permissions_user.id) {
          findOneResults = await strapi.entityService.findMany(
            "api::exam.exam",
            {
              filters: {
                users_permissions_user: user.id,
              },
              ...ctx.query,
            }
          );
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      }
      return await sanitize.contentAPI.output(
        findOneResults,
        strapi.contentType("api::exam.exam"),
        {
          auth: ctx.state.auth,
        }
      );
    } catch (err) {
      return ctx.badRequest(`Exam find one Error: ${err.message}`);
    }
  },

  async delete(ctx) {
    try {
      const user = ctx.state.user;
      const id = ctx.params.id;
      const result = await strapi.entityService.findOne("api::exam.exam", id, {
        populate: { users_permissions_user: true },
      });
      if (user.id === result.users_permissions_user.id) {
        const deleteResult = await strapi.entityService.delete(
          "api::exam.exam",
          id
        );
        return deleteResult;
      } else {
        ctx.unauthorized("You are not authorized to perform this action.");
      }
    } catch (err) {
      return ctx.badRequest(`Exam Delete Error: ${err.message}`);
    }
  },

  async update(ctx) {
    try {
      const user = ctx.state.user;
      const id = ctx.params.id;
      const result = await strapi.entityService.findOne("api::exam.exam", id, {
        populate: { users_permissions_user: true },
      });

      if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
        return ctx.badRequest("Invalid request body");
      }

      if (user.id === result.users_permissions_user.id) {
        const updateResult = await strapi.entityService.update(
          "api::exam.exam",
          id,
          {
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );
        return await sanitize.contentAPI.output(
          updateResult,
          strapi.contentType("api::exam.exam"),
          {
            auth: ctx.state.auth,
          }
        );
      } else {
        ctx.unauthorized("You are not authorized to perform this action.");
      }
    } catch (err) {
      return ctx.badRequest(`Exam Update Error: ${err.message}`);
    }
  },
}));
