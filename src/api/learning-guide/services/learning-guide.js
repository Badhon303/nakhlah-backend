'use strict';

/**
 * learning-guide service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learning-guide.learning-guide');
