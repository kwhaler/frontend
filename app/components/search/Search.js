import template from './search.html';
import './search.styl';

import debounce from 'debounce';

class Search {
  /*@ngInject*/
  constructor($routeParams, $location, PacService){
    this.name = 'search';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.PacService = PacService;
  }

  link($scope){


    $scope.viewModel = {
      searchType: this.$routeParams.searchType,
      searchTerm: this.$routeParams.searchTerm,
      pacs: []
    };

    $scope.onSubmit = () => {
      this.$location.path('/results/' + $scope.viewModel.searchType + '/' + $scope.viewModel.searchTerm);
    };

    $scope.$watchCollection('[viewModel.searchType, viewModel.searchTerm]', debounce(() => {
      this.PacService.searchPacs($scope.viewModel.searchTerm)
        .then(function(pacs){
          $scope.viewModel.pacs = pacs;
        });
    }, 250));

  }

}

export default Search;
