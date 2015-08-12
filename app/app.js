import jquery from 'jquery';
import angular from 'angular';
import ngRoute from 'angular-route';
import register from './register';
import filters from './filters';
import 'bootstrap-webpack';

import Shell from './components/Shell';
import Home from './components/home/Home';
import SiteNav from './components/siteNav/SiteNav';
import Search from './components/search/Search';
import PacTile from './components/pac/tile/PacTile';
import PacDetail from './components/pac/detail/PacDetail';
import Radial from './components/radial/Radial';

import PacService from './services/PacService';

angular
  .module('app', [ngRoute])

  .config(($routeProvider)=>{
    return $routeProvider
      .when('/', {
        template: '<home></home>'
      })
      .when('/results/:searchType?/:searchTerm?', {
        template: '<search></search>'
      })
      .when('/pac/:pacId', {
        template: '<pac-detail></pac-detail>'
      });
  });

filters(angular.module('app'));

register('app')
  .directive('shell', Shell)
  .directive('home', Home)
  .directive('siteNav', SiteNav)
  .directive('search', Search)
  .directive('pacTile', PacTile)
  .directive('radial', Radial)
  .directive('pacDetail', PacDetail)

  .factory('PacService', PacService);
