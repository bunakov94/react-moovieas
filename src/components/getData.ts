export default class MoovieDB {
  apiBaseUrl = 'https://api.themoviedb.org/3/';

  async getResources(url: string) {
    const res = await fetch(`${this.apiBaseUrl}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  getPage(pageNumber: number) {
    return this.getResources(
      `search/movie?api_key=edc55cfd07c269b11eeeec5793477440&language=en-US&query=return&page=${pageNumber}&include_adult=false`,
    );
  }

  getGenres() {
    return this.getResources('genre/movie/list?api_key=edc55cfd07c269b11eeeec5793477440&language=en-US');
  }
}

const moovie = new MoovieDB();

moovie.getPage(10).then((body) => console.log(body));
