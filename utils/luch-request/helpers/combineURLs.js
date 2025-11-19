'use strict'

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseUrl The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export default function combineURLs(baseUrl, relativeURL) {
  return relativeURL
    ? baseUrl.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseUrl
}
