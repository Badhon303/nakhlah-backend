"use strict";

/**
 * learning-journey-level controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::learning-journey-level.learning-journey-level"
  // ,
  // ({ strapi }) => ({
  //   async getExamQuestions(ctx) {
  //     const { journey, unit, level, ...filteredQuery } = ctx.query;
  //     try {
  //       const questionContentData = await strapi.entityService.findMany(
  //         "api::journey-map-question-content.journey-map-question-content",
  //         {
  //           filters: {
  //             $and: [
  //               {
  //                 learning_journey_lesson: {
  //                   learning_journey_level: {
  //                     learning_journey_unit: {
  //                       learning_journey: {
  //                         title: {
  //                           // @ts-ignore
  //                           $eq: journey,
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //               {
  //                 learning_journey_lesson: {
  //                   learning_journey_level: {
  //                     learning_journey_unit: {
  //                       title: {
  //                         // @ts-ignore
  //                         $eq: unit, //Describe things
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //               {
  //                 learning_journey_lesson: {
  //                   learning_journey_level: {
  //                     title: {
  //                       // @ts-ignore
  //                       $eq: level,
  //                     },
  //                   },
  //                 },
  //               },
  //             ],
  //           },
  //           ...filteredQuery,
  //         }
  //       );

  //       console.log("ctx.query: ", { ...filteredQuery });
  //       console.log("data: ", questionContentData);
  //     } catch (error) {
  //       console.log("error: ", error);
  //     }
  //   },
  // })
);
