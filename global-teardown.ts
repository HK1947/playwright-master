// global-teardown.ts
// Runs ONCE after all tests — cleanup, reporting, notifications

import * as fs from 'fs';
import * as path from 'path';

// Use process.stdout for teardown logs
const log = (msg: string) => process.stdout.write(`${msg}\n`);

function globalTeardown() {
    log('\n🧹 Global Teardown Starting...\n');

    // 1. Generate test summary
    const resultsDir = path.join(process.cwd(), 'test-results');
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    if (fs.existsSync(resultsDir)) {
        const files = fs.readdirSync(resultsDir);
        files.forEach((file) => {
            if (file.includes('passed')) passed++;
            else if (file.includes('failed')) failed++;
            else if (file.includes('skipped')) skipped++;
        });
    }

    // 2. Log summary
    log('📊 Test Execution Summary:');
    log(`   ✅ Passed: ${passed}`);
    log(`   ❌ Failed: ${failed}`);
    log(`   ⏭️ Skipped: ${skipped}`);

    // 3. Cleanup old reports (keep last 5)
    const reportsDir = path.join(process.cwd(), 'playwright-report');
    if (fs.existsSync(reportsDir)) {
        log('✅ Reports directory preserved');
    }

    // 4. Cleanup old screenshots (keep last 50)
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
        const screenshots = fs.readdirSync(screenshotsDir);
        if (screenshots.length > 50) {
            const toDelete = screenshots.slice(0, screenshots.length - 50);
            toDelete.forEach((file) => {
                fs.unlinkSync(path.join(screenshotsDir, file));
            });
            log(`🗑️ Cleaned up ${toDelete.length} old screenshots`);
        }
    }

    // 5. Ensure results directory exists
    const resultsOutputDir = path.join(process.cwd(), 'results');
    if (!fs.existsSync(resultsOutputDir)) {
        fs.mkdirSync(resultsOutputDir, { recursive: true });
    }

    // 6. Write execution metadata for CI/dashboards
    const metadata = {
        timestamp: new Date().toISOString(),
        environment: process.env.ENV || 'qa',
        passed,
        failed,
        skipped,
        total: passed + failed + skipped,
        duration: process.env.TEST_DURATION || 'unknown',
    };

    fs.writeFileSync(
        path.join(resultsOutputDir, 'execution-metadata.json'),
        JSON.stringify(metadata, null, 2),
    );
    log('✅ Execution metadata saved');

    log('\n✅ Global Teardown Complete\n');
}

export default globalTeardown;
