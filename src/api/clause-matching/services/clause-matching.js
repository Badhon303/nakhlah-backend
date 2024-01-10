'use strict';

/**
 * clause-matching service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::clause-matching.clause-matching');
