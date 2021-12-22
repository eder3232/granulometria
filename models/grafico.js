//devuelve un array con los datos necesarios para el grafico( el datasets requerido por chartjs)
export function crearDatosGrafico(granulometria) {
  let response = []
  let inMallas = granulometria.mallas
  let outCoordenadas = []
  for (let i = 0; i < inMallas.length; i++) {
    outCoordenadas.push({ x: inMallas[i].abertura, y: inMallas[i].pasante })
  }
  let colores = [
    '#D98880',
    '#C39BD3',
    '#7FB3D5',
    '#76D7C4',
    '#7DCEA0',
    '#F7DC6F',
    '#F0B27A',
    '#D98880',
    '#C39BD3',
    '#7FB3D5',
    '#76D7C4',
    '#7DCEA0',
    '#F7DC6F',
    '#F0B27A',
  ]

  //agregamos la lista de coordenadas a la respuesta
  response.push({
    label: 'Curva granulometria',
    borderColor: '#F8F9F9',
    data: outCoordenadas,
    showLine: true,
    fill: false,
    borderColor: 'rgba(0,200,0,1)',
    tension: 0.3,
  })
  // agregamos la lista de mallas( lineas verticales)
  for (let i = 0; i < inMallas.length - 1; i++) {
    response.push({
      label: inMallas[i].tamiz,
      borderColor: colores[i],
      borderWidth: 2,
      data: [
        { x: inMallas[i].abertura, y: 0 },
        { x: inMallas[i].abertura, y: 100 },
      ],
      showLine: true,
      fill: false,
    })
  }
  return response
}
