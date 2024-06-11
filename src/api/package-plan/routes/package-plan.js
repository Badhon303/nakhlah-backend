'use strict';

/**
 * package-plan router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::package-plan.package-plan');
