'use strict';

/**
 * learning-goal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learning-goal.learning-goal');
