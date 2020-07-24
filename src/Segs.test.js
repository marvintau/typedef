import Seg from './Seg';
import Vec from './Vec';
import Segs from './Segs';
import List from './List';

describe('create', () => {
  test('normal', () => {
    const seg1 = new Seg(new Vec(), new Vec(60));
    const seg2 = new Seg(new Vec(), new Vec(120));
    const segs = new Segs(seg1, seg2);
    expect(segs.length).toBe(2);
  })

  test('fromVec', () => {
    const vecList = List.from([...Array(10)].map((_, i) => new Vec(10 * i)));
    const segs1 = Segs.fromVecs(vecList);
    expect(segs1.length).toBe(9);
    const segs2 = Segs.fromVecs(vecList, {closed: true});
    expect(segs2.length).toBe(10);
    expect(segs2.last().tail).toBe(segs2[0].head);
  })

})

describe('transform', () => {
  const segs = Segs.fromVecs(new List(new Vec(), new Vec(1, 1), new Vec(2, 2)));

  test('translate', () => {
    segs.trans(new Vec(1, 1));
    expect(segs[0].head.x).toBeCloseTo(1);
    expect(segs[0].head.y).toBeCloseTo(1);
    expect(segs[1].head.x).toBeCloseTo(2);
    expect(segs[1].head.y).toBeCloseTo(2);
    expect(segs[1].tail.x).toBeCloseTo(3);
    expect(segs[1].tail.y).toBeCloseTo(3);
  })

  test('rotate', () => {
    const {SQRT2, SQRT1_2} = Math;
    segs.rotate(45);
    segs.rotate(90, new Vec(0, 2*SQRT2));
    expect(segs[0].head.x).toBeCloseTo(  SQRT2);
    expect(segs[0].head.y).toBeCloseTo(2*SQRT2);
    expect(segs[1].head.x).toBeCloseTo(0);
    expect(segs[1].head.y).toBeCloseTo(2*SQRT2);
    expect(segs[1].tail.x).toBeCloseTo( -SQRT2);
    expect(segs[1].tail.y).toBeCloseTo(2*SQRT2);
  })

  test('scale', () => {
    const {SQRT1_2} = Math;

    segs.scale(SQRT1_2, new Vec());
    expect(segs[0].head.x).toBeCloseTo(  1);
    expect(segs[0].head.y).toBeCloseTo(2*1);
    expect(segs[1].head.x).toBeCloseTo(0);
    expect(segs[1].head.y).toBeCloseTo(2*1);
    expect(segs[1].tail.x).toBeCloseTo( -1);
    expect(segs[1].tail.y).toBeCloseTo(2*1);
  })

  test('flip', () => {
  
    segs.flip();
    expect(segs[0].head.x).toBeCloseTo( -1);
    expect(segs[0].head.y).toBeCloseTo(2*1);
    expect(segs[1].head.x).toBeCloseTo(0);
    expect(segs[1].head.y).toBeCloseTo(2*1);
    expect(segs[1].tail.x).toBeCloseTo(  1);
    expect(segs[1].tail.y).toBeCloseTo(2*1);
  })

  describe('area & centroid', () => {
    const {random, ceil, sin, cos, PI} = Math;
    const edges = ceil(random()*10)+3;
    const ang_2 = PI/edges;
    const vecs = new List(...Array(edges)).map((_, i) => {
      return new Vec(360 * i / edges);
    })

    test('area', () => {

      const segs1 = Segs.fromVecs(vecs);
      expect(() => segs1.area()).toThrow();
  
      const segs2 = Segs.fromVecs(vecs, {closed:true});
      expect(segs2.area()).toBeCloseTo(sin(ang_2)*cos(ang_2)*edges);
    })
  
    test('centroid', () => {
      const segs = Segs.fromVecs(vecs, {closed:true});
      segs.trans(new Vec(2, 3));
      const {x, y} = segs.centroid();
      expect(x).toBeCloseTo(2);
      expect(y).toBeCloseTo(3);
    })  
  })
})

describe('cut', () => {

  const N = 10;

  const poly = Segs.fromVecs(new List(...[...Array(N)].map((n, i) => new Vec(i*360/N))), {closed:true});
  let enterIndex = Math.floor(Math.random() * N);
  let exitIndex = Math.floor(Math.random() * N + 1) % N;

  console.log(enterIndex, exitIndex, 'enter & exit');

  test('cut entering', () => {

    const {head, tail} = poly[enterIndex];
    
    const point = head.lerp(0.5, tail);
    const insertion = {index:enterIndex, point};
    const result = poly.cutEnter(insertion);

    expect(poly.length).toBe(N + 1);
    expect(result).toEqual(insertion);
    expect(poly[enterIndex].tail).toBe(point);
    expect(poly[enterIndex+1].head).toBe(point);

    for (let i = 0; i < poly.length - 1; i++) {
      expect(poly[i].tail).toBe(poly[i+1].head)
    }  
  })

  test('cut going', () => {
    const goingIndex = enterIndex + 1;
    
    for(let i = 0, insertion = {index: goingIndex, point: new Vec()}; i < Math.random()*10 + 5; i ++) {
      const {index:prevIndex} = insertion;
      const point = new Vec(Math.random(), Math.random());
      insertion = poly.cutGoing({...insertion, point});

      expect(insertion).toHaveProperty('index', prevIndex + 1);
      expect(insertion).toHaveProperty('point', point);
    }  

    for (let i = 0; i < poly.length - 1; i++) {
      expect(poly[i].tail).toBe(poly[i+1].head)
    }  
  })

  test('cutting through', () => {
    const {left, right} = poly.cutThrough(enterIndex, exitIndex, new Vec(Math.random(), Math.random()));
    
    console.log(left);

    for (let i = 0; i < left.length; i++) {
      expect(left[i].tail).toBe(left[(i+1)%left.length].head)
    }

    for (let i = 0; i < right.length; i++) {
      expect(right[i].tail).toBe(right[(i+1)%left.length].head);
    }
  })
})