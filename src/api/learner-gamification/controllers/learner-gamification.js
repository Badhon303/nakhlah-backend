"use strict";

/**
 * learner-gamification controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::learner-gamification.learner-gamification",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      // @ts-ignore
      const { data } = ctx.request.body;
      try {
        if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
          return ctx.badRequest("Invalid request body");
        }

        if (
          data.gamification_tx.connect.length !== 0 &&
          data.gamification_tx.connect.length < 2
        ) {
          const gamificationTxAmountDetails =
            await strapi.entityService.findOne(
              "api::gamification-tx-amount.gamification-tx-amount",
              data.gamification_tx.connect[0], // need to replace with data.gamification_tx_amount.connect[0], in future update
              {
                populate: {
                  gamification_tx: {
                    populate: ["gamification_tx_type", "gamification_type"],
                  },
                },
              }
            );
          if (!gamificationTxAmountDetails) {
            return ctx.badRequest("Invalid request body");
          }
          const amount = gamificationTxAmountDetails?.amount;
          const gamificationTransactionId =
            gamificationTxAmountDetails?.gamification_tx?.id; // Palm Gain Per Hour(1), Palm Loss By Wrong Answer(2), Palm Refill By Dates Loss(5)
          // const gamificationTypeId =
          //   gamificationTxAmountDetails?.gamification_tx?.gamification_type?.id; // Palm(1), Date(5), Injaz(6)
          // const gamificationTxTypeId =
          //   gamificationTxAmountDetails?.gamification_tx?.gamification_tx_type
          //     ?.id; // Add(1), Deduct(2)
          console.log("gamificationTransactionId: ", gamificationTransactionId);
          switch (gamificationTransactionId) {
            case 1: // Palm Gain Per Hour
              const LearnerGamificationStockDetailsOfPalm1 = await strapi.db
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
              if (!LearnerGamificationStockDetailsOfPalm1) {
                return ctx.badRequest("Something went wrong");
              }
              let currentTime = new Date();
              let getUpdatedTime = new Date(
                LearnerGamificationStockDetailsOfPalm1?.updatedAt
              );
              let hourDifference = Math.round(
                // @ts-ignore
                (currentTime - getUpdatedTime) / (1000 * 60 * 60)
              );
              console.log("hourDifference: ", hourDifference);
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfPalm1.id,
                  {
                    data: {
                      gamification_type: 1,
                      stock:
                        LearnerGamificationStockDetailsOfPalm1.stock +
                          hourDifference >
                        5
                          ? 5
                          : LearnerGamificationStockDetailsOfPalm1.stock +
                            hourDifference,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
              break;
            case 2: // Palm Loss By Wrong Answer
              const LearnerGamificationStockDetailsOfPalm2 = await strapi.db
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
              if (!LearnerGamificationStockDetailsOfPalm2) {
                return ctx.badRequest("Something went wrong");
              }
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfPalm2.id,
                  {
                    data: {
                      gamification_type: 1,
                      stock:
                        LearnerGamificationStockDetailsOfPalm2.stock - amount <
                        0
                          ? 0
                          : LearnerGamificationStockDetailsOfPalm2.stock -
                            amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
              break;
            case 5: // Palm Refill By Dates Loss
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
                return ctx.badRequest(
                  `Don't have enough dates to purchase palm`
                );
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
                        gamification_type: 1,
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
                        gamification_type: 5,
                        stock: dateItem.stock - amount,
                        users_permissions_user: user.id,
                      },
                    }
                  );
                } catch (error) {
                  return ctx.badRequest("Something went wrong");
                }
              }
            case 6: // Palm Gain By Advertisement
              const LearnerGamificationStockDetailsOfPalm6 = await strapi.db
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
              if (!LearnerGamificationStockDetailsOfPalm6) {
                return ctx.badRequest("Something went wrong");
              }
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfPalm6.id,
                  {
                    data: {
                      gamification_type: 1,
                      stock:
                        LearnerGamificationStockDetailsOfPalm6.stock + amount >
                        5
                          ? 5
                          : LearnerGamificationStockDetailsOfPalm6.stock +
                            amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
              break;
            case 7: // Dates Gain By Exam
              const LearnerGamificationStockDetailsOfDate7 = await strapi.db
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
              if (!LearnerGamificationStockDetailsOfDate7) {
                return ctx.badRequest("Something went wrong");
              }
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfDate7.id,
                  {
                    data: {
                      gamification_type: 5,
                      stock:
                        LearnerGamificationStockDetailsOfDate7.stock + amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
              break;
            case 8: // Dates Gain By Exam With Full Marks
              const LearnerGamificationStockDetailsOfDate8 = await strapi.db
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
              if (!LearnerGamificationStockDetailsOfDate8) {
                return ctx.badRequest("Something went wrong");
              }
              try {
                await strapi.entityService.update(
                  "api::learner-gamification-stock.learner-gamification-stock",
                  LearnerGamificationStockDetailsOfDate8.id,
                  {
                    data: {
                      gamification_type: 5,
                      stock:
                        LearnerGamificationStockDetailsOfDate8.stock + amount,
                      users_permissions_user: user.id,
                    },
                  }
                );
              } catch (error) {
                return ctx.badRequest(`Something went wrong ${error}`);
              }
              break;
              // try {
              //   await strapi.entityService.update(
              //     "api::learner-gamification-stock.learner-gamification-stock",
              //     LearnerGamificationStockDetailsOfPalm2.id,
              //     {
              //       data: {
              //         gamification_type: 1,
              //         stock:
              //           LearnerGamificationStockDetailsOfPalm2.stock - 1 < 0
              //             ? 0
              //             : LearnerGamificationStockDetailsOfPalm2.stock - 1,
              //         users_permissions_user: user.id,
              //       },
              //     }
              //   );
              // } catch (error) {
              //   return ctx.badRequest(`Something went wrong ${error}`);
              // }
              break;
            // default:
            //   text = "No value found";
          }
        } else {
          return ctx.badRequest("Invalid request body");
        }

        // const getGamificationStockDetails = await strapi.entityService.findOne(
        //   "api::learner-gamification-stock.learner-gamification-stock",
        //   LearnerGamificationStockDetails[0].id,
        //   {
        //     populate: { users_permissions_user: true },
        //   }
        // );

        // if (user.id === getGamificationStockDetails.users_permissions_user.id) {
        //   await strapi.entityService.update(
        //     "api::learner-gamification-stock.learner-gamification-stock",
        //     LearnerGamificationStockDetails[0].id,
        //     gamificationTxDetails.gamification_tx_type.typeName === "Add"
        //       ? {
        //           data: {
        //             ...ctx.request.body,
        //             stock:
        //               LearnerGamificationStockDetails[0].stock +
        //               gamificationTxDetails.amount,
        //             users_permissions_user: user.id,
        //           },
        //           ...ctx.query,
        //         }
        //       : {
        //           data: {
        //             ...ctx.request.body,
        //             stock:
        //               LearnerGamificationStockDetails[0].stock -
        //               gamificationTxDetails.amount,
        //             users_permissions_user: user.id,
        //           },
        //           ...ctx.query,
        //         }
        //   );
        // } else {
        //   ctx.unauthorized("You are not authorized to perform this action.");
        // }

        // const result = await strapi.entityService.create(
        //   "api::learner-gamification.learner-gamification",
        //   {
        //     // @ts-ignore
        //     data: {
        //       ...ctx.request.body,
        //       users_permissions_user: user.id,
        //     },
        //     ...ctx.query,
        //   }
        // );

        // return await sanitize.contentAPI.output(
        //   result,
        //   strapi.contentType("api::learner-gamification.learner-gamification"),
        //   {
        //     auth: ctx.state.auth,
        //   }
        // );
      } catch (err) {
        return ctx.badRequest(
          `Learner Gamification Create Error: ${err.message}`
        );
      }
    },

    async find(ctx) {
      const user = ctx.state.user;
      let results;
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
