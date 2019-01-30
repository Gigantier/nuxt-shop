import Repository from './Repository';

const resource = '/Banner';

export default {
  async get(position) {
    const banners = await Repository.get(`${resource}?position=${position}`);
    return banners;
  }
};
