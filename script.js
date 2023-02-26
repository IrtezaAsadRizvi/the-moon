// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry( 0.5, 64, 64 );

// Texture
const textureLoader = new THREE.TextureLoader() 
const normalTexture = textureLoader.load('https://i.ibb.co/Y70ZFfs/Normal-Map.png', function () {
    console.log('loaded')
    document.getElementById('loader').style.display = 'none'
},)
const texture = new THREE.TextureLoader().load( 'https://i.ibb.co/89dV1tX/moon-texture.jpg' );

// Materials
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.15
material.roughness = 0.95
material.normalMap = normalTexture
material.map = texture
material.color = new THREE.Color(0xffffff)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(40.5, -77.6, 21)
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 0.8)
pointLight2.position.set(-2.5,0.7,2.9)
scene.add(pointLight2)

// Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Interaction

let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const maxUpScroll = 0.245

const onMouseMove = (event) => {
    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
}


const scrollSphere = (event) => {
    if ((window.scrollY * .001) <= maxUpScroll) sphere.position.y = window.scrollY * .00045
    sphere.position.z = window.scrollY * .0035
    
    document.getElementById('title').style.transform = 'translateY('+ window.scrollY*0.25 +'px) scale('+ (1-(window.scrollY*0.0005)) +')'
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.getElementById('text').classList.add('show')
        document.getElementById('webgl').classList.add('normal-blend')
        document.getElementById('ScrollIndicator').classList.add('hide-transform')
    } else {
        document.getElementById('text').classList.remove('show')
        document.getElementById('webgl').classList.remove('normal-blend')
        document.getElementById('ScrollIndicator').classList.remove('hide-transform')
    }
}

window.addEventListener('scroll', scrollSphere)

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.003
    targetY = mouseY * 0.003
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.x += .5 * (targetY - sphere.rotation.x)
    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

window.scrollTo({ top: 0, behavior: 'smooth' });
// starting the motion
tick()
