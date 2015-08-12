import template from './siteNav.html';
import register from '../../register';
import './siteNav.styl';

class SiteNav {

  /*@ngInject*/
  constructor($location){
    this.name = 'siteNav';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
    this.$location = $location;
  }

  link(scope){
    scope.atHome = (() => {
        return (this.$location.path() === '/');
    });
  }

}

export default SiteNav;
