import Repository from './Repository';

const resource = '/Country';

export default {
  get() {
    return Repository.get(`${resource}`);
  }
};
