export class Granulometria {
  constructor(pesoCorregido = null) {
    this.cc = null
    this.cu = null
    this.d10 = null
    this.d30 = null
    this.d60 = null
    this.mallas = []
    this.pesoMallas = 0
    this.pesoCorregido = pesoCorregido
  }
  agregarMalla(tamiz = '', abertura = 0, pesoRetenido = 0) {
    let newMalla = new Malla(tamiz, abertura, pesoRetenido)
    this.pesoMallas += newMalla.pesoRetenido
    this.mallas.push(newMalla)
  }
  correccion() {
    if (!this.pesoCorregido) {
      this.pesoCorregido = this.pesoMallas
    }
    let eder = 0
    for (let i = 0; i < this.mallas.length; i++) {
      this.mallas[i].pesoCorregido =
        (this.mallas[i].pesoRetenido * this.pesoCorregido) / this.pesoMallas
    }
    return true
  }
  retenidos() {
    // se calculan retenidos parciales
    for (let i = 0; i < this.mallas.length; i++) {
      this.mallas[i].retenido =
        (this.mallas[i].pesoCorregido / this.pesoCorregido) * 100
    }
  }
  retenidosAcumulados() {
    this.mallas[0].retenidoAcumulado = this.mallas[0].retenido
    for (let i = 1; i < this.mallas.length; i++) {
      this.mallas[i].retenidoAcumulado =
        this.mallas[i - 1].retenidoAcumulado + this.mallas[i].retenido
    }
  }
  pasantes() {
    for (let i = 0; i < this.mallas.length; i++) {
      this.mallas[i].pasante = 100 - this.mallas[i].retenidoAcumulado
    }
  }
  decil(d) {
    let pasanteSuperior = 0
    let pasanteInferior = 0
    let aberturaSuperior = 0
    let aberturaInferior = 0
    let decil = d
    for (let i = 0; i < this.mallas.length; i++) {
      if (this.mallas[i].pasante < decil) {
        pasanteSuperior = this.mallas[i - 1].pasante
        pasanteInferior = this.mallas[i].pasante
        aberturaSuperior = this.mallas[i - 1].abertura
        aberturaInferior = this.mallas[i].abertura
        break
      }
    }
    let apertura = interp(
      pasanteInferior,
      pasanteSuperior,
      aberturaInferior,
      aberturaSuperior,
      decil
    )
    return apertura
  }
  deciles() {
    this.d10 = this.decil(10)
    this.d30 = this.decil(30)
    this.d60 = this.decil(60)
    return { d10: this.d10, d30: this.d30, d60: this.d60 }
  }
  coeficientes() {
    this.cu = this.d60 / this.d10
    this.cc = this.d30 ** 2 / (this.d10 * this.d60)
    return { cu: this.cu, cc: this.cc }
  }
}
export class Malla {
  constructor(tamiz = '', abertura = 0, pesoRetenido = 0) {
    this.tamiz = tamiz
    this.abertura = abertura
    this.pesoRetenido = pesoRetenido
    this.pesoCorregido = null
    this.retenido = 0
    this.retenidoAcumulado = 0
    this.pasante = 0
  }
}

// let gr = new Granulometria(650)

// gr.agregarMalla(1, 9.53, 0)
// gr.agregarMalla(4, 4.75, 53)
// gr.agregarMalla(10, 2, 76)
// gr.agregarMalla(20, 0.85, 73)
// gr.agregarMalla(40, 0.425, 142)
// gr.agregarMalla(100, 0.15, 85)
// gr.agregarMalla(200, 0.075, 120)
// gr.agregarMalla('fondo', 0, 90)
// console.log(gr.correccion())
// gr.retenidos()
// gr.retenidosAcumulados()
// gr.pasantes()
// console.log(gr.deciles())
// console.log(gr.coeficientes())
// console.table(gr.mallas)

// inputear
// corregir
// calcular %retenidos, %retenidos %retenidosAcumulados %pasantes
// calcular deciles
// calcular coeficientes cu cc

// determinar %arena,grava y finos.
function interp(xi, xj, yi, yj, x) {
  let y = yi + ((x - xi) * (yj - yi)) / (xj - xi)
  return y
}
