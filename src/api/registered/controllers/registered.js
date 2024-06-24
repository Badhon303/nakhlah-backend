"use strict";

/**
 * registered controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { parseMultipartData, sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::registered.registered",
  ({ strapi }) => ({
    // async create(ctx) {
    //   const user = ctx.state.user;
    //   // @ts-ignore
    //   const { data } = ctx.request.body;
    //   const parsedData = await JSON.parse(data);
    //   try {
    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }
    //     const registeredData = await strapi.db
    //       .query("api::registered.registered")
    //       .findOne({
    //         where: { users_permissions_user: user.id },
    //       });
    //     if (registeredData) {
    //       return ctx.badRequest("User Info already exists");
    //     }
    //     const profileData = await strapi.db
    //       .query("api::learner-info.learner-info")
    //       .findOne({
    //         where: { users_permissions_user: user.id },
    //       });
    //     if (!profileData) {
    //       return ctx.badRequest("Create Your Profile First");
    //     }
    //     const result = await strapi.entityService.create(
    //       "api::registered.registered",
    //       {
    //         // @ts-ignore
    //         data: {
    //           ...parsedData,
    //           users_permissions_user: user.id,
    //         },
    //         ...ctx.query,
    //       }
    //     );
    //     try {
    //       await strapi.entityService.update(
    //         "api::learner-info.learner-info",
    //         profileData.id,
    //         {
    //           data: {
    //             registered: result.id,
    //           },
    //           ...ctx.query,
    //         }
    //       );
    //     } catch (error) {
    //       return ctx.badRequest(`Something went wrong`);
    //     }

    //     return await sanitize.contentAPI.output(
    //       result,
    //       strapi.contentType("api::registered.registered"),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(`Registration create Error: ${err.message}`);
    //   }
    // },

    async create(ctx) {
      const user = ctx.state.user;
      let parsedData = {};
      let files = {};

      // Check if the request is multipart
      if (ctx.is("multipart")) {
        // Parse the multipart data
        const multipartData = parseMultipartData(ctx);
        parsedData = multipartData.data;
        files = multipartData.files;
      } else {
        // @ts-ignore
        parsedData = await JSON.parse(ctx.request.body.data);
      }

      try {
        if (typeof parsedData !== "object" || parsedData === null) {
          return ctx.badRequest("Invalid request body");
        }

        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });

        if (registeredData) {
          return ctx.badRequest("User Info already exists");
        }

        const profileData = await strapi.db
          .query("api::learner-info.learner-info")
          .findOne({
            where: { users_permissions_user: user.id },
          });

        if (!profileData) {
          return ctx.badRequest("Create Your Profile First");
        }

        const createParams = {
          data: {
            ...parsedData,
            users_permissions_user: user.id,
          },
          ...ctx.query,
        };

        if (Object.keys(files).length > 0) {
          // @ts-ignore
          createParams.files = files;
        }

        const result = await strapi.entityService.create(
          "api::registered.registered",
          createParams
        );

        try {
          await strapi.entityService.update(
            "api::learner-info.learner-info",
            profileData.id,
            {
              data: {
                registered: result.id,
              },
              ...ctx.query,
            }
          );
        } catch (error) {
          return ctx.badRequest(`Something went wrong`);
        }

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Registration create Error: ${err.message}`);
      }
    },

    async find(ctx) {
      let results;
      const user = ctx.state.user;
      try {
        if (ctx.state.user.role.name === "Admin") {
          results = await strapi.entityService.findMany(
            "api::registered.registered",
            {
              ...ctx.query,
            }
          );
        } else {
          const registeredData = await strapi.db
            .query("api::registered.registered")
            .findOne({
              where: { users_permissions_user: user.id },
            });
          if (!registeredData) {
            return ctx.badRequest("Data not found");
          }
          results = await strapi.entityService.findOne(
            "api::registered.registered",
            registeredData.id,
            {
              ...ctx.query,
            }
          );
        }
        return await sanitize.contentAPI.output(
          results,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Learner info Error: ${err.message}`);
      }
    },

    async delete(ctx) {
      const user = ctx.state.user;
      try {
        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!registeredData) {
          return ctx.badRequest("Data not found");
        }
        const result = await strapi.entityService.delete(
          "api::registered.registered",
          registeredData.id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },

    // async update(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const registeredData = await strapi.db
    //       .query("api::registered.registered")
    //       .findOne({
    //         where: { users_permissions_user: user.id },
    //       });
    //     if (!registeredData) {
    //       return ctx.badRequest("Data not found");
    //     }

    //     if (typeof ctx.request.body !== "object" || ctx.request.body === null) {
    //       return ctx.badRequest("Invalid request body");
    //     }

    //     const result = await strapi.entityService.update(
    //       "api::registered.registered",
    //       registeredData.id,
    //       {
    //         data: {
    //           ...ctx.request.body,
    //           users_permissions_user: user.id,
    //         },
    //         ...ctx.query,
    //       }
    //     );
    //     return await sanitize.contentAPI.output(
    //       result,
    //       strapi.contentType("api::registered.registered"),
    //       {
    //         auth: ctx.state.auth,
    //       }
    //     );
    //   } catch (err) {
    //     return ctx.badRequest(`User Profile Update Error: ${err.message}`);
    //   }
    // },
    async update(ctx) {
      try {
        const user = ctx.state.user;
        const registeredData = await strapi.db
          .query("api::registered.registered")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (!registeredData) {
          return ctx.badRequest("Data not found");
        }

        let parsedData = {};
        let files = {};

        // Check if the request is multipart
        if (ctx.is("multipart")) {
          // Parse the multipart data
          const multipartData = parseMultipartData(ctx);
          parsedData = multipartData.data;
          files = multipartData.files;
        } else {
          // @ts-ignore
          parsedData = await JSON.parse(ctx.request.body.data);
        }

        if (typeof parsedData !== "object" || parsedData === null) {
          return ctx.badRequest("Invalid request body");
        }

        const updateParams = {
          data: {
            ...parsedData,
            users_permissions_user: user.id,
          },
          ...ctx.query,
        };

        if (Object.keys(files).length > 0) {
          // @ts-ignore
          updateParams.files = files;
        }

        const result = await strapi.entityService.update(
          "api::registered.registered",
          registeredData.id,
          updateParams
        );

        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::registered.registered"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`User Profile Update Error: ${err.message}`);
      }
    },
  })
);
