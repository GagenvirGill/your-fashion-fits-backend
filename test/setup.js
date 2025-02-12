// test/setup.test.js
require('dotenv').config();
const { testSequelize } = require('../src/config/db');
const modelSetup = require('../src/models/index.js');

module.exports = async function setupTestDB() {
    before(async () => {
        try {
            console.log(`Global Test Before: Connecting to test database...`);
            await testSequelize.authenticate();
            console.log(`Test PostgreSQL Connected`);
            modelSetup(testSequelize);
            console.log('Models Added to Test Sequelize Instance');
            await testSequelize.sync({ force: true });
            console.log('Test Database synced successfully.');
            console.log('Registered models:', Object.keys(testSequelize.models));
            console.log(`Global Test Before: Successful`);
        } catch (err) {
            console.error('Error Setting Up Test Database:', err.message);
            process.exit(1);
        }
    });

    after(async () => {
        console.log(`Global Test After: Disonnecting test database...`);
        await testSequelize.close()
        console.log(`Global Test After: Successful`);
    });
}
