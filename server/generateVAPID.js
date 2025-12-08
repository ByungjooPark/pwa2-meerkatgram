import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();

console.log(JSON.stringify(keys, null, 2));

// 출력 예시
// {
//   publicKey: 'BIk1uW9a1B...',
//   privateKey: 'IOm5Kl8vgh...'
// }