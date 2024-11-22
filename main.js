import { v1 as uuidv1 } from 'uuid';

function generateOrderedUUIDs(count) {
    const uuids = [];
    
    for (let i = 0; i < count; i++) {
        // Add a small delay to demonstrate timestamp ordering
        if (i > 0) {
            for (let j = 0; j < 1000000; j++) {}
        }
        
        const uuid = uuidv1();
        uuids.push({
            uuid: uuid,
            timestamp: BigInt('0x' + uuid.slice(0, 8) + uuid.slice(9, 13) + uuid.slice(14, 18)) - 122192928000000000n,
            index: i
        });
    }
    
    return uuids;
}

// Demo usage
const uuids = generateOrderedUUIDs(5);

console.log('Generated UUIDs with timestamps:\n');
uuids.forEach(({uuid, timestamp, index}) => {
    const date = new Date(Number(timestamp / 10000n));
    console.log(`UUID ${index + 1}: ${uuid}`);
    console.log(`Timestamp: ${date.toISOString()}\n`);
});

// Verify ordering with proper BigInt comparison
const sortedUuids = [...uuids].sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
    if (a.timestamp > b.timestamp) return 1;
    return 0;
});
const orderPreserved = uuids.every((uuid, index) => uuid === sortedUuids[index]);

console.log('UUIDs are in chronological order:', orderPreserved);
