import Repository from './Repository';

const resource = '/User';

export default {
  
  logged: false, 

  init() {
    this.logged = (this.accessToken() != null && this.expires() >= new Date().getTime());
  },
  
  storage() {
    if (process.server) {
      return {};
    } else {
      return localStorage;
    }
  },
  
  accessToken() {
    return this.storage().accessToken;
  },
  
  expires() {
    return this.storage().expires * 1000;
  },
  
  setAccessToken(token) {
    this.storage().accessToken = token;
  },

  setExpires(expires) {
    this.storage().expires = expires;
  },

  login(email, pwd) {
    return new Promise((resolve, reject) => {
      Repository.post(`${resource}/login`, { email, pwd }).then((data) => {
        this.setAccessToken(data.data.accessToken);
        this.setExpires(data.data.expires);
        this.init();
        resolve(data);
      }, reject);
    });
  },
  
  logout() {
    this.setAccessToken(null);
    this.setExpires(0);
    this.init();
  },

  register(user) {
    return Repository.post(`${resource}`, user);
  }

};
