/**
 * @file app/services/subscriptions.service.js
 * @description subscriptions Service
 * 251203 park init
 */

import db from '../models/index.js';
import PushSubscriptionRepository from '../repositories/PushSubscription.repository.js';

async function subscribe(data) {
  const {userId, subscription, deviceInfo} = data;
    // subscription의 구조
    // {
    //   endpoint: 'https://fcm.googleapis.com/fcm/send/dFlTq11Ly-w:...',
    //   expirationTime: null,
    //   keys: {
    //     p256dh: 'BD9B5KMdQbwgG7...',
    //     auth: 'OL56CZS...'
    //   }
    // }
    // deviceInfo의 구조
    // {
    //   userAgent: navigator.userAgent,   // 브라우저/디바이스 정보
    //   language: navigator.language      // 언어 정보
    // }

  return db.sequelize.transaction(async t => {
    const {endpoint, keys} = subscription;
    const {userAgent} = deviceInfo;

    const data = {
      userId: userId,
      endpoint: endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      device: userAgent,
    }

    await PushSubscriptionRepository.upsert(t, data);
  });
}

export default {
  subscribe,
}