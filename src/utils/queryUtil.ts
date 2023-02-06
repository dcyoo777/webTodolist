import qs from 'qs';

export const makeQuery = (obj: object) => {
  return qs.stringify(obj, { addQueryPrefix: true, arrayFormat: 'brackets' });
};
