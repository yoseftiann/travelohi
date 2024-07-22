import React, { useEffect } from "react";
import { Fighter } from "./class/Fighter";
import { Sprite } from "./class/Sprite";
import backgroundImg from "./Asset/background.png"
import shopImg from "./Asset/shop.png"
import healthbarImg from "./GameAsset/lifebar full.png"

// Player asset
import idleImg from "./Asset/samuraiMack/Idle.png"
import runImg from "./Asset/samuraiMack/Run.png"
import jumpImg from "./Asset/samuraiMack/Jump.png"
import fallImg from "./Asset/samuraiMack/Fall.png"
import attackImg1 from "./Asset/samuraiMack/Attack1.png"
import attackImg2 from "./Asset/samuraiMack/Attack2.png"

import idleReversedImg from "./Asset/samuraiMack/reversed/Idle.png"
import runReversedImg from "./Asset/samuraiMack/reversed/Run.png"
import attackReversedImg1 from "./Asset/samuraiMack/reversed/Attack1.png"
import attackReversedImg2 from "./Asset/samuraiMack/reversed/Attack2.png"
import jumpReversedImg from "./Asset/samuraiMack/reversed/Jump.png"
import fallReversedImg from "./Asset/samuraiMack/reversed/Fall.png"

// Enemy asset
import enemyIdleImg from "./Asset/kenji/Idle.png"
import enemyRunImg from "./Asset/kenji/Run.png"
import enemyJumpImg from "./Asset/kenji/Jump.png"
import enemyFallImg from "./Asset/kenji/Fall.png"
import enemyAttackImg1 from "./Asset/kenji/Attack1.png"
import enemyAttackImg2 from "./Asset/kenji/Attack2.png"

import enemyReversedIdleImg from "./Asset/kenji/reversed/Ide.png"
import enemyReversedRunImg from "./Asset/kenji/reversed/Run.png"
import enemyReversedJumpImg from "./Asset/kenji/reversed/Jump.png"
import enemyReversedFallImg from "./Asset/kenji/reversed/Fall.png"
import enemyReversedAttackImg1 from "./Asset/kenji/reversed/Attack1.png"
import enemyReversedAttackImg2 from "./Asset/kenji/reversed/Attack2.png"

// Canvas
import {CANVAS_WIDTH, CANVAS_HEIGHT} from './const'

// Audio
import BGM from "./GameAsset/background music 2.mp3"

// Validate user
import Loading from "../../components/loader/loading-page";
import useValidateUser from "../../hooks/useValidateUser";

interface GamePageProps {
  addBalance: () => Promise<void>; 
}


export default function GamePage({addBalance} : GamePageProps) {

  // Background music
  const bgmRef = React.useRef(new Audio(BGM));
  const [playMusic, setPlayMusic] = React.useState(true);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  let canvas: HTMLCanvasElement | null;
  const animationFrameId = React.useRef<number | null>(null);

  //FPS
  const fps = 60
  const fpsInterval = 1000 / fps
  let lastDrawTime = React.useRef(Date.now());
  // const [audioReady, setAudioReady] = React.useState();

  //Timer and handler
  const [timer, setTimer] = React.useState(60);
  const [result, setResult] = React.useState('');

  //Health
  const [enemyHealth, setEnemyHealth] = React.useState(100);
  const [playerHealth, setPlayerHealth] = React.useState(100);

  //Draw healthbar using canvas 2D
  const drawHealthBar = ( ctx : CanvasRenderingContext2D, x_ :number, y_ :number, health: number) => {
    const width = 295;
    const height = 30;
    const x = x_;
    const y = y_;

    ctx.fillStyle = 'red';
    const fillWidth = (health / 100) * width;
    // console.log("current health bar : " , health);
    
    ctx.clearRect(x, y, width, height);
    ctx.fillRect(x,y,fillWidth, height);
  }

  //Keys that can be used and its state
  const keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
    ArrowLeft: {
      pressed: false,
    },
    ArrowUp: {
      pressed: false,
    },
  };

  // Make a new player
  const player = new Fighter(
    { x: 0, y: 0 }, 
    { x: 0, y: 5 }, 
    "red", 
    idleImg,
    2.5,
    8,
    5,
    {x: 210, y: 155},
    {
      idle: {
          imageSrc: idleImg,
          frameMax:8
      },
      run : {
        imageSrc: runImg,
        frameMax: 8
      },
      jump : {
        imageSrc: jumpImg,
        frameMax : 2
      },
      fall : {
        imageSrc: fallImg,
        frameMax: 2
      },
      attack1 : {
        imageSrc: attackImg1,
        frameMax: 6
      },
      attack2 : {
        imageSrc: attackImg2,
        frameMax: 6
      }
    },
    {
      idle: {
        imageSrc: idleReversedImg,
        frameMax:8
      },
      run : {
        imageSrc: runReversedImg,
        frameMax: 8
      },
      jump : {
        imageSrc: jumpReversedImg,
        frameMax : 2
      },
      fall : {
        imageSrc: fallReversedImg,
        frameMax: 2
      },
      attack1 : {
        imageSrc: attackReversedImg1,
        frameMax: 6
      },
      attack2 : {
        imageSrc: attackReversedImg2,
        frameMax: 6
      }
    },
    {
      offset:{
        x:100,y:50
      },
      width: 160,
      height: 50
    }
  );

  // Make enemy
  const enemy = new Fighter(
    { x: 400, y: 0 }, 
    { x: 0, y: 0 }, 
    "blue",
    enemyIdleImg,
    2.5,
    4,
    5,
    {x: 214, y: 167},
    {
      idle: {
          imageSrc: enemyIdleImg,
          frameMax:4
      },
      run : {
        imageSrc: enemyRunImg,
        frameMax: 8
      },
      jump : {
        imageSrc: enemyJumpImg,
        frameMax : 2
      },
      fall : {
        imageSrc: enemyFallImg,
        frameMax: 2
      },
      attack1 : { 
        imageSrc: enemyAttackImg1,
        frameMax: 4
      },
      attack2 : {
        imageSrc: enemyAttackImg2,
        frameMax: 4
      }
    },
    {
      idle: {
        imageSrc: enemyReversedIdleImg,
        frameMax:4
      },
      run : {
        imageSrc: enemyReversedRunImg,
        frameMax: 8
      },
      jump : {
        imageSrc: enemyReversedJumpImg,
        frameMax : 2
      },
      fall : {
        imageSrc: enemyReversedFallImg,
        frameMax: 2
      },
      attack1 : { 
        imageSrc: enemyReversedAttackImg1,
        frameMax: 4
      },
      attack2 : {
        imageSrc: enemyReversedAttackImg2,
        frameMax: 4
      }
    },
    {
      offset:{
        x:-170,y:50
      },
      width: 170,
      height: 50
    }
    );

  // Make a background
  const background = new Sprite(
    {
     x:0,
     y:0 
    },
    backgroundImg
  )

  // Shop
  const shop = new Sprite(
    {
      x:620,
      y:128
    },
    shopImg,
    2.75,
    6,
    30
  )

  // Healthbar full
  const healthbar = new Sprite(
    {
      x:36,
      y:0
    },
    healthbarImg,
    2.95,
    1,
    0
  )

  //Looping Animation
  const animate = () => {
    if (result !== '') {
      return;
    }

    requestAnimationFrame(animate);

    const now = Date.now();
    const elapsed = now - lastDrawTime.current

    if(elapsed > fpsInterval){
      lastDrawTime.current = now - (elapsed % fpsInterval)

      if (canvas) {
        const c = canvas.getContext("2d");
  
        // Drawing logic
        if (c) {
          c.clearRect(0, 0, canvas.width, canvas.height);
  
          background.update(c)
          shop.update(c)
          //Display healthbar canvas
          drawHealthBar(c, 160, 50, player.health);
          drawHealthBar(c, 570, 50, enemy.health);
          healthbar.update(c)
  
          // Switch Sprite for directions player and enemy
          if(player.position.x > enemy.position.x){
            player.switchSpriteSet(true)
          }else{
            player.switchSpriteSet(false)
          }
  
          if(enemy.position.x < player.position.x){
            enemy.switchSpriteSet(true)
          }else{
            enemy.switchSpriteSet(false)
          }
  
          // Update and draw the player and enemy
          player.update(c);
          enemy.update(c);
  
          //Player movement
          player.velocity.x = 0;
          if (keys.a.pressed && player.lastKey === "a") {
            player.velocity.x = -2;
            player.switchSprites('run')
          } else if (keys.d.pressed && player.lastKey === "d") {
            player.velocity.x = 2;
            player.switchSprites('run')
          } else {
            player.switchSprites('idle')
          }
  
          //Jump Player Movement
          if(player.velocity.y < 0){
            player.framesCurrent = 0;
            player.switchSprites('jump');
            
          }else if(player.velocity.y > 0){
            player.framesCurrent = 0;
            player.switchSprites('fall');
          }
  
          //Enemy Movement
          enemy.velocity.x = 0;
          if (keys.ArrowLeft.pressed && enemy.lastKey == "a") {
            enemy.velocity.x = -5;
            enemy.switchSprites('run')
          } else if (keys.ArrowRight.pressed && enemy.lastKey == "d") {
            enemy.velocity.x = 5;
            enemy.switchSprites('run')
          } else {
            enemy.switchSprites('idle')
          }
  
          //Jump Enemy Movement
          if(enemy.velocity.y < 0){
            enemy.framesCurrent = 0;
            enemy.switchSprites('jump');
            
          }else if(enemy.velocity.y > 0){
            enemy.framesCurrent = 0;
            enemy.switchSprites('fall');
          }
  
  
          //Detect for collision
          if (detectCollision(player, enemy) && player.isAttacking && player.framesCurrent === 4) {
            player.isAttacking = false;
  
            //decrease enemy health by 20%
            enemy.health -= player.damage;
  
            setEnemyHealth(enemy.health)
          }
  
          //If player attack miss
          if(player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false;
          }
  
          
          //Detect for collisision
          if (detectCollision(enemy, player) && enemy.isAttacking) {
            enemy.isAttacking = false;
  
            //decrease enemy health by 20%
            player.health -= enemy.damage;
  
            setPlayerHealth(player.health);
            console.log("player health now", playerHealth);
          }
  
          //If enemy miss
          if(enemy.isAttacking && enemy.framesCurrent === 2){
            enemy.isAttacking = false;
          }
  
          animationFrameId.current = requestAnimationFrame(animate);

        }
      }
    }
  };

  //Detect Collision
  const detectCollision = (rect1: Fighter, rect2: Fighter) => {
    return (
      rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
      rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  };

  // Event listener for KEYDOWN
  const keydownHandler = (event : any) => {
    if (result != '') return;

    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        event.preventDefault();
        player.lastKey = "d";
        break;

      case "a":
        keys.a.pressed = true;
        event.preventDefault();
        player.lastKey = "a";
        break;

      case "w":
        player.jump()
        break;

      case " ":
        player.attack1();
        break;

      case "q":
        player.attack2();
        break;
    }

    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        event.preventDefault();
        enemy.lastKey = "d";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        event.preventDefault();
        enemy.lastKey = "a";
        break;

      case "ArrowUp":
        enemy.jump();
        break;

      case "ArrowDown":
        enemy.attack1();
        break;

      case "p":
        enemy.attack2();
        break;
    }
  }

  // Event listener for KEYUP
  const keyupHandler = (event : any) => {
    if (result !== '') return;
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        event.preventDefault();
        break;

      case "a":
        keys.a.pressed = false;
        event.preventDefault();
        break;
    }

    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        event.preventDefault();
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        event.preventDefault();
        break;
    }
  } 
    
  React.useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);
    canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      //Animation Loop
      animate();
    }

    // Clean up the animation frame when the component unmounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (result !== '') {
      // Stop the music when a result is found
      console.log(result);
      
      bgmRef.current.pause();

      keys.d.pressed = false;
      keys.a.pressed = false;
      keys.ArrowRight.pressed = false;
      keys.ArrowLeft.pressed = false;


      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    } else {
      window.addEventListener("keydown", keydownHandler);
      window.addEventListener("keyup", keyupHandler);

      // Play the music when the game is active
      if (playMusic) {
        bgmRef.current.play();
      }
    }

    bgmRef.current.loop = true;

    return () => {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;

      // Remove event listeners when component unmounts
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };

  }, [result, playMusic]);

  //Winning Condition
  const winningCondition = () => {
    console.log("entering winninig conditiion , ", playerHealth, " and ", enemyHealth);
    
    if(playerHealth === enemyHealth) {
      setResult('Tie')
    } else if(playerHealth > enemyHealth){
      setResult('Player Win')
      addBalance();
    } else if(playerHealth < enemyHealth){
      setResult('Enemy Win')
    }
  }

  //Health Handler 
  useEffect(() => {
    // Check if the game should end based on the latest health states
    if (playerHealth <= 0 || enemyHealth <= 0) {
      winningCondition();
    }
  }, [playerHealth, enemyHealth]);

  //Timer Handler
  useEffect(() => {
    if (result !== '') {
      return;
    }
  
    if (timer <= 0) {
      winningCondition();
      return;
    }
    const timerId = setTimeout(() => {
      setTimer(prevTimer => Math.max(prevTimer - 1, 0));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timer, result]);

  return (
    <div style={{
      position:'relative',
      display:'inline-block'
    }}>
      <div style={{
        position:'absolute',
        display:'flex',
        width: '100%',
        alignItems:'center',
        padding:'1rem 6rem',
        boxSizing:'border-box',
        zIndex: '1'
      }}>
        {/* Player health */}
        <div style={{
          position:'relative',
          backgroundColor:'transparent',
          height:'30px',
          width:'100%',
          display:'flex',
          justifyContent:'flex-end'
        }}>
          <div style={{
            backgroundColor:'transparent',
            position:'absolute',
            height:'30px',
            width: `${playerHealth}%`
          }}>
          </div>
        </div>
        {/* Timer */}
        <div style={{
          color:'white',
          fontSize:'2rem',
          height:'100px',
          width:'100px',
          flexShrink:'0',
          display:'flex',
          alignItems:'center',
          justifyContent:'center'
        }}>
          {timer}
        </div>
        {/* Enemy Health */}
        <div style={{
          position:'relative',
          backgroundColor:'transparent',
          height:'30px',
          width:'100%',
        }}>
          <div style={{
            backgroundColor:'transparent',
            position:'absolute',
            height:'30px',
            width: `${enemyHealth}%`
          }}>
          </div>
        </div>
      </div>
      {/* Display Text */}
      <div style={{
          position:'absolute',
          color:'white',
          top:0,
          right:0,
          bottom:0,
          left:0,
          display: result ? 'flex' : 'none',
          alignItems:'center',
          justifyContent:'center'
        }}>
          {result}
      </div>
      <canvas ref={canvasRef} style={{ 

        backgroundColor: "black", 
        zIndex:'1'}}/>
    </div>
  );
}
