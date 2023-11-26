'use strict';

/**
 * learning-journey service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learning-journey.learning-journey');
