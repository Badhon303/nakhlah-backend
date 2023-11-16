'use strict';

/**
 * learner-starting-point service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learner-starting-point.learner-starting-point');
