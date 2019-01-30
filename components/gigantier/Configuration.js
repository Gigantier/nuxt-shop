import Repository from './Repository';

const resource = '/Configuration';

export default {
  get() {
    return Repository.get(`${resource}`);
  }
};
