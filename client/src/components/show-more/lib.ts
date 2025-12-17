export type FetchMoreParams<Filters> = {
  limit: number
  offset: number
  filters: Filters
}

export async function fetchMoreProducts<Filters, Item = unknown>(
  params: FetchMoreParams<Filters>,
) {
  const res = await fetch('/api/cources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    throw new Error('Failed to load more products')
  }
  return (await res.json()) as { totalCount: number; items: Item[] }
}
