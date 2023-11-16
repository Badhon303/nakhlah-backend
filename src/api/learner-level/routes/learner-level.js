'use strict';

/**
 * learner-level router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::learner-level.learner-level');
