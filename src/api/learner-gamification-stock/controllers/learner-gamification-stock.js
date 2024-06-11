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

// function mergeCountryInfo(results, learnerInfos) {
//   const userCountryMap = learnerInfos.reduce((acc, learnerInfo) => {
//     acc[learnerInfo.users_permissions_user.id] = learnerInfo.country;
//     return acc;
//   }, {});

//   return results.map((result) => {
//     const country = userCountryMap[result.users_permissions_user.id];
//     const {
//       users_permissions_user,
//       country: resultCountry,
//       createdAt,
//       updatedAt,
//       ...restResult
//     } = result;
//     const { id: userId, ...restUser } = users_permissions_user;
//     const {
//       id: countryId,
//       createdAt: countryCreatedAt,
//       updatedAt: countryUpdatedAt,
//       ...restCountry
//     } = country || {};

//     return {
//       ...restResult,
//       users_permissions_user: restUser,
//       country: country ? restCountry : null,
//     };
//   });
// }

function mergeCountryInfo(results, learnerInfos) {
  const userCountryMap = learnerInfos.reduce((acc, learnerInfo) => {
    acc[learnerInfo.users_permissions_user.id] = learnerInfo.country;
    return acc;
  }, {});

  return results.map((result) => {
    const country = userCountryMap[result.users_permissions_user.id];
    const {
      users_permissions_user,
      country: resultCountry,
      createdAt,
      updatedAt,
      id,
      ...restResult
    } = result;
    const { id: userId, ...restUser } = users_permissions_user;
    const {
      id: countryId,
      createdAt: countryCreatedAt,
      updatedAt: countryUpdatedAt,
      ...restCountry
    } = country || {};

    return {
      ...restResult,
      users_permissions_user: restUser,
      country: country ? restCountry : null,
    };
  });
}

async function fetchLearnerInfos(userIds) {
  const learnerInfos = await strapi.entityService.findMany(
    "api::learner-info.learner-info",
    {
      filters: {
        users_permissions_user: {
          id: {
            $in: userIds,
          },
        },
      },
      populate: ["country", "users_permissions_user"],
      // populate: {
      //   country: {
      //     fields: "*",
      //   },
      //   users_permissions_user: {
      //     fields: ["username", "email"],
      //   },
      // },
    }
  );
  console.log("learnerInfos: ", learnerInfos);
  return learnerInfos;
}
module.exports = createCoreController(
  "api::learner-gamification-stock.learner-gamification-stock",
  ({ strapi }) => ({
    async userPositionByInjaz(ctx) {
      const user = ctx.state.user;
      try {
        const userInjaz = await strapi.entityService.findMany(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            populate: {
              users_permissions_user: {
                fields: ["id"],
              },
            },
            filters: {
              gamification_type: {
                typeName: {
                  $eq: "Injaz",
                },
              },
            },
            sort: { stock: "desc" },
          }
        );
        const position =
          userInjaz.findIndex(
            (item) => item.users_permissions_user.id === user.id
          ) + 1;

        const userInjazStock = await strapi.db
          .query("api::learner-gamification-stock.learner-gamification-stock")
          .findOne({
            where: {
              users_permissions_user: user.id,
              gamification_type: {
                typeName: {
                  $eq: "Injaz",
                },
              },
            },
            populate: {
              users_permissions_user: {
                fields: ["username", "email"],
              },
            },
          });

        const learnerInfos = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: {
              users_permissions_user: user.id,
            },
            populate: { country: true },
          });
        const response = {
          stock: userInjazStock.stock,
          users_permissions_user: {
            username: userInjazStock.users_permissions_user.username,
            email: userInjazStock.users_permissions_user.email,
          },
          position: position,
          country: learnerInfos.country?.country,
        };
        ctx.send({ data: response });
      } catch (err) {
        return ctx.badRequest(`Get injaz Position Error: ${err.message}`);
      }
    },
    async findInjaz(ctx) {
      const user = ctx.state.user;
      try {
        // Fetch the results
        const results = await strapi.entityService.findMany(
          "api::learner-gamification-stock.learner-gamification-stock",
          {
            limit: 10,
            populate: {
              users_permissions_user: {
                fields: ["username", "email"],
              },
            },
            filters: {
              gamification_type: {
                typeName: {
                  $eq: "Injaz",
                },
              },
            },
            sort: { stock: "desc" },
          }
        );

        const userIds = results.map((item) => item.users_permissions_user.id);
        const userExists = userIds.includes(user.id);

        const data = await fetchLearnerInfos(userIds).then((learnerInfos) => {
          const mergedResults = mergeCountryInfo(results, learnerInfos);
          return mergedResults;
        });

        return {
          data,
          userInjazStock: userExists ? null : "poor learner",
        };
      } catch (err) {
        return ctx.badRequest(`Get injaz Error: ${err.message}`);
      }
    },
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
          // Getting Gemification Types
          const gamificationTypesDetails = await strapi.entityService.findMany(
            "api::gamification-type.gamification-type"
          );
          if (!gamificationTypesDetails) {
            return ctx.badRequest("No details found");
          }
          const getPalmDetails = gamificationTypesDetails.find(
            (item) => item?.typeName === "Palm"
          );
          const getDateDetails = gamificationTypesDetails.find(
            (item) => item?.typeName === "Date"
          );
          const getInjazDetails = gamificationTypesDetails.find(
            (item) => item?.typeName === "Injaz"
          );

          // Getting Amount of Injaz and Dates from gamification transaction amount
          const gamificationTxAmountDetails =
            await strapi.entityService.findMany(
              "api::gamification-tx-amount.gamification-tx-amount",
              { populate: { gamification_tx: true } }
            );
          if (!gamificationTxAmountDetails) {
            return ctx.badRequest("No details found");
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
          const getPalmGainPerHourDetails = gamificationTxAmountDetails.find(
            (item) =>
              item?.gamification_tx?.transactionName === "Palm Gain Per Hour"
          );

          // Getting Current Amount of Injaz, Palm and Dates
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

          let currentTime = new Date();

          // Injaz Gain By Daily Streak
          const today = currentTime.toISOString().split("T")[0];
          const streakLatestData = await strapi.entityService.findMany(
            "api::learner-streak.learner-streak",
            {
              limit: 1,
              // @ts-ignore
              sort: { updatedAt: "DESC" },
              filters: {
                users_permissions_user: user.id,
              },
            }
          );
          if (!streakLatestData) {
            return ctx.badRequest("Data not found");
          }

          const latestEntryDate = new Date(streakLatestData[0]?.updatedAt)
            .toISOString()
            .split("T")[0];

          if (latestEntryDate !== today) {
            try {
              await strapi.entityService.create(
                "api::learner-streak.learner-streak",
                {
                  // @ts-ignore
                  data: {
                    present: true,
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
                      LearnerGamificationStockDetailsOfInjaz.stock +
                      getInjazDailyStreakDetails.amount,
                    users_permissions_user: user.id,
                  },
                }
              );
              await strapi.entityService.create(
                "api::learner-gamification.learner-gamification",
                {
                  // @ts-ignore
                  data: {
                    gamification_tx: getInjazDailyStreakDetails.id, // data.gamification_tx.connect[0]
                    users_permissions_user: user.id,
                  },
                  ...ctx.query,
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
          }

          // Palm Gain Per Hour
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
                    gamification_type: getPalmDetails.id,
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
              await strapi.entityService.create(
                "api::learner-gamification.learner-gamification",
                {
                  // @ts-ignore
                  data: {
                    gamification_tx: getPalmGainPerHourDetails.id, // data.gamification_tx.connect[0]
                    users_permissions_user: user.id,
                  },
                  ...ctx.query,
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
                checked: false,
              },
            }
          );
          if (streakData.length === 7) {
            const hasSevenDaysData = hasLastSevenDays(streakData);
            if (hasSevenDaysData) {
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfDate.id,
                  {
                    data: {
                      gamification_type: getDateDetails.id,
                      stock:
                        LearnerGamificationStockDetailsOfDate.stock +
                        getDateFullStreakDetails.amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
                await strapi.entityService.create(
                  "api::learner-gamification.learner-gamification",
                  {
                    // @ts-ignore
                    data: {
                      gamification_tx: getDateFullStreakDetails.id, // data.gamification_tx.connect[0]
                      users_permissions_user: user.id,
                    },
                    ...ctx.query,
                  }
                );
                const streakIds = streakData.map((streak) => streak.id);
                try {
                  await strapi.db
                    .query("api::learner-streak.learner-streak")
                    .updateMany({
                      where: { id: { $in: streakIds } },
                      data: {
                        checked: true, // Example update (replace with your desired changes)
                      },
                    });
                } catch (error) {
                  ctx.badRequest("Error updating streaks");
                }
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
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
                checked: false,
              },
            }
          );
          if (streakDataInjaz.length === 7) {
            const hasSevenDaysDataInjaz = hasLastSevenDays(streakDataInjaz);
            if (hasSevenDaysDataInjaz) {
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfInjaz.id,
                  {
                    data: {
                      gamification_type: getInjazDetails.id,
                      stock:
                        LearnerGamificationStockDetailsOfInjaz.stock +
                        getInjazFullStreakDetails.amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
                await strapi.entityService.create(
                  "api::learner-gamification.learner-gamification",
                  {
                    // @ts-ignore
                    data: {
                      gamification_tx: getInjazFullStreakDetails.id, // data.gamification_tx.connect[0]
                      users_permissions_user: user.id,
                    },
                    ...ctx.query,
                  }
                );
                const streakInjazIds = streakDataInjaz.map(
                  (streak) => streak.id
                );
                try {
                  await strapi.db
                    .query("api::learner-streak.learner-streak")
                    .updateMany({
                      where: { id: { $in: streakInjazIds } },
                      data: {
                        checked: true, // Example update (replace with your desired changes)
                      },
                    });
                } catch (error) {
                  ctx.badRequest("Error updating streaks");
                }
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
            }
          }
          const query = { ...ctx.query };
          if (!query.filters) {
            // @ts-ignore
            query.filters = {};
          }
          // @ts-ignore
          query.filters.users_permissions_user = user.id;
          results = await strapi.entityService.findMany(
            "api::learner-gamification-stock.learner-gamification-stock",
            query
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
      try {
        // Getting Amount of Injaz and Dates
        const gamificationTxAmountDetails = await strapi.entityService.findMany(
          "api::gamification-tx-amount.gamification-tx-amount",
          { populate: { gamification_tx: true } }
        );
        if (!gamificationTxAmountDetails) {
          return ctx.badRequest("No details found");
        }

        // Getting Gemification Types
        const gamificationTypesDetails = await strapi.entityService.findMany(
          "api::gamification-type.gamification-type"
        );
        if (!gamificationTypesDetails) {
          return ctx.badRequest("No details found");
        }
        const getPalmDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Palm"
        );
        const getDateDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Date"
        );
        const getInjazDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Injaz"
        );

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
              populate: ["users_permissions_user", "gamification_type"],
            }
          );
          if (user.id === result.users_permissions_user.id) {
            if (result.gamification_type.id === getPalmDetails.id) {
              const LearnerGamificationStockDetailsOfPalm = await strapi.db
                .query(
                  "api::learner-gamification-stock.learner-gamification-stock"
                )
                .findOne({
                  where: {
                    gamification_type: {
                      id: getPalmDetails.id,
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
                  const getPalmGainPerHourDetails =
                    gamificationTxAmountDetails.find(
                      (item) =>
                        item?.gamification_tx?.transactionName ===
                        "Palm Gain Per Hour"
                    );
                  await strapi.entityService.update(
                    "api::learner-gamification-stock.learner-gamification-stock",
                    LearnerGamificationStockDetailsOfPalm.id,
                    {
                      data: {
                        gamification_type: getPalmDetails.id,
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
                  await strapi.entityService.create(
                    "api::learner-gamification.learner-gamification",
                    {
                      // @ts-ignore
                      data: {
                        gamification_tx: getPalmGainPerHourDetails.id, // data.gamification_tx.connect[0]
                        users_permissions_user: user.id,
                      },
                      ...ctx.query,
                    }
                  );
                } catch (error) {
                  return ctx.badRequest(`Something went wrong ${error}`);
                }
              }
            }
            if (result.gamification_type.id === getDateDetails.id) {
              const getDateFullStreakDetails = gamificationTxAmountDetails.find(
                (item) =>
                  item?.gamification_tx?.transactionName ===
                  "Dates Gain By Full Streak"
              );
              const streakData = await strapi.entityService.findMany(
                "api::learner-streak.learner-streak",
                {
                  limit: 7,
                  // @ts-ignore
                  sort: { updatedAt: "DESC" },
                  filters: {
                    users_permissions_user: user.id,
                    checked: false,
                  },
                }
              );
              if (streakData.length === 7) {
                const hasSevenDaysData = hasLastSevenDays(streakData);
                if (hasSevenDaysData) {
                  const LearnerGamificationStockDetailsOfDate = await strapi.db
                    .query(
                      "api::learner-gamification-stock.learner-gamification-stock"
                    )
                    .findOne({
                      where: {
                        gamification_type: {
                          id: getDateDetails.id,
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
                          gamification_type: getDateDetails.id,
                          stock:
                            LearnerGamificationStockDetailsOfDate.stock +
                            getDateFullStreakDetails.amount,
                          users_permissions_user: user.id,
                        },
                      }
                    );
                    await strapi.entityService.create(
                      "api::learner-gamification.learner-gamification",
                      {
                        // @ts-ignore
                        data: {
                          gamification_tx: getDateFullStreakDetails.id, // data.gamification_tx.connect[0]
                          users_permissions_user: user.id,
                        },
                        ...ctx.query,
                      }
                    );
                    const streakIds = streakData.map((streak) => streak.id);
                    try {
                      await strapi.db
                        .query("api::learner-streak.learner-streak")
                        .updateMany({
                          where: { id: { $in: streakIds } },
                          data: {
                            checked: true, // Example update (replace with your desired changes)
                          },
                        });
                    } catch (error) {
                      ctx.badRequest("Error updating streaks");
                    }
                  } catch (error) {
                    return ctx.badRequest(`Something went wrong ${error}`);
                  }
                }
              }
            }

            if (result.gamification_type.id === getInjazDetails.id) {
              const getInjazDailyStreakDetails =
                gamificationTxAmountDetails.find(
                  (item) =>
                    item?.gamification_tx?.transactionName ===
                    "Injaz Gain By Daily Streak"
                );
              const getInjazFullStreakDetails =
                gamificationTxAmountDetails.find(
                  (item) =>
                    item?.gamification_tx?.transactionName ===
                    "Injaz Gain By Full Streak"
                );
              const LearnerGamificationStockDetailsOfInjaz = await strapi.db
                .query(
                  "api::learner-gamification-stock.learner-gamification-stock"
                )
                .findOne({
                  where: {
                    gamification_type: {
                      id: getInjazDetails.id,
                    },
                    users_permissions_user: user.id,
                  },
                });
              if (!LearnerGamificationStockDetailsOfInjaz) {
                return ctx.badRequest("Something went wrong");
              }

              // Injaz Gain By Daily Streak
              let currentTime = new Date();
              const today = currentTime.toISOString().split("T")[0];
              const streakLatestData = await strapi.entityService.findMany(
                "api::learner-streak.learner-streak",
                {
                  limit: 1,
                  // @ts-ignore
                  sort: { updatedAt: "DESC" },
                  filters: {
                    users_permissions_user: user.id,
                  },
                }
              );
              if (!streakLatestData) {
                return ctx.badRequest("Data not found");
              }

              const latestEntryDate = new Date(streakLatestData[0]?.updatedAt)
                .toISOString()
                .split("T")[0];

              if (latestEntryDate !== today) {
                try {
                  await strapi.entityService.create(
                    "api::learner-streak.learner-streak",
                    {
                      // @ts-ignore
                      data: {
                        present: true,
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
                          LearnerGamificationStockDetailsOfInjaz.stock +
                          getInjazDailyStreakDetails.amount,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                  await strapi.entityService.create(
                    "api::learner-gamification.learner-gamification",
                    {
                      // @ts-ignore
                      data: {
                        gamification_tx: getInjazDailyStreakDetails.id, // data.gamification_tx.connect[0]
                        users_permissions_user: user.id,
                      },
                      ...ctx.query,
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
                    checked: false,
                  },
                }
              );
              if (streakDataInjaz.length === 7) {
                const hasSevenDaysDataInjaz = hasLastSevenDays(streakDataInjaz);
                if (hasSevenDaysDataInjaz) {
                  try {
                    await strapi.entityService.update(
                      "api::learner-gamification-stock.learner-gamification-stock",
                      LearnerGamificationStockDetailsOfInjaz.id,
                      {
                        data: {
                          gamification_type: getInjazDetails.id,
                          stock:
                            LearnerGamificationStockDetailsOfInjaz.stock +
                            getInjazFullStreakDetails.amount,
                          users_permissions_user: user.id,
                        },
                      }
                    );
                    await strapi.entityService.create(
                      "api::learner-gamification.learner-gamification",
                      {
                        // @ts-ignore
                        data: {
                          gamification_tx: getInjazFullStreakDetails.id, // data.gamification_tx.connect[0]
                          users_permissions_user: user.id,
                        },
                        ...ctx.query,
                      }
                    );
                    const streakInjazIds = streakDataInjaz.map(
                      (streak) => streak.id
                    );
                    try {
                      await strapi.db
                        .query("api::learner-streak.learner-streak")
                        .updateMany({
                          where: { id: { $in: streakInjazIds } },
                          data: {
                            checked: true, // Example update (replace with your desired changes)
                          },
                        });
                    } catch (error) {
                      ctx.badRequest("Error updating streaks");
                    }
                  } catch (error) {
                    return ctx.badRequest(`Something went wrong ${error}`);
                  }
                }
              }
            }
            findOneResults = await strapi.entityService.findOne(
              "api::learner-gamification-stock.learner-gamification-stock",
              id
            );
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
