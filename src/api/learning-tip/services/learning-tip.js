'use strict';

/**
 * learning-tip service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::learning-tip.learning-tip');
