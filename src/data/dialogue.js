/**
 * Dialogue data for all cutscenes in the game
 * Each dialogue line has: speaker, text, delay (ms), and optional action/sound
 */

export const DIALOGUE_INTRO = [
    { speaker: "Chandler", text: "Mama... I have to go. The village has no hotdogs left.", delay: 3000 },
    { speaker: "Mama", text: "Oh, mi hijo. You go to the North? To the land of Costco?", delay: 3000 },
    { speaker: "Chandler", text: "Si. I dream of the Freedom Glizzy. $1.50 with a soda.", delay: 3500 },
    { speaker: "Mama", text: "It is dangerous! The Wall... The ICE... The heat!", delay: 3000 },
    { speaker: "Chandler", text: "I am fast, Mama. Like the wind.", delay: 2500, sound: "footsteps" },
    { speaker: "Mama", text: "Take these flip-flops. And do not forget who you are.", delay: 3500 },
    { speaker: "Chandler", text: "Adios, Mama. I will bring you back a churro.", delay: 2000 }
];

export const DIALOGUE_L2 = [
    { speaker: "Chandler", text: "Phew! The desert. It is so quiet...", delay: 3000 },
    { speaker: "Coyote", text: "Turn back, little one. The heat takes everyone.", delay: 3000 },
    { speaker: "Chandler", text: "A talking Coyote?! Am I hallucinating?", delay: 3000 },
    { speaker: "Coyote", text: "Your mama warned you about the heat, no? She was right.", delay: 3500 },
    { speaker: "Coyote", text: "Maybe you ARE hallucinating. Or maybe I am ICE in disguise. Awoooo!", delay: 3500, sound: "coyote_howl" },
    { speaker: "Chandler", text: "I don't care! I have a coupon!", delay: 2000 }
];

export const DIALOGUE_L3 = [
    { speaker: "Chandler", text: "The River! I must cross before...", delay: 2500, sound: "water_flow" },
    { speaker: "Alligator", text: "SNAP SNAP. Tasty toes.", delay: 3000, action: "gator_snap", sound: "jaw_snap" },
    { speaker: "Chandler", text: "Please Mr. Gator, I am just passing through!", delay: 3000 },
    { speaker: "Alligator", text: "The toll is one leg. Or a chicken nugget.", delay: 3000, sound: "gator_hiss" },
    { speaker: "Chandler", text: "I have flip-flops from my Mama! Brand new!", delay: 3000 },
    { speaker: "Alligator", text: "Bah! I have no feet. Give me your quarters instead!", delay: 3000 },
    { speaker: "Chandler", text: "Not my quarters! See ya later alligator!", delay: 2000, sound: "splash" }
];

export const DIALOGUE_L4 = [
    { speaker: "Chandler", text: "Ay caramba! The Wall! It is huge!", delay: 3000 },
    { speaker: "Agent", text: "HALT! RESTRICTED AREA! TURN BACK!", delay: 3000, action: "agent_scan", sound: "scanner_beep" },
    { speaker: "Chandler", text: "I cannot! The coupon expires tomorrow!", delay: 3000 },
    { speaker: "Agent", text: "We've been tracking you since the river crossing, amigo.", delay: 3500, action: "agent_scan", sound: "walkie_talkie" },
    { speaker: "Agent", text: "Deploying searchlights! Release the drones!", delay: 3000, action: "deploy_drones", sound: "drone_launch" },
    { speaker: "Chandler", text: "You cannot stop the hunger of a free man!", delay: 2500 }
];

export const DIALOGUE_L5 = [
    { speaker: "Chandler", text: "I made it! The street... it is so grey!", delay: 3000, action: "phone_call", sound: "phone_ring" },
    { speaker: "Mama", text: "Mijo! Can you see it? The Costco sign!", delay: 3000 },
    { speaker: "Chandler", text: "Mama? Is that you?", delay: 2500, action: "phone_call" },
    { speaker: "Mama", text: "I am with you in spirit. Run to the Glizzy!", delay: 3000 },
    { speaker: "Chandler", text: "I CAN TASTE THE RELISH!", delay: 2000, action: "phone_call" }
];

export const DIALOGUE_ENDING = [
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

// Happy ending (unlocked with enough coins)
export const DIALOGUE_ENDING_HAPPY = [
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
