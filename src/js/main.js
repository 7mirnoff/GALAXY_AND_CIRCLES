import './modules/polyfill'
import SimplexNoise from 'simplex-noise'
import './modules/3d-space'

let simplex = new SimplexNoise()
let noise
let time = 0
let mouseX = 0
let mouseY = 0

const stars = document.querySelector(`.container-stars`)

let width, height, halfX, halfY

let canvas = document.createElement(`canvas`)
let ctx = canvas.getContext(`2d`)

stars.appendChild(canvas)

const sizing = () => {
  width = window.innerWidth
  height = window.innerHeight

  halfX = width / 2
  halfY = height / 2

  canvas.height = height
  canvas.width = width
}

sizing()

let lines = []
let linesNumber = 4
let vertices = 100
let color = `#ff0429`
let radius = 200

for (let i = 0; i < linesNumber; i++) {
  lines[i] = []

  for (let j = 0; j <= vertices; j++) {
    let point = {
      x: Math.cos(j / vertices * Math.PI * 2),
      y: Math.sin(j / vertices * Math.PI * 2),
      width: 4 // ширина бордера
    }
    point._x = point.x // сохраняем оригинальную позицию по х
    point._y = point.y // сохраняем оригинальную позицию по у
    lines[i].push(point)
  }
}

let mfX = 0
let mfY = 0 // коэфициенты мышки
let linesDelta = 0 // коэфициент ширины линий

const update = () => {
  mfX += 0.05 * (mouseX / halfX - mfX)
  mfY += 0.05 * (mouseY / halfY - mfY)

  for (let i = 0; i < linesNumber; i++) {
    for (let j = 0; j <= vertices; j++) {
      noise = simplex.noise2D(lines[i][j]._x / 2 + time * 0.003, lines[i][j]._y / 2 + time * 0.003)

      lines[i][j].x = lines[i][j]._x * radius * (1 - i / 10) + noise * radius / 10
      lines[i][j].y = lines[i][j]._y * radius * (1 - i / 10) + noise * radius / 10

      lines[i][j].x = lines[i][j].x - mfX * radius * i / 20
      lines[i][j].y = lines[i][j].y - mfY * radius * i / 20

      linesDelta = lines[i][j].x * mfX + lines[i][j].y * mfY
      lines[i][j].width = 4 + 4 * linesDelta / 200 // обноляю ширину линий
    }
  }
}

const render = () => {
  ctx.clearRect(0, 0, width, height)
  ctx.strokeStyle = color
  for (let i = 0; i < linesNumber; i++) {
    for (let j = 1; j <= vertices; j++) {
      ctx.beginPath()
      ctx.lineWidth = lines[i][j].width < 2 ? 2 : lines[i][j].width // минимальная ширина линии 1px
      ctx.moveTo(halfX + lines[i][j - 1].x, halfY + lines[i][j - 1].y)
      ctx.lineTo(halfX + lines[i][j].x, halfY + lines[i][j].y)

      ctx.stroke()
    }
  }
}

function onMouseMove (evt) {
  mouseX = evt.clientX - halfX
  mouseY = evt.clientY - halfY
}

document.addEventListener(`mousemove`, onMouseMove)

function raf () {
  time++
  update()
  render()

  window.requestAnimationFrame(raf)
}

raf()
