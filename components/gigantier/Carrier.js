import Repository from './Repository';

const resource = '/Carrier';

export default {
  get(stateId, cityId) {
    return Repository.get(`${resource}?stateId=${stateId}&cityId=${cityId}`);
  }
};
