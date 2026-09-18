/* eslint-disable no-console */
import { isVerboseLogging } from './env'

/**
 * Data-layer logging. Chatty during development, silent in production builds so
 * the deployed console stays clean. Warnings and errors always surface.
 */
export const log = (...args: unknown[]) => {
  if (isVerboseLogging) console.log(...args)
}

export const warn = (...args: unknown[]) => {
  console.warn(...args)
}

export const logError = (...args: unknown[]) => {
  console.error(...args)
}
