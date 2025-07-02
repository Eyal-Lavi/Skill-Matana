export const trimFormData = (data) => {
    const trimmed = {};
    for (const key in data) {
      const value = data[key];
      trimmed[key] = typeof value === 'string' ? value.trim() : value;
    }
    return trimmed;
};
