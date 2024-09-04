export const BASE_URL = "https://phantom.app/ul/v1/";
const buildUrl = (path: string, params: URLSearchParams) =>
  `${BASE_URL}${path}?${params.toString()}`;

export default buildUrl;
