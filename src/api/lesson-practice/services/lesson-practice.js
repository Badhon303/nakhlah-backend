'use strict';

/**
 * lesson-practice service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lesson-practice.lesson-practice');
