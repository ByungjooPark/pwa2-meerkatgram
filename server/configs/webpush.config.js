import webpush from 'web-push';

webpush.setVapidDetails(
  `mailto:${rocess.env.JWT_ISSUER}`,
  process.env.VAPID_PUBLIC_KEY, // Public Key
  process.env.VAPID_PRIVATE_KEY // Private Key
);

export default webpush;