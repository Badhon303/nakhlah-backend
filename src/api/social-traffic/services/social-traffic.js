'use strict';

/**
 * social-traffic service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::social-traffic.social-traffic');
