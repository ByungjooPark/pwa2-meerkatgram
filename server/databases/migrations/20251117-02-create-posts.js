/**
 * @file databases/migrations/20251117-01-create-users.js
 * @description users migration file
 * 251117 v1.0.0 park init
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'posts';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '유저 PK',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
  }
};

// 옵션 설정
const options = {
  charset: 'utf8mb4',       // 테이블 문자셋 설정(이모지 지원)
  collate: 'utf8mb4_bin',   // 정렬 방식 설정 (영어 대소문자 구분 정렬)
  engine: 'InnoDB'          // 사용 엔진 설정
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출되는 메소드 (스키마 생성, 수정)
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드(스키마 제거, 수정)
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};
