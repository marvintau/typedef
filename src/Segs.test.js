import Segs from './Segs';
import Seg from './Seg';
import Vec from './Vec';
import List from './List';

function createRegularPolygon(edges, radius) {
  const vecList = List.from([...Array(edges)].map((_, i) => new Vec({ang:i/edges*360, len:radius})));
  return Segs.fromVecs(vecList, {closed: true});
}

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

describe('cutting', () => {

  const polygon = createRegularPolygon(4, 10);

  const point = new Vec(45);
  const point1 = point.copy();
  point1.mult(2);
  const point2 = point.copy();
  point2.mult(3);
  const points = [point1, point2];

  let initialSegmentIndex = 0;
  let cutThroughIndex = 3;
  let cutEnterIndex, cutGoingEnd;
  test('cut enter', () => {
  
    const {head: origHead, tail: origTail} = polygon[0];

    const {indexGoing} = polygon.cutEnter({index: initialSegmentIndex, point: new Vec(45)});
    cutEnterIndex = indexGoing;

    const {head} = polygon[0];
    const {tail} = polygon[1];

    expect(head).toBe(origHead);
    expect(tail).toBe(origTail);
    expect(cutEnterIndex).toBe(initialSegmentIndex);

    cutThroughIndex += 1;
  })

  test('cut going', () => {
    const {indexGoing} = polygon.cutGoing({index: cutEnterIndex, points});
    // cutGoingIndex2 = index2;

    const vecs0 = polygon.slice(cutEnterIndex+1, cutEnterIndex + 1 + points.length).toVecs();
    const vecs1 = polygon.slice(indexGoing + 1, indexGoing + 1 + points.length).toVecs().reverse();

    expect(vecs0).toEqual(vecs1);
    expect(indexGoing).toBe(cutEnterIndex + points.length);
    cutGoingEnd = indexGoing;
    cutThroughIndex += points.length * 2;
  })

  test('cut through', () => {
    
    const {left, right} = polygon.cutThrough(cutThroughIndex);
    console.log(polygon.toString());

    console.log(left.toVecs().map(v => v.toString()).join('\n'), 'left');
    console.log(right.toVecs().map(v => v.toString()).join('\n'), 'right');

    const decomEnds = (segs) => {
      const heads = segs.map(({head}) => head);
      const tails = segs.map(({tail}) => tail);
      tails.unshift(tails.pop());
      return {heads, tails};
    }

    const {heads:leftHeads, tails: leftTails} = decomEnds(left);
    const {heads:rightHeads, tails: rightTails} = decomEnds(right);

    expect(leftHeads).toEqual(leftTails);
    expect(rightHeads).toEqual(rightTails);
  })

  test ('cut', () => {
    const polygon = createRegularPolygon(4, 4);
    const vecs = List.from([new Vec(6, 2.5), new Vec(2, 2.5), new Vec(-2, 2.5), new Vec(-6, 2.5)]);
    const segs = Segs.fromVecs(vecs);

    // const res = segs.cut(polygon);
    console.log(polygon, 'cut')
  })
})