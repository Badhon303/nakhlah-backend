"use strict";

/**
 * learner-journey controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

async function fetchLearningJourneys() {
  const response = await strapi.entityService.findMany(
    "api::learning-journey.learning-journey"
  );
  return response;
}

async function fetchLearningJourneyUnits(learningJourneyId) {
  const response = await strapi.entityService.findMany(
    "api::learning-journey-unit.learning-journey-unit",
    {
      filters: { learning_journey: learningJourneyId },
    }
  );
  return response;
}

async function fetchLearningJourneyLevels(unitId) {
  const response = await strapi.entityService.findMany(
    "api::learning-journey-level.learning-journey-level",
    {
      filters: { learning_journey_unit: unitId },
    }
  );
  return response;
}

async function fetchLessons(levelId) {
  const response = await strapi.entityService.findMany(
    "api::learning-journey-lesson.learning-journey-lesson",
    {
      filters: { learning_journey_level: levelId },
    }
  );
  return response;
}

// Function to get next lesson
async function getNextLesson(currentLesson) {
  try {
    const learningJourneys = await fetchLearningJourneys();
    const currentLearningJourney = learningJourneys.find(
      (journey) =>
        journey.id ===
        currentLesson.learning_journey_level.learning_journey_unit
          .learning_journey.id
    );

    if (!currentLearningJourney)
      throw new Error("Current learning journey not found.");

    const units = await fetchLearningJourneyUnits(currentLearningJourney.id);
    const currentUnit = units.find(
      (unit) =>
        unit.id ===
        currentLesson.learning_journey_level.learning_journey_unit.id
    );

    if (!currentUnit) throw new Error("Current unit not found.");

    const levels = await fetchLearningJourneyLevels(currentUnit.id);
    const currentLevel = levels.find(
      (level) => level.id === currentLesson.learning_journey_level.id
    );

    if (!currentLevel) throw new Error("Current level not found.");

    const lessons = await fetchLessons(currentLevel.id);

    // Sort lessons by lessonSequence to handle gaps in sequence
    const sortedLessons = lessons.sort(
      (a, b) => a.lessonSequence - b.lessonSequence
    );
    const currentLessonIndex = sortedLessons.findIndex(
      (lesson) => lesson.id === currentLesson.id
    );

    // Try to find the next lesson within the same level
    if (
      currentLessonIndex !== -1 &&
      currentLessonIndex < sortedLessons.length - 1
    ) {
      return sortedLessons[currentLessonIndex + 1];
    }

    // If no more lessons in the current level, move to the next level
    const currentLevelIndex = levels.findIndex(
      (level) => level.id === currentLevel.id
    );
    if (currentLevelIndex !== -1 && currentLevelIndex < levels.length - 1) {
      const nextLevel = levels[currentLevelIndex + 1];
      const nextLevelLessons = await fetchLessons(nextLevel.id);
      if (nextLevelLessons.length > 0) {
        // Sort lessons by lessonSequence to handle gaps in sequence
        const sortedNextLevelLessons = nextLevelLessons.sort(
          (a, b) => a.lessonSequence - b.lessonSequence
        );
        return sortedNextLevelLessons[0];
      }
    }

    // If no more levels in the current unit, move to the next unit
    const currentUnitIndex = units.findIndex(
      (unit) => unit.id === currentUnit.id
    );
    if (currentUnitIndex !== -1 && currentUnitIndex < units.length - 1) {
      const nextUnit = units[currentUnitIndex + 1];
      const nextUnitLevels = await fetchLearningJourneyLevels(nextUnit.id);
      if (nextUnitLevels.length > 0) {
        const nextUnitLessons = await fetchLessons(nextUnitLevels[0].id);
        if (nextUnitLessons.length > 0) {
          // Sort lessons by lessonSequence to handle gaps in sequence
          const sortedNextUnitLessons = nextUnitLessons.sort(
            (a, b) => a.lessonSequence - b.lessonSequence
          );
          return sortedNextUnitLessons[0];
        }
      }
    }

    // If no more units in the current learning journey, move to the next learning journey
    const currentLearningJourneyIndex = learningJourneys.findIndex(
      (journey) => journey.id === currentLearningJourney.id
    );
    if (
      currentLearningJourneyIndex !== -1 &&
      currentLearningJourneyIndex < learningJourneys.length - 1
    ) {
      const nextLearningJourney =
        learningJourneys[currentLearningJourneyIndex + 1];
      const nextLearningJourneyUnits = await fetchLearningJourneyUnits(
        nextLearningJourney.id
      );
      if (nextLearningJourneyUnits.length > 0) {
        const nextLearningJourneyLevels = await fetchLearningJourneyLevels(
          nextLearningJourneyUnits[0].id
        );
        if (nextLearningJourneyLevels.length > 0) {
          const nextLearningJourneyLessons = await fetchLessons(
            nextLearningJourneyLevels[0].id
          );
          if (nextLearningJourneyLessons.length > 0) {
            // Sort lessons by lessonSequence to handle gaps in sequence
            const sortedNextLearningJourneyLessons =
              nextLearningJourneyLessons.sort(
                (a, b) => a.lessonSequence - b.lessonSequence
              );
            return sortedNextLearningJourneyLessons[0];
          }
        }
      }
    }

    throw new Error("No next lesson found.");
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = createCoreController(
  "api::learner-journey.learner-journey",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      // if (!lessonIds || !Array.isArray(lessonIds)) {
      //   return ctx.badRequest('Invalid lessonIds');
      // }
      const progressData = await strapi.db
        .query("api::learner-progress.learner-progress")
        .findOne({
          where: { users_permissions_user: user.id },
        });
      if (!progressData) {
        return ctx.badRequest("Data not found");
      }
      const currentLesson = await strapi.entityService.findOne(
        "api::learning-journey-lesson.learning-journey-lesson",
        progressData.progressId,
        {
          populate: {
            learning_journey_level: {
              populate: {
                learning_journey_unit: {
                  populate: {
                    learning_journey: true,
                  },
                },
              },
            },
          },
        }
      );
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        const gamificationTxAmountDetails = await strapi.entityService.findMany(
          "api::gamification-tx-amount.gamification-tx-amount",
          { populate: { gamification_tx: true } }
        );
        if (!gamificationTxAmountDetails) {
          return ctx.badRequest("Invalid request body");
        }
        const getInjazRefillByPractice = gamificationTxAmountDetails.find(
          (item) =>
            item?.gamification_tx?.transactionName ===
            "Injaz Refill By Practice"
        );
        const getInjazGainByCompletingLesson = gamificationTxAmountDetails.find(
          (item) =>
            item?.gamification_tx?.transactionName ===
            "Injaz Gain By Completing Lesson"
        );

        // Getting Gemification Types
        const gamificationTypesDetails = await strapi.entityService.findMany(
          "api::gamification-type.gamification-type"
        );
        if (!gamificationTypesDetails) {
          return ctx.badRequest("No details found");
        }
        const getInjazDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Injaz"
        );

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
        if (!LearnerGamificationStockDetailsOfInjaz) {
          return ctx.badRequest("Something went wrong");
        }

        // @ts-ignore
        let { learning_journey_lesson } = ctx.request.body;

        const learningJourneyLessonExists = await strapi.db
          .query("api::learner-journey.learner-journey")
          .findOne({
            where: {
              learning_journey_lesson: learning_journey_lesson?.connect[0],
              users_permissions_user: user.id,
            },
          });
        if (learningJourneyLessonExists) {
          try {
            if (
              typeof ctx.request.body !== "object" ||
              ctx.request.body === null
            ) {
              return ctx.badRequest("Invalid request body");
            }
            await strapi.entityService.create(
              "api::lesson-practice.lesson-practice",
              {
                // @ts-ignore
                data: {
                  learning_journey_lesson: learning_journey_lesson?.connect[0],
                  users_permissions_user: user.id,
                },
              }
            );
            // Injaz Refill By Practice

            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfInjaz.id,
                {
                  data: {
                    gamification_type: getInjazDetails.id,
                    stock:
                      LearnerGamificationStockDetailsOfInjaz.stock +
                      getInjazRefillByPractice.amount,
                    users_permissions_user: user.id,
                  },
                }
              );
              await strapi.entityService.create(
                "api::learner-gamification.learner-gamification",
                {
                  // @ts-ignore
                  data: {
                    gamification_tx: getInjazRefillByPractice.id, // data.gamification_tx.connect[0]
                    users_permissions_user: user.id,
                  },
                  ...ctx.query,
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          } catch (err) {
            return ctx.badRequest(
              `Learner practice Create Error: ${err.message}`
            );
          }
          return ctx.badRequest("Lesson already completed");
        } else {
          // Injaz Gain by Completing Lesson
          try {
            await strapi.entityService.update(
              "api::learner-gamification-stock.learner-gamification-stock",
              LearnerGamificationStockDetailsOfInjaz.id,
              {
                data: {
                  gamification_type: getInjazDetails.id,
                  stock:
                    LearnerGamificationStockDetailsOfInjaz.stock +
                    getInjazGainByCompletingLesson.amount,
                  users_permissions_user: user.id,
                },
              }
            );
            await strapi.entityService.create(
              "api::learner-gamification.learner-gamification",
              {
                // @ts-ignore
                data: {
                  gamification_tx: getInjazGainByCompletingLesson.id, // data.gamification_tx.connect[0]
                  users_permissions_user: user.id,
                },
                ...ctx.query,
              }
            );
          } catch (error) {
            return ctx.badRequest(`Something went wrong ${error}`);
          }
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

        getNextLesson(currentLesson).then(async (nextLesson) => {
          if (nextLesson) {
            // await strapi.entityService.create(
            //   "api::learner-progress.learner-progress",
            //   {
            //     // @ts-ignore
            //     data: {
            //       progressId: nextLesson.id,
            //       users_permissions_user: user.id,
            //     },
            //   }
            // );
            await strapi.db
              .query("api::learner-progress.learner-progress")
              .update({
                where: { users_permissions_user: { id: user.id } },
                data: {
                  progressId: nextLesson.id,
                },
              });
          } else {
            console.log("No next lesson found.");
          }
        });

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
      const query = { ...ctx.query };
      if (!query.filters) {
        // @ts-ignore
        query.filters = {};
      }
      // @ts-ignore
      query.filters.users_permissions_user = user.id;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-journey.learner-journey",
            query
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
