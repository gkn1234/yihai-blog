/**
 * Stylelint 样式规范配置文件
 * 参考文档：https://github.com/stylelint/stylelint
 */
/** @type {import('stylelint').Config} */
export default {
  extends: [
    // 代码风格规则
    '@stylistic/stylelint-config',
    // 基本 scss 规则
    'stylelint-config-standard-scss',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    'stylelint-config-css-modules',
  ],
  rules: {

  },
}
