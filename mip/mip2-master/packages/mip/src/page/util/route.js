import {resolveQuery, stringifyQuery} from './query'
import {parsePath, resolvePath} from './path'

const trailingSlashRE = /\/?$/
const locationRE = /^(http(?:s?):\/\/[^/]+)(.*)/

/**
 * create route with raw url
 *
 * @param {string|Object} rawUrl rawUrl or location object
 * @param {Route} current currentRoute
 * @return {Object} route object
 */
export function normalizeLocation (rawUrl, current) {
  let next = rawUrl

  // split origin out
  if (typeof rawUrl === 'string') {
    next = {
      path: rawUrl
    }
  }

  let matched = next.path.match(locationRE)
  if (matched) {
    next.origin = matched[1]
    next.path = matched[2]
  }

  const origin = next.origin || current.origin
  const basePath = (current && current.path) || '/'
  const parsedPath = parsePath(next.path || '')

  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath)
    : basePath

  const query = resolveQuery(parsedPath.query)

  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    origin,
    path,
    query,
    hash,
    meta: next.meta || {},
    fullPath: getFullPath({origin, path, query, hash})
  }
}

/**
 * create route with location object
 *
 * @param {Object} location object
 * @return {Object} route object
 */
export function createRoute (location) {
  const route = {
    origin: location.origin || window.location.origin,
    path: location.path || location.pathname,
    query: location.query || resolveQuery(location.search),
    hash: location.hash,
    meta: location.meta || {}
  }
  let fullPath = getFullPath(route)
  route.fullPath = fullPath
  return Object.freeze(route)
}

// the starting route that represents the initial state
export const START = createRoute({path: '/'})

export function getFullPath ({href, origin = window.location.origin, path = '/', query = {}, hash = ''}) {
  return href || origin + path + stringifyQuery(query) + hash
}

export function isSameRoute (a, b, ignoreHash) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.origin !== b.origin) {
    return false
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
            (ignoreHash || (a.hash === b.hash)) &&
            isObjectEqual(a.query, b.query)
  }
  return false
}

export function isOnlyDifferentInHash (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.origin !== b.origin) {
    return false
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
            a.hash !== b.hash &&
            isObjectEqual(a.query, b.query)
  }
  return false
}

function isObjectEqual (a = {}, b = {}) {
  // handle null value #1566
  if (!a || !b) {
    return a === b
  }
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => {
    const aVal = a[key]
    const bVal = b[key]
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}
