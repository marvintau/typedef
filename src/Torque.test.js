import Torque from './Torque';
import Vec from './Vec';

describe('create', () => {
  test('normal',() => {
    const {center:{x, y}, mass} = new Torque({center: new Vec(1, 1), mass: 5});
    expect(mass).toBe(5);
    expect(x).toBe(1);
    expect(y).toBe(1);

    const t1 = new Torque({mass:5});
    expect(t1.center.x).toBe(0);
    expect(t1.center.y).toBe(0);
    expect(t1.mass).toBeCloseTo(5);

    const t2 = new Torque({center:new Vec(1,1)});
    expect(t2.center.x).toBe(1);
    expect(t2.center.y).toBe(1);
    expect(t2.mass).toBeCloseTo(0);

    const t3 = new Torque();
    expect(t3.center.x).toBe(0);
    expect(t3.center.y).toBe(0);
    expect(t3.mass).toBeCloseTo(0);
  })

  test('fromVec', () => {
    const {center:{x, y}, mass} = Torque.fromVec(new Vec(1, 1));
    expect(x).toBe(0.5);
    expect(y).toBe(0.5);
    expect(mass).toBe(Math.SQRT2);
  })

  test('sum', () => {
    const vecs = [new Vec(45), new Vec(135)];

    const {center:{x, y}, mass} = Torque.sum(vecs.map(vec => Torque.fromVec(vec)));
    expect(mass).toBe(2);
    expect(y).toBeCloseTo(Math.SQRT1_2/2)
    expect(x).toBeCloseTo(0)
    
    const emp = Torque.sum([]);
    expect(emp.mass).toBe(0);
    expect(emp.center.x).toBeCloseTo(0);
    expect(emp.center.y).toBeCloseTo(0);

  })
})