const _ = require('lodash');

export const camelCase: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => ({ ...camelCase(v) }));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      return {
        ...result,
        [_.camelCase(key)]: camelCase(obj[key]),
      };
    }, {});
  }
  return obj;
};

export const snakeCase: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeCase(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      return {
        ...result,
        [_.snakeCase(key)]: snakeCase(obj[key]),
      };
    }, {});
  }
  return obj;
};
