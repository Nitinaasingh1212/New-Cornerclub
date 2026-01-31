const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

async function testOrderFlow() {
    try {
        console.log('Testing Create Order...');
        const createRes = await fetch(`${API_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 500,
                currency: 'INR',
                userId: 'test_user_123',
                eventId: 'test_event_456'
            })
        });

        if (!createRes.ok) throw new Error(`Create Order failed: ${createRes.statusText}`);
        const orderData = await createRes.json();
        console.log('Order Created:', orderData);

        console.log('Testing Verify Payment...');
        const verifyRes = await fetch(`${API_URL}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderData.id,
                paymentId: 'pay_test_789',
                signature: 'fake_sig'
            })
        });

        if (!verifyRes.ok) throw new Error(`Verify Payment failed: ${verifyRes.statusText}`);
        const verifyData = await verifyRes.json();
        console.log('Payment Verified:', verifyData);

        console.log('Data Persistence Test Passed!');

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testOrderFlow();
