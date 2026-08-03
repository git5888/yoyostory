import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVerificationCode,percentEncode,signAliyunRequest} from '../src/aliyun-sms.js';
test('验证码始终是 6 位数字',()=>{const code=generateVerificationCode();assert.match(code,/^\d{6}$/)});
test('阿里云编码符合 RFC3986',()=>{assert.equal(percentEncode("!*'()"),'%21%2A%27%28%29')});
test('相同请求参数产生稳定签名',()=>{const p={Action:'SendSms',AccessKeyId:'test',SignatureNonce:'nonce'};assert.equal(signAliyunRequest(p,'secret'),signAliyunRequest(p,'secret'))});
