import webpush from 'web-push';

console.log(JSON.stringify(webpush.generateVAPIDKeys(), null, 2));

// 출력 예시
// {
//   publicKey: 'BIk1uW9a1B...',
//   privateKey: 'IOm5Kl8vgh...'
// }