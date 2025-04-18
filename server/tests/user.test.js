const request = require('supertest');
const app = require('../app');

describe('User APIs', () => {
    let testUser = {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass123'
    };

    let csrfToken;
    let cookie;

    beforeAll(async () => {
        const res = await request(app)
            .get('/api/csrf-token');

        csrfToken = res.body.csrfToken;
        cookie = res.headers['set-cookie'];
    });

    it("Hello", async () => {
        const res = await request(app)
            .get('/hello')
        expect(res.statusCode).toBe(200);
    })


    it("Get CSRF TOKEN:", async () => {
        const res = await request(app)
            .get('/hello')
        expect(res.statusCode).toBe(200);
    })

    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .set('Cookie', cookie)
            .set('X-CSRF-Token', csrfToken)
            .send(testUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user with an existing username', async () => {
        await request(app)
            .post('/api/users/register')
            .set('Cookie', cookie)
            .set('X-CSRF-Token', csrfToken)
            .send({
                name: 'Test User',
                username: 'testuser2',
                password: 'testpass123'
            });

        const res = await request(app)
            .post('/api/users/register')
            .set('Cookie', cookie)
            .set('X-CSRF-Token', csrfToken)
            .send({
                name: 'Another User',
                username: 'testuser2',
                password: 'differentpass'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Registration failed');
    });


    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .set('Cookie', cookie)
            .set('X-CSRF-Token', csrfToken)
            .send({
                username: testUser.username,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .set('Cookie', cookie)
            .set('X-CSRF-Token', csrfToken)
            .send({
                username: testUser.username,
                password: 'wrongpass'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Login failed');
    });


});
