import List from "./List";

function getPolyPoint(poly, {index, pos}) {
  const [head, tail] = poly.slice(index, index+2);
  const lerp = head.lerp(pos, tail);

  return {head, pos, lerp};
}

export default class Layer {
  constructor(poly) {
    this.poly = poly;
    this.cuts = new List();
    this.subs = {};
  }

  addCut(cut) {
    if (Array.isArray(cut)) {
      this.cuts.push(...cut);
    } else {
      this.cuts.push(cut);
    }
  }

  updateCut({isLogging} = {}) {

    // the reason of not using Segs.copy():
    // it will also copy the points, not desirable.
    let polyCopy = this.poly.slice();

    // 1. 首先处理好所有cutter连接在poly上的点，这些intersection应当保存
    //    在polyCopy中，避免影响到this.poly。对于所有的cuts也建立一份copy
    //    使得在后续计算cuts之间的intersection时不会影响到原始的this.cuts。
    let cutsEntries = this.cuts
    .map(({vecs, head, tail}) => {

      const headEntry = getPolyPoint(polyCopy, head);
      const tailEntry = getPolyPoint(polyCopy, tail);

      const newVecs = vecs.slice().growEnds({head: headEntry.lerp, tail: tailEntry.lerp});

      return {
        vecs: newVecs,
        head: headEntry,
        tail: tailEntry
      }
    });

    // 2. 得到polyCopy每一条边都有哪几条cutter的端点与之对应，并一次性更新
    //    polyCopy。我们不能够逐个对cutter进行计算的原因是，每次cutter计算
    //    之后都会对polyCopy造成影响，从而影响下一次cutter的计算。
    let splitEdges = cutsEntries.map(({head, tail}) => [head, tail]).flat()  //get getPolyPoint entry
    let splitMap = new Map();
    for (let {head, pos, lerp} of splitEdges) {
      if (!splitMap.has(head)) {
        splitMap.set(head, []);
      }
      splitMap.get(head).push({pos, lerp});
    }

    for (let intersects of splitMap.values()) {
      intersects.sort(({pos: posA}, {pos: posB}) => posA - posB);
    }

    polyCopy = polyCopy.map((head, i, a) => {
      return splitMap.has(head) && (i < a.length - 1)
      ? [head, splitMap.get(head).map(({lerp}) => lerp)]
      : head
    }).flat(Infinity)

    const cutsMap = cutsEntries
      .map(({vecs}) => vecs)
      .cart(([prev, succ]) => {
        prev.intersect(succ);
      }, {nonSelf: true})
      .map(vecs => [vecs[0], vecs])
      .toMap();

    // 3. 对于每一个polygon，应用当前所有的cutsMap，直到没有任何polygon中包含与
    //    cutsMap共享的vertex，或者没有任何遗留的cutsMap。这两个标准是等价的，
    //    需要注意，当cuts切割polygon时，polyCopy和cutsMap都会变化，因此无论选择
    //    测试polyCopy还是cutsMap，都不影响复杂性。
    const polys = [polyCopy];
    while(cutsMap.size > 0) {
      isLogging && console.log(polys, 'polys')
      isLogging && console.log(cutsMap, 'cutsmap')
      doneCut: for (let i = 0; i < polys.length; i++) for (let [head, vecs] of cutsMap) if (polys[i].includes(head)){
        const [orig, curr] = polys[i].split(vecs);
        polys.splice(i, 1, orig, curr);

        cutsMap.delete(head);

        for (let vec of vecs) {
          doneUpdateCuts: for (let remVecs of cutsMap.values()){
            const remIndex = remVecs.indexOf(vec);

            if (remIndex > 0 && remIndex < remVecs.length - 1) {  
              const index = remVecs.indexOf(vec);
              const rest = remVecs.splice(index);
              remVecs.push(rest[0]);
              cutsMap.set(rest[0], rest);
              break doneUpdateCuts;
            }
          }
        }

        break doneCut;
      }
    }
    
    return {polys, cutsMap};
  }  
}