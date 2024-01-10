'use strict';

/**
 * word-matching service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::word-matching.word-matching');
