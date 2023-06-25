import axios from "axios";

export const contentType = (url: string) => axios.head(url)
  .then(res => ({
    contentType: res.headers['content-type']?.toString(),
    contentLength: ((contentLength?: string): number | null =>
      contentLength
      && !isNaN(Number(contentLength))
        ? Number(contentLength) : null)(res.headers['content-length']?.toString()),
  })).catch(() => ({}))