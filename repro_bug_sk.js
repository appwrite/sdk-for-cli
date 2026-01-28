// repro_bug.js

import { drawTable } from './lib/parser.ts'; // Change .js to .ts


console.log("--- Test 1: Simulating Database Trigger with Null values ---");
const mockExecutionData = [
    {
        $id: "65ae12345",
        status: "completed",
        duration: 0.123,
        scheduledAt: null, // This is the value that triggers the crash
        trigger: "database"
    }
];

try {
    // Before your fix, this line would throw:
    // TypeError: Cannot convert undefined or null to object
    drawTable(mockExecutionData);
    console.log("\n✅ Test 1 Passed: Table rendered successfully despite null values.");
} catch (error) {
    console.error("\nTest 1 Failed:", error.message);
}

console.log("\n--- Test 2: Simulating Empty Object array ---");
try {
    drawTable([null]);
    console.log("✅ Test 2 Passed: Handled [null] array gracefully.");
} catch (error) {
    console.error(" Test 2 Failed:", error.message);
}