import * as THREE from 'three';
import { gsap } from 'gsap'
import fragmentShader from '../shader/fragmentShader.glsl?raw'
import vertexShader from '../shader/vertexShader.glsl?raw'
export default function () {
  const coments = document.querySelectorAll('.comentWrapper')
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x000000, 1);

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);
  
  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const mousePosition = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  }
  

  let playing = true;
  let roundCount = 0 
  let tl = gsap.timeline()
  let tl2 = gsap.timeline()
  let currentNum = 0;
  let changeNum = 0;
  let nextMixRatio = 0;
  let titlesWords = [];
  let comentLines = [];

  const boxWrapper = new THREE.Group()
  const textureLoader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );



  /** light */
  const light = new THREE.AmbientLight( 0xffffff, 1.5 ); // soft white light
  light.position.set(0,0,0);
  scene.add( light )



 /** CreateBox **/
 const createBox = () =>{
  // const geometry = new THREE.BoxGeometry(0,0,0)
  const geometry = new THREE.BoxGeometry(2.3,1,1)
  const material = new THREE.ShaderMaterial({
    vertexShader : vertexShader,
    fragmentShader : fragmentShader,
    uniforms,
    side : THREE.DoubleSide
    })
  const box = new THREE.Mesh(geometry,material)
  boxWrapper.add(box);

  scene.add(boxWrapper)
 }

   
 /** imageassets **/
 let images = [
   textureLoader.load('public/assets/001_worlds.jpg'),
   textureLoader.load('public/assets/001Team.png'),
  textureLoader.load('public/assets/002T1LNG.jpg'),
  textureLoader.load('public/assets/002T1JDG.jpg'),
  textureLoader.load('public/assets/003FINALS.jpg'),
  textureLoader.load('public/assets/002T1WBG.jpg'),
  textureLoader.load('public/assets/004winner2.webp'),
  textureLoader.load('public/assets/004WInner.jpg'),
 ]
 /** uniform **/
 const uniforms = {
  u_time: {
    type: 'f',
    value: 0.0
  },
  u_resolution: {
    type:'v2',
    value : new THREE.Vector2(window.innerWidth,Window.innerHeight).multiplyScalar(window.devicePixelRatio),
  },
  u_mouse : {
    type: 'v2',
    value: new THREE.Vector2(0.0,0.0)
  },
  image : {
    type:'t',
    value: images[0]
  },
  image2 : {
    type:'t',
    value: images[1]
  },
  transition : {
    type:'t',
    value: textureLoader.load('public/assets/noise.jpg')
  },
  mixRatio: {value:0.0}
}

 const createBoxMap = () => {
  const geometry = new THREE.BoxGeometry(6.5,4,5);

  const texture = textureLoader.load('public/assets/worlds23.webp');
  texture.center.set(.5, .5);
  const material = new THREE.MeshPhongMaterial({
    map : texture,
    side: THREE.BackSide
  })


  const boxMap = new THREE.Mesh(geometry,material);
  boxMap.scale.x = -1
  const group = new THREE.Group()

  group.add(boxMap)
  

  return group
 }

  /** Camera */
  camera.position.set(0, 0, 2);
  
  /** create */
  const create = () => {
    createBox()
    const boxMap = createBoxMap()
    scene.add(boxMap);
    return { boxMap }
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };


  const addEvent = () => {
    window.addEventListener('resize', resize);
    window.addEventListener("scroll", () => {
    });
    window.addEventListener('mousemove', (e) => getPositions(e.clientX,e.clientY))
    window.addEventListener('wheel', (e) => rotateBox(e))
    window.addEventListener("mousemove",(e)=>{
      const vpRatio = window.innerWidth / window.innerHeight
      uniforms.u_mouse.value.x = (e.offsetX / window.innerWidth) * vpRatio;
      uniforms.u_mouse.value.y = (e.offsetY / window.innerHeight) * vpRatio;
    })
  };

  const getPositions = (eX,eY) => {
    mousePosition.x = -(eX - (window.innerWidth/2)) / (window.innerWidth/2)
    mousePosition.y =  (eY - (window.innerHeight/2)) / (window.innerHeight/2)
    mousePosition.dx = mousePosition.x * 0.0003
    mousePosition.dy = mousePosition.y * 0.0003
  }
  
  let comentsLines = []
  let comentsLine = []
  const getComents = () =>{
    for(let i=0; i <  coments.length ;i++){
        let titlesWords = coments[i].children[0].children[0].innerHTML.split('')
        for(let j = 0 ; j < titlesWords.length ; j++){
          let spanTag = document.createElement('span');
          spanTag.innerHTML = titlesWords[j]
          coments[i].children[0].children[1].appendChild(spanTag)
        }

    }

    for(let i=0; i <  coments.length ;i++){
      for(let j = 0; j < coments[i].children[1].children[0].children.length ; j++){
        let comentsWords = coments[i].children[1].children[0].children[j].innerHTML.split('')
        comentsLine.push(comentsWords)
      }
      comentsLines.push(comentsLine)
      comentsLine = []
    }
    
    comentsLines.forEach((comentsP,linesIndex)=>{
      comentsP.forEach((comentP,lineindex)=>{
        
          let pTag = document.createElement('p')
          for(let i = 0 ; i < comentP.length ; i++){
            let spanTag = document.createElement('span')
            spanTag.innerHTML = comentP[i]
            pTag.appendChild(spanTag)
          }
          coments[linesIndex].children[1].children[1].appendChild(pTag);
        })
    })
  

    titlesWords  = coments[0].children[0].children[1]
    comentLines = coments[0].children[1].children[0].children

    for(let i = 0 ; i < titlesWords.children.length ; i++){
     gsap.to(titlesWords.children[i],{
       duration: 0.8 / coments[0].children[0].children[1].children.length,
       opacity:1,
       delay: ( 0.8 / coments[0].children[0].children[1].children.length) * i,
       onComplete: () =>{
        if(i == titlesWords.children.length - 1){
          playing = false
        }
       }
     })
    }
    for(let i = 0 ; i < comentLines.length; i++){
      gsap.fromTo(comentLines[i],{
        x:-15,
        opacity:0,
      },{
        duration: 0.25 ,
        x:0,
        opacity:1,
        delay:  0.75,
      })
    }
  }

  const textAnimation = ()  =>{
    let num = currentNum + changeNum
    
    for(let i = 0 ; i < titlesWords.children.length ; i++){
     titlesWords.children[i].style.opacity = 0
    }
    for(let i = 0 ; i < comentLines.length ; i++){
      comentLines[i].style.opacity = 0
    }

    for(let i = 0 ; i < coments[num].children[0].children[1].children.length ; i++){
      // console.log(coments[num].children[0].children[1].children[i])
      gsap.to(coments[num].children[0].children[1].children[i],{
       duration: 0.8 / coments[num].children[0].children[1].children.length,
       opacity:1,
       delay: ( 0.8 / coments[num].children[0].children[1].children.length) * i
      })
     }
     for(let i = 0 ; i < coments[num].children[1].children[0].children.length ; i++){
      gsap.fromTo(coments[num].children[1].children[0].children[i],{
        x:-15,
        y:3,
        opacity:0,
      },{
        duration: 0.25 / coments[num].children[1].children[0].children.length,
        x:0,
        y:0,
        opacity:1,
        delay:  0.75 + (0.25/coments[num].children[1].children[0].children.length * i),
      })   
    }
     
    comentLines = coments[num].children[1].children[0].children
    titlesWords = coments[num].children[0].children[1]
  }


  const rotateBox =  (e) =>{
    const dir = e.deltaY
    if(playing == false ){
      animate(dir)
      playing = true 
    }
  }

  const animate = (dir) =>{
    if(dir > 0){
      roundCount++
      changeNum = 1
    }else {
      roundCount--
      changeNum = -1
    }
    if(currentNum+changeNum >= 0 && currentNum+changeNum < images.length){
      if(nextMixRatio == 0){
        nextMixRatio++
        uniforms.image.value = images[currentNum]
        uniforms.image2.value = images[currentNum + changeNum]
      }else{
        nextMixRatio--
        uniforms.image2.value = images[currentNum]
        uniforms.image.value = images[currentNum + changeNum]
      }
      textAnimation()
      currentNum = currentNum + changeNum;
    }

    if((roundCount-2) % 4 == 0){
      tl.to(boxWrapper.children[0].rotation,{
        duration: 1,
        opacity:0,
        x : Math.PI * (roundCount*.5),
        onComplete : () =>{
          playing = false
        }
      })
      tl.to(boxWrapper.children[0].scale,{
        x: -1,
        y: -1,
        duration:.002,
        delay: .05
      },"<")
      tl.to(uniforms.mixRatio,{
        value : nextMixRatio,
        duration : .7,
        ease: "power1.in",
        onComplete : () =>{
        } 
      },'<')


    }else{
      boxWrapper.children[0].scale.y = 1
      boxWrapper.children[0].scale.x = 1
      tl.to(boxWrapper.children[0].rotation,{
        duration: 1,
        x : Math.PI * (roundCount*.5),
        onComplete : () =>{
          playing = false
          
        }
      })
      tl.to(uniforms.mixRatio,{
        value : nextMixRatio,
        duration : 0.35,
        ease: "power1.in",
        onComplete : () =>{
        } 
      },'<')
    }
    console.log(playing)
  }

  const draw = (obj) => {
    // const {boxWrapper} = obj
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      boxWrapper.rotation.y = mousePosition.x  * 0.6
      boxWrapper.rotation.x = mousePosition.y * 0.32   
      draw(obj);
    });
  };




  const initialize = () => {
    const obj = create();
    addEvent();
    resize();
    getComents()
    draw(obj);
  };

  initialize();
}