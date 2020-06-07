export const images = {
  cross: () => require('./images/close.png'),
  checkMark: () => require('./images/checkMark.png'),
};

export type ImageName = keyof typeof images;
