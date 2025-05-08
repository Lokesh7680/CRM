// src/utils/tracking.js

/**
 * Returns an open tracking pixel URL to embed in emails.
 * @param {string} campaignId
 * @param {string} userId
 */
export const getOpenTrackingPixel = (campaignId, userId) => {
    return `<img src="https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/track/open/${campaignId}/${userId}" width="1" height="1" style="display:none" alt="" />`;
  };
  
  /**
   * Returns a click-tracked link for a URL in email.
   * @param {string} url - Actual destination
   * @param {string} campaignId
   * @param {string} userId
   * @param {string} linkId
   */
  export const getTrackedLink = (url, campaignId, userId, linkId) => {
    return `https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/track/click/${campaignId}/${userId}/${linkId}?redirect=${encodeURIComponent(url)}`;
  };
  