/**
 * Level: Costco (Ending)
 * The final destination - the promised land of hot dogs!
 */

import * as THREE from 'three';

// ============================================
// DIALOGUE - BAD ENDING
// ============================================

export const dialogueEnding = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000, sound: "cash_register" },
    { speaker: "Chandler", text: "Cash. I have it right here...", delay: 2000, action: "check_pockets", sound: "coins_jingle" },
    { speaker: "Chandler", text: "Wait... one, two, three quarters... one dollar... twenty five...", delay: 4000 },
    { speaker: "Chandler", text: "NO! I lost a quarter to that alligator!", delay: 3000, action: "shock", sound: "dramatic_sting" },
    { speaker: "Cashier", text: "You have $1.25? The price is $1.50.", delay: 3000 },
    { speaker: "Chandler", text: "Please! I ran all the way from Mexico!", delay: 3000 },
    { speaker: "Cashier", text: "Store policy. No money, no Glizzy.", delay: 3000 },
    { speaker: "Cashier", text: "SECURITY! REMOVE THIS MAN!", delay: 2000, action: "call_security", sound: "security_whistle" },
    // EPILOGUE - Bad Ending
    { speaker: "Chandler", text: "But I... I came so far...", delay: 2500, action: "shock" },
    { speaker: "Mama", text: "Mijo... you tried. That is what matters.", delay: 3000 },
    { speaker: "Chandler", text: "I failed you, Mama. I failed everyone...", delay: 2500 },
    { speaker: "Stranger", text: "Hey kid. Here's a quarter. Now go get your Glizzy.", delay: 3500, action: "stranger_helps", sound: "coins_jingle" },
    { speaker: "Chandler", text: "You... you would do that for me?", delay: 2500 },
    { speaker: "Stranger", text: "Everyone deserves a hot dog. Now hurry, before they close.", delay: 3000 },
    { speaker: "Chandler", text: "There is still hope... WAIT FOR ME, GLIZZY!", delay: 2500 }
];

// ============================================
// DIALOGUE - HAPPY ENDING
// ============================================

export const dialogueEndingHappy = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000, sound: "cash_register" },
    { speaker: "Chandler", text: "Cash! One dollar... fifty cents!", delay: 2500, action: "check_pockets", sound: "coins_jingle" },
    { speaker: "Cashier", text: "Exact change. Here's your Glizzy.", delay: 3000, sound: "cash_register" },
    { speaker: "Chandler", text: "THE FREEDOM GLIZZY! IT IS BEAUTIFUL!", delay: 3500, action: "victory", sound: "victory_jingle" },
    { speaker: "Chandler", text: "Mama... I made it. I still have your flip-flops.", delay: 3500 },
    { speaker: "Chandler", text: "I did not forget who I am. This is for you.", delay: 3000 },
    // EPILOGUE - Happy Ending
    { speaker: "Narrator", text: "And so, Chandler took his first bite...", delay: 3000 },
    { speaker: "Chandler", text: "*crunch* ...it tastes like FREEDOM.", delay: 3000, action: "eating_glizzy", sound: "glizzy_bite" },
    { speaker: "Chandler", text: "The relish... the mustard... the perfect bun...", delay: 3000, action: "eating_glizzy" },
    { speaker: "Chandler", text: "Every mile was worth it.", delay: 2500 },
    { speaker: "Narrator", text: "Six months later...", delay: 2500, action: "time_skip" },
    { speaker: "Chandler", text: "Mama! I brought you a churro. And a Costco membership.", delay: 4000, action: "reunion" },
    { speaker: "Mama", text: "Mi hijo... you came back. That is the real gift.", delay: 3500, action: "reunion" },
    { speaker: "Chandler", text: "I promised you, didn't I? Let's go get matching Glizzys.", delay: 3500 },
    { speaker: "Mama", text: "Together, my son. Together.", delay: 2500, action: "reunion", sound: "crowd_cheer" }
];

// ============================================
// COSTCO EXTERIOR ENVIRONMENT
// ============================================

export function createExteriorEnvironment(scene) {
    const group = new THREE.Group();

    // Day sky
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 20, 200);

    // Parking Lot Ground
    const lotGeo = new THREE.PlaneGeometry(60, 150);
    const lotMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const lot = new THREE.Mesh(lotGeo, lotMat);
    lot.rotation.x = -Math.PI / 2;
    lot.position.z = -40;
    lot.receiveShadow = true;
    group.add(lot);

    // Parking lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let i = -4; i <= 4; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 8), lineMat);
        line.position.set(i * 5, 0.01, -20);
        group.add(line);
    }

    // The Costco Building
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE });
    const building = new THREE.Mesh(new THREE.BoxGeometry(40, 18, 8), buildingMat);
    building.position.set(0, 9, -70);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Red stripe at top
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xE31837 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(40, 3, 8.1), stripeMat);
    stripe.position.set(0, 15, -70);
    group.add(stripe);

    // COSTCO sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#E31837';
    ctx.font = 'bold 80px Arial';
    ctx.fillText('COSTCO', 80, 90);
    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTexture, transparent: true });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), signMat);
    sign.position.set(0, 14, -65.9);
    group.add(sign);

    // Entrance doors
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(4, 7, 0.2), doorMat);
    doorL.position.set(-3, 3.5, -65.9);
    group.add(doorL);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(4, 7, 0.2), doorMat);
    doorR.position.set(3, 3.5, -65.9);
    group.add(doorR);

    // Shopping carts
    const cartMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 });
    for (let i = 0; i < 3; i++) {
        const cart = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.2), cartMat);
        cart.position.set(-12 + i * 1.2, 0.4, -60);
        group.add(cart);
    }

    // Parked cars in lot
    const carColors = [0x2F4F4F, 0x8B0000, 0x4169E1, 0x228B22];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
            const carGroup = new THREE.Group();
            const carBody = new THREE.Mesh(
                new THREE.BoxGeometry(2, 1, 4),
                new THREE.MeshStandardMaterial({ color: carColors[(row + col) % carColors.length] })
            );
            carBody.position.y = 0.5;
            carGroup.add(carBody);
            const carTop = new THREE.Mesh(
                new THREE.BoxGeometry(1.6, 0.8, 2),
                new THREE.MeshStandardMaterial({ color: carColors[(row + col) % carColors.length] })
            );
            carTop.position.y = 1.4;
            carGroup.add(carTop);
            carGroup.position.set(-12 + col * 8, 0, -30 - row * 12);
            group.add(carGroup);
        }
    }

    return { group, animatedElements: [] };
}

// ============================================
// COSTCO INTERIOR ENVIRONMENT
// ============================================

export function createInteriorEnvironment(scene) {
    const group = new THREE.Group();

    // Set warehouse interior atmosphere
    scene.background = new THREE.Color(0xEEEEEE);
    scene.fog = new THREE.FogExp2(0xEEEEEE, 0.015);

    // Polished Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.4,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Warehouse walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(60, 15, 1), wallMat);
    backWall.position.set(0, 7.5, -25);
    backWall.receiveShadow = true;
    group.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 50), wallMat);
    leftWall.position.set(-30, 7.5, 0);
    group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 50), wallMat);
    rightWall.position.set(30, 7.5, 0);
    group.add(rightWall);

    // Costco red accent stripe
    const redStripeMat = new THREE.MeshStandardMaterial({ color: 0xE31837 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(60, 2, 0.5), redStripeMat);
    stripe.position.set(0, 12, -24.8);
    group.add(stripe);

    // Food Court Counter
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, 0, -10);
    group.add(counterGroup);

    const counter = new THREE.Mesh(
        new THREE.BoxGeometry(14, 1.2, 2),
        new THREE.MeshStandardMaterial({ color: 0xD32F2F })
    );
    counter.position.y = 0.6;
    counter.castShadow = true;
    counter.receiveShadow = true;
    counterGroup.add(counter);

    // Cash Registers
    const regMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    for (let i = -1; i <= 1; i += 2) {
        const reg = new THREE.Group();
        reg.position.set(i * 4, 1.2, 0.5);
        const base = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 1), regMat);
        base.position.y = 0.4;
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.1), regMat);
        screen.position.set(0, 1.0, -0.4);
        screen.rotation.x = -0.3;
        const display = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), screenMat);
        display.position.set(0, 1.0, -0.34);
        display.rotation.x = -0.3;
        reg.add(base, screen, display);
        counterGroup.add(reg);
    }

    // Soda Fountain
    const sodaMachine = new THREE.Group();
    sodaMachine.position.set(9, 0, -9);
    const smBody = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
    );
    smBody.position.y = 2;
    sodaMachine.add(smBody);
    for (let i = 0; i < 4; i++) {
        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        nozzle.rotation.x = Math.PI / 2;
        nozzle.position.set(-1 + i * 0.66, 2.5, 0.8);
        sodaMachine.add(nozzle);
    }
    group.add(sodaMachine);

    // Menu Board
    const menuTexture = createFoodCourtSignTexture();
    const menuMat = new THREE.MeshStandardMaterial({
        map: menuTexture,
        emissive: 0xFFFFFF,
        emissiveMap: menuTexture,
        emissiveIntensity: 0.5
    });
    const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 0.2), menuMat);
    menuBoard.position.set(0, 5, -12);
    group.add(menuBoard);

    // Picnic Tables with Eaters
    group.add(createPicnicTable(-5, -3));
    group.add(createPicnicTable(5, -3));
    group.add(createPicnicTable(-5, 3));
    group.add(createPicnicTable(5, 3));

    // Pallet Racks
    group.add(createPalletRack(-10, -18));
    group.add(createPalletRack(10, -18));
    group.add(createPalletRack(-10, -22));
    group.add(createPalletRack(10, -22));

    // Ceiling lights
    const ceilingLightMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let z = -20; z <= 0; z += 10) {
        const cl = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 1), ceilingLightMat);
        cl.position.set(0, 12, z);
        group.add(cl);
    }

    // Point lights
    const lightColor = 0xFFFCE0;
    const pointLight1 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight1.position.set(0, 10, -5);
    group.add(pointLight1);

    const pointLight2 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight2.position.set(-10, 10, -15);
    group.add(pointLight2);

    const pointLight3 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight3.position.set(10, 10, -15);
    group.add(pointLight3);

    return { group, animatedElements: [] };
}

// ============================================
// HELPERS
// ============================================

function createFoodCourtSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#e31837';
    ctx.fillRect(0, 0, 1024, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('COSTCO FOOD COURT', 20, 35);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('HOT DOG COMBO', 50, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$1.50', 50, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('1/4 lb beef + 20oz soda', 50, 200);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('PIZZA SLICE', 400, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$1.99', 400, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('Cheese, Pepperoni, or Combo', 400, 200);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('CHICKEN BAKE', 750, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$3.99', 750, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('Chicken, bacon, caesar dressing', 750, 200);

    return new THREE.CanvasTexture(canvas);
}

function createPicnicTable(x, z) {
    const tGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, roughness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

    const top = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 1.5), woodMat);
    top.position.y = 1.2;
    top.castShadow = true;

    const benchL = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.8), woodMat);
    benchL.position.set(0, 0.6, 1.2);
    benchL.castShadow = true;
    const benchR = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.8), woodMat);
    benchR.position.set(0, 0.6, -1.2);
    benchR.castShadow = true;

    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
    const leg1 = new THREE.Mesh(legGeo, metalMat);
    leg1.position.set(-1, 0.6, 0);
    const leg2 = new THREE.Mesh(legGeo, metalMat);
    leg2.position.set(1, 0.6, 0);

    tGroup.add(top, benchL, benchR, leg1, leg2);

    // Add an Eater
    const eaterGroup = new THREE.Group();
    const shirtColors = [0x4169E1, 0x32CD32, 0xFF6347, 0x9370DB, 0xFFD700];
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8),
        new THREE.MeshStandardMaterial({ color: shirtColors[Math.floor(Math.random() * shirtColors.length)] })
    );
    body.position.y = 0.4;
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffccaa })
    );
    head.position.y = 0.95;
    eaterGroup.add(body, head);
    eaterGroup.position.set(0, 0.7, 1.2);
    tGroup.add(eaterGroup);

    tGroup.position.set(x, 0, z);
    return tGroup;
}

function createPalletRack(x, z) {
    const rackGroup = new THREE.Group();
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF6F00 });
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xC19A6B });

    for (let i = -1; i <= 1; i += 2) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), orangeMat);
        post.position.set(i * 2, 4, 0);
        rackGroup.add(post);
        const postBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), orangeMat);
        postBack.position.set(i * 2, 4, -2);
        rackGroup.add(postBack);
    }

    for (let y = 2; y <= 6; y += 2) {
        const beamFront = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.2, 0.1), orangeMat);
        beamFront.position.set(0, y, 0.15);
        rackGroup.add(beamFront);
        const beamBack = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.2, 0.1), orangeMat);
        beamBack.position.set(0, y, -2.15);
        rackGroup.add(beamBack);

        const pallet = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.5, 1.8), boxMat);
        pallet.position.set(0, y + 0.85, -1);
        pallet.castShadow = true;
        rackGroup.add(pallet);
    }
    rackGroup.position.set(x, 0, z);
    return rackGroup;
}

export default {
    dialogueEnding,
    dialogueEndingHappy,
    createExteriorEnvironment,
    createInteriorEnvironment
};
