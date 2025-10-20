import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-simulation-view',
  standalone:true,
  imports: [],
  templateUrl: './simulation-view.html',
  styleUrl: './simulation-view.css'
})
export class SimulationView {
  //haalt camera op uit DOM van simulation
  @Input() camera!: THREE.PerspectiveCamera;
  //variabelen meteen initialiseren
  #radius = 30;
  #azimuth = 0;
  #elevation = 0;
  #mouseDown = false;
  #prevMouseX = 0;
  #prevMouseY = 0;
  //check of middelste muisknop ingedrukt is
  onMouseDown(e: MouseEvent) { 
    if (e.button === 1){
      this.#mouseDown = true;
    }
  }
  //check of middelste muisknop weer losgelaten is
  onMouseUp(e: MouseEvent) { 
    if (e.button === 1) {
      this.#mouseDown = false;
    }
  }
  //wat te doen als muis beweegt, azimuth is verandering in x waarde, elevation in y waarde, nadien met Math berekend of deze niet onder 0° gaat of boven 90°
  onMouseMove(e: MouseEvent) { 
    if(this.#mouseDown){
      this.#azimuth -= ((e.clientX-this.#prevMouseX));
      this.#elevation += ((e.clientY-this.#prevMouseY));
      this.#elevation = Math.min(90, Math.max(0, this.#elevation));
      this.updateCameraPosition();
    }
    this.#prevMouseX = e.clientX;
    this.#prevMouseY = e.clientY; 
  }
  //mouse scroll voor in en uitzoomen, moet tussen z positie 30 (grid is 30, dus zo blijft hele grid zichtbaar) en 100 blijven
  onMouseWheel(e: WheelEvent) { 
    const zoomSpeed = 0.1;
    this.#radius += e.deltaY * zoomSpeed;
    this.#radius = Math.max(30, Math.min(100, this.#radius));
    this.updateCameraPosition();
  }
  //formules voor het correct roteren van de camera
  updateCameraPosition() { 
    this.camera.position.x = this.#radius * Math.sin(this.#azimuth * Math.PI/180) * Math.cos(this.#elevation * Math.PI/180);
    this.camera.position.y = this.#radius * Math.sin(this.#elevation * Math.PI/180);
    this.camera.position.z = this.#radius * Math.cos(this.#azimuth * Math.PI/180) * Math.cos(this.#elevation * Math.PI/180);
    this.camera.lookAt(0, 0, 0);
  }
}
