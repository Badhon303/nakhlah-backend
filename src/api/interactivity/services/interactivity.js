'use strict';

/**
 * interactivity service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::interactivity.interactivity');
