import axios, { AxiosError } from "axios";

export const getUrlContentType = (url: string) => {
  return new Promise<{ contentType: string; contentLength: string | null }>(
    async (resolve, reject) => {
      try {
        const res = await axios.get(url);
        // console.log("res", res);
        // console.log("res headers", res.headers);
        const contentType = res.headers["content-type"];
        const contentLength = res.headers["content-length"];
        resolve({
          contentType,
          contentLength,
        });
      } catch (e: any) {
        reject(`Request failed with ${e}`);
      }

      // xhttp.open('HEAD', url);
      // xhttp.onreadystatechange = function () {
      //   if (this.readyState == this.DONE) {
      //     const contentType = this.getResponseHeader('Content-Type');
      //     if (!contentType) return reject('Request failed');
      //     resolve({
      //       contentType,
      //       contentLength: this.getResponseHeader('Content-Length'),
      //     });
      //   }
      // };
      // xhttp.onerror = function () {
      //   reject('Request failed');
      // };
      // xhttp.send();
      //   const xhttp = new XMLHttpRequest();
      //   xhttp.open('HEAD', url);
      //   xhttp.onreadystatechange = function () {
      //     if (this.readyState == this.DONE) {
      //       const contentType = this.getResponseHeader('Content-Type');
      //       if (!contentType) return reject('Request failed');
      //       resolve({
      //         contentType,
      //         contentLength: this.getResponseHeader('Content-Length'),
      //       });
      //     }
      //   };
      //   xhttp.onerror = function () {
      //     reject('Request failed');
      //   };
      //   xhttp.send();
    }
  );
};
