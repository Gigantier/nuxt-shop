import Repository from './Repository';

const resource = '/Page';

export default {
  async get() {
    const pages = await Repository.get(`${resource}`);
    pages.data = pages.data.map((page) => {
      const newPage = page;
      newPage.url = this.url(page);
      return newPage;
    });
    return pages;
  },
  getPage(id) {
    return Repository.get(`${resource}/${id}`);
  },
  url(page) {
    const path = page.title.toLowerCase().trim().replace(' ', '-');
    return encodeURI(`/paginas/${page.id}-${path}`);
  }
};
