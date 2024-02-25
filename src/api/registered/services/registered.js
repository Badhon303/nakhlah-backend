'use strict';

/**
 * registered service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::registered.registered');
