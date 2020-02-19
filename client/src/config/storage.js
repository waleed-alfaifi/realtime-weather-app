export const setItem = (key, value) => {
  localStorage[key] = JSON.stringify(value);
};

export const getItem = key => {
  const value = localStorage[key];
  return value ? JSON.parse(value) : undefined;
};
