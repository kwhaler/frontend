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

    var deferred = $q.defer();
    var promise = deferred.promise;
    $http.get(`http://54.213.83.132/hackoregon/http/committee_data_by_id/${pacId}/`)
      .then(function (result) {
        var pac = new Pac();
        pac.fromObject(result.data[0]);
        deferred.resolve(pac);
      });

    return promise;
  };

}

export default PacService;
