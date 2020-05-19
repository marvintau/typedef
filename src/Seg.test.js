const Seg = require('./Seg');
const Vec = require('./Vec');

test('create', () => {
  const seg = new Seg(new Vec(), new Vec(1, 1));
  const {head, tail} = seg;
  expect(head !== undefined).toBe(true);
  expect(tail !== undefined).toBe(true);
})

describe('utility', () => {
  test('diff', () => {
    const seg = new Seg(new Vec(), new Vec(1, 1));
    const diff = seg.diff();
    expect(diff.x).toBe(1);
    expect(diff.y).toBe(1);
  })

  test('lerp', () => {
    const seg = new Seg(new Vec(), new Vec(4, 8));
    const {x, y} = seg.lerp(0.75);
    expect(x).toBe(3);
    expect(y).toBe(6);
  })

  test('len', () => {
    const seg = new Seg(new Vec(), new Vec(4, 8));
    const len = seg.len();
    expect(len).toBe(Math.sqrt(5)*4);
  })

  test('cross', () => {
    const seg = new Seg(new Vec(), new Vec(4, 8));
    const {head, tail} = seg;
    expect(seg.cross()).toEqual(tail.cross(head));
  })

  test('copy', () => {
    const seg = new Seg(new Vec(), new Vec(4, 8));
    const cop = seg.copy();
    expect(seg.tail).toEqual(cop.tail);
    expect(seg.tail).not.toBe(cop.tail);
  })

  test('torque', () => {
    const seg = new Seg(new Vec(), new Vec(4, 8));
    const {center:{x, y}, mass} = seg.torque();
    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(4);
    expect(mass).toBeCloseTo(Math.sqrt(5)*4)
  })

  describe('intersect', () => {
    const seg1 = new Seg(new Vec(0, 2), new Vec(4, 2));
    const seg2 = new Seg(new Vec(2, 0), new Vec(2, 4));

    test('orthogonal', () => {
      const copy1 = seg1.copy();
      const copy2 = seg2.copy();
      const {ratioA, ratioB, point:{x, y}, det} = copy1.intersect(copy2);
      expect(ratioA).toBe(0.5);
      expect(ratioB).toBe(0.5);
      expect(x).toBe(2);
      expect(y).toBe(2);
    })

    test('normal', () => {
      const copy1 = seg1.copy();
      const copy2 = seg2.copy();
      copy1.rotate(45, new Vec(2, 2));
      copy1.rotate(103, new Vec(2, 2));
      const {ratioA, ratioB, point:{x, y}, det} = copy1.intersect(copy2);
      expect(ratioA).toBe(0.5);
      expect(ratioB).toBe(0.5);
      expect(x).toBe(2);
      expect(y).toBe(2);
    })

    test('edge', () => {
      const copy1 = seg1.copy();
      const copy2 = seg2.copy();
      copy1.trans({x:0, y:-2});
      const {ratioA, ratioB, point:{x, y}, det} = copy1.intersect(copy2);
      expect(ratioA).toBe(0.5);
      expect(ratioB === 0).toBe(true);
      expect(x).toBe(2);
      expect(y).toBe(0);   
    })

    describe('ends', () => {
      const copy1 = seg1.copy();
      const copy2 = seg2.copy();

      test ('head', () => {
        copy1.trans({x:0, y:-2});
        copy2.trans({x:-2, y:0});
        copy1.rotate(35, new Vec(2, 2));
        copy2.rotate(35, new Vec(2, 2));
        const {ratioA, ratioB, point:{x, y}, det} = copy1.intersect(copy2);
        expect(ratioA === 0).toBe(true);
        expect(ratioB === 0).toBe(true);
      })

      test('tail', () => {
        copy1.flip();
        copy2.flip();
        const {ratioA, ratioB, point:{x, y}, det} = copy1.intersect(copy2);
        console.log(ratioA, ratioB)
        expect(ratioA).toBeCloseTo(1);
        expect(ratioB).toBeCloseTo(1);
      })

    })
  })
})

describe('transforms', ()=>{
  test('translate', () => {
    const seg = new Seg(new Vec(), new Vec(1, 1));
    seg.trans({x: 1, y: 1});

    const {head, tail} = seg;

    expect(seg.diff()).toEqual(tail.diff(head));
    expect(seg.head.x).toBe(1);
    expect(seg.tail.x).toBe(2);
    expect(seg.head.y).toBe(1);
    expect(seg.tail.y).toBe(2);
  })

  test('rotate', () => {
    const seg = new Seg(new Vec(1, 1), new Vec(1, -1));
    seg.rotate(90);
    expect(seg.head.x).toBe(-1);
    expect(seg.head.y).toBe(1);
    expect(seg.tail.x).toBe(1);
    expect(seg.tail.y).toBe(1);
    
    seg.rotate(30, new Vec(0, 1));
    expect(seg.tail.y).toBeCloseTo(1.5);
    expect(seg.head.y).toBeCloseTo(0.5);
  })

  test('scale', () => {
    const seg = new Seg(new Vec(), new Vec(2, 0));
    seg.scale(2);
    expect(seg.head.x).toBe(0);
    expect(seg.tail.x).toBe(4);

    seg.scale(2);
    expect(seg.tail.x).toBe(8);
  })

  test('flip', () => {
    const seg = new Seg(new Vec(), new Vec(2, 0));
    const {head, tail} =seg;
    seg.flip();
    expect(seg.head).toBe(tail);
    expect(seg.tail).toBe(head);
  })
})