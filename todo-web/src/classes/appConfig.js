/**
 * @typedef {import('./session.js')} Session
 */

export default class AppConfig {
  /**@private {number} */
  session;

  constructor() {}

  /**
   * @returns {Session}
   */
  get session() {
    return this.session;
  }

  /**
   * @param {Session} val
   */
  set session(val) {
    if (this.session !== undefined) {
      throw new Error("Session already exists");
    }
    this.session = val;
  }
}
