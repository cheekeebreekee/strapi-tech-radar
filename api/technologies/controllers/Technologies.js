'use strict';
const fetch = require("node-fetch");
const googleTrends = require('google-trends-api');
const GITHUB_TOKEN = '576fe97a164a55ed3caf93e5acc234b7cdbc9852';
const GITHUB_API_URL = 'https://api.github.com'

const getInfoFromGoogleTrends = async ({ 
    keyword, 
    technology, 
    startTime, 
    endTime 
  }) => await googleTrends.interestByRegion({
    keyword: keyword,
    technology: technology,
    startTime: startTime, 
    endTime: endTime
});

/**
 * Technologies.js controller
 *
 * @description: A set of functions called "actions" for managing `Technologies`.
 */

module.exports = {

  /**
   * Retrieve technologies records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.technologies.search(ctx.query)
    } else {
      return strapi.services.technologies.fetchAll(ctx.query)
    }
  },

  /**
   * Retrieve a technologies record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    let strapiDbRecord = await strapi.services.technologies.fetch(ctx.params);
    let splittedGoogleKeyword = strapiDbRecord.githubApiRoute.split('/')[strapiDbRecord.githubApiRoute.split('/').length - 1]
    let googleTrendsResponse = await getInfoFromGoogleTrends({
      keyword: splittedGoogleKeyword,
      technology: 77,
      startTime: new Date('2018-10-15'), 
      endTime: new Date('2018-10-23'),
      granularTimeResolution: false
    });
    let githubResponse = await fetch(`${GITHUB_API_URL}/repos/${strapiDbRecord.githubApiRoute}?${GITHUB_TOKEN}`);
    githubResponse = await githubResponse.json();
    
    return Object.assign({}, strapiDbRecord, githubResponse, JSON.parse(googleTrendsResponse));
  },

  /**
   * Count technologies records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.technologies.count(ctx.query);
  },

  /**
   * Create a/an technologies record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.technologies.add(ctx.request.body);
  },

  /**
   * Update a/an technologies record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.technologies.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an technologies record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.technologies.remove(ctx.params);
  }
};
