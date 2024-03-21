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
  //     let filters = ctx.query.filters || {};
  //     // @ts-ignore
  //     const learning_journey_lesson = filters?.learning_journey_lesson || {};

  //     // Using optional chaining (?.) and logical OR (||) to safely navigate through the object
  //     const learning_journey_sequence =
  //       learning_journey_lesson?.learning_journey_level?.learning_journey_unit
  //         ?.learning_journey?.sequence?.$eq || null;

  //     const learning_journey_unit_sequence =
  //       learning_journey_lesson?.learning_journey_level?.learning_journey_unit
  //         ?.sequence?.$eq || null;

  //     const learning_journey_level_sequence =
  //       learning_journey_lesson?.learning_journey_level?.sequence?.$eq || null;

  //     const learning_journey_lesson_sequence =
  //       learning_journey_lesson?.sequence?.$eq || null;

  //     // let results;
  //     // try {
  //     //   if (ctx.state.user.role.name === "Admin") {
  //     //     results = await strapi.entityService.findMany(
  //     //       "api::journey-map-question-content.journey-map-question-content",
  //     //       {
  //     //         ...ctx.query,
  //     //       }
  //     //     );
  //     //   } else {
  //     //     results = await strapi.entityService.findMany(
  //     //       "api::journey-map-question-content.journey-map-question-content",
  //     //       {
  //     //         populate: {
  //     //           question_content: { populate: "*" },
  //     //           learning_journey_lesson: {
  //     //             populate: {
  //     //               learning_journey_level: {
  //     //                 populate: {
  //     //                   learning_journey_unit: { populate: "learning_journey" },
  //     //                 },
  //     //               },
  //     //             },
  //     //           },
  //     //         },
  //     //         filters: {
  //     //           learning_journey_lesson: {
  //     //             learning_journey_level: {
  //     //               learning_journey_unit: {
  //     //                 learning_journey: { sequence: { $eq: "1" } },
  //     //                 sequence: { $eq: "1" },
  //     //               },
  //     //               sequence: { $eq: "1" },
  //     //             },
  //     //             sequence: { $eq: "1" },
  //     //           },
  //     //         },
  //     //       }
  //     //     );
  //     //   }

  //     //   if (!results || results.length === 0) {
  //     //     return ctx.notFound("No learner information found.");
  //     //   }

  //     //   const data = await sanitize.contentAPI.output(
  //     //     results,
  //     //     strapi.contentType(
  //     //       "api::journey-map-question-content.journey-map-question-content"
  //     //     ),
  //     //     {
  //     //       auth: ctx.state.auth,
  //     //     }
  //     //   );
  //     //   return { data: data };
  //     // } catch (err) {
  //     //   return ctx.badRequest(`User Learner info Error: ${err.message}`);
  //     // }
  //   },
  // })
);
