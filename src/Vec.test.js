import Vec from './Vec';

describe('creating', () => {

  test('empty argument', () => {
    const vec = new Vec();
    expect(vec.x).toBe(0);
    expect(vec.y).toBe(0);
  })

  test('creating with two components', () => {
    const vec = new Vec(1, 2);
    expect(vec.x).toBe(1);
    expect(vec.y).toBe(2);
  })

  test('creating with cartesian coords', () => {
    const vec1 = new Vec(3.24, 6.58);
    const vec = new Vec(vec1);
    expect(vec.x).toBe(3.24);
    expect(vec.y).toBe(6.58);
  })

  test('creating with polar coord', () => {
    const vec = new Vec({ang:45, len:2});
    const twoRoot = Math.sqrt(2);
    expect(vec.x).toBeCloseTo(twoRoot);
    expect(vec.y).toBeCloseTo(twoRoot);
  })

  test('creating with single arg, the angle', () => {
    const vec = new Vec(60);
    const HalfSqrtThree = Math.sqrt(3)/2;
    expect(vec.x).toBeCloseTo(0.5);
    expect(vec.y).toBeCloseTo(HalfSqrtThree);
  })

  test('creating with attribute', () => {
    const vec = new Vec(1,2, {a:1});
    expect(vec.attr.a).toBe(1);
  })

  test('create with bad argument', () => {
    expect(() => {
      new Vec({x:1, y:2})
    }).toThrow();
  })
})

describe('inplace functions', () => {
  test('translation', () => {
    const vec1 = new Vec(1,2);
    const vec2 = new Vec(0.5, 0.5);
    vec1.trans(vec2);
    expect(vec1.x).toBe(1.5);
    expect(vec1.y).toBe(2.5);

    vec1.trans({x:2, y:2});
    expect(vec1.x).toBe(3.5);
    expect(vec1.y).toBe(4.5);
  })

  test('rotate', () => {
    const vec1 = new Vec(0);
    expect(vec1.x).toBe(1);
    vec1.rotate(60);
    expect(vec1.x).toBeCloseTo(0.5);
    expect(vec1.y).toBeCloseTo(Math.sqrt(3)/2)
    vec1.rotate(60, {x:1, y:0});
    expect(vec1.x).toBeCloseTo(0);
    expect(vec1.y).toBeCloseTo(0);

    const vec2 = new Vec(30);
    const {x, y} = vec2;
    vec2.rotate(90);
    expect(vec2.x).toBeCloseTo(-0.5);
    expect(vec2.y).toBeCloseTo(Math.sqrt(3)/2);
    vec2.rotate(-90);
    expect(vec2.x).toBeCloseTo(Math.sqrt(3)/2);
    expect(vec2.y).toBeCloseTo(0.5);
    vec2.rotate(180);
    expect(vec2.x).toBeCloseTo(-Math.sqrt(3)/2);
    expect(vec2.y).toBeCloseTo(-0.5);
  })

  test('mult', () => {
    const vec1 = new Vec(1,2);
    vec1.mult(new Vec(2, 4));
    expect(vec1.x).toBeCloseTo(2);
    expect(vec1.y).toBeCloseTo(8);
    vec1.mult(2);
    expect(vec1.x).toBeCloseTo(4);
    expect(vec1.y).toBeCloseTo(16);
    
    expect(() => vec1.mult('haha')).toThrow();
    
  })

  test('scale', () => {
    const vec1 = new Vec(60);
    vec1.scale(2);
    expect(vec1.x).toBeCloseTo(1);
    vec1.scale(2, {x:2, y:0});
    expect(vec1.x).toBeCloseTo(0);
  })

  test('neg', () => {
    const vec1 = new Vec(0);
    vec1.neg();
    expect(vec1.x).toBeCloseTo(-1);
  })
})

describe('feature function', () => {

  test('is', () => {
    const vec1 = new Vec(0);
    const vec2 = vec1;
    expect(vec2.is(vec1)).toBe(true);
  })

  test('add', () => {
    const vec1 = new Vec(60);
    const vec2 = new Vec(30);
    const vec3 = vec1.add(vec2);
    expect(vec3.x).toBeCloseTo((Math.sqrt(3)+1)/2);
    expect(vec3.is(vec1)).toBe(false);
  })

  test('diff', () => {
    const vec1 = new Vec(60);
    const vec2 = new Vec(0);
    const diffed = vec1.diff(vec2);
    expect(diffed.is(vec1)).toBe(false);
    expect(diffed.is(vec2)).toBe(false);
    expect(diffed.x).toBeCloseTo(-0.5);
    expect(diffed.y).toBeCloseTo(Math.sqrt(3)/2)
  })

  test('lerp', () => {
    const vec1 = new Vec(4, 8);
    const vec2 = new Vec();
    const {x, y} = vec2.lerp(0.75, vec1);
    expect(x).toBeCloseTo(3);
    expect(y).toBeCloseTo(6);
  })

  test('mag', () => {
    const vec1 = new Vec(Math.random(), Math.random());
    const mag = vec1.mag();
    expect(mag).toBeCloseTo(Math.hypot(vec1.x, vec1.y));
  })

  test('angle', () => {
    const vec1 = new Vec(60);
    expect(vec1.angle()).toBe(60);
  })

  test('cross', () => {
    const vec1 = new Vec(60);
    const vec2 = new Vec(0);
    // remember, right-hand rule
    expect(vec1.cross(vec2)).toBeCloseTo(-vec1.mag()*vec2.mag()*Math.sin(60/180*Math.PI));
  })

  test('dot', () => {
    const vec1 = new Vec(90);
    const vec2 = new Vec(180);
    const vec3 = new Vec(45);
    expect(vec1.dot(vec2)).toBeCloseTo(0);
    expect(vec1.dot(vec3)).toBeCloseTo(Math.SQRT1_2)
  })

  test('norm', () => {
    const vec1 = new Vec(0);
    vec1.trans({x:1, y:2});
    vec1.norm();
    expect(vec1.mag()).toBeCloseTo(1);
    expect(vec1.x).toBeCloseTo(Math.SQRT1_2);

    const vec2 = new Vec();
    vec2.norm();
    expect(vec2.x).toBeCloseTo(0);
    expect(vec2.y).toBeCloseTo(0);
  })
})

describe('misc', () => {
  test('addAttr', ()=> {
    const vec1 = new Vec(0);
    vec1.addAttr('a', 1);
    expect(vec1.attr.a).toBeCloseTo(1);
  })

  test('setAAttr', () => {
    const vec1 = new Vec(0);
    vec1.addAttr('a', 1);
    expect(vec1.attr.a).toBeCloseTo(1);
    vec1.setAttr({'a':2, 'b':3});
    expect(vec1.attr.a).toBeCloseTo(2);
    expect(vec1.attr.b).toBeCloseTo(3);
  })

  test('copy', () => {
    const vec1 = new Vec(60);
    vec1.setAttr({a:1, b:2});
    const vec2 = vec1.copy();
    expect(vec1.x).toBe(vec2.x);
    expect(vec1.y).toBe(vec2.y);
    expect(vec1.attr.a).toBe(vec2.attr.a)
    expect(vec1.attr.b).toBe(vec2.attr.b)
    expect(vec1.is(vec2)).toBe(false);
  })

  test('tostring', () => {
    const vec1 = new Vec(60);
    const str = vec1.toString();
    expect(str.startsWith('(')).toBe(true);
  })
})