export const images = {
  cross: () => require('./images/close.png'),
  check: () => require('./images/check.png'),
  plus: () => require('./images/plus.png'),
  checkMark: () => require('./images/checkMark.png'),
};

export type ImageName = keyof typeof images;
