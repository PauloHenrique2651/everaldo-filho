import assert from 'node:assert/strict';
import checkout from '../api/checkout.js';
import webhook from '../api/asaas/webhook.js';
import authorization from '../api/asaas/authorization.js';
function response() { return { code: 0, body: null, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.code=code; return this; }, json(body) { this.body=body; return this; } }; }
const key=process.env.ASAAS_API_KEY, secret=process.env.ASAAS_WEBHOOK_SECRET;
try {
 delete process.env.ASAAS_API_KEY; delete process.env.ASAAS_WEBHOOK_SECRET;
 let res=response(); await checkout({method:'GET'},res); assert.equal(res.code,405);
 res=response(); await checkout({method:'POST',body:{planId:'bad',price:1}},res); assert.equal(res.code,400);
 res=response(); await checkout({method:'POST',body:{planId:'studio-complete'}},res); assert.equal(res.code,400);
 res=response(); await checkout({method:'POST',body:{planId:'guitar-premium',price:1}},res); assert.equal(res.code,503);
 process.env.ASAAS_API_KEY='test-only';
 res=response(); await checkout({method:'POST',body:{planId:'guitar-premium',price:1}},res); assert.equal(res.code,501); assert.equal(res.body.price,undefined);
 res=response(); await authorization({method:'POST',body:{planId:'guitar-premium'}},res); assert.equal(res.code,501);
 res=response(); await webhook({method:'POST'},res); assert.equal(res.code,503);
 process.env.ASAAS_WEBHOOK_SECRET='test-token';
 res=response(); await webhook({method:'POST',headers:{'asaas-access-token':'invalid'}},res); assert.equal(res.code,401);
 res=response(); await webhook({method:'POST',headers:{'asaas-access-token':'test-token'},body:{event:'PAYMENT_CONFIRMED'}},res); assert.equal(res.code,503);
 console.log('9 backend guards passed: methods, plan validation, disabled combo, price tampering, unavailable integration, webhook authentication and no false activation.');
} finally {
 if(key===undefined) delete process.env.ASAAS_API_KEY; else process.env.ASAAS_API_KEY=key;
 if(secret===undefined) delete process.env.ASAAS_WEBHOOK_SECRET; else process.env.ASAAS_WEBHOOK_SECRET=secret;
}
