import template from './pacTile.html';
import './pacTile.styl';
import '../pac.styl';

class PacTile {
  /*@ngInject*/
  constructor(){
    this.name = 'pacTile';
    this.template = template;
    this.restrict = 'E';
    this.scope = {
      pac: '='
    };
  }

  link(scope){

  }

}

export default PacTile;
