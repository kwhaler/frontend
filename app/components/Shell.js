import './shell.styl';
import template from './shell.html';

class Shell {
  /*@ngInject*/
  constructor(){
    this.name = 'shell';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
  }

  link(scope){

  }

}

export default Shell;
