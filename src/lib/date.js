const formatterCache = new Map();

const getFormatter = (options = {}) => {
  const key = JSON.stringify(options);
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        ...options,
      })
    );
  }
  return formatterCache.get(key);
};

export const formatDateUTC = (value, options = {}) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return getFormatter(options).format(date);
};
