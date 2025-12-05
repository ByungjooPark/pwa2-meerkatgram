/**
 * @file app/middlewares/validations/validators/posts/show.validator.js
 * @description 게시글 show 검사기
 * 251128 v1.0.0 park init
 */

import userFields from "../../fields/user.field.js";
const { profile, email, password, passwordChk, nick } = userFields;

export default [profile, email, password, passwordChk, nick];