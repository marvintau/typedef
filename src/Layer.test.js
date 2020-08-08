import Layer from './Layer';
import List from './List';
import Vec from './Vec';
import Vecs from './Vecs';

describe('create leayer', () => {

  let polygon;
  beforeEach(() => {
    const pointSet = [
      new Vec(3, 3),
      new Vec(-3, 3),
      new Vec(-3, -3),
      new Vec(3, -3),
    ];
  
    polygon = Vecs.fromVecs(pointSet, {closed: true});
  })

  test('create layer', () => {
    const layer = new Layer(polygon);

    const cutters = [
      {head: {index: 0, pos: 1/3}, tail: {index: 2, pos: 2/3}, vecs:Vecs.fromVecs(new List(new Vec(1, 2), new Vec(1, -2)))},
      {head: {index: 0, pos: 2/3}, tail: {index: 2, pos: 1/3}, vecs:Vecs.fromVecs(new List(new Vec(-1, 2), new Vec(-1, -2)))},
      {head: {index: 1, pos: 1/3}, tail: {index: 3, pos: 2/3}, vecs:Vecs.fromVecs(new List(new Vec(-2, 1), new Vec(2, 1)))},
      {head: {index: 1, pos: 2/3}, tail: {index: 3, pos: 1/3}, vecs:Vecs.fromVecs(new List(new Vec(-2, -1), new Vec(2, -1)))},
    ]
  
    layer.addCut(cutters);
    const {polys, cutsMap} = layer.updateCut();

    expect(polys.length).toBe(9);
    expect(cutsMap.size).toBe(0);

    for (let poly of polys)
    for (let i = 1; i < poly.length - 1; i++) {
      for (let j = 0; j < i; j++) {
        const a = Vecs.from([poly[i], poly[i+1]]);
        const b = Vecs.from([poly[j], poly[j+1]]);
        const res = a.intersect(b);
        expect(res.length).toBe(0);
      }
    }

  })

  test('create layer', () => {
    const layer = new Layer(polygon);

    const cutters = [
      {head: {index: 0, pos: 1/3}, tail: {index: 1, pos: 2/3}, vecs:Vecs.fromVecs([new Vec(2, -2)])},
      {head: {index: 2, pos: 1/3}, tail: {index: 3, pos: 2/3}, vecs:Vecs.fromVecs([new Vec(-2, 2)])},
    ]
  
    layer.addCut(cutters);
    const {polys, cutsMap} = layer.updateCut();

    expect(polys.length).toBe(5);
    expect(cutsMap.size).toBe(0);

    for (let poly of polys)
    for (let i = 1; i < poly.length - 1; i++) {
      for (let j = 0; j < i; j++) {
        const a = Vecs.from([poly[i], poly[i+1]]);
        const b = Vecs.from([poly[j], poly[j+1]]);
        const res = a.intersect(b);
        expect(res.length).toBe(0);
      }
    }

  })

})