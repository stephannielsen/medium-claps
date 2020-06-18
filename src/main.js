import { MediumClaps } from './medium-claps.js'

window.addEventListener("DOMContentLoaded", (event) => {
    new MediumClaps({
        feedUrl: `http://localhost:1458/get?url=${encodeURIComponent(
          "https://medium.com/feed/@stephannielsen/has-recommended"
        )}`,
      missingImage: "https://source.unsplash.com/random/640x480",
    });
  });
