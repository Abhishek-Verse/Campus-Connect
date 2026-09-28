import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema, loginSchema } from '../backend/src/validators/auth.validators.js';
import { createEventSchema, updateEventSchema } from '../backend/src/validators/event.validators.js';
import { scanSchema } from '../backend/src/validators/attendance.validators.js';
import { createNoticeSchema } from '../backend/src/validators/notice.validators.js';
import { generateQrToken } from '../backend/src/services/qr.service.js';
import { generateToken, verifyToken } from '../backend/src/utils/jwt.js';

describe('QR Token Service', () => {
  it('should generate an opaque token with prefix CH- and 8 uppercase hex characters', () => {
    const token = generateQrToken();
    assert.match(token, /^CH-[0-9A-F]{8}$/, 'Token must match CH-XXXXXXXX format');
  });

  it('should generate unique tokens across invocations', () => {
    const tokens = new Set();
    for (let i = 0; i < 50; i++) {
      tokens.add(generateQrToken());
    }
    assert.equal(tokens.size, 50, 'All generated tokens must be unique');
  });
});

describe('Auth Validators', () => {
  it('should accept valid registration data and normalize role to uppercase', () => {
    const input = {
      name: 'Aarav Patel',
      email: 'aarav@college.edu',
      password: 'password123',
      rollNo: 'CS-2024-042',
      role: 'student'
    };
    const parsed = registerSchema.parse(input);
    assert.equal(parsed.name, 'Aarav Patel');
    assert.equal(parsed.role, 'STUDENT');
  });

  it('should reject invalid email in registration', () => {
    assert.throws(() => {
      registerSchema.parse({
        name: 'Invalid User',
        email: 'not-an-email',
        password: 'password123',
        rollNo: '123'
      });
    });
  });

  it('should reject password shorter than 6 characters', () => {
    assert.throws(() => {
      registerSchema.parse({
        name: 'Short Password',
        email: 'short@college.edu',
        password: '123',
        rollNo: '124'
      });
    });
  });

  it('should accept valid login credentials', () => {
    const input = { email: 'student@college.edu', password: 'secretpassword' };
    const parsed = loginSchema.parse(input);
    assert.equal(parsed.email, 'student@college.edu');
  });

  it('should accept student roll number or club ID as login identifier', () => {
    const input = { email: 'CLUB-CODING', password: 'secretpassword' };
    const parsed = loginSchema.parse(input);
    assert.equal(parsed.email, 'CLUB-CODING');
  });
});

describe('Event Validators', () => {
  it('should validate and coerce event creation payload', () => {
    const input = {
      title: 'Annual TechFest 2026',
      description: 'The flagship hackathon and coding fest',
      category: 'TECH',
      date: '2026-11-15',
      startTime: '09:00',
      endTime: '18:00',
      capacity: '200',
      venue: 'Main Auditorium',
      deadline: '2026-11-10T23:59'
    };
    const parsed = createEventSchema.parse(input);
    assert.equal(parsed.title, 'Annual TechFest 2026');
    assert.equal(parsed.capacity, 200, 'Capacity should be coerced to number');
    assert.equal(parsed.eventDate, '2026-11-15');
    assert.equal(parsed.registrationDeadline, '2026-11-10T23:59');
  });

  it('should reject event without a date', () => {
    assert.throws(() => {
      createEventSchema.parse({
        title: 'Event Without Date',
        capacity: 50
      });
    });
  });
});

describe('Attendance Scan Validator', () => {
  it('should accept qrToken and return it trimmed', () => {
    const parsed = scanSchema.parse({ qrToken: '  CH-8A7B6C5D  ' });
    assert.equal(parsed.qrToken, 'CH-8A7B6C5D');
  });

  it('should accept qrCode field as fallback and map to qrToken', () => {
    const parsed = scanSchema.parse({ qrCode: 'CH-11223344' });
    assert.equal(parsed.qrToken, 'CH-11223344');
  });

  it('should reject empty scan request', () => {
    assert.throws(() => {
      scanSchema.parse({});
    });
  });
});

describe('Notice Validator', () => {
  it('should validate notice and accept all UI priorities', () => {
    const parsed = createNoticeSchema.parse({
      title: 'Workshop Timing Update',
      content: 'The workshop will start at 10:30 AM instead of 10:00 AM.',
      priority: 'URGENT',
      eventId: ''
    });
    assert.equal(parsed.priority, 'URGENT');
    assert.equal(parsed.eventId, null, 'Empty eventId string should transform to null');
  });
});

describe('JWT Utility', () => {
  it('should generate and verify a valid JWT token', () => {
    const userId = 'user-uuid-12345';
    const token = generateToken(userId);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = verifyToken(token);
    assert.equal(decoded.userId, userId);
  });
});
