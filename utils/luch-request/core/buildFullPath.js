'use strict'

import isAbsoluteURL from '../helpers/isAbsoluteURL'
import combineURLs from '../helpers/combineURLs'

/**
 * Creates a new URL by combining the baseUrl with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseUrl The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
export default function buildFullPath(baseUrl, requestedURL) {
  if (baseUrl && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseUrl, requestedURL)
  }
  return requestedURL
}
