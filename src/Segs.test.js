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

describe('intersect', () => {
  const segsX = Segs.fromVecs(new List(...[...Array(4)].map((n, i) => new Vec(i, 1.5))));
  const segsY = Segs.fromVecs(new List(...[...Array(4)].map((n, i) => new Vec(1.5, i))));

  test('ortho intersect', () => {
    segsX.intersect(segsY);

    expect(segsX.length).toBe(4)
    expect(segsY.length).toBe(4);
    expect(segsX[1].tail).toBe(segsY[1].tail);
    expect(segsX[1].tail.x).toBeCloseTo(1.5);
  })

  test('transformed intersect', () => {
    segsX.rotate(45, new Vec(1.5, 1.4));

    segsX.intersect(segsY);

    console.log(segsX);

    // expect(segsX.length).toBe(4)
    // expect(segsY.length).toBe(4);
    // expect(segsX[1].tail).toBe(segsY[1].tail);
    // expect(segsX[1].tail.x).toBeCloseTo(1.5);

  })
})

describe('cut', () => {

  const N = 10;

  const poly = Segs.fromVecs(new List(...[...Array(N)].map((n, i) => new Vec(i*360/N))), {closed:true});

  const points = [...Array(Math.floor(Math.random() * 5 + 5))].map(() => new Vec(Math.random(), Math.random()));

  let cutTip = Math.floor(Math.random() * N);
  let cutExit = Math.floor(Math.random() * N + 1) % N;
  let enterRes = {cutTip, cutExit};

  let leftSep, rightSep;
  let leftAll, rightAll;

  test('cut entering', () => {

    console.log(enterRes);
    const {cutTip: prevCutTip} = enterRes;

    const {head, tail} = poly[cutTip];
    
    const point = head.lerp(0.5, tail);
    enterRes.point = point;
    enterRes = poly.cutEnter(enterRes);

    expect(enterRes.cutTip).toBe(prevCutTip);
    expect(enterRes.point).toBe(point);

    expect(poly[cutTip].tail).toBe(point);
    expect(poly[cutTip+1].head).toBe(point);

    for (let i = 0; i < poly.length - 1; i++) {
      expect(poly[i].tail).toBe(poly[i+1].head)
    }

    // console.log(poly);

  })

  test('cut going', () => {
    
    for(let i = 0; i < points.length; i ++) {
      const {cutTip:prevTip} = enterRes;
      enterRes = poly.cutGoing({...enterRes, point: points[i]});

      expect(enterRes).toHaveProperty('cutTip', prevTip + 1);
      expect(enterRes).toHaveProperty('point', points[i]);
    }  

    for (let i = 0; i < poly.length - 1; i++) {
      expect(poly[i].tail).toBe(poly[i+1].head)
    }  

    // console.log(poly);

  })

  test('cutting through', () => {
    const {left, right} = poly.cutThrough(enterRes);
    
    for (let i = 0; i < left.length; i++) {
      expect(left[i].tail).toBe(left[(i+1) % left.length].head)
    }

    for (let i = 0; i < right.length; i++) {
      expect(right[i].tail).toBe(right[(i+1)% right.length].head);
    }

    leftSep = left;
    rightSep = right;
  })

  test('cut all-in-one', () => {

    const {left:leftAll, right: rightAll} = poly.cut({points, start:{index: cutTip}, end: {index: cutExit}});

    console.log(leftSep.length, leftAll.length);
    console.log(rightSep.length, rightAll.length);

  })
})