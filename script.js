import { readDom } from './helpers/readDom.js'
import { Granulometria, Malla } from './models/granulometria.js'
//leer datos de dom
let $table = document.getElementById('table')
let $body = $table.lastElementChild
console.log($table)

let total = 0
// console.log(body)
// console.log(body.rows.length)

let $perdidaFalse = document.getElementById('perdidaFalse')
let $perdidaTrue = document.getElementById('perdidaTrue')
let $onoff = document.querySelectorAll('.onoff')

$perdidaFalse.addEventListener('change', function () {
  if (this.checked) {
    $perdidaTrue.checked = false
    //cuando no haya perdida, ocultamos los inputs
    for (let i = 0; i < $onoff.length; i++) {
      $onoff[i].classList.add('hidden')
    }
  } else {
    $perdidaTrue.checked = true
    //cuando si haya perdida de material, mostramos los inputs
    for (let i = 0; i < $onoff.length; i++) {
      $onoff[i].classList.remove('hidden')
    }
  }
})
$perdidaTrue.addEventListener('change', function () {
  if (this.checked) {
    $perdidaFalse.checked = false
    //cuando si haya perdida de material, mostramos los inputs
    for (let i = 0; i < $onoff.length; i++) {
      $onoff[i].classList.remove('hidden')
    }
  } else {
    $perdidaFalse.checked = true
    //cuando no haya perdida, ocultamos los inputs
    for (let i = 0; i < $onoff.length; i++) {
      $onoff[i].classList.add('hidden')
    }
  }
})

// aca se debe crear un metodo para agregar filas por encima o por debajo.
let index

$table.addEventListener('mouseover', function () {
  for (let i = 1; i < $table.rows.length; i++) {
    $table.rows[i].cells[1].onclick = function deleteRow() {
      index = this.parentElement.rowIndex
      $table.deleteRow(index)
      console.log(index)
    }
    $table.rows[i].cells[0].onclick = function addRow() {
      index = this.parentElement.rowIndex
      let row = $table.insertRow(index)
      let cell0 = row.insertCell(0)
      let cell1 = row.insertCell(1)
      let cell2 = row.insertCell(2)
      let cell3 = row.insertCell(3)
      let cell4 = row.insertCell(4)
      let cell5 = row.insertCell(5)
      let cell6 = row.insertCell(6)
      cell0.innerHTML = '<td><button class="add">&nbsp + &nbsp</button></td>'
      cell1.innerHTML = '<td><button class="remove">&nbsp - &nbsp</button></td>'
      cell2.innerHTML = '<td><input type="text" value="" /></td>'
      cell3.innerHTML = '<td><input type="number" value="" /></td>'
      cell4.innerHTML = '<td><input type="number" /></td>'
      cell5.innerHTML = '<td>0</td>'
      cell6.innerHTML = '<td>0</td>'
    }
  }
  $table.rows[1].cells[4].firstElementChild.value = 0
})

//aca se crea la funcionalidad para ir aumentando el peso total a medida de que se aumentan los pesos en las tablas

let $calcular = document.getElementById('calcular')

$calcular.addEventListener('click', calcular)
let gr
let $pesoTotal = document.getElementById('pesoTotal')
let $pesoTotalCorregido = document.getElementById('pesoTotalCorregido')

let $d10 = document.getElementById('d10')
let $d30 = document.getElementById('d30')
let $d60 = document.getElementById('d60')

let $cu = document.getElementById('cu')
let $cc = document.getElementById('cc')

function calcular() {
  let dataTable = readDom($body)
  let $pesoInicial = document.getElementById('pesoInicial').value
  // console.log($pesoInicial)
  // console.log(dataTable)
  if ($perdidaTrue) {
    gr = new Granulometria($pesoInicial)
  } else {
    gr = new Granulometria()
  }
  for (let malla of dataTable) {
    gr.agregarMalla(malla.c0, malla.c1, Number(malla.c2))
  }
  gr.correccion()
  gr.retenidos()
  gr.retenidosAcumulados()
  gr.pasantes()
  gr.deciles()
  gr.coeficientes()
  $pesoTotal.innerText = gr.pesoMallas
  $pesoTotalCorregido.innerText = gr.pesoCorregido
  // console.log($pesoTotal)
  // console.table(gr.mallas)

  for (let i = 0; i < $body.rows.length - 1; i++) {
    $body.rows.item(i).cells.item(5).innerText = r3(gr.mallas[i].pesoCorregido)
    $body.rows.item(i).cells.item(6).innerText = r3(gr.mallas[i].retenido)
    $body.rows.item(i).cells.item(7).innerText = r3(
      gr.mallas[i].retenidoAcumulado
    )
    $body.rows.item(i).cells.item(8).innerText = r3(gr.mallas[i].pasante)
    // console.log(($body.rows.item(i).cells.item(5).innerText = 'asdf'))
  }
  console.log(gr)
  $d10.innerText = r3(gr.d10)
  $d30.innerText = r3(gr.d30)
  $d60.innerText = r3(gr.d30)

  $cc.innerText = r3(gr.cc)
  $cu.innerText = r3(gr.cu)
}

function r3(n) {
  return Math.round(n * 1000) / 1000
}