import template from './home.html';
//import './home.styl';

class Home {
  /*@ngInject*/
  constructor(){
    this.name = 'home';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
  }

  link(scope){

  }

}

export default Home;
