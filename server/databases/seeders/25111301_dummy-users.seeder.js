/**
 * @file databases/seeders/dummy-users.seeder.js
 * @description users table dummy data create
 * 251118 v1.0.0 park init
 */

import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import PROVIDER from '../../app/middlewares/auth/configs/provider.enum.js';
import ROLE from '../../app/middlewares/auth/configs/role.enum.js';
import { fakerKO } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { sequelize, User } = db;

/**
 * 오브젝트에서 랜덤한 값 추출
 * @param {*} obj 
 * @returns 
 */
function getRandomValueInObject(obj) {
  const values = Object.values(obj);
  const randomIndex = Math.floor(Math.random() * values.length);
  
  return values[randomIndex];
}

/**
 * 인터벌 카운트 만큼 벌크 데이터 생성
 * @param {number} intervalCnt - 인터벌 카운트
 * @returns {[]} 생성한 벌크데이터가 담겨있는 배열
 */
async function generateBulkData(intervalCnt) {
  let promiseList = []; // 프로미스 리스트 저장용
  
  // 인터벌 카운트 만큼 루프
  for(let i = 0; i < intervalCnt; i++) {
    // bcrypt.hashSync()는 CPU 집약적인 synchronous 함수이기 때문에
    // 반복문 내에서 실행되면 전체 데이터 생성 과정이 매우 느려짐.
    // 따라서 bcrypt.hash()를 사용하여 asynchronous 처리로 작성
    const user = bcrypt.hash('qweqweqwe', 10)
    .then(hash => {
      const millisecond = (dayjs().millisecond()).toString().padStart(3, '0');
      return {
        email: `${millisecond}.${fakerKO.internet.email()}`,
        password: hash,
        nick: fakerKO.string.uuid().slice(0, 14),
        provider: getRandomValueInObject(PROVIDER),
        role: getRandomValueInObject(ROLE),
        profile: fakerKO.image.url(),
      }
    });

    // Promise 객체 리스트에 추가
    promiseList.push(user);
  }

  // 모든 asynchronous 처리 대기
  const bulkData = await Promise.all(promiseList);
  return bulkData;
}

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    const totalCnt = 30000; // 총 생성 수
    const intervalCnt = 5000; // 인터벌 수

    await sequelize.transaction(async t => {
      try {
        for(let i = 0; i < totalCnt; i += intervalCnt) {
          const bulkData = await generateBulkData(intervalCnt);

          // insert 처리
          await User.bulkCreate(bulkData, {transaction: t});
        }
      } catch(err) {
        console.log(`${err.name}: ${err.message}\n${err.stack}`);
        throw err;
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
