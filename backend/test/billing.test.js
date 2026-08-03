import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePoints } from '../src/billing.js';

test('按百万 Token 价格计算积分，保留四位小数', () => {
  assert.equal(calculatePoints(125000, 8), 1);
  assert.equal(calculatePoints(12345, 3.5), 0.0432);
});

test('非法或负数消耗不产生扣费', () => {
  assert.equal(calculatePoints(-1, 8), 0);
  assert.equal(calculatePoints('x', 8), 0);
  assert.equal(calculatePoints(1000, -8), 0);
});
