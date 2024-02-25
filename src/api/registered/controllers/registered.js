'use strict';

/**
 * registered controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::registered.registered');
