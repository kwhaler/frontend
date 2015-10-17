import Pac from '../models/Pac';

const CONTRIBUTION = {
  PAC: 'PAC',
  BUSINESS: 'Business',
  GRASSROOTS: 'Grassroots',
  INDIVIDUAL: 'Individual',
  PARTY: 'Party',
  UNION: 'Union',
  NA: 'NA'
};

const CACHE = {pacId: null, transactions: null};

class PacService {
  /*@ngInject*/
  constructor($http, $q){
    this.$http = $http;
    this.$q = $q;
  }

  searchPacs(term) {
    var deferred = this.$q.defer();
      var promise = deferred.promise;
      this.$http.get(`http://54.213.83.132/hackoregon/http/candidate_search/${term}/`)
        .then(function (result) {
          var pacs = result.data.map(function(item){
            var pac = new Pac();
            pac.fromObject(item);
            return pac;
          });
          deferred.resolve(pacs);
        });

      return promise;
  }

  getPac(pacId) {

    var deferred = this.$q.defer();
    var promise = deferred.promise;
    this.$http.get(`http://54.213.83.132/hackoregon/http/committee_data_by_id/${pacId}/`)
      .then(function (result) {
        var pac = new Pac();
        pac.fromObject(result.data[0]);
        deferred.resolve(pac);
      });

    return promise;
  };

  /**
   * These results will get cached.  Each result could be many rows of data, so we'll only cache one
   * candidateId of results at a time.  Other service calls like getFinancialSummary will use the cached results.
   * @param pacId
   * @returns {*}
   */
  getTransactions(pacId) {
    var deferred = this.$q.defer();
    var promise = deferred.promise;
    console.log(pacId, CACHE);
    if (pacId === CACHE.pacId) {
      deferred.resolve(CACHE.transactions);
    } else {
      this.$http.get(`http://54.213.83.132/hackoregon/http/current_candidate_transactions/${pacId}/`)
        .then(function (result) {
          CACHE.pacId = pacId;
          CACHE.transactions = result.data;
          deferred.resolve(result.data);
        });
    }

    return promise;
  };


  getFinancialSummary(pacId) {

    var deferred = this.$q.defer();
    var promise = deferred.promise;

    var sortEntry = function(a, b) {
      return Number(b.amount) - Number(a.amount);
    }

    var self = this;

    this.getTransactions(pacId)
      .then(function (transactions) {
        var contributions = {};
        _(self.CONTRIBUTION).each(function(type){
          contributions[type] = {amount:0,number:0};
        });
        var expenditures = {};
        var donors = {
          indiv: {},
          corp: {},
          pac: {}
        };
        var committee_codes = {};

        // Use contributor name as a unique key to add up total donations for each contributor
        var addDonorItem = function(type, row) {
          var payee = row['contributor_payee'];
          if (! _.has(donors[type], payee)){
            donors[type][payee] = 0;
          }
          donors[type][payee] += row.amount;

          if (type === 'pac' && _.has(row, 'contributor_payee_committee_id')) {
            committee_codes[payee] = row['contributor_payee_committee_id'];
          }
        };

        _(transactions).chain()
          .each(function (row) {
            var subType = row['sub_type'];
            switch (subType) {
              case 'In-Kind Contribution':
              case 'Cash Contribution':
                var bookType = row['book_type'];
                var contributionKey = '';
                switch (bookType) {
                  case 'Business Entity':
                    contributionKey = self.CONTRIBUTION.BUSINESS;
                    addDonorItem('corp', row);
                    break;
                  case 'Political Committee':
                    contributionKey = self.CONTRIBUTION.PAC;
                    addDonorItem('pac', row);
                    break;
                  case 'Political Party Committee':
                    contributionKey = self.CONTRIBUTION.PARTY;
                    addDonorItem('pac', row);
                    break;
                  case 'NA':
                    contributionKey = self.CONTRIBUTION.NA;
                    break;
                  case 'Individual':
                    if (row['contributor_payee_class'] !== 'grassroots_contributor') {
                      contributionKey = self.CONTRIBUTION.INDIVIDUAL;
                      addDonorItem('indiv', row);
                    }
                    break;
                }
                if (contributionKey) {
                  contributions[contributionKey].amount += Number(row['amount']);
                  contributions[contributionKey].number += 1;
                }
                if (row['contributor_payee_class'] === 'grassroots_contributor') {
                  contributions[self.CONTRIBUTION.GRASSROOTS].amount += Number(row['amount']);
                  contributions[self.CONTRIBUTION.GRASSROOTS].number += 1;
                }
                break;
              case 'Cash Expenditure':
                var purposeCodes = (row['purpose_codes'] || '').split('; ');
                _(purposeCodes).each(function (purposeCode) {
                  if (!_(expenditures).has(purposeCode)) {
                    expenditures[purposeCode] = 0;
                  }
                  expenditures[purposeCode] += (Number(row['amount']) / purposeCodes.length);
                });
                break;

            }
          });

        donors.indiv = _.map(donors.indiv, function(amount, donor){
          return {payee: donor, amount: amount};
        });
        donors.indiv.sort(sortEntry);

        donors.corp = _.map(donors.corp, function(amount, donor){
          return {payee: donor, amount: amount};
        });
        donors.corp.sort(sortEntry);

        donors.pac = _.map(donors.pac, function(amount, donor) {
          return {payee: donor, amount: amount};
        })
        donors.pac.sort(sortEntry);

        _.each(donors.pac, function(val) {
          if (_.has(committee_codes, val.payee)) {
            val['filer_id'] = committee_codes[val.payee];
          }
        })

        deferred.resolve({contributions:contributions,expenditures:expenditures, donors: donors});
    });

    return promise;
  };

}

export default PacService;
