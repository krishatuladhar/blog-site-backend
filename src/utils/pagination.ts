export function getPageParams(query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
}

export function paginate({ page, limit }: { page: number; limit: number }) {
  const _page = Number(page) || 1;
  const _limit = Number(limit) || 10;

  const offset = (_page - 1) * _limit;

  return {
    page: _page,
    limit: _limit,
    offset,
  };
}
