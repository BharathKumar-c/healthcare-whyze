const tablePagination = (page, perPage) => {
  const skip = (page - 1) * perPage;
  return { skip, limit: perPage };
};

module.exports = {
  tablePagination,
};
