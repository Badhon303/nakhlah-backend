"use strict";

/**
 * learner-gamification-stock controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

function hasLastSevenDays(streakData) {
  // Get the current date and reset time to midnight
  const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // Check each day from today going back 6 days (total 7 days)
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);

    // Convert checkDate to ISO string and check if any record matches the date
    const dateIso = checkDate.toISOString().slice(0, 10);
    const hasDate = streakData.some((record) => {
      const recordDate = record.updatedAt.slice(0, 10);
      return recordDate === dateIso;
    });

    // If no record matches the date, return false
    if (!hasDate) {
      return false;
    }
  }

  // If all dates are found, return true
  return true;
}

module.exports = createCoreController(
  "api::learner-gamification-stock.learner-gamification-stock",
  ({ strapi }) => ({
    // async create(ctx) {
    //   const user = ctx.state.user;
    //   try {
    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }
    //     // @ts-ignore
    //     let { gamification_type } = ctx.request.body;

    //     const learningJourneyLevelExists = await strapi.db
    //       .query("api::learner-gamification-stock.learner-gamification-stock")
    //       .findOne({
    //         where: {
    //           gamification_type: gamification_type?.connect[0],
    //         },
    //       });
    //     if (learningJourneyLevelExists) {
    //       return ctx.badRequest("Stock type already exists");
    //     }
    //     const result = await strapi.entityService.create(
    //       "api::learner-gamification-stock.learner-gamification-stock",
    //       {
    //         // @ts-ignore
    //         data: {
    //           ...ctx.request.body,
    //           users_permissions_user: user.id,
    //         },
    //         ...ctx.query,
    //       }
    //     );
    //     return await sanitize.contentAPI.output(
    //       result,
    //       strapi.contentType(
    //         "api::learner-gamification-stock.learner-gamification-stock"
    //       ),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Stock Create Error: ${err.message}`
    //     );
    //   }
    // },

    async find(ctx) {
      const user = ctx.state.user;
      let results;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
            {
              ...ctx.query,
            }
          );
        } else {
          const gamificationTxAmountDetails =
            await strapi.entityService.findMany(
              "api::gamification-tx-amount.gamification-tx-amount",
              { populate: { gamification_tx: true } }
            );
          if (!gamificationTxAmountDetails) {
            return ctx.badRequest("Invalid request body");
          }
          const getInjazDailyStreakDetails = gamificationTxAmountDetails.find(
            (item) =>
              item?.gamification_tx?.transactionName ===
              "Injaz Gain By Daily Streak"
          );
          const getInjazFullStreakDetails = gamificationTxAmountDetails.find(
            (item) =>
              item?.gamification_tx?.transactionName ===
              "Injaz Gain By Full Streak"
          );
          const getDateFullStreakDetails = gamificationTxAmountDetails.find(
            (item) =>
              item?.gamification_tx?.transactionName ===
              "Dates Gain By Full Streak"
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

          const LearnerGamificationStockDetailsOfPalm = await strapi.db
            .query("api::learner-gamification-stock.learner-gamification-stock")
            .findOne({
              where: {
                gamification_type: {
                  typeName: "Palm",
                },
                users_permissions_user: user.id,
              },
            });
          if (!LearnerGamificationStockDetailsOfPalm) {
            return ctx.badRequest("Something went wrong");
          }
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
          if (!LearnerGamificationStockDetailsOfDate) {
            return ctx.badRequest("Something went wrong");
          }
          // Palm Gain Per Hour
          let currentTime = new Date();
          let getUpdatedTime = new Date(
            LearnerGamificationStockDetailsOfPalm?.updatedAt
          );
          let hourDifference = Math.round(
            // @ts-ignore
            (currentTime - getUpdatedTime) / (1000 * 60 * 60)
          );
          if (hourDifference >= 1) {
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfPalm.id,
                {
                  data: {
                    gamification_type: 1,
                    stock:
                      LearnerGamificationStockDetailsOfPalm.stock +
                        hourDifference >
                      5
                        ? 5
                        : LearnerGamificationStockDetailsOfPalm.stock +
                          hourDifference,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          }
          // Dates Gain By full Streak
          const streakData = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            {
              limit: 7,
              // @ts-ignore
              sort: { updatedAt: "DESC" },
              filters: {
                users_permissions_user: user.id,
              },
            }
          );

          const hasSevenDaysData = hasLastSevenDays(streakData);
          if (hasSevenDaysData) {
            const dateFullStreakAmount = getDateFullStreakDetails.amount;
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfDate.id,
                {
                  data: {
                    gamification_type: 5,
                    stock:
                      LearnerGamificationStockDetailsOfDate.stock +
                      dateFullStreakAmount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          }
          // Injaz Gain By Daily Streak
          const today = new Date().toISOString().split("T")[0];
          const latestEntryDate = new Date(
            LearnerGamificationStockDetailsOfInjaz?.updatedAt
          )
            .toISOString()
            .split("T")[0];
          const injazDailyStreakAmount = getInjazDailyStreakDetails.amount;
          if (latestEntryDate !== today) {
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfInjaz.id,
                {
                  data: {
                    gamification_type: 6,
                    stock:
                      LearnerGamificationStockDetailsOfInjaz.stock +
                      injazDailyStreakAmount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          }

          // Injaz Gain By Full Streak
          const streakDataInjaz = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            {
              limit: 7,
              // @ts-ignore
              sort: { updatedAt: "DESC" },
              filters: {
                users_permissions_user: user.id,
              },
            }
          );

          const hasSevelDaysDataInjaz = hasLastSevenDays(streakDataInjaz);
          if (hasSevelDaysDataInjaz) {
            const injazFullStreakAmount = getInjazFullStreakDetails.amount;
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfInjaz.id,
                {
                  data: {
                    gamification_type: 6,
                    stock:
                      LearnerGamificationStockDetailsOfInjaz.stock +
                      injazFullStreakAmount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          }

          results = await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
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
          strapi.contentType(
            "api::learner-gamification-stock.learner-gamification-stock"
          ),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Error: ${err.message}`
        );
      }
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      const id = ctx.params.id;
      let findOneResults;
      const gamificationTxAmountDetails = await strapi.entityService.findMany(
        "api::gamification-tx-amount.gamification-tx-amount"
      );
      if (!gamificationTxAmountDetails) {
        return ctx.badRequest("Invalid request body");
      }
      try {
        if (ctx.state.user.role.name === "Admin") {
          findOneResults = await strapi.entityService.findOne(
            "api::learner-gamification-stock.learner-gamification-stock",
            id,
            {
              ...ctx.query,
            }
          );
        } else {
          const result = await strapi.entityService.findOne(
            "api::learner-gamification-stock.learner-gamification-stock",
            id,
            {
              populate: { users_permissions_user: true },
            }
          );

          if (user.id === result.users_permissions_user.id) {
            findOneResults = await strapi.entityService.findMany(
              "api::learner-gamification-stock.learner-gamification-stock",
              {
                filters: {
                  users_permissions_user: user.id,
                },
                ...ctx.query,
              }
            );
            if (id === 1) {
              const LearnerGamificationStockDetailsOfPalm = await strapi.db
                .query(
                  "api::learner-gamification-stock.learner-gamification-stock"
                )
                .findOne({
                  where: {
                    gamification_type: {
                      id: 1,
                    },
                    users_permissions_user: user.id,
                  },
                });
              if (!LearnerGamificationStockDetailsOfPalm) {
                return ctx.badRequest("Something went wrong");
              }
              let currentTime = new Date();
              let getUpdatedTime = new Date(
                LearnerGamificationStockDetailsOfPalm?.updatedAt
              );
              let hourDifference = Math.round(
                // @ts-ignore
                (currentTime - getUpdatedTime) / (1000 * 60 * 60)
              );
              if (hourDifference >= 1) {
                try {
                  await strapi.entityService.update(
                    "api::learner-gamification-stock.learner-gamification-stock",
                    LearnerGamificationStockDetailsOfPalm.id,
                    {
                      data: {
                        gamification_type: 1,
                        stock:
                          LearnerGamificationStockDetailsOfPalm.stock +
                            hourDifference >
                          5
                            ? 5
                            : LearnerGamificationStockDetailsOfPalm.stock +
                              hourDifference,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                } catch (error) {
                  return ctx.badRequest(`Something went wrong ${error}`);
                }
              }
            }
            if (id === 5) {
              const getDateFullStreakDetails = gamificationTxAmountDetails.find(
                (item) => item.id === 10
              );
              const streakData = await strapi.entityService.findMany(
                "api::learner-streak.learner-streak",
                {
                  limit: 7,
                  // @ts-ignore
                  sort: { updatedAt: "DESC" },
                  filters: {
                    users_permissions_user: user.id,
                  },
                }
              );

              const hasSevelDaysData = hasLastSevenDays(streakData);
              if (hasSevelDaysData) {
                const LearnerGamificationStockDetailsOfDate = await strapi.db
                  .query(
                    "api::learner-gamification-stock.learner-gamification-stock"
                  )
                  .findOne({
                    where: {
                      gamification_type: {
                        id: 5,
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
                          getDateFullStreakDetails.amount,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                } catch (error) {
                  return ctx.badRequest(`Something went wrong ${error}`);
                }
              }
            }
            if (id === 6) {
              // Injaz Gain By Daily Streak
              const getInjazDailyStreakDetails =
                gamificationTxAmountDetails.find((item) => item.id === 14);
              const getInjazFullStreakDetails =
                gamificationTxAmountDetails.find((item) => item.id === 15);
              const LearnerGamificationStockDetailsOfInjaz = await strapi.db
                .query(
                  "api::learner-gamification-stock.learner-gamification-stock"
                )
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
              // Injaz Gain by Daily Streak
              const today = new Date().toISOString().split("T")[0];
              const latestEntryDate = new Date(
                LearnerGamificationStockDetailsOfInjaz?.updatedAt
              )
                .toISOString()
                .split("T")[0];
              const injazDailyStreakAmount = getInjazDailyStreakDetails.amount;
              if (latestEntryDate !== today) {
                try {
                  await strapi.entityService.update(
                    "api::learner-gamification-stock.learner-gamification-stock",
                    LearnerGamificationStockDetailsOfInjaz.id,
                    {
                      data: {
                        gamification_type: 6,
                        stock:
                          LearnerGamificationStockDetailsOfInjaz.stock +
                          injazDailyStreakAmount,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                } catch (error) {
                  return ctx.badRequest(`Something went wrong ${error}`);
                }
              }
              // Injaz Gain by Full Streak
              const streakDataInjaz = await strapi.entityService.findMany(
                "api::learner-streak.learner-streak",
                {
                  limit: 7,
                  // @ts-ignore
                  sort: { updatedAt: "DESC" },
                  filters: {
                    users_permissions_user: user.id,
                  },
                }
              );

              const hasSevelDaysDataInjaz = hasLastSevenDays(streakDataInjaz);
              if (hasSevelDaysDataInjaz) {
                const injazFullStreakAmount = getInjazFullStreakDetails.amount;
                try {
                  await strapi.entityService.update(
                    "api::learner-gamification-stock.learner-gamification-stock",
                    LearnerGamificationStockDetailsOfInjaz.id,
                    {
                      data: {
                        gamification_type: 6,
                        stock:
                          LearnerGamificationStockDetailsOfInjaz.stock +
                          injazFullStreakAmount,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                } catch (error) {
                  return ctx.badRequest(`Something went wrong ${error}`);
                }
              }
            }
          } else {
            ctx.unauthorized("You are not authorized to perform this action.");
          }
        }
        return await sanitize.contentAPI.output(
          findOneResults,
          strapi.contentType(
            "api::learner-gamification-stock.learner-gamification-stock"
          ),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Error: ${err.message}`
        );
      }
    },

    // async delete(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const id = ctx.params.id;
    //     const result = await strapi.entityService.findOne(
    //       "api::learner-gamification-stock.learner-gamification-stock",
    //       id,
    //       {
    //         populate: { users_permissions_user: true },
    //       }
    //     );
    //     if (user.id === result.users_permissions_user.id) {
    //       const deleteResult = await strapi.entityService.delete(
    //         "api::learner-gamification-stock.learner-gamification-stock",
    //         id
    //       );
    //       return deleteResult;
    //     } else {
    //       ctx.unauthorized("You are not authorized to perform this action.");
    //     }
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Stock Delete Error: ${err.message}`
    //     );
    //   }
    // },

    async update(ctx) {
      try {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const result = await strapi.entityService.findOne(
          "api::learner-gamification-stock.learner-gamification-stock",
          id,
          {
            populate: { users_permissions_user: true },
          }
        );

        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        if (user.id === result.users_permissions_user.id) {
          const updateResult = await strapi.entityService.update(
            "api::learner-gamification-stock.learner-gamification-stock",
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
            strapi.contentType(
              "api::learner-gamification-stock.learner-gamification-stock"
            ),
            {
              auth: ctx.state.auth,
            }
          );
        } else {
          ctx.unauthorized("You are not authorized to perform this action.");
        }
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Stock Update Error: ${err.message}`
        );
      }
    },
  })
);
