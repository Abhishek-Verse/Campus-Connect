import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../backend/src/app.js';

describe('Express HTTP API & Static Server', () => {
  let server;
  let baseUrl;

  before(async () => {
    return new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('GET /api/v1/health should return ok with status 200', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.status, 'ok');
    assert.ok(json.data.timestamp);
  });

  it('GET / should serve the frontend landing page HTML', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('CampusHub'));
    assert.ok(html.includes('College Event Management Platform'));
  });

  it('GET /pages/auth/login.html should serve the login page', async () => {
    const res = await fetch(`${baseUrl}/pages/auth/login.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Sign in to your account'));
  });

  it('GET /pages/student/my-qr.html should serve the student QR page', async () => {
    const res = await fetch(`${baseUrl}/pages/student/my-qr.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('My QR'));
    assert.ok(html.includes('Show this QR at registered events'));
  });

  it('GET /pages/club/scanner.html should serve the scanner page', async () => {
    const res = await fetch(`${baseUrl}/pages/club/scanner.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Attendance Scanner'));
    assert.ok(html.includes('Ready to scan'));
  });

  it('POST /api/v1/events/:id/attendance/scan without auth token should return 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/v1/events/dummy-event-id/attendance/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken: 'CH-ABC12345' })
    });
    assert.equal(res.status, 401);
    const json = await res.json();
    assert.equal(json.success, false);
  });

  it('POST /api/v1/events/:id/register without auth token should return 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/v1/events/dummy-event-id/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    assert.equal(res.status, 401);
  });

  it('GET /css/global.css should serve the design system stylesheet', async () => {
    const res = await fetch(`${baseUrl}/css/global.css`);
    assert.equal(res.status, 200);
    const css = await res.text();
    assert.ok(css.includes('--color-primary: #2563eb;'));
    assert.ok(css.includes('--color-background: #ffffff;'));
  });
});
