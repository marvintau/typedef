const List = require('./List');
const Vec = require('./Vec');
describe('create', () => {
  test('creaate', () => {
    const list = new List(1,2,3);
    expect(list[0]).toBe(1);
  })

  test('from', () => {
    const list = List.from([1,2,3]);
    expect(list[0]).toBe(1);
  })

})

describe('funcs', () => {
  test('most', () => {
    const list = new List(1,2,3);
    expect(list.most()).toEqual([1,2])
  })

  test('last', () => {
    const list = new List (1,2,3);
    expect(list.last()).toBe(3);
  })

  test('sum', () => {
    const list = new List(new Vec(45), new Vec(60));
    const {x, y} = list.sum();
    expect(x).toBeCloseTo(Math.SQRT1_2+1/2);
    expect(y).toBeCloseTo(Math.SQRT1_2+Math.sqrt(3)/2);
  })

  test ('same', ()=>{
    const list = new List(new Vec(45), new Vec(60));
    expect(list.same(e => e.constructor)).toBe(true);
  })

  test('accum', () => {
    const list = new List(1,2,3);
    expect(list.accum()).toEqual([0, 1, 3, 6]);
    expect(list.accum(e => 2*e)).toEqual([0, 2, 6, 12]);
  })

  test('zip', () => {
    
  })

})