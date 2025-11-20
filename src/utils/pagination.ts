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
