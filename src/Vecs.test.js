import Vec from './Vec';
import Vecs from './Vecs';
import List from './List';

describe('create', () => {
  test('fromVec', () => {
    const N = Math.floor(Math.random() * 5) + 3
    const vecList = List.from([...Array(N)].map((_, i) => new Vec(N * i)));

    const vecs1 = Vecs.fromVecs(vecList);
    expect(vecs1.length).toBe(N);

    const vecs2 = Vecs.fromVecs(vecList, {closed: true});
    expect(vecs2.length).toBe(N+1);

    expect(vecs2.last().tail).toBe(vecs2[0].head);
  })

})

describe('transform', () => {
  const vecs = Vecs.fromVecs(new List(new Vec(), new Vec(1, 1), new Vec(2, 2)));

  test('translate', () => {
    vecs.trans(new Vec(1, 1));
    expect(vecs[0].x).toBeCloseTo(1);
    expect(vecs[0].y).toBeCloseTo(1);
    expect(vecs[1].x).toBeCloseTo(2);
    expect(vecs[1].y).toBeCloseTo(2);
    expect(vecs[2].x).toBeCloseTo(3);
    expect(vecs[2].y).toBeCloseTo(3);
  })

  test('rotate', () => {
    const {SQRT2, SQRT1_2} = Math;
    vecs.rotate(45);
    vecs.rotate(90, new Vec(0, 2*SQRT2));
    expect(vecs[0].x).toBeCloseTo(  SQRT2);
    expect(vecs[0].y).toBeCloseTo(2*SQRT2);
    expect(vecs[1].x).toBeCloseTo(0);
    expect(vecs[1].y).toBeCloseTo(2*SQRT2);
    expect(vecs[2].x).toBeCloseTo( -SQRT2);
    expect(vecs[2].y).toBeCloseTo(2*SQRT2);
  })

  test('scale', () => {
    const {SQRT1_2} = Math;

    vecs.scale(SQRT1_2, new Vec());
    expect(vecs[0].x).toBeCloseTo(  1);
    expect(vecs[0].y).toBeCloseTo(2*1);
    expect(vecs[1].x).toBeCloseTo(0);
    expect(vecs[1].y).toBeCloseTo(2*1);
    expect(vecs[2].x).toBeCloseTo( -1);
    expect(vecs[2].y).toBeCloseTo(2*1);
  })

  test('flip', () => {
  
    vecs.reverse();
    expect(vecs[0].x).toBeCloseTo( -1);
    expect(vecs[0].y).toBeCloseTo(2*1);
    expect(vecs[1].x).toBeCloseTo(0);
    expect(vecs[1].y).toBeCloseTo(2*1);
    expect(vecs[2].x).toBeCloseTo(  1);
    expect(vecs[2].y).toBeCloseTo(2*1);
  })

  describe('area & centroid', () => {
    const {random, ceil, sin, cos, PI} = Math;
    const edges = ceil(random()*10)+3;
    const ang_2 = PI/edges;

    const vecs = new List(...Array(edges)).map((_, i) => {
      return new Vec(360 * i / edges);
    })

    test('area', () => {

      const vecs1 = Vecs.fromVecs(vecs);
      expect(() => vecs1.area()).toThrow();
  
      const vecs2 = Vecs.fromVecs(vecs, {closed:true});
      expect(vecs2.area()).toBeCloseTo(sin(ang_2)*cos(ang_2)*edges);
    })
  
    test('centroid', () => {
      const vecs1 = Vecs.fromVecs(vecs, {closed:true});
      vecs1.trans(new Vec(2, 3));
      const {x, y} = vecs1.centroid();
      console.log(x, y)
      expect(x).toBeCloseTo(2);
      expect(y).toBeCloseTo(3);
    })  
  })
})

describe('intersect', () => {
  let vecsX;
  let vecsY;

  beforeEach(() => {
    vecsX = Vecs.fromVecs(new List(...[...Array(4)].map((n, i) => new Vec(i, 1.5))));
    vecsY = Vecs.fromVecs(new List(...[...Array(4)].map((n, i) => new Vec(1.5, i))));
  })

  test('ortho intersect', () => {
    vecsX.intersect(vecsY, {isLogging: true});

    expect(vecsX.length).toBe(5)
    expect(vecsY.length).toBe(5);
    expect(vecsX[2]).toBe(vecsY[2]);
    expect(vecsX[2].x).toBeCloseTo(1.5);
  })

  test('not break when already intersected', () => {
    vecsX.intersect(vecsY);
    vecsX.intersect(vecsY);

    expect(vecsX.length).toBe(5)
    expect(vecsY.length).toBe(5);
  })

  test('only break one when intersect on an end of segment (X)', () => {
    vecsX.trans(new Vec(0, 0.5));
    vecsX.intersect(vecsY);

    expect(vecsX.length).toBe(5)
    expect(vecsY.length).toBe(4);
  })

  test('only break one when intersect on an end of segment (Y)', () => {
    vecsY.trans(new Vec(0.5, 0));
    vecsY.intersect(vecsX);

    expect(vecsX.length).toBe(4)
    expect(vecsY.length).toBe(5);
  })

  test('only break one when intersect on an end of segment (Y swap case)', () => {
    vecsY.trans(new Vec(0.5, 0));
    vecsX.intersect(vecsY);

    expect(vecsX.length).toBe(4)
    expect(vecsY.length).toBe(5);
  })
})
