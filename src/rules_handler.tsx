/** @file Handles loading and storing rules in memory and in Chrome. */

/** URL Mapping between short and long URL. */
export type UrlMapping = {
  ruleId: number;
  shortUrl: string;
  longUrl: string;
};

/**
 * Gets existing URL Mapping Rules.
 *
 * @return Google Chrome URL rule mappings.
 */
export const getRules = async (): Promise<UrlMapping[]> => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  return rules.map((rule) => parseRule(rule));
};

/**
 * Parses a rule in browser format to a readable format.
 *
 * @param rule Rule to parse.
 * @return Rule in an easy-to-use format.
 */
const parseRule = (rule: chrome.declarativeNetRequest.Rule): UrlMapping => {
  const ruleId = rule.id;
  const shortUrl = rule.condition?.urlFilter?.slice(0, -1) || '';
  const longUrl = rule.action?.redirect?.url || '';

  return {
    ruleId,
    shortUrl,
    longUrl,
  }
};

/**
 * Creates the URL mapping rule from a short and long URL.
 *
 * @param shortUrl URL that will redirect.
 * @param longUrl URL to which it will redirect.
 * @param ruleId ID to use for the browser extension rule mapping.
 *
 * @return Google Chrome URL rule mapping for one short and long url.
 */
const createRule = (
  shortUrl: string,
  longUrl: string,
  ruleId: number
): chrome.declarativeNetRequest.Rule => {
  // TODO: throw error if rule already exists.
  return {
    'id': ruleId,
    'priority': 1,
    'action': {
      'type': 'redirect' as chrome.declarativeNetRequest.RuleActionType,
      'redirect': {'url': longUrl},
    },
    'condition': {
      // TODO: improve URL matching (e.g. http vs https, final slash).
      'urlFilter': `${shortUrl}|`,
      'resourceTypes': [
        'main_frame' as chrome.declarativeNetRequest.ResourceType,
      ],
    },
  };
};

/**
 * Adds a new URL Mapping rule.
 *
 * @param shortUrl URL that will redirect.
 * @param longUrl URL to which it will redirect.
 */
export const addNewRule = async (
  shortUrl: string,
  longUrl: string
): Promise<void> => {
  const rules = await getRules();
  const ruleIds = rules.map((rule) => rule.ruleId);
  const nextRuleId = Math.max(...ruleIds.concat([0])) + 1;
  const rule = createRule(shortUrl, longUrl, nextRuleId);
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [rule],
  });
};

/**
 * Edits an existing URL Mapping rule.
 *
 * @param shortUrl URL that will redirect.
 * @param longUrl URL to which it will redirect.
 * @param ruleId ID of the rule to edit.
 */
export const editRule = async (
  shortUrl: string,
  longUrl: string,
  ruleId: number
) => {
  const rule = createRule(shortUrl, longUrl, ruleId);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ruleId],
    addRules: [rule],
  });
};

/**
 * Removes an existing URL Mapping rule.
 *
 * @param ruleId ID of the rule to remove.
 */
export const removeRule = async (ruleId: number) => {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ruleId],
  });
}
