import Repository from './Repository';

const resource = '/City';

export default {
  get(cityId) {
    return Repository.get(`${resource}/${cityId}`);
  }
};
