export function getCalcuation(actions) {
    let digit = 0;
    let sum = 0;
    let eqs = '';
    actions.map((list) => {
      if (list[0] === 'd'){
        sum -= digit;
        [...Array(Math.abs(digit))].map((_, index) => {
          let rad = parseInt(Math.random()*list.split('d')[1] + 1);
          if(digit < 0) {
            rad *= -1;
            if (eqs !== '') eqs += '-';
          } else if(eqs !== '') eqs += '+';
          sum += rad;
          if(Math.abs(digit) > 1 && index === 0) eqs += '(';
          eqs += Math.abs(rad);
        });
        if(Math.abs(digit) > 1) eqs += ')';
        digit = 0;
      } else {
        if(digit !== 0) {
          if(eqs !== '') { 
            if(digit < 0) eqs += '-';
            else eqs += '+';
          }
          eqs += Math.abs(digit);
        }
        sum += parseInt(list);
        digit = parseInt(list);
      }
    });
    if(digit !== 0) {
      if(eqs !== '') {
        if(digit < 0) eqs += '-';
        else eqs += '+';
      }
      eqs += Math.abs(digit);
    }
    return {eqs, sum}
}