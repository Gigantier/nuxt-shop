const express = require('express');
const app = express();

const apicache = require('apicache')
const CACHE_TIME = '1 hour';
const cache = apicache.middleware

const gigantier = require('@gigantier/js-sdk');

const bodyParser = require('body-parser')
app.use(bodyParser.json());

const apiClient = gigantier.client({
  clientId: 'd014588bc77c37d24ee5375eb3ec1d22',
  clientSecret: '7b078ae1588b06d9cd0057631ee90a8c',
  scope: 'Configuration Page Category Banner Product User PaymentMethod Country State City Carrier Order OrderList',
  host: 'gigantier',
  protocol: 'http'
});

app.get('/', function(req, res) {
  res.send('');
});

app.get('/Configuration', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Configuration/value').then((data) => {
    res.json(data.values);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Page', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Page/menu').then((data) => {
    res.json(data.pages);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Page/:id', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Page/list/'+req.params.id).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Category', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Category/list', { active: 1 }).then((data) => {
    res.json(data.categories);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Category/:id', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Category/list/'+req.params.id).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.post('/User/login', function(req, res) {
  apiClient.authenticate(req.body.email, req.body.pwd).then((data) => {
    delete data.clientId;
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.post('/User', function(req, res) {
  apiClient.call('/User', req.body).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Banner', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Banner/list', { position: req.query.position }).then((data) => {
    res.json(data.banners);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Product', cache(CACHE_TIME), function(req, res) {

  let endpoint = '/Product/list';
  if(req.query.categoryId > 0)
    endpoint = '/Product/listForCategory/'+req.query.categoryId;

  if(req.query.sort) {
    req.query.sortField = req.query.sort;
    if(req.query.sort == 'created') {
      req.query.sortWay = 'desc';
    }
  }

  apiClient.call(endpoint, req.query).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });

});

app.get('/Product/:id', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Product/list/'+req.params.id).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Product/:id/related', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Product/listRelated/'+req.params.id).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/PaymentMethod', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/PaymentMethod/list').then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Country', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Country/list').then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/State/:countryId', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/State/list', { countryId: req.params.countryId }).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/City/:stateId', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/City/list', { stateId: req.params.stateId }).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Carrier', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Carrier/list', { stateId: req.query.stateId, cityId: (req.query.cityId ? req.query.cityId : null) }).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.post('/Order', function(req, res) {
  req.body.products = JSON.stringify(req.body.products);

  if(req.body.discounts) {
    req.body.discounts = JSON.stringify(req.body.discounts);
  }

  apiClient.call('/Order', req.body).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.get('/Order/:id', cache(CACHE_TIME), function(req, res) {
  apiClient.call('/Order/list/'+req.params.id).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

app.post('/Order/calculateTotal', function(req, res) {
  req.body.products = JSON.stringify(req.body.products);

  if(req.body.discounts) {
    req.body.discounts = JSON.stringify(req.body.discounts);
  }

  apiClient.call('/Order/calculateTotal', req.body).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.status(400).json(data);
  });
});

module.exports = {
  path: '/api',
  handler: app
};
