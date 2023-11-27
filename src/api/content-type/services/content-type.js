'use strict';

/**
 * content-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::content-type.content-type');
