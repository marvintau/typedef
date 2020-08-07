import Vec from './Vec';
import Vecs from './Vecs';
import List from './List';

function deg2rad(deg) {
  return deg/180 * Math.PI;
}

describe('create', () => {
  test('fromVec', () => {
    const N = Math.floor(Math.random() * 5) + 3
    const vecList = [...Array(N)].map((_, i) => new Vec(N * i));

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

  test('growEnds', () => {
    const vecs = new Vecs(new Vec(-5, -5), new Vec(), new Vec(5, 5));
    const newVecRef = vecs.growEnds({head: new Vec(), tail: new Vec()});
    expect(vecs.length).toBe(5);
    expect(newVecRef.length).toBe(5);
  })

  test('stepwise', () => {
    const vecs = new Vecs(new Vec(-5, -5), new Vec(), new Vec(5, 5));
    const stepped = vecs.stepwise(5);
    expect(stepped.length).toBe(6);
    expect(stepped.diff().map(([head, tail]) => head.diff(tail).mag()).every(e => e === 2 * Math.SQRT2)).toBe(true)
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

describe('split', () => {
  test('should create two new polygons', () => {

    const N = 10
    const polygon = Vecs.fromVecs([...Array(N)].map((n, i) => new Vec(i/N*360)), {closed:true});
    polygon.scale(5, new Vec());

    expect(polygon.length).toBe(N+1);
    expect(polygon[0]).toBe(polygon.last());
    expect(polygon.every(e => e.mag() - 5 < 1e-5)).toBe(true);

    const enter = polygon.breakAt({
      index: Math.floor(Math.random() * N/2),
      pos:Math.random()*0.5 + 0.25
    })

    const exit = polygon.breakAt({
      index: Math.floor(Math.random() * N/2 + N/2 + 1),
      pos:Math.random()*0.5 + 0.25
    })

    const M = 3;
    const cutter = Vecs.fromVecs([new Vec(-2, 1), new Vec(2, 1)])
      .stepwise(M)
      .growEnds({head: enter, tail: exit});

    const [orig, curr] = polygon.split(cutter);

    expect(orig.diff().some(([head, tail]) => head === tail)).toBe(true);
    expect(curr.diff().some(([head, tail]) => head === tail)).toBe(true);
    
    for (let i = 1; i < orig.length - 1; i++) {
      for (let j = 0; j < i; j++) {
        const a = Vecs.from([orig[i], orig[i+1]]);
        const b = Vecs.from([orig[j], orig[j+1]]);
        const res = a.intersect(b);
        expect(res.length).toBe(0);
      }
    }

    for (let i = 1; i < curr.length - 1; i++) {
      for (let j = 0; j < i; j++) {
        const a = Vecs.from([orig[i], orig[i+1]]);
        const b = Vecs.from([orig[j], orig[j+1]]);
        const res = a.intersect(b);
        expect(res.length).toBe(0);
      }
    }
  })
})
