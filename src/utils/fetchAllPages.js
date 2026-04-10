import fetcher from './fetcher';

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });
  return query.toString();
};

/**
 * Fetches all pages from a paginated endpoint in bounded batches.
 * Expects response shape: { data: [], meta: { totalResults, pageSize, pageNo } }
 */
export const fetchAllPages = async ({
  baseUrl,
  params = {},
  pageSize = 300,
  maxPages = 200,
  shouldCancel,
}) => {
  const allRows = [];
  let pageNo = 1;
  let totalResults = 0;
  let pagesFetched = 0;

  while (pagesFetched < maxPages) {
    if (shouldCancel?.()) {
      return {
        data: [],
        meta: { totalResults: 0, pageNo: 0, pageSize },
        cancelled: true,
      };
    }

    const query = buildQueryString({
      ...params,
      pageNo,
      pageSize,
    });
    const response = await fetcher(`${baseUrl}?${query}`);
    const pageRows = Array.isArray(response?.data) ? response.data : [];
    const meta = response?.meta ?? {};

    allRows.push(...pageRows);
    totalResults = Number(meta.totalResults ?? allRows.length);
    pagesFetched += 1;

    if (allRows.length >= totalResults || pageRows.length === 0) {
      break;
    }

    pageNo += 1;
  }

  return {
    data: allRows,
    meta: {
      totalResults,
      pageNo: 1,
      pageSize,
    },
    cancelled: false,
  };
};

export default fetchAllPages;
