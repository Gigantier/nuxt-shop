import Repository from './Repository';

const resource = '/Order';

export default {
  calculateTotal(data) {
    return Repository.post(`${resource}/calculateTotal`, data);
  },
  
  create(data) {
    return Repository.post(`${resource}`, data);
  }
};
