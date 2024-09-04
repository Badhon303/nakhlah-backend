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

      // Getting Gemification Types
      const gamificationTypesDetails = await strapi.entityService.findMany(
        "api::gamification-type.gamification-type"
      );
      if (!gamificationTypesDetails) {
        return ctx.badRequest("No details found");
      }
      const getDateDetails = gamificationTypesDetails.find(
        (item) => item?.typeName === "Date"
      );
      const getInjazDetails = gamificationTypesDetails.find(
        (item) => item?.typeName === "Injaz"
      );

      // Getting Gemification Types
      const gamificationTxDetails = await strapi.entityService.findMany(
        "api::gamification-tx.gamification-tx"
      );
      if (!gamificationTxDetails) {
        return ctx.badRequest("No details found");
      }

      const getDateGainByExamDetails = gamificationTxDetails.find(
        (item) => item?.transactionName === "Dates Gain By Exam"
      );
      const getInjazGainByExamDetails = gamificationTxDetails.find(
        (item) => item?.transactionName === "Injaz Gain By Exam"
      );

      // @ts-ignore
      let { learning_journey_level } = ctx.request.body;

      const learningJourneyLevelExists = await strapi.db
        .query("api::exam.exam")
        .findOne({
          where: {
            learning_journey_level: learning_journey_level?.connect[0],
            users_permissions_user: user.id,
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
      try {
        // Getting Gemification Types
        const levelInfo = await strapi.entityService.findOne(
          "api::learning-journey-level.learning-journey-level",
          learning_journey_level?.connect[0]
        );
        if (!levelInfo) {
          return ctx.badRequest("No details found");
        }

        await strapi.entityService.update(
          "api::learner-gamification-stock.learner-gamification-stock",
          LearnerGamificationStockDetailsOfDate.id,
          {
            data: {
              gamification_type: getDateDetails.id,
              stock:
                LearnerGamificationStockDetailsOfDate.stock +
                levelInfo.dates * (levelInfo.passMark / 100),
              users_permissions_user: user.id,
            },
          }
        );
        await strapi.entityService.create(
          "api::learner-gamification.learner-gamification",
          {
            // @ts-ignore
            data: {
              gamification_tx: getDateGainByExamDetails.id, // data.gamification_tx.connect[0]
              users_permissions_user: user.id,
            },
          }
        );
        await strapi.entityService.update(
          "api::learner-gamification-stock.learner-gamification-stock",
          LearnerGamificationStockDetailsOfInjaz.id,
          {
            data: {
              gamification_type: getInjazDetails.id,
              stock:
                LearnerGamificationStockDetailsOfInjaz.stock + levelInfo.injaz,
              users_permissions_user: user.id,
            },
          }
        );
        await strapi.entityService.create(
          "api::learner-gamification.learner-gamification",
          {
            // @ts-ignore
            data: {
              gamification_tx: getInjazGainByExamDetails.id, // data.gamification_tx.connect[0]
              users_permissions_user: user.id,
            },
          }
        );
      } catch (error) {
        return ctx.badRequest(`Something went wrong ${error}`);
      }

      const getLessonsOfLevel = await strapi.db
        .query("api::learning-journey-lesson.learning-journey-lesson")
        .findMany({
          where: {
            learning_journey_level: learning_journey_level?.connect[0],
          },
        });

      const lessonIds = getLessonsOfLevel.map((lesson) => lesson.id);

      try {
        // Query the database for entries with the specified IDs
        const existingLessons = await strapi.entityService.findMany(
          "api::learner-journey.learner-journey",
          {
            filters: {
              learning_journey_lesson: {
                id: {
                  $in: lessonIds,
                },
              },
              users_permissions_user: user.id,
            },
          }
        );
        if (
          lessonIds.length >= 1 &&
          lessonIds.length === existingLessons.length
        ) {
          try {
            // Create Exam
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
        } else {
          return ctx.badRequest(`Complete your lessons first`);
        }
      } catch (err) {
        return ctx.internalServerError(
          "An error occurred while checking lessons"
        );
      }
    } catch (err) {
      return ctx.badRequest(`Exam Create Error: ${err.message}`);
    }
  },

  async find(ctx) {
    const user = ctx.state.user;
    let results;
    const query = { ...ctx.query };
    if (!query.filters) {
      // @ts-ignore
      query.filters = {};
    }
    // @ts-ignore
    query.filters.users_permissions_user = user.id;
    try {
      if (ctx.state.user.role.name === "Admin") {
        results = await strapi.entityService.findMany("api::exam.exam", {
          ...ctx.query,
        });
      } else {
        results = await strapi.entityService.findMany("api::exam.exam", query);
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
    const query = { ...ctx.query };
    if (!query.filters) {
      // @ts-ignore
      query.filters = {};
    }
    // @ts-ignore
    query.filters.users_permissions_user = user.id;
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
            query
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
