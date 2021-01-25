export default class MovieDB {
  apiBaseUrl = 'https://api.themoviedb.org/3/';

  API_KEY = 'e1ebf9616662e10fc1d28082f9a4a46f';

  async getResources(url: string) {
    const res = await fetch(`${this.apiBaseUrl}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  getPage(pageNumber: number, query: string) {
    return this.getResources(
      `search/movie?api_key=${this.API_KEY}&language=en-US&query=${query}&page=${pageNumber}&include_adult=false`,
    );
  }

  getGenres() {
    return this.getResources(`genre/movie/list?api_key=${this.API_KEY}&language=en-US`);
  }

  getGuestId() {
    return this.getResources(`authentication/guest_session/new?api_key=${this.API_KEY}`);
  }

  async rateMovie(sessionId: string, rate: number, movieId: number) {
    const res = await fetch(
      `${this.apiBaseUrl}movie/${movieId}/rating?api_key=${this.API_KEY}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rate,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`);
    }
    return res.json();
  }

  async getRatedMovies(sessionId: string) {
    const res = await fetch(
      `${this.apiBaseUrl}guest_session/${sessionId}/rated/movies?api_key=${this.API_KEY}&language=en-US`,
    );
    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`);
    }
    return res.json();
  }
}
