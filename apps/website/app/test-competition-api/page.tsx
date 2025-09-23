'use client';

import { useState } from 'react';

export default function TestCompetitionApi() {
  const [status, setStatus] = useState('');
  const [token, setToken] = useState('');

  const testCreateCompetition = async () => {
    try {
      setStatus('Testing competition creation...');

      // First, let's manually set a test token (you can get this from your auth)
      const authToken = token || localStorage.getItem('directus_auth_token');
      if (!authToken) {
        setStatus('No auth token found. Please enter a token or login first.');
        return;
      }

      // Create a test competition with only metadata
      const response = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: `Test Competition ${new Date().toISOString()}`,
          participantCount: 150, // Only sending count, not actual participants
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setStatus(`Failed: ${JSON.stringify(error)}`);
        return;
      }

      const result = await response.json();
      setStatus(`Success! Created competition: ${JSON.stringify(result, null, 2)}`);

      // Now test fetching competitions
      const fetchResponse = await fetch('/api/competitions', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (fetchResponse.ok) {
        const { competitions } = await fetchResponse.json();
        setStatus(
          (prev) =>
            prev +
            `\n\nFetched ${competitions.length} competitions:\n${JSON.stringify(competitions, null, 2)}`
        );
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Competition API</h1>

      <div className="mb-4">
        <label className="block mb-2">
          Auth Token (optional, will use stored token if available):
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter Directus auth token"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={testCreateCompetition}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Create Competition (Metadata Only)
      </button>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Status:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{status}</pre>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>This test creates a competition with only metadata (name and participant count).</p>
        <p>No actual participant data is sent to Directus, keeping the database lightweight.</p>
        <p>The participant data would be stored locally in the extension.</p>
      </div>
    </div>
  );
}
