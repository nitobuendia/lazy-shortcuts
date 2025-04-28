/** @file Options app. Handles the UI for the extenion. */

import React, { useState, useEffect, useCallback } from 'react';
import { URLMapping } from '@app/types';
import '@app/options/options.css';

interface Redirect {
  shortURL: string;
  longURL: string;
}

async function saveRules() {
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

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: (await chrome.declarativeNetRequest.getDynamicRules()).map(rule => rule.id),
    addRules: newRules
  });
}

const OptionsApp: React.FC = () => {
  const [newShortURL, setNewShortURL] = useState('');
  const [newLongURL, setNewLongURL] = useState('');
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editShortURL, setEditShortURL] = useState('');
  const [editLongURL, setEditLongURL] = useState('');

  const loadRedirects = useCallback(() => {
    chrome.storage.local.get(['urlMappings'], (data) => {
      const mappings = data.urlMappings || {};
      const redirectsArray = Object.entries(mappings).map(
        ([shortURL, longURL]) => ({
          shortURL: shortURL,
          longURL: longURL as string,
        }));
      setRedirects(redirectsArray);
    });
  }, []);

  useEffect(() => {
    loadRedirects();
  }, [loadRedirects]);

  const handleAddRedirect = (event: React.FormEvent) => {
    event.preventDefault();
    if (newShortURL && newLongURL) {
      const newMapping: URLMapping = { ...Object.fromEntries(redirects.map(r => [r.shortURL, r.longURL])), [newShortURL]: newLongURL };
      chrome.storage.local.set({ urlMappings: newMapping }, () => {
        setNewShortURL('');
        setNewLongURL('');
        loadRedirects();
        saveRules();
      });
    }
  };

  const handleEdit = (redirect: Redirect) => {
    setEditingId(redirect.shortURL);
    setEditShortURL(redirect.shortURL);
    setEditLongURL(redirect.longURL);
    saveRules();
  };

  const handleSaveEdit = (originalShortURL: string) => {
    if (editShortURL && editLongURL) {
      const updatedMappings: URLMapping = { ...Object.fromEntries(redirects.map(r => [r.shortURL, r.longURL])) };
      delete updatedMappings[originalShortURL];
      updatedMappings[editShortURL] = editLongURL;
      chrome.storage.local.set({ urlMappings: updatedMappings }, () => {
        setEditingId(null);
        loadRedirects();
        saveRules();
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (shortURLToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete the redirect for ${shortURLToDelete}?`)) {
      const updatedMappings: URLMapping = { ...Object.fromEntries(redirects.map(r => [r.shortURL, r.longURL])) };
      delete updatedMappings[shortURLToDelete];
      chrome.storage.local.set({ urlMappings: updatedMappings }, () => {
        loadRedirects();
      });
    }
  };

  return (
    <div>
      <h1>URL Redirector Options</h1>

      <h2>Add New Redirect</h2>
      <form onSubmit={handleAddRedirect}>
        <div>
          <label htmlFor="short-url">Short URL:</label>
          <input
            type="url"
            id="short-url"
            value={newShortURL}
            onChange={(e) => setNewShortURL(e.target.value)}
            required
            placeholder="http://m"
          />
        </div>
        <div>
          <label htmlFor="long-url">Long URL:</label>
          <input
            type="url"
            id="long-url"
            value={newLongURL}
            onChange={(e) => setNewLongURL(e.target.value)}
            required
            placeholder="https://mail.google.com"
          />
        </div>
        <button type="submit">Add Redirect</button>
      </form>

      <h2>Existing Redirects</h2>
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Long URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {redirects.map((redirect) => (
            <tr key={redirect.shortURL}>
              {editingId === redirect.shortURL ? (
                <>
                  <td>
                    <input
                      type="url"
                      value={editShortURL}
                      onChange={(e) => setEditShortURL(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="url"
                      value={editLongURL}
                      onChange={(e) => setEditLongURL(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSaveEdit(redirect.shortURL)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{redirect.shortURL}</td>
                  <td>{redirect.longURL}</td>
                  <td>
                    <button onClick={() => handleEdit(redirect)}>Edit</button>
                    <button onClick={() => handleDelete(redirect.shortURL)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OptionsApp;
