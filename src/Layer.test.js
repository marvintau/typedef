import Layer from './Layer';
import List from './List';
import Vec from './Vec';
import Vecs from './Vecs';

describe('create leayer', () => {

  const pointSet = new List(
    new Vec(3, 3),
    new Vec(-3, 3),
    new Vec(-3, -3),
    new Vec(3, -3),
  )

  const polygon = Vecs.fromVecs(pointSet, {closed: true});

  const cutters = [
    {head: {index: 0, pos: 1/3}, tail: {index: 2, pos: 2/3}, vecs:Vecs.fromVecs(new List(new Vec(1, 2), new Vec(1, -2)))},
    {head: {index: 0, pos: 2/3}, tail: {index: 2, pos: 1/3}, vecs:Vecs.fromVecs(new List(new Vec(-1, 2), new Vec(-1, -2)))},
    {head: {index: 1, pos: 1/3}, tail: {index: 3, pos: 2/3}, vecs:Vecs.fromVecs(new List(new Vec(-2, 1), new Vec(2, 1)))},
    {head: {index: 1, pos: 2/3}, tail: {index: 3, pos: 1/3}, vecs:Vecs.fromVecs(new List(new Vec(-2, -1), new Vec(2, -1)))},
  ]

  test('create layer', () => {
    const layer = new Layer(polygon);
    layer.addCut(cutters);
    const {polyCopy, cutsMap} = layer.updateCut();
    expect(polyCopy.length).toBe(13);
    expect(polyCopy[0]).toBe(polyCopy.last());
    expect(polyCopy.diff().map(([head, tail]) => head.diff(tail).mag()).every(e => e===2)).toBe(true);

    for (let val of cutsMap.values()) {
      expect(val.length).toBe(6)
    }
  })
})