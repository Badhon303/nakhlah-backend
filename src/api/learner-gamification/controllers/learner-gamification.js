"use strict";

/**
 * learner-gamification controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

// function hasLastSevenDays(streakData) {
//   const today = new Date();

//   // Function to format date to 'YYYY-MM-DD'
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1; // getMonth() returns month from 0-11
//     const day = date.getDate();
//     return `${year}-${month.toString().padStart(2, "0")}-${day
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   // Check each day from today going back 6 days (total 7 days)
//   for (let i = 0; i < 7; i++) {
//     const checkDate = new Date(today);
//     checkDate.setDate(checkDate.getDate() - i);
//     const dateStr = formatDate(checkDate);
//     console.log("dateStr: ", dateStr);

//     const hasDate = streakData.some((record) => {
//       const recordDate = new Date(record.updatedAt);
//       return formatDate(recordDate) === dateStr;
//     });

//     // If no record matches the date, return false
//     if (!hasDate) {
//       return false;
//     }
//   }

//   // If all dates are found, return true
//   return true;
// }

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
  "api::learner-gamification.learner-gamification",
  ({ strapi }) => ({
    async txAmount(ctx) {
      // @ts-ignore
      const { data } = ctx.request.body;
      const gamificationTxDetails = await strapi.db
        .query("api::gamification-tx.gamification-tx")
        .findOne({
          where: { transactionName: data.gamification_tx },
          populate: { gamification_tx_amount: true },
        });

      if (!gamificationTxDetails) {
        return ctx.badRequest("Invalid request body");
      }
      ctx.send({ data: gamificationTxDetails?.gamification_tx_amount?.amount });
    },
    async create(ctx) {
      const user = ctx.state.user;
      // @ts-ignore
      const { data } = ctx.request.body;
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
        const getPalmDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Palm"
        );
        const getDateDetails = gamificationTypesDetails.find(
          (item) => item?.typeName === "Date"
        );
        // const getInjazDetails = gamificationTypesDetails.find(
        //   (item) => item?.typeName === "Injaz"
        // );

        const gamificationTxDetails = await strapi.db
          .query("api::gamification-tx.gamification-tx")
          .findOne({
            where: { transactionName: data.gamification_tx },
            populate: { gamification_tx_amount: true },
          });

        if (!gamificationTxDetails) {
          return ctx.badRequest("Invalid request body");
        }
        const amount = gamificationTxDetails?.gamification_tx_amount?.amount;
        const gamificationTransactionName =
          gamificationTxDetails?.transactionName; // Palm Gain Per Hour(1), Palm Loss By Wrong Answer(2), Palm Refill By Dates Loss(5)

        switch (gamificationTransactionName) {
          case "Palm Loss By Wrong Answer":
            const LearnerGamificationStockDetailsOfPalm2 = await strapi.db
              .query(
                "api::learner-gamification-stock.learner-gamification-stock"
              )
              .findOne({
                where: {
                  gamification_type: {
                    typeName: "Palm",
                  },
                  users_permissions_user: user.id,
                },
              });
            if (!LearnerGamificationStockDetailsOfPalm2) {
              return ctx.badRequest("Something went wrong");
            }
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfPalm2.id,
                {
                  data: {
                    gamification_type: getPalmDetails.id,
                    stock:
                      LearnerGamificationStockDetailsOfPalm2.stock - amount < 0
                        ? 0
                        : LearnerGamificationStockDetailsOfPalm2.stock - amount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
            break;
          case "Palm Refill By Dates Loss":
            const LearnerGamificationStockDetails5 =
              await strapi.entityService.findMany(
                "api::learner-gamification-stock.learner-gamification-stock",
                {
                  filters: { users_permissions_user: user.id },
                  populate: { gamification_type: true },
                }
              );
            if (!LearnerGamificationStockDetails5) {
              return ctx.badRequest("Something went wrong");
            }
            const dateItem = LearnerGamificationStockDetails5.find(
              (item) => item.gamification_type.typeName === "Date"
            );
            const palmItem = LearnerGamificationStockDetails5.find(
              (item) => item.gamification_type.typeName === "Palm"
            );
            if (!dateItem.stock || dateItem.stock < amount) {
              return ctx.badRequest(`Don't have enough dates to purchase palm`);
            }
            if (palmItem.stock === 5) {
              return ctx.badRequest("You already have 5 palm trees");
            } else {
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  palmItem.id,
                  {
                    data: {
                      gamification_type: getPalmDetails.id,
                      stock: 5,
                      users_permissions_user: user.id,
                    },
                  }
                );
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  dateItem.id,
                  {
                    data: {
                      gamification_type: getDateDetails.id,
                      stock: dateItem.stock - amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest("Something went wrong");
              }
            }
            break;
          case "Palm Gain By Advertisement":
            const LearnerGamificationStockDetailsOfPalm6 = await strapi.db
              .query(
                "api::learner-gamification-stock.learner-gamification-stock"
              )
              .findOne({
                where: {
                  gamification_type: {
                    typeName: "Palm",
                  },
                  users_permissions_user: user.id,
                },
              });
            if (!LearnerGamificationStockDetailsOfPalm6) {
              return ctx.badRequest("Something went wrong");
            }
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfPalm6.id,
                {
                  data: {
                    gamification_type: getPalmDetails.id,
                    stock:
                      LearnerGamificationStockDetailsOfPalm6.stock + amount > 5
                        ? 5
                        : LearnerGamificationStockDetailsOfPalm6.stock + amount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
            break;
          case "Dates Gain By Public Sharing":
            const LearnerGamificationStockDetailsOfDate9 = await strapi.db
              .query(
                "api::learner-gamification-stock.learner-gamification-stock"
              )
              .findOne({
                where: {
                  gamification_type: {
                    typeName: "Date",
                  },
                  users_permissions_user: user.id,
                },
              });
            if (!LearnerGamificationStockDetailsOfDate9) {
              return ctx.badRequest("Something went wrong");
            }
            try {
              await strapi.entityService.update(
                "api::learner-gamification-stock.learner-gamification-stock",
                LearnerGamificationStockDetailsOfDate9.id,
                {
                  data: {
                    gamification_type: getDateDetails.id,
                    stock:
                      LearnerGamificationStockDetailsOfDate9.stock + amount,
                    users_permissions_user: user.id,
                  },
                }
              );
            } catch (error) {
              return ctx.badRequest(`Something went wrong ${error}`);
            }
            break;
          case "Dates Loss By Streak Restore":
            const streakData11 = await strapi.entityService.findMany(
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
            if (streakData11.length === 7) {
              const hasSevelDaysData11 = hasLastSevenDays(streakData11);
              if (!hasSevelDaysData11) {
                const LearnerGamificationStockDetailsOfDate11 = await strapi.db
                  .query(
                    "api::learner-gamification-stock.learner-gamification-stock"
                  )
                  .findOne({
                    where: {
                      gamification_type: {
                        typeName: "Date",
                      },
                      users_permissions_user: user.id,
                    },
                  });
                if (!LearnerGamificationStockDetailsOfDate11) {
                  return ctx.badRequest("Something went wrong");
                }

                if (LearnerGamificationStockDetailsOfDate11.stock < amount) {
                  return ctx.badRequest(`Don't have enough dates`);
                } else {
                  // Helper function to format date as YYYY-MM-DDT00:00:00.000Z
                  const formatDate = (date) =>
                    date.toISOString().split("T")[0] + "T00:00:00.000Z";

                  // Create a set of existing dates from streakData
                  const existingDates = new Set(
                    streakData11.map((data) =>
                      formatDate(new Date(data.updatedAt))
                    )
                  );

                  // Generate dates for the last 7 days
                  const today = new Date();
                  const dates = [];
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    dates.push(formatDate(date));
                  }

                  // Find missing dates by filtering out existing dates
                  const missingDates = dates.filter(
                    (date) => !existingDates.has(date)
                  );
                  missingDates.map(async (item) => {
                    await strapi.entityService.create(
                      "api::learner-streak.learner-streak",
                      {
                        // @ts-ignore
                        data: {
                          present: true,
                          checked: true,
                          updatedAt: item,
                          createdAt: item,
                        },
                      }
                    );
                  });
                  try {
                    await strapi.entityService.update(
                      "api::learner-gamification-stock.learner-gamification-stock",
                      LearnerGamificationStockDetailsOfDate11.id,
                      {
                        data: {
                          gamification_type: getDateDetails.id,
                          stock:
                            LearnerGamificationStockDetailsOfDate11.stock -
                            amount,
                          users_permissions_user: user.id,
                        },
                      }
                    );
                  } catch (error) {
                    return ctx.badRequest(`Something went wrong ${error}`);
                  }
                }
              }
            }
            break;
          // case "Dates Gain Package 1":
          //   const LearnerGamificationStockDetailsOfDate16 = await strapi.db
          //     .query(
          //       "api::learner-gamification-stock.learner-gamification-stock"
          //     )
          //     .findOne({
          //       where: {
          //         gamification_type: {
          //           typeName: "Date",
          //         },
          //         users_permissions_user: user.id,
          //       },
          //     });
          //   if (!LearnerGamificationStockDetailsOfDate16) {
          //     return ctx.badRequest("Something went wrong");
          //   }
          //   try {
          //     await strapi.entityService.update(
          //       "api::learner-gamification-stock.learner-gamification-stock",
          //       LearnerGamificationStockDetailsOfDate16.id,
          //       {
          //         data: {
          //           gamification_type: getDateDetails.id,
          //           stock:
          //             LearnerGamificationStockDetailsOfDate16.stock + amount,
          //           users_permissions_user: user.id,
          //         },
          //       }
          //     );
          //   } catch (error) {
          //     return ctx.badRequest(`Something went wrong ${error}`);
          //   }
          //   break;
          // case "Dates Gain Package 2":
          //   const LearnerGamificationStockDetailsOfDate17 = await strapi.db
          //     .query(
          //       "api::learner-gamification-stock.learner-gamification-stock"
          //     )
          //     .findOne({
          //       where: {
          //         gamification_type: {
          //           id: 5,
          //         },
          //         users_permissions_user: user.id,
          //       },
          //     });
          //   if (!LearnerGamificationStockDetailsOfDate17) {
          //     return ctx.badRequest("Something went wrong");
          //   }
          //   try {
          //     await strapi.entityService.update(
          //       "api::learner-gamification-stock.learner-gamification-stock",
          //       LearnerGamificationStockDetailsOfDate17.id,
          //       {
          //         data: {
          //           gamification_type: 5,
          //           stock:
          //             LearnerGamificationStockDetailsOfDate17.stock + amount,
          //           users_permissions_user: user.id,
          //         },
          //       }
          //     );
          //   } catch (error) {
          //     return ctx.badRequest(`Something went wrong ${error}`);
          //   }
          //   break;
          // case "Dates Gain Package 3":
          //   const LearnerGamificationStockDetailsOfDate18 = await strapi.db
          //     .query(
          //       "api::learner-gamification-stock.learner-gamification-stock"
          //     )
          //     .findOne({
          //       where: {
          //         gamification_type: {
          //           typeName: "Date",
          //         },
          //         users_permissions_user: user.id,
          //       },
          //     });
          //   if (!LearnerGamificationStockDetailsOfDate18) {
          //     return ctx.badRequest("Something went wrong");
          //   }
          //   try {
          //     await strapi.entityService.update(
          //       "api::learner-gamification-stock.learner-gamification-stock",
          //       LearnerGamificationStockDetailsOfDate18.id,
          //       {
          //         data: {
          //           gamification_type: getDateDetails.id,
          //           stock:
          //             LearnerGamificationStockDetailsOfDate18.stock + amount,
          //           users_permissions_user: user.id,
          //         },
          //       }
          //     );
          //   } catch (error) {
          //     return ctx.badRequest(`Something went wrong ${error}`);
          //   }
          //   break;
        }

        const result = await strapi.entityService.create(
          "api::learner-gamification.learner-gamification",
          {
            // @ts-ignore
            data: {
              gamification_tx: gamificationTxDetails.id, // data.gamification_tx.connect[0]
              users_permissions_user: user.id,
            },
            ...ctx.query,
          }
        );

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::learner-gamification.learner-gamification"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Create Error: ${err.message}`
        );
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
            "api::learner-gamification.learner-gamification",
            {
              ...ctx.query,
            }
          );
        } else {
          results = await strapi.entityService.findMany(
            "api::learner-gamification.learner-gamification",
            query
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::learner-gamification.learner-gamification"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Learner Gamification Error: ${err.message}`);
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
            "api::learner-gamification.learner-gamification",
            id,
            {
              ...ctx.query,
            }
          );
        } else {
          const result = await strapi.entityService.findOne(
            "api::learner-gamification.learner-gamification",
            id,
            {
              populate: { users_permissions_user: true },
            }
          );

          if (user.id === result.users_permissions_user.id) {
            findOneResults = await strapi.entityService.findMany(
              "api::learner-gamification.learner-gamification",
              query
            );
          } else {
            ctx.unauthorized("You are not authorized to perform this action.");
          }
        }
        return await sanitize.contentAPI.output(
          findOneResults,
          strapi.contentType("api::learner-gamification.learner-gamification"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Exam find one Error: ${err.message}`);
      }
    },

    // async delete(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const id = ctx.params.id;
    //     const result = await strapi.entityService.findOne(
    //       "api::learner-gamification.learner-gamification",
    //       id,
    //       {
    //         populate: { users_permissions_user: true },
    //       }
    //     );
    //     if (user.id === result.users_permissions_user.id) {
    //       const deleteResult = await strapi.entityService.delete(
    //         "api::learner-gamification.learner-gamification",
    //         id
    //       );
    //       return deleteResult;
    //     } else {
    //       ctx.unauthorized("You are not authorized to perform this action.");
    //     }
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Delete Error: ${err.message}`
    //     );
    //   }
    // },

    // async update(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const id = ctx.params.id;
    //     const result = await strapi.entityService.findOne(
    //       "api::learner-gamification.learner-gamification",
    //       id,
    //       {
    //         populate: { users_permissions_user: true },
    //       }
    //     );

    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }

    //     if (user.id === result.users_permissions_user.id) {
    //       const updateResult = await strapi.entityService.update(
    //         "api::learner-gamification.learner-gamification",
    //         id,
    //         {
    //           data: {
    //             ...ctx.request.body,
    //             users_permissions_user: user.id,
    //           },
    //           ...ctx.query,
    //         }
    //       );
    //       return await sanitize.contentAPI.output(
    //         updateResult,
    //         strapi.contentType(
    //           "api::learner-gamification.learner-gamification"
    //         ),
    //         {
    //           auth: ctx.state.auth,
    //         }
    //       );
    //     } else {
    //       ctx.unauthorized("You are not authorized to perform this action.");
    //     }
    //   } catch (err) {
    //     return ctx.badRequest(
    //       `Learner Gamification Update Error: ${err.message}`
    //     );
    //   }
    // },
  })
);
