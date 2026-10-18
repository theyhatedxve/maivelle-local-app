/** Search display metadata only; never index password values. */
export function filterCredentials(records, query = '', tag = 'all', favoritesOnly = false) {
  const search = query.trim().toLowerCase();
  return records.filter((record) => (tag === 'all' || record.tag === tag)
    && (!favoritesOnly || record.favorite)
    && `${record.title} ${record.username} ${record.website} ${record.tag}`.toLowerCase().includes(search));
}
