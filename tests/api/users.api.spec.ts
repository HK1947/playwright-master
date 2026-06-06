// tests/api/users.api.spec.ts

// API tests use { request } fixture — NO browser opens!
// Faster than UI tests — no page rendering needed

import { test, expect } from '@playwright/test';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface UsersListResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
}

interface SingleUserResponse {
    data: User;
}

interface CreateUserResponse {
    name: string;
    job: string;
    id: string;
    createdAt: string;
}

interface UpdateUserResponse {
    name: string;
    job: string;
    updatedAt: string;
}

interface ErrorResponse {
    error: string;
}

test.describe('API Testing — Users CRUD @api', () => {
    test('GET — list all users @smoke', async ({ request }) => {
        // Lesson 26: request.get() — send GET request
        const response = await request.get(`users?page=1`);

        // Lesson 26: status() — check HTTP status code
        expect(response.status()).toBe(200);

        // Lesson 26: ok() — true for 200-299
        expect(response.ok()).toBeTruthy();

        // Lesson 26: json() — parse response body
        const body = (await response.json()) as UsersListResponse;

        // Lesson 15: toBeGreaterThan — numeric assertion
        expect(body.data.length).toBeGreaterThan(0);

        // Lesson 9: every() — check ALL items have required fields
        const allHaveEmail = body.data.every(
            (user) => user.email && user.first_name && user.last_name,
        );
        expect(allHaveEmail).toBeTruthy();
    });

    test('GET — single user by ID @smoke', async ({ request }) => {
        const response = await request.get(`users/2`);

        expect(response.status()).toBe(200);

        const body = (await response.json()) as SingleUserResponse;
        expect(body.data.id).toBe(2);
        expect(body.data.first_name).toBeTruthy();
        expect(body.data.email).toContain('@reqres.in');
    });

    test('GET — user not found returns 404 @regression', async ({ request }) => {
        // Lesson 26: Error response handling
        const response = await request.get(`users/999`);

        expect(response.status()).toBe(404);
        expect(response.ok()).toBeFalsy();
    });

    test('POST — create new user @smoke', async ({ request }) => {
        // Lesson 26: request.post() with data object
        const response = await request.post(`users`, {
            data: {
                name: 'Harsha Kumar',
                job: 'QA Lead',
            },
        });

        expect(response.status()).toBe(201);

        const body = (await response.json()) as CreateUserResponse;
        expect(body.name).toBe('Harsha Kumar');
        expect(body.job).toBe('QA Lead');
        // Verify server generated an ID
        expect(body.id).toBeTruthy();
        // Verify server added timestamp
        expect(body.createdAt).toBeTruthy();
    });

    test('PUT — update entire user @regression', async ({ request }) => {
        // Lesson 26: request.put() — full update
        const response = await request.put(`users/2`, {
            data: {
                name: 'Harsha Updated',
                job: 'SDET Lead',
            },
        });

        expect(response.status()).toBe(200);

        const body = (await response.json()) as UpdateUserResponse;
        expect(body.name).toBe('Harsha Updated');
        expect(body.job).toBe('SDET Lead');
        expect(body.updatedAt).toBeTruthy();
    });

    test('PATCH — partial update @regression', async ({ request }) => {
        // Lesson 26: request.patch() — update only specific fields
        const response = await request.patch(`users/2`, {
            data: {
                job: 'Senior SDET',
            },
        });

        expect(response.status()).toBe(200);

        const body = (await response.json()) as UpdateUserResponse;
        expect(body.job).toBe('Senior SDET');
    });

    test('DELETE — remove user @regression', async ({ request }) => {
        // Lesson 26: request.delete()
        const response = await request.delete(`users/2`);

        // 204 = No Content (deleted successfully)
        expect(response.status()).toBe(204);
    });

    test('POST — register user with missing password returns 400 @regression', async ({
        request,
    }) => {
        // Lesson 26: Error response handling
        const response = await request.post(`register`, {
            data: {
                email: 'sydney@fife',
                // password intentionally missing!
            },
        });

        expect(response.status()).toBe(400);

        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toBeTruthy();
    });

    test('CRUD chain — create then update then delete @regression', async ({ request }) => {
        // Lesson 26: Chaining API calls

        await test.step('create user', async () => {
            const createResponse = await request.post(`users`, {
                data: { name: 'Chain Test', job: 'Tester' },
            });
            expect(createResponse.status()).toBe(201);
        });

        await test.step('update user', async () => {
            const updateResponse = await request.put(`users/2`, {
                data: { name: 'Chain Updated', job: 'Lead Tester' },
            });
            expect(updateResponse.status()).toBe(200);
            const body = (await updateResponse.json()) as UpdateUserResponse;
            expect(body.name).toBe('Chain Updated');
        });

        await test.step('delete user', async () => {
            const deleteResponse = await request.delete(`users/2`);
            expect(deleteResponse.status()).toBe(204);
        });
    });

    test('verify response time under 3 seconds @regression', async ({ request }) => {
        // Lesson 26: Response time check
        const start = Date.now();
        const response = await request.get(`users?page=1`);
        const duration = Date.now() - start;

        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000);
    });

    test('verify response headers @regression', async ({ request }) => {
        const response = await request.get(`users/2`);

        expect(response.status()).toBe(200);

        // Lesson 26: response.headers() — check response headers
        const headers = response.headers();
        expect(headers['content-type']).toContain('application/json');
    });
});
