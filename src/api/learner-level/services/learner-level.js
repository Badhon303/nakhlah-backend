'use strict';

/**
 * learner-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learner-level.learner-level');
