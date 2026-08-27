console.log('Test 1: Simple console log');
console.log('Test 2: Another message');
console.log('Test 3: Third message');

setTimeout(() => {
  console.log('Test 4: After timeout');
  process.exit(0);
}, 1000);