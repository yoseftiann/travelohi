import { CANVAS_HEIGHT } from "../const";
import { Sprite } from "./Sprite";

const gravity = 0.4;
const maxFallSpeed = 4;

interface ISpriteInfo {
    imageSrc : string;
    frameMax : number;
}

interface Sprites {
    [action : string] : {
        img: HTMLImageElement;
        frameMax : number;
    }
}

export class Fighter extends Sprite {
  velocity: { x: number; y: number };
  height: number;
  width: number;
  lastKey: string = "";
  attackBox: {
    position: {x: number; y:number},
    offset: {x: number; y:number},
    width: number,
    height: number
  };
  color: string;
  isAttacking: boolean;
  health: number;
  damage: number;
  isFlip: boolean;

  sprites : Sprites;
  reversedSprites: Sprites;

  //Constructor
  constructor(
    position: { x: number; y: number },
    velocity: { x: number; y: number },
    color = "red",
    imageSrc: string,
    scale = 1,
    frameMax = 1,
    framesHold = 10,
    offset = { x: 0, y: 0 },
    sprites : {[action : string] : ISpriteInfo},
    reversedSprites : {[action : string] : ISpriteInfo},
    attackBoxParams: {
      offset: { x: number, y:number},
      width: number,
      height: number
    }
  ) {
    super(position, imageSrc, scale, frameMax, framesHold, offset);
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey = this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBoxParams.offset,
      width: attackBoxParams.width,
      height: attackBoxParams.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.damage = 20;
    this.isFlip = false;

    this.sprites = {};
    this.reversedSprites = {};

    //Loop through every property sprites
    for(const [action, {imageSrc, frameMax}] of Object.entries(sprites)){
        const img = new Image;
        img.src = imageSrc;
        this.sprites[action] = {img, frameMax}
    }

    for(const [action, {imageSrc, frameMax}] of Object.entries(reversedSprites)){
      const img = new Image;
      img.src = imageSrc;
      this.reversedSprites[action] = {img, frameMax}
    }
  }

  switchSprites(sprite : string){
    const currentSprites = this.isFlip ? this.reversedSprites : this.sprites;

    if((this.image == currentSprites.attack1.img || this.image ==currentSprites.attack2.img) && this.framesCurrent < this.frameMax - 1){
      return;
    }
  
    switch (sprite) {
        case 'idle':
            if(this.image != currentSprites.idle.img){
              this.framesCurrent = 0;
            }
            this.image = currentSprites.idle.img;
            this.frameMax = currentSprites.idle.frameMax;
            
            break;
        case 'run':
            if(this.image != currentSprites.run.img){
              this.framesCurrent = 0;
            }
            this.image = currentSprites.run.img;
            this.frameMax = currentSprites.run.frameMax;
            break;
        case 'jump':
            if(this.image != currentSprites.jump.img){
              this.framesCurrent = 0;
            }
            this.image = currentSprites.jump.img;
            this.frameMax = currentSprites.jump.frameMax;
            break;
        case 'fall':
            if(this.image != currentSprites.fall.img){
              this.framesCurrent = 0;
            }
            this.image = currentSprites.fall.img;
            this.frameMax = currentSprites.fall.frameMax;
            break;
        case 'attack1':
            if(this.image != currentSprites.attack1.img){
              this.framesCurrent = 0;
            }
            this.damage = 20;
            this.image = currentSprites.attack1.img;
            this.frameMax = currentSprites.attack1.frameMax;
            break;

        case 'attack2':
          if(this.image != currentSprites.attack2.img){
            this.framesCurrent = 0;
          }
          this.damage = 10;
          this.image = currentSprites.attack2.img;
          this.frameMax = currentSprites.attack2.frameMax;
          break;
    }
  }

  jump(){
    this.velocity.y -= 12;
    this.switchSprites('jump')
  }

  attack1() {
    this.isAttacking = true;
    this.switchSprites('attack1')
  }

  attack2() {
    this.isAttacking = true;
    this.switchSprites('attack2')
  }

  switchSpriteSet(useReversed : boolean){
    this.isFlip = useReversed;
  }

  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.animateFrames();

    //Setting the attackbox
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Display collision box
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= CANVAS_HEIGHT - 96) {
      //Stop player
      this.velocity.y = 0;
      this.position.y = CANVAS_HEIGHT - 96 - this.height;
    } else {
        this.velocity.y += gravity;
        if (this.velocity.y > maxFallSpeed) {
            this.velocity.y = maxFallSpeed;
        }
        
    }
  }
}
