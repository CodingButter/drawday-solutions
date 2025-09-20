#!/usr/bin/env node

// Test script to verify base64 encoding/decoding for participants

const testParticipants = [
  { firstName: 'John', lastName: 'Doe', ticketNumber: '0001' },
  { firstName: 'Jane', lastName: 'Smith', ticketNumber: '0002' },
  { firstName: 'Bob', lastName: 'Johnson', ticketNumber: '0003' },
];

console.log('Testing base64 encoding for participants...');
console.log('Original participants:', testParticipants);
console.log('Original size:', JSON.stringify(testParticipants).length, 'bytes');

// Encode (as done in the API)
const compactJson = JSON.stringify(testParticipants);
const base64Encoded = Buffer.from(compactJson).toString('base64');

console.log('\nBase64 encoded:', base64Encoded);
console.log('Encoded size:', base64Encoded.length, 'bytes');

// Decode (as done in the API)
const jsonString = Buffer.from(base64Encoded, 'base64').toString('utf-8');
const decodedParticipants = JSON.parse(jsonString);

console.log('\nDecoded participants:', decodedParticipants);

// Verify
const isEqual = JSON.stringify(testParticipants) === JSON.stringify(decodedParticipants);
console.log('\nTest result:', isEqual ? '✅ PASSED' : '❌ FAILED');

// Test with large dataset
const largeParticipants = [];
for (let i = 1; i <= 10000; i++) {
  largeParticipants.push({
    firstName: `First${i}`,
    lastName: `Last${i}`,
    ticketNumber: String(i).padStart(6, '0'),
  });
}

const largeJson = JSON.stringify(largeParticipants);
const largeBase64 = Buffer.from(largeJson).toString('base64');

console.log('\nLarge dataset test:');
console.log('Number of participants:', largeParticipants.length);
console.log('Original JSON size:', largeJson.length, 'bytes (', (largeJson.length / 1024).toFixed(2), 'KB)');
console.log('Base64 encoded size:', largeBase64.length, 'bytes (', (largeBase64.length / 1024).toFixed(2), 'KB)');
console.log('Size increase:', ((largeBase64.length / largeJson.length - 1) * 100).toFixed(1), '%');

// Verify large dataset
const decodedLarge = JSON.parse(Buffer.from(largeBase64, 'base64').toString('utf-8'));
const largeIsEqual = decodedLarge.length === largeParticipants.length && 
                     decodedLarge[0].ticketNumber === '000001' &&
                     decodedLarge[9999].ticketNumber === '010000';

console.log('Large dataset test:', largeIsEqual ? '✅ PASSED' : '❌ FAILED');