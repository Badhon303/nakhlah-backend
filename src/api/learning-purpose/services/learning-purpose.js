'use strict';

/**
 * learning-purpose service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learning-purpose.learning-purpose');
