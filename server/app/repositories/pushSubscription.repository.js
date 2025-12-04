/**
 * @file app/repositories/like.repository.js
 * @description like Repository
 * 251129 v1.0.0 park init
 */

import db from '../models/index.js';
const {sequelize, PushSubscription} = db;


async function upsert(t = null, data) {
  return await PushSubscription.upsert(
    data,
    {
      transaction: t
    }
  );
}

async function findByUserId(t = null, userId) {
  return await PushSubscription.findAll(
    {
      where: {
        userId: userId
      }
    },
    {
      transaction: t
    }
  );
}

async function hardDestroy(t = null, id) {
  return await PushSubscription.destroy(
    {
      where: { id : id },
      force: true,
      transaction: t,
    }
  );
}

export default {
  upsert,
  findByUserId,
  hardDestroy,
}