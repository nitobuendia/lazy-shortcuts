chrome.runtime.onInstalled.addListener(() => {
  console.log('Custom URL Redirector (Declarative) installed.');
  loadAndApplyRules();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.urlMappings) {
    loadAndApplyRules();
  }
});

async function loadAndApplyRules() {
  console.log('applying rules');
  const data = await chrome.storage.local.get(['urlMappings']);
  const urlMappings: { [key: string]: string } = data.urlMappings || {};
  const newRules = [] as chrome.declarativeNetRequest.Rule[];
  let ruleId = 1;

  for (const shortURL in urlMappings) {
    // Assuming shortURL is a hostname or a specific path prefix
    const longURL = urlMappings[shortURL];
    newRules.push(
      {
        "id": ruleId++,
        "priority": 1,
        "action": {
          "type": "redirect" as chrome.declarativeNetRequest.RuleActionType,
          "redirect": {"url": longURL}
        },
        "condition": {
          "urlFilter": `${shortURL}|`,
          "resourceTypes": [
            "main_frame" as chrome.declarativeNetRequest.ResourceType
          ]
        }
      });
  }

  console.log({newRules});
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: (await chrome.declarativeNetRequest.getDynamicRules()).map(rule => rule.id),
    addRules: newRules
  });
}
