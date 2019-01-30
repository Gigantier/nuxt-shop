import Repository from './Repository';

const resource = '/PaymentMethod';

export default {
  async get() {
    const pm = await Repository.get(`${resource}`);
    return pm;
  }
};
