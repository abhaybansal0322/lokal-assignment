// Client setup placeholder
/**
 * client.ts
 *
 * Responsibility:
 * - Define the base API URL
 * - Provide a reusable GET request helper
 * - Handle query parameters
 * - Handle network errors and invalid responses
 *
 * This file MUST NOT:
 * - Contain UI logic
 * - Access Zustand store
 * - Know anything about screens or components
 *
 * All other API files must use this client.
 */

export const API_BASE_URL = 'https://saavn.sumit.co';

/**
 * Generic GET helper
 * @param endpoint - The API endpoint (e.g., '/api/search/songs')
 * @param params - Query parameters to be appended to the URL
 * @returns Raw parsed JSON response
 */
export async function apiGet<T = any>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
): Promise<T> {
    // 1. Construct URL with query parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, String(params[key]));
        }
    });

    try {
        // 2. Perform Network Request
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 3. Handle HTTP Errors
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        // 4. Parse JSON
        const data = await response.json();
        return data;

    } catch (error) {
        // 5. Unified Error Handling
        console.error(`[API] GET ${endpoint} failed:`, error);
        throw error;
    }
}
