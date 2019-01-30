import Repository from './Repository';

const resource = '/Order';

export default {
  getOrder(id) {
    return Repository.get(`${resource}/${id}`);
  },

  calculateTotal(data) {
    return Repository.post(`${resource}/calculateTotal`, data);
  },

  create(data) {
    return Repository.post(`${resource}`, data);
  }
};
