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
      const gamificationTxAmountDetails = await strapi.entityService.findMany(
        "api::gamification-tx-amount.gamification-tx-amount",
        { populate: { gamification_tx: true } }
      );
      if (!gamificationTxAmountDetails) {
        return ctx.badRequest("Invalid request body");
      }
      const getInjazDailyStreakDetails = gamificationTxAmountDetails.find(
        (item) =>
          item?.gamification_tx?.transactionName ===
          "Injaz Gain By Completing Lesson"
      );
      const getInjazRefillByPractice = gamificationTxAmountDetails.find(
        (item) =>
          item?.gamification_tx?.transactionName === "Injaz Refil By Practice"
      );
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        // @ts-ignore
        let { learning_journey_lesson } = ctx.request.body;

        const learningJourneyLessonExists = await strapi.db
          .query("api::learner-journey.learner-journey")
          .findOne({
            where: {
              learning_journey_lesson: learning_journey_lesson?.connect[0],
            },
          });
        if (
          learningJourneyLessonExists &&
          !learning_journey_lesson.mysteryBox
        ) {
          try {
            if (
              typeof ctx.request.body !== "object" ||
              ctx.request.body === null
            ) {
              return ctx.badRequest("Invalid request body");
            }
            const result = await strapi.entityService.create(
              "api::lesson-practice.lesson-practice",
              {
                // @ts-ignore
                data: {
                  learning_journey_lesson: learning_journey_lesson?.connect[0],
                  users_permissions_user: user.id,
                },
                ...ctx.query,
              }
            );
            // Injaz Refil By Practice
            const LearnerGamificationStockDetailsOfInjaz = await strapi.db
              .query(
                "api::learner-gamification-stock.learner-gamification-stock"
              )
              .findOne({
                where: {
                  gamification_type: {
                    typeName: "Injaz",
                  },
                  users_permissions_user: user.id,
                },
              });
            if (!LearnerGamificationStockDetailsOfInjaz) {
              return ctx.badRequest("Something went wrong");
            }
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfInjaz.id,
                {
                  data: {
                    gamification_type: 6,
                    stock:
                      LearnerGamificationStockDetailsOfInjaz.stock +
                      getInjazRefillByPractice.amount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
            return await sanitize.contentAPI.output(
              result,
              strapi.contentType("api::lesson-practice.lesson-practice"),
              {
                auth: ctx.state.auth,
              }
            );
          } catch (err) {
            return ctx.badRequest(
              `Learner Progress Create Error: ${err.message}`
            );
          }
          // return ctx.badRequest("Lesson already completed");
        }
        // Create Learner Journey
        const result = await strapi.entityService.create(
          "api::learner-journey.learner-journey",
          {
            data: {
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );
        // Injaz Gain by Completing Lesson
        const LearnerGamificationStockDetailsOfInjaz = await strapi.db
          .query("api::learner-gamification-stock.learner-gamification-stock")
          .findOne({
            where: {
              gamification_type: {
                id: 6,
              },
              users_permissions_user: user.id,
            },
          });
        if (!LearnerGamificationStockDetailsOfInjaz) {
          return ctx.badRequest("Something went wrong");
        }
        if (learning_journey_lesson.mysteryBox) {
          try {
            await strapi.entityService.update(
              "api::learner-gamification-stock.learner-gamification-stock",
              LearnerGamificationStockDetailsOfInjaz.id,
              {
                data: {
                  gamification_type: 6,
                  stock:
                    LearnerGamificationStockDetailsOfInjaz.stock +
                    learning_journey_lesson.injaz,
                  users_permissions_user: user.id,
                },
              }
            );
          } catch (error) {
            return ctx.badRequest(`Something went wrong ${error}`);
          }
        } else {
          try {
            await strapi.entityService.update(
              "api::learner-gamification-stock.learner-gamification-stock",
              LearnerGamificationStockDetailsOfInjaz.id,
              {
                data: {
                  gamification_type: 6,
                  stock:
                    LearnerGamificationStockDetailsOfInjaz.stock +
                    getInjazDailyStreakDetails.amount,
                  users_permissions_user: user.id,
                },
              }
            );
          } catch (error) {
            return ctx.badRequest(`Something went wrong ${error}`);
          }
        }

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

    async find(ctx) {
      const user = ctx.state.user;
      let results;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
            {
              ...ctx.query,
            }
          );
        } else {
          //   const profileData = await strapi.db
          //     .query("api::learner-info.learner-info")
          //     .findOne({
          //       where: { users_permissions_user: ctx.state.user.id },
          //     });
          //   if (!profileData) {
          //     return ctx.notFound("Resource not found");
          //   }
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
            {
              filters: {
                users_permissions_user: user.id,
              },
              ...ctx.query,
            }
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-journey.learner-journey"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Learner Journey Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-journey.learner-journey",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );
        // const profileData = await strapi.db
        //   .query("api::learner-info.learner-info")
        //   .findOne({
        //     where: { users_permissions_user: user.id },
        //   });
        // if (!profileData) {
        //   return ctx.notFound("Resource not found");
        // }
        if (user.id === result.users_permissions_user.id) {
          const deleteResult = await strapi.entityService.delete(
            "api::learner-journey.learner-journey",
            id
          );
          return deleteResult;
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(`Learner Journey Delete Error: ${err.message}`);
      }
    },
  })
);
