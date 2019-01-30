import Repository from './Repository';

const resource = '/State';

export default {
  get(countryId) {
    return Repository.get(`${resource}/${countryId}`);
  }
};
