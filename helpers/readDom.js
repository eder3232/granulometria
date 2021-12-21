export function readDom(body) {
  let arr = []
  let rows = body.rows.length
  for (let i = 0; i < rows - 1; i++) {
    let obj = {}
    let c0 = body.rows.item(i).cells.item(2).firstElementChild.value
    let c1 = Number(body.rows.item(i).cells.item(3).firstElementChild.value)
    let c2 = Number(body.rows.item(i).cells.item(4).firstElementChild.value)
    obj = { c0, c1, c2 }
    arr.push(obj)
  }
  return arr
}
