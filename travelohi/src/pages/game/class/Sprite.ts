// import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../const";

export class Sprite {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: HTMLImageElement;
  scale : number;
  frameMax : number;
  framesCurrent : number;
  framesElapsed : number;
  framesHold : number;
  offset: { x: number; y: number };

  //Constructor
  constructor(
    position: { x: number; y: number }, 
    imageSrc : string,
    scale = 1,
    frameMax = 1,
    framesHold = 5,
    offset= {x: 0, y:0}
    ) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameMax = frameMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  draw(c: CanvasRenderingContext2D): void {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    )
  }

  update(c: CanvasRenderingContext2D) {
    this.draw(c);
    this.animateFrames();
  }

  animateFrames(){
    this.framesElapsed++

    if(this.framesElapsed % this.framesHold === 0){
      if(this.framesCurrent < this.frameMax - 1){
        this.framesCurrent++
      }else{
        this.framesCurrent = 0
      }
    }
  }
}