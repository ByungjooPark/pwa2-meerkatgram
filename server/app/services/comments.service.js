/**
 * @file app/services/comments.service.js
 * @description comments Service
 * 251203 park init
 */

import commentRepository from "../repositories/comment.repository.js";
import db from '../models/index.js';
import pushSubscriptionRepository from "../repositories/pushSubscription.repository.js";
import webpush from '../../configs/webpush.config.js';
import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";

/**
 * 코멘트 작성 처리
 * @param {{postId: string, replyId: string, userId: string, content: string}} data 
 */
async function store(data) {
  const comment = await commentRepository.create(null, data);
  const user = await userRepository.findByPk(null, data.userId);
  const post = await postRepository.findByPk(null, data.postId);
  return db.sequelize.transaction(async t => {
    const payload = JSON.stringify(
      {
        title: `새로운 댓글`,
        message: `${user.nick}님께서 당신의 게시글에 댓글을 작성하셨습니다.`,
        data: {
          postId: data.postId
        }
      }
    );

    const pushSubscription = await pushSubscriptionRepository.findByUserId(t, post.userId);
    const pushList = pushSubscription.map(async sub => {
      // subscription의 구조
      const subscription = {
        endpoint: sub.endpoint,
        expirationTime: null,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (error) {
        // expired subscription 제거
        if(error.statusCode === 410) {
          await pushSubscriptionRepository.hardDestroy(t, sub.id);
        }
      }
    });
    const results = await Promise.allSettled(pushList);
    console.log("푸시 전송 결과:",results);
  });
}

export default {
  store,
}