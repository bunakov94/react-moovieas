export default class MovieDB {
  apiBaseUrl = 'https://api.themoviedb.org/3/';

  async getResources(url: string) {
    const res = await fetch(`${this.apiBaseUrl}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  getPage(pageNumber: number, query: string) {
    return this.getResources(
      `search/movie?api_key=edc55cfd07c269b11eeeec5793477440&language=en-US&query=${query}&page=${pageNumber}&include_adult=false`,
    );
  }

  getGenres() {
    return this.getResources('genre/movie/list?api_key=edc55cfd07c269b11eeeec5793477440&language=en-US');
  }
}
