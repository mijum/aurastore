import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';

process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/aurastore_test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-with-at-least-32-characters';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-with-at-least-32-characters';

const { requireAdmin, requireRole } = await import('../server-dist/server/src/middleware/auth.js');
const response = () => { const state = {}; const res = { status(code) { state.status = code; return res; }, json(body) { state.body = body; return res; } }; return { res, state }; };

test('protected admin middleware rejects a request without a cookie', () => {
  const { res, state } = response(); let next = false;
  requireAdmin({ cookies: {} }, res, () => { next = true; });
  assert.equal(next, false); assert.equal(state.status, 401); assert.equal(state.body.success, false);
});

test('protected admin middleware accepts a signed access cookie', () => {
  const token = jwt.sign({ sub: 'admin-1', email: 'admin@example.com', role: 'ADMIN', type: 'access' }, process.env.JWT_ACCESS_SECRET);
  const req = { cookies: { aura_admin_access: token } }; const { res } = response(); let next = false;
  requireAdmin(req, res, () => { next = true; });
  assert.equal(next, true); assert.equal(req.admin.sub, 'admin-1');
});

test('role middleware keeps manager mutations read-only', () => {
  const { res, state } = response(); let next = false;
  requireRole('SUPER_ADMIN', 'ADMIN')({ admin: { role: 'MANAGER' } }, res, () => { next = true; });
  assert.equal(next, false); assert.equal(state.status, 403);
});
