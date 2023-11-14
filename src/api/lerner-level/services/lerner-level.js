'use strict';

/**
 * lerner-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lerner-level.lerner-level');
