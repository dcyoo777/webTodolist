export const apiErrorCatcher = (e: any) => {
  if (e.response) {
    return {
      ...(e?.response?.config?.url && { name: e?.response?.config?.url }),
      ...(e?.response?.data?.message && { message: e?.response?.data?.message }),
      ...(e?.response?.status && { code: e?.response?.status?.toString() }),
    };
  } else {
    return e;
  }
};
