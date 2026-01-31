const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api'; // Frontend Next.js API route proxying to Backend
// OR direct backend?
// `api/users` is a Next.js route in `app/api/users/[userId]/route.ts`. 
// Wait, `app/api/users` uses `pool`, so it talks to DB directly. It does NOT proxy to `server.js` for users?
// Let's check `app/api/users/[userId]/route.ts` again.
// It imports `pool` from `@/lib/mysql`. Yes, it talks to MySQL directly.

const userId = 'test_user_persistence_' + Date.now();

async function testProfilePersistence() {
    console.log(`Testing Profile Persistence for User: ${userId}`);

    const profileData = {
        name: "Test Persistence User",
        email: "test_persist@example.com",
        phone: "+919999999999",
        bio: "This is a test bio for SQL check.",
        city: "Test City",
        profileImage: "http://example.com/img.jpg",
        instagram: "@test_insta",
        facebook: "fb.com/test",
        youtube: "yt.com/test"
    };

    try {
        // 1. Update/Create Profile
        console.log("1. Sending Profile Update...");
        const updateRes = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        if (!updateRes.ok) {
            const errText = await updateRes.text();
            throw new Error(`Update failed: ${updateRes.status} ${errText}`);
        }
        console.log("   Update Success.");

        // 2. Fetch Profile
        console.log("2. Fetching Profile back...");
        const getRes = await fetch(`${API_BASE}/users/${userId}`, {
            cache: 'no-store'
        });

        if (!getRes.ok) throw new Error(`Fetch failed: ${getRes.status}`);
        const fetchedData = await getRes.json();

        // 3. Verify Fields
        console.log("3. Verifying Fields...");
        const fieldsToCheck = ['name', 'email', 'phone', 'bio', 'city', 'instagram'];
        let allMatch = true;

        fieldsToCheck.forEach(field => {
            if (fetchedData[field] !== profileData[field]) {
                console.error(`MISMATCH: ${field} - Expected '${profileData[field]}', Got '${fetchedData[field]}'`);
                allMatch = false;
            }
        });

        if (allMatch) {
            console.log("SUCCESS: All profile data is correctly persisted in SQL.");
        } else {
            console.error("FAILURE: Some data was lost or incorrect.");
        }

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testProfilePersistence();
