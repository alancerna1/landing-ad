import { AfterContentInit, Component } from '@angular/core';
import * as P5 from 'p5';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css'],
})
export class ShapeComponent implements AfterContentInit {
  width: number = 0;
  height: number = 0;
  isOver: boolean = false;
  show: boolean = true;
  one: boolean = false;

  ngAfterContentInit(): void {
    this.show = true;
    let canvasContainer = document.getElementById('canvas-container');
    this.width = canvasContainer?.clientWidth ?? 0;
    this.height = canvasContainer?.clientHeight ?? 0;
    if (this.width && this.height) new P5(this.sketch);
  }

  sketch = (p5: P5) => {
    let R = 0;
    let angle = 0.005;
    let nr = 8.5;
    let offset = 2.3;
    let mX = 0;
    let mY = 0;
    let taken = false;
    p5.randomSeed(Date.now());
    let f = p5.random(1.5, 2);
    let sum = 0;
    let shape: P5.Graphics;

    p5.setup = () => {
      let size = this.width > this.height ? this.height : this.width;
      const canvas = p5.createCanvas(size, size);
      R = size / 1.2;
      canvas.parent('canvas');
      p5.pixelDensity(1);
      shape = p5.createGraphics(size, size, p5.WEBGL);
      shape.setAttributes({
        alpha: true,
        premultipliedAlpha: true,
      });
      p5.colorMode(p5.HSB, 255);
      shape.noFill();
      shape.colorMode(p5.HSB, 255);
    };

    p5.draw = () => {
      p5.clear(0, 0, 0, 0);
      if (this.isOver) {
        mX = p5.mouseX;
        mY = p5.mouseY;
      }
      if (p5.frameCount < 10) {
        sum += p5.frameRate();
      } else if (!taken) {
        nr = p5.map(sum / 9, 15, 60, 15, 3);
        taken = true;
        // console.log({ nr }, sum / 9);
      }
      shape.clear(0, 0, 0, 0);
      shape.rotateY(angle);
      shape.rotateX(-angle);
      shape.rotateZ(angle);
      let noiseScale =
        p5.map(mX + mY, 0, p5.width + p5.height, 0.001, 0.002) * offset * f;
      for (let y = -R / 2; y < R / 2; y += p5.round(nr)) {
        let t = 0;
        shape.beginShape();
        while (t < p5.TWO_PI) {
          let r = p5.sqrt(p5.pow(R / 2, 2) - p5.pow(y, 2));
          let x = r * p5.cos(t);
          let z = r * p5.sin(t);
          let noiseVal = p5.noise(
            x * noiseScale,
            y * noiseScale,
            z * noiseScale
          );
          noiseVal = p5.map(noiseVal, 0, 1, 0.3, 1.1);
          let c = p5.color(p5.map(p5.abs(y), 0, R / 2, 100, 255), 90, 155);
          shape.stroke(c);
          shape.vertex(x * noiseVal, y * noiseVal, z * noiseVal);
          t += 0.1;
        }
        shape.endShape(p5.CLOSE);
      }
      p5.image(shape, 0, 0);
      if (p5.floor(p5.frameCount / 500) % 2 == 0) offset -= 0.003;
      else offset += 0.003;
    };
    p5.mouseReleased = () => {
      f = p5.random(1.5, 2);
    };
  };

  onCanvas(isOver: boolean) {
    this.isOver = isOver;
  }
}
