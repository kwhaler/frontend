import angular from 'angular';
import numeral from 'numeral';

export default function(angularApp){
  return angularApp
    .filter('currencyFormat', function(){
      return function(str) {
        var number = parseFloat(str);
        var suffix = '';
        if ( ! isNaN(number)){
          if (number > 999999) {
            number = (number / 1000000);
            suffix = ' m';
          } else if (number > 9999) {
            number = (number / 1000);
            suffix = ' k';
          }
          if (suffix === '') {
            return numeral(number).format('$0,0');
          } else {
            return numeral(number).format('$0.0') + suffix;
          }
        } else {
          return '';
        }
      }
    })
    .filter('range', function() {
      return function(input, start, total) {
        if (!input) return;
        var clone = _.clone(input);
        if (!total || start + total > clone.length) {
          total = clone.length - start;
        }
        return clone.splice(start, total);
      };
    })
    .filter('convertCase', function() {
      return function(str) {
        var lower = str.toLowerCase();
        return lower.replace(/(^| )(\w)/g, function(x) {
          return x.toUpperCase();
        });
      }
    });
}

