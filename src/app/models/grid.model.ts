import * as THREE from 'three';

export class Grid {
    //variabelen
    geometry!: THREE.BoxGeometry;
    material!: THREE.MeshBasicMaterial;
    grid!: THREE.GridHelper;
    mesh!: THREE.Mesh;
    gridSize!: number;
    gridDivisions!: number;

    //grid initialiseren
    initialize(): void {
        this.geometry = new THREE.BoxGeometry(30,0.1,30);
        this.material = new THREE.MeshBasicMaterial({color: 0x000000});
        this.mesh = new THREE.Mesh (this.geometry, this.material);
        this.gridSize = 30;
        this.gridDivisions = 30;
        this.grid = new THREE.GridHelper(this.gridSize, this.gridDivisions, 0xffffff, 0xffffff);
        this.grid.position.y = 0.1;
    }
}
