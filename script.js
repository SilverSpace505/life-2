m = document.getElementById("life").getContext("2d")
size = 500
particleAmount = 500
colourAmount = 5
rules = []
colourParticles = []
collisions = true
forceField = 5
maxDistance = 80
fieldStrength = 250
particleRadius = 10
distanceFalloff = 5

newSim = document.getElementById("newSim")
save = document.getElementById("save")
load = document.getElementById("load")
copy = document.getElementById("copy")
paste = document.getElementById("paste")
code = document.getElementById("code")

newSim.onclick = function () {
	nc()
}

copy.onclick = function () {
	code.focus()
	code.select()
	document.execCommand('copy');
}

copy.onclick = function () {
	code.focus()
	code.select()
	document.execCommand('paste');
}

save.onclick = function () {
	code.value = JSON.stringify(colours)
}

load.onclick = function () {
	lc(JSON.parse(code.value))
}

function lc(newColours) {
	rules = []
	colourParticles = []
	colours = []
	colours = newColours
	particles = []
	for (let i in colours) {
		colourParticles.push(create(particleAmount/colours.length, i))
		rules.push([])
		for (let j in colours) {
			var ruleVal = (Math.sin(colours[i][0]/255*39.58+colours[j][0]/255*48.41) - Math.cos(colours[i][1]/255*91.95+colours[j][1]/255*12.45)) * Math.tan(colours[i][2]/255*48.492+colours[j][2]/255*53.23)
			if (ruleVal > 1) {ruleVal = 1}
			if (ruleVal < -1) {ruleVal = -1}
			rules[i].push(ruleVal)
		}
	}
}

function sc() {
	console.log(JSON.stringify(colours))
}

function nc() {
	rules = []
	colourParticles = []
	colours = []
	for (let i = 0; i < colourAmount; i++) {
		colours.push([Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)])
	}
	particles = []
	for (let i in colours) {
		colourParticles.push(create(particleAmount/colours.length, i))
		rules.push([])
		for (let j in colours) {
			var ruleVal = (Math.sin(colours[i][0]/255*39.58+colours[j][0]/255*48.41) - Math.cos(colours[i][1]/255*91.95+colours[j][1]/255*12.45)) * Math.tan(colours[i][2]/255*48.492+colours[j][2]/255*53.23)
			if (ruleVal > 1) {ruleVal = 1}
			if (ruleVal < -1) {ruleVal = -1}
			rules[i].push(ruleVal)
		}
	}
	// red = create(500, "red")
	// yellow = create(500, "yellow")
	// green = create(500, "green")
	// blue = create(500, "blue")
}

draw = (x, y, c, s) => {
	m.fillStyle = c
	m.fillRect(x, y, s, s)
}

particles = []
particle = (x, y, c) => {
	return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c, "showColour": colours[c], "lx": x, "ly": y }
}

random = () => {
	return Math.random() * (size - 100) + 50
}

create = (number, colour) => {
	group = []
	for (let i = 0; i < number; i++) {
		group.push(particle(random(), random(), colour))
		particles.push(group[i])
	}
	return group
}

rule = (particles1, particles2, g) => {
	for (let i = 0; i < particles1.length; i++) {
		fx = 0
		fy = 0
		for (let j = 0; j < particles2.length; j++) {
			a = particles1[i]
			b = particles2[j]
			dx = a.x - b.x
			dy = a.y - b.y
			d = Math.sqrt(dx * dx + dy * dy)
			F = 0
			if (collisions) {
				if (d > particleRadius && d < maxDistance) {
					F = g * 1 / d
					// F = Math.abs(d-maxDistance)/(maxDistance*maxDistance)*g*2
				} else if (d > 0 && d < maxDistance) {
					F = 1 / d
				}
			} else if (d > 0 && d < maxDistance) {
				F = g * 1 / d
			}
			
			fx += (F * dx)
			fy += (F * dy)
			// if (d <= 10 && d > 0) {
			// 	F = 1 * 1/d
			// 	// fx *= 0.95
			// 	// fy *= 0.95
			// 	fx += (F * dx)
			// 	fy += (F * dy)
			// 	// fx -= b.vx*0.5
			// 	// fy -= b.vy*0.5
			// 	// b.x -= dx/2
			// 	// b.y -= dy/2
			// 	// a.x += dx/2
			// 	// a.y += dy/2
			// }
		}
		a.vx = (a.vx + fx) * 0.5
		a.vy = (a.vy + fy) * 0.5
		a.lx = a.x
		a.ly = a.y
		a.x += a.vx
		a.y += a.vy
		// if (a.vx > 25) {a.vx = 25}
		// if (a.vx < -25) {a.vx = -25}
		// if (a.vy > 25) {a.vx = 25}
		// if (a.vy < -25) {a.vy = -25}
		if (a.x <= forceField || a.x >= size-forceField) { a.vx -= (a.x-250)/fieldStrength }
		if (a.y <= forceField || a.y >= size-forceField) { a.vy -= (a.y-250)/fieldStrength }
		// if (a.x < 5) { a.x = 5}
		// if (a.x > size-5) { a.x = size-5 }
		// if (a.y < 5) { a.y = 5 }
		// if (a.y > size-5) { a.y = size-5 }
	}
}

settings = []
for (let i = 0; i < 16; i++) {
	settings.push(Math.random() * 2 - 1)
}

nc()
// lc([[255, 0, 1]])

update = () => {
	for (let i in colourParticles) {
		for (let j in colourParticles) {
			rule(colourParticles[i], colourParticles[j], rules[i][j])
		}
	}
	// rule(red, yellow, settings[0])
	// rule(red, red, settings[1])
	// rule(red, green, settings[2])
	// rule(red, blue, settings[3])

	// rule(yellow, yellow, settings[4])
	// rule(yellow, red, settings[5])
	// rule(yellow, green, settings[6])
	// rule(yellow, blue, settings[7])

	// rule(green, yellow, settings[8])
	// rule(green, red, settings[9])
	// rule(green, green, settings[10])
	// rule(green, blue, settings[11])

	// rule(blue, yellow, settings[12])
	// rule(blue, red, settings[13])
	// rule(blue, green, settings[14])
	// rule(blue, blue, settings[15])

	// rule(red, red, -1)
	// rule(blue, blue, -1)
	// rule(red, blue, 0)
	// rule(blue, red, 0)

	for (let i = 0; i < particles.length; i++) {
		rule(particles[i], particles)
	}

	m.clearRect(0, 0, size, size)
	m.fillStyle = "black"
	m.fillRect(0, 0, size, size)
	for (i = 0; i < particles.length; i++) {
		m.beginPath()
		m.fillStyle = `rgb(${particles[i].showColour[0]}, ${particles[i].showColour[1]}, ${particles[i].showColour[2]})`
		m.arc(particles[i].x, particles[i].y, particleRadius/4, 0, Math.PI*2)
		m.fill()
		// draw(particles[i].x - 2.5, particles[i].y - 2.5, `rgb(${particles[i].showColour[0]}, ${particles[i].showColour[1]}, ${particles[i].showColour[2]})`, 5)
	}
	requestAnimationFrame(update)
}

update()