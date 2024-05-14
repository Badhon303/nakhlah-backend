'use strict';

/**
 * learner-streak service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learner-streak.learner-streak');
