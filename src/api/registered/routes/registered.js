'use strict';

/**
 * registered router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::registered.registered');
