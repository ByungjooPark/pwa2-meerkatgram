import { useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export default function usePushNotifications() {
  // 권한 플래그
  // NotificationPermission: "default" | "denied" | "granted"
  // 유저가 권한 거부를 한 경우, 코드상으로는 재설정 불가능
  // 크롬의 경우 `chrome://settings/content/notifications`로 접속하여 직접 허용 설정 필요
  const [isPermission, setIsPermission] = useState(Notification?.permission === 'granted');
  const [isCheckedSubscribe, setIsCheckedSubscribe] = useState(false);

  // 권한 요청
  async function requestPermission() {
    let subscriptionFlg = false;

    try {
      if('Notification' in window) {
        // Notification 지원하는 경우
        if(Notification.permission !== 'granted') {
          // 허용이 아닌경우 처리
          const result = await Notification.requestPermission();
          if(result === 'denied') {
            alert('알림을 거부하신 이력이 있습니다.\n알림 허용을 하지 않으면 서비스 이용에 제한이 있습니다.');
          }

          // 유저가 권한 거부를 한 경우, 코드상으로는 재설정 불가능하므로 "denied"과 "granted"는 true로 취급
          subscriptionFlg = result !== 'default';
        } else {
          // 이미 허용인 경우
          subscriptionFlg = true;
        }
      } else {
        // Notification 지원하지 않는 경우
        alert('알림을 지원하지 않는 브라우저입니다.');
      }
    } catch(error) {
      console.error(error);
    }

    // 권한 플래그 저장
    setIsPermission(subscriptionFlg);
    return subscriptionFlg;
  }

  // 구독 등록
  async function subscribeUser() {
    try {
      // 서비스 워커 준비
      const registration = await navigator.serviceWorker.ready;
      
      // 등록 중인 구독 정보 획득
      const subscribing = await registration.pushManager.getSubscription();

      if(!subscribing) {
        // 권한 확인 및 승인 요청
        if(!await requestPermission()) {
          return;
        }

        // 서비스 워커에 구독 정보 등록
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLICK_KEY
        });
  
        // subscription의 구조
        // {
        //   endpoint: 'https://fcm.googleapis.com/fcm/send/dFlTq11Ly-w:...',
        //   expirationTime: null,
        //   keys: {
        //     p256dh: 'BD9B5KMdQbwgG7...',
        //     auth: 'OL56CZS...'
        //   }
        // }
  
        const deviceInfo = {
          userAgent: navigator.userAgent,   // 브라우저/디바이스 정보
          language: navigator.language      // 언어 정보
        };
        
        // Backend에 구독 정보 등록 요청
        await axiosInstance.post('/api/subscriptions', {subscription, deviceInfo});
        alert('구독 성공');
      }
    } catch(error) {
      console.error("구독 실패: ", error);
    } finally {
      setIsCheckedSubscribe(true);
    }
  }

  return {
    isPermission,
    isCheckedSubscribe,
    subscribeUser,
  }
}
