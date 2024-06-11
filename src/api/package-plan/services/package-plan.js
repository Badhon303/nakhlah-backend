'use strict';

/**
 * package-plan service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::package-plan.package-plan');
