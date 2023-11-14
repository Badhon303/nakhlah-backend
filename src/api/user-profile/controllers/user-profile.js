"use strict";

/**
 * user-profile controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const user = ctx.state.user;
        const profileData = await strapi.db
          .query("api::user-profile.user-profile")
          .findOne({
            where: { users_permissions_user: user.id },
          });
        if (profileData) {
          return ctx.badRequest("User profile already exists");
        }
        const result = await strapi.entityService.create(
          "api::user-profile.user-profile",
          {
            data: {
              // @ts-ignore
              ...ctx.request.body,
              users_permissions_user: user.id,
            },
          }
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Create Error: ${err.message}`);
      }
    },
    async update(ctx) {
      try {
        const user = ctx.state.user;

        const profileData = await strapi.db
          .query("api::user-profile.user-profile")
          .findOne({
            where: { users_permissions_user: user.id },
          });

        const result = await strapi.entityService.update(
          "api::user-profile.user-profile",
          profileData.id,
          {
            data: {
              // @ts-ignore
              ...ctx.request.body,
            },
          }
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Update Error: ${err.message}`);
      }
    },
    async delete(ctx) {
      try {
        const user = ctx.state.user;

        const profileData = await strapi.db
          .query("api::user-profile.user-profile")
          .findOne({
            where: { users_permissions_user: user.id },
          });

        const result = await strapi.entityService.delete(
          "api::user-profile.user-profile",
          profileData.id
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Delete Error: ${err.message}`);
      }
    },
    // async findOne(ctx) {
    //   try {
    //     const user = ctx.state.user;
    //     const { id } = ctx.params;

    //     const experienceData = await strapi.entityService.findMany(
    //       "api::address.address",
    //       {
    //         filters: {
    //           owner: {
    //             id: user.id,
    //           },
    //           id: id,
    //         },
    //       }
    //     );

    //     if (experienceData.length === 0) {
    //       return {
    //         data: null,
    //         error: {
    //           message: "",
    //         },
    //       };
    //     }

    //     const result = await strapi.entityService.findOne(
    //       "api::address.address",
    //       id
    //     );
    //     return result;
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // },
    async find(ctx) {
      try {
        const user = ctx.state.user;
        const result = await strapi.entityService.findMany(
          "api::user-profile.user-profile",
          {
            filters: {
              users_permissions_user: user.id,
            },
          }
        );
        return result;
      } catch (err) {
        return ctx.badRequest(`User Profile Find Error: ${err.message}`);
      }
    },
  })
);
