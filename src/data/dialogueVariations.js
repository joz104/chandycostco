/**
 * Dialogue Variations System
 * Provides multiple dialogue options for replayability
 * Variations are selected based on playthrough count, difficulty, and game context
 */

// ============================================================================
// INTRO VARIATIONS
// ============================================================================

const INTRO_VARIATION_A = [
    { speaker: "Chandler", text: "Mama... I have to go. The village has no hotdogs left.", delay: 3000 },
    { speaker: "Mama", text: "Oh, mi hijo. You go to the North? To the land of Costco?", delay: 3000 },
    { speaker: "Chandler", text: "Si. I dream of the Freedom Glizzy. $1.50 with a soda.", delay: 3500 },
    { speaker: "Mama", text: "It is dangerous! The Wall... The ICE... The heat!", delay: 3000 },
    { speaker: "Chandler", text: "I am fast, Mama. Like the wind.", delay: 2500 },
    { speaker: "Mama", text: "Take these flip-flops. And do not forget who you are.", delay: 3500 },
    { speaker: "Chandler", text: "Adios, Mama. I will bring you back a churro.", delay: 2000 }
];

const INTRO_VARIATION_B = [
    { speaker: "Chandler", text: "The village is out of hotdogs, Mama. I must leave.", delay: 3000 },
    { speaker: "Mama", text: "Again? This is the third time this week!", delay: 3000 },
    { speaker: "Chandler", text: "The Costco calls to me... I can taste the mustard already.", delay: 3500 },
    { speaker: "Mama", text: "You are obsessed! What about the dangers?", delay: 3000 },
    { speaker: "Chandler", text: "Danger is just spice on the journey, Mama.", delay: 2500 },
    { speaker: "Mama", text: "Fine. But this time, bring me back the BIG churro.", delay: 3500 },
    { speaker: "Chandler", text: "The biggest one they have. I promise.", delay: 2000 }
];

const INTRO_VARIATION_C = [
    { speaker: "Mama", text: "Chandler! Where do you think you're going?", delay: 3000 },
    { speaker: "Chandler", text: "North, Mama. The prophecy spoke of the Sacred Glizzy.", delay: 3000 },
    { speaker: "Mama", text: "The prophecy? You mean that expired coupon you found?", delay: 3500 },
    { speaker: "Chandler", text: "It expires tomorrow! This is a sign!", delay: 3000 },
    { speaker: "Mama", text: "You're crazy. But you get that from your father...", delay: 2500 },
    { speaker: "Chandler", text: "Tell Papa I'll bring back samples.", delay: 2500 },
    { speaker: "Mama", text: "May the Costco gods watch over you.", delay: 2000 }
];

// ============================================================================
// L2 - COYOTE VARIATIONS
// ============================================================================

const L2_VARIATION_A = [
    { speaker: "Chandler", text: "Phew! The desert. It is so quiet...", delay: 3000 },
    { speaker: "Coyote", text: "Turn back, little one. The heat takes everyone.", delay: 3000 },
    { speaker: "Chandler", text: "A talking Coyote?! Am I hallucinating?", delay: 3000 },
    { speaker: "Coyote", text: "Maybe. Or maybe I am ICE in disguise. Awoooo!", delay: 3000 },
    { speaker: "Chandler", text: "I don't care! I have a coupon!", delay: 2000 }
];

const L2_VARIATION_B = [
    { speaker: "Chandler", text: "This heat... I can barely see straight...", delay: 3000 },
    { speaker: "Coyote", text: "The bones of travelers litter this desert, child.", delay: 3000 },
    { speaker: "Chandler", text: "You again?! How many talking coyotes are there?", delay: 3000 },
    { speaker: "Coyote", text: "None who cross here make it to Costco alive...", delay: 3500 },
    { speaker: "Chandler", text: "Then I'll be the first! Watch me!", delay: 2000 }
];

const L2_VARIATION_C = [
    { speaker: "Chandler", text: "The desert... endless sand...", delay: 3000 },
    { speaker: "Coyote", text: "I have seen your future in the stars, little one.", delay: 3500 },
    { speaker: "Chandler", text: "What? Who are you?!", delay: 2500 },
    { speaker: "Coyote", text: "I see... relish. So much relish. And onions.", delay: 3500 },
    { speaker: "Chandler", text: "The mystical coyote speaks truth! I WILL have onions!", delay: 3000 },
    { speaker: "Coyote", text: "But beware the mustard of regret... Awoooo!", delay: 2500 }
];

// ============================================================================
// L3 - ALLIGATOR VARIATIONS
// ============================================================================

const L3_VARIATION_A = [
    { speaker: "Chandler", text: "The River! I must cross before...", delay: 2500 },
    { speaker: "Alligator", text: "SNAP SNAP. Tasty toes.", delay: 3000, action: "gator_snap" },
    { speaker: "Chandler", text: "Please Mr. Gator, I am just passing through!", delay: 3000 },
    { speaker: "Alligator", text: "The toll is one leg. Or a chicken nugget.", delay: 3000 },
    { speaker: "Chandler", text: "I need my legs! See ya later alligator!", delay: 2000 }
];

const L3_VARIATION_B = [
    { speaker: "Chandler", text: "The water looks... bitey.", delay: 2500 },
    { speaker: "Alligator", text: "RIDDLE TIME! Answer correctly or become lunch!", delay: 3500, action: "gator_snap" },
    { speaker: "Chandler", text: "A riddle?! I didn't study for this!", delay: 3000 },
    { speaker: "Alligator", text: "What's better than a hotdog? TRICK QUESTION! NOTHING!", delay: 3500 },
    { speaker: "Chandler", text: "Correct! Now let me pass!", delay: 2000 },
    { speaker: "Alligator", text: "You may proceed... this time.", delay: 2000 }
];

const L3_VARIATION_C = [
    { speaker: "Chandler", text: "Almost across... just a little further...", delay: 2500 },
    { speaker: "Alligator", text: "TOLL TIME! I'll take your shoes, your shirt, AND your dreams!", delay: 3500, action: "gator_snap" },
    { speaker: "Chandler", text: "You can't have my dreams! They're all I have!", delay: 3000 },
    { speaker: "Alligator", text: "Then pay with... your SOCKS!", delay: 3000 },
    { speaker: "Chandler", text: "I'm wearing flip-flops! No socks! Checkmate!", delay: 3000 },
    { speaker: "Alligator", text: "Clever... too clever. GO!", delay: 2000 }
];

// ============================================================================
// L4 - AGENT VARIATIONS
// ============================================================================

const L4_VARIATION_A = [
    { speaker: "Chandler", text: "Ay caramba! The Wall! It is huge!", delay: 3000 },
    { speaker: "Agent", text: "HALT! RESTRICTED AREA! TURN BACK!", delay: 3000, action: "agent_scan" },
    { speaker: "Chandler", text: "I cannot! The coupon expires tomorrow!", delay: 3000 },
    { speaker: "Agent", text: "Deploying searchlights! Release the drones!", delay: 3000, action: "deploy_drones" },
    { speaker: "Chandler", text: "You cannot stop the hunger of a free man!", delay: 2500 }
];

const L4_VARIATION_B = [
    { speaker: "Chandler", text: "The Wall looms before me... intimidating...", delay: 3000 },
    { speaker: "Agent", text: "SCANNING... UNAUTHORIZED ENTITY DETECTED...", delay: 3500, action: "agent_scan" },
    { speaker: "Chandler", text: "Are you a robot?! This is getting weird!", delay: 3000 },
    { speaker: "Agent", text: "THREAT LEVEL: HOTDOG. INITIATING PROTOCOL MUSTARD.", delay: 3500, action: "deploy_drones" },
    { speaker: "Chandler", text: "Protocol Mustard?! That's my favorite protocol!", delay: 2500 }
];

const L4_VARIATION_C = [
    { speaker: "Chandler", text: "So close... I can see the lights of freedom...", delay: 3000 },
    { speaker: "Agent", text: "Kid, turn back. It's not worth it. Trust me.", delay: 3500, action: "agent_scan" },
    { speaker: "Chandler", text: "You... you're trying to help me?", delay: 2500 },
    { speaker: "Agent", text: "I used to dream of hotdogs too. Before... the job.", delay: 3500 },
    { speaker: "Chandler", text: "Then you understand! Let me pass!", delay: 2500 },
    { speaker: "Agent", text: "I can't. But I won't try too hard. Good luck, kid.", delay: 3000, action: "deploy_drones" }
];

// ============================================================================
// L5 - PHONE CALL WITH MAMA VARIATIONS
// ============================================================================

const L5_VARIATION_A = [
    { speaker: "Chandler", text: "I made it! The street... it is so grey!", delay: 3000, action: "phone_call" },
    { speaker: "Mama", text: "Mijo! Can you see it? The Costco sign!", delay: 3000 },
    { speaker: "Chandler", text: "Mama? Is that you?", delay: 2500, action: "phone_call" },
    { speaker: "Mama", text: "I am with you in spirit. Run to the Glizzy!", delay: 3000 },
    { speaker: "Chandler", text: "I CAN TASTE THE RELISH!", delay: 2000, action: "phone_call" }
];

const L5_VARIATION_B = [
    { speaker: "Chandler", text: "The suburbs! So many houses! So much... lawn!", delay: 3000, action: "phone_call" },
    { speaker: "Mama", text: "Mijo! You're almost there! I can feel it!", delay: 3000 },
    { speaker: "Chandler", text: "Mama! I survived everything!", delay: 2500, action: "phone_call" },
    { speaker: "Mama", text: "The ancestors smile upon you! And also they're hungry!", delay: 3500 },
    { speaker: "Chandler", text: "Tell them I'll bring back SAMPLES!", delay: 2000, action: "phone_call" }
];

const L5_VARIATION_C = [
    { speaker: "Chandler", text: "America... I'm really here...", delay: 3000, action: "phone_call" },
    { speaker: "Mama", text: "Chandler! The whole village is watching on TV!", delay: 3500 },
    { speaker: "Chandler", text: "What?! How?!", delay: 2000, action: "phone_call" },
    { speaker: "Mama", text: "Someone started a livestream! You have 10,000 viewers!", delay: 3500 },
    { speaker: "Chandler", text: "DON'T FORGET TO LIKE AND SUBSCRIBE!", delay: 2500, action: "phone_call" }
];

// ============================================================================
// ENDING VARIATIONS - Based on coin count
// ============================================================================

// NO COINS (0 coins = $0.00)
const ENDING_BROKE = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000 },
    { speaker: "Chandler", text: "Cash! I have it right... wait...", delay: 2500, action: "check_pockets" },
    { speaker: "Chandler", text: "No... NO! MY POCKETS ARE EMPTY!", delay: 3500, action: "shock" },
    { speaker: "Cashier", text: "You came all this way with NO MONEY?", delay: 3000 },
    { speaker: "Chandler", text: "I... I thought the journey was the reward?", delay: 3000 },
    { speaker: "Cashier", text: "The reward is a HOTDOG. Get out.", delay: 3000 },
    { speaker: "Cashier", text: "SECURITY! REMOVE THIS PENNILESS FOOL!", delay: 2500, action: "call_security" }
];

// 1-2 COINS ($0.25-$0.50)
const ENDING_DESPERATE = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000 },
    { speaker: "Chandler", text: "I have... one quarter... maybe two...", delay: 3000, action: "check_pockets" },
    { speaker: "Chandler", text: "Fifty cents! That's... that's something, right?", delay: 3500, action: "shock" },
    { speaker: "Cashier", text: "It's $1.50. You're short by a DOLLAR.", delay: 3000 },
    { speaker: "Chandler", text: "Please! I crossed a DESERT! And a RIVER! And ICE!", delay: 3500 },
    { speaker: "Cashier", text: "Should've crossed with more quarters.", delay: 3000 },
    { speaker: "Cashier", text: "SECURITY! WE HAVE A BEGGAR!", delay: 2000, action: "call_security" }
];

// 3-5 COINS ($0.75-$1.25) - SO CLOSE
const ENDING_CLOSE = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000 },
    { speaker: "Chandler", text: "Cash. One dollar... and... twenty-five cents!", delay: 3000, action: "check_pockets" },
    { speaker: "Chandler", text: "Wait... one, two, three, four, five quarters...", delay: 4000 },
    { speaker: "Chandler", text: "NO! I'M 25 CENTS SHORT!", delay: 3500, action: "shock" },
    { speaker: "Cashier", text: "So close. Yet so far.", delay: 3000 },
    { speaker: "Chandler", text: "Please! Can't you make an exception?!", delay: 3000 },
    { speaker: "Cashier", text: "Store policy. No mercy for the poor.", delay: 3000 },
    { speaker: "Cashier", text: "SECURITY! REMOVE THIS ALMOST-CUSTOMER!", delay: 2000, action: "call_security" }
];

// 6 COINS (Exact $1.50) - PERFECT
const ENDING_EXACT = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000 },
    { speaker: "Chandler", text: "Cash! One dollar... fifty cents!", delay: 2500, action: "check_pockets" },
    { speaker: "Cashier", text: "Exact change. Here's your Glizzy.", delay: 3000 },
    { speaker: "Chandler", text: "THE FREEDOM GLIZZY! IT IS BEAUTIFUL!", delay: 3500, action: "victory" },
    { speaker: "Chandler", text: "Mama... I made it. This is for you.", delay: 3000 }
];

// 7-9 COINS ($1.75-$2.25) - GENEROUS
const ENDING_TIP_SMALL = [
    { speaker: "Chandler", text: "One Glizzy Combo please. Extra mustard.", delay: 3000 },
    { speaker: "Cashier", text: "That'll be $1.50. Cash or card?", delay: 3000 },
    { speaker: "Chandler", text: "Cash! Here's TWO DOLLARS!", delay: 2500, action: "check_pockets" },
    { speaker: "Cashier", text: "Oh! Your change is fifty cents.", delay: 2500 },
    { speaker: "Chandler", text: "Keep it! You work hard!", delay: 2500, action: "victory" },
    { speaker: "Cashier", text: "Wow! Thanks! Here's extra napkins!", delay: 3000 },
    { speaker: "Chandler", text: "THE FREEDOM GLIZZY! AND NAPKINS!", delay: 3000 }
];

// 10+ COINS ($2.50+) - BIG SPENDER
const ENDING_RICH = [
    { speaker: "Chandler", text: "Give me TWO Glizzy Combos! Extra everything!", delay: 3000 },
    { speaker: "Cashier", text: "Big spender! That'll be $3.00.", delay: 3000 },
    { speaker: "Chandler", text: "Here's FOUR DOLLARS! Keep the change!", delay: 2500, action: "check_pockets" },
    { speaker: "Cashier", text: "A DOLLAR TIP?! You're the best customer all day!", delay: 3500 },
    { speaker: "Chandler", text: "I am a MAN OF WEALTH now!", delay: 3000, action: "victory" },
    { speaker: "Cashier", text: "Here's EXTRA churros! On the house!", delay: 3000 },
    { speaker: "Chandler", text: "MAMA! I'M BRINGING HOME A FEAST!", delay: 3000 }
];

// 15+ COINS ($3.75+) - COSTCO LEGEND
const ENDING_LEGEND = [
    { speaker: "Chandler", text: "I'll take THREE combos! And a whole pizza!", delay: 3000 },
    { speaker: "Cashier", text: "Wow! That's $5.50!", delay: 2500 },
    { speaker: "Chandler", text: "Here's TEN DOLLARS! I'm feeling GENEROUS!", delay: 3000, action: "check_pockets" },
    { speaker: "Cashier", text: "MANAGER! WE HAVE A COSTCO LEGEND HERE!", delay: 3500 },
    { speaker: "Chandler", text: "This is the greatest day of my life!", delay: 3000, action: "victory" },
    { speaker: "Cashier", text: "Sir, you've earned a FREE MEMBERSHIP CARD!", delay: 3500 },
    { speaker: "Chandler", text: "MAMA! I'M NEVER LEAVING COSTCO!", delay: 3000 }
];

// ============================================================================
// VARIATION STORAGE
// ============================================================================

const VARIATIONS = {
    intro: [INTRO_VARIATION_A, INTRO_VARIATION_B, INTRO_VARIATION_C],
    L2: [L2_VARIATION_A, L2_VARIATION_B, L2_VARIATION_C],
    L3: [L3_VARIATION_A, L3_VARIATION_B, L3_VARIATION_C],
    L4: [L4_VARIATION_A, L4_VARIATION_B, L4_VARIATION_C],
    L5: [L5_VARIATION_A, L5_VARIATION_B, L5_VARIATION_C]
};

// ============================================================================
// SELECTION FUNCTIONS
// ============================================================================

/**
 * Get play count from localStorage or return 0
 */
function getPlayCount() {
    const saved = localStorage.getItem('chandyglizzy_save');
    if (!saved) return 0;

    try {
        const data = JSON.parse(saved);
        return data.gamesPlayed || 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Get a dialogue variation based on context
 * @param {string} dialogueKey - The dialogue identifier (intro, L2, L3, L4, L5, ending)
 * @param {object} context - Context object containing playCount, coins, difficulty, etc.
 * @returns {array} The selected dialogue array
 */
export function getDialogueVariation(dialogueKey, context = {}) {
    // Default context values
    const playCount = context.playCount !== undefined ? context.playCount : getPlayCount();
    const coins = context.coins || 0;
    const difficulty = context.difficulty || 'normal';

    // Special handling for ending based on coins
    if (dialogueKey === 'ending') {
        return getEndingVariation(coins);
    }

    // Get variations for this key
    const variations = VARIATIONS[dialogueKey];
    if (!variations || variations.length === 0) {
        console.warn(`No variations found for dialogue key: ${dialogueKey}`);
        return [];
    }

    // Select variation based on playCount
    // Cycle through variations: playCount 0-2 = var A, 3-5 = var B, 6+ = var C, then repeat
    const cyclePosition = Math.floor(playCount / 3) % variations.length;
    const selectedVariation = variations[cyclePosition];

    console.log(`Selected ${dialogueKey} variation ${cyclePosition} (play count: ${playCount})`);

    return selectedVariation;
}

/**
 * Get ending variation based on coin count
 * @param {number} coins - Number of coins collected
 * @returns {array} The appropriate ending dialogue
 */
export function getEndingVariation(coins) {
    // Calculate money: each coin is $0.25
    const money = coins * 0.25;

    console.log(`Coins collected: ${coins} ($${money.toFixed(2)})`);

    if (coins >= 15) {
        // $3.75+ = LEGEND STATUS
        console.log('Ending: LEGEND (15+ coins)');
        return ENDING_LEGEND;
    } else if (coins >= 10) {
        // $2.50+ = Rich
        console.log('Ending: RICH (10+ coins)');
        return ENDING_RICH;
    } else if (coins >= 7) {
        // $1.75-$2.25 = Small tip
        console.log('Ending: TIP (7-9 coins)');
        return ENDING_TIP_SMALL;
    } else if (coins === 6) {
        // Exactly $1.50 = Perfect
        console.log('Ending: EXACT (6 coins)');
        return ENDING_EXACT;
    } else if (coins >= 3) {
        // $0.75-$1.25 = So close
        console.log('Ending: CLOSE (3-5 coins)');
        return ENDING_CLOSE;
    } else if (coins >= 1) {
        // $0.25-$0.50 = Desperate
        console.log('Ending: DESPERATE (1-2 coins)');
        return ENDING_DESPERATE;
    } else {
        // $0.00 = Broke
        console.log('Ending: BROKE (0 coins)');
        return ENDING_BROKE;
    }
}

/**
 * Get random variation (for manual selection if desired)
 * @param {string} dialogueKey - The dialogue identifier
 * @returns {array} Random dialogue variation
 */
export function getRandomVariation(dialogueKey) {
    const variations = VARIATIONS[dialogueKey];
    if (!variations || variations.length === 0) {
        console.warn(`No variations found for dialogue key: ${dialogueKey}`);
        return [];
    }

    const randomIndex = Math.floor(Math.random() * variations.length);
    return variations[randomIndex];
}

/**
 * Get specific variation by index
 * @param {string} dialogueKey - The dialogue identifier
 * @param {number} index - Variation index (0, 1, 2, etc.)
 * @returns {array} Specific dialogue variation
 */
export function getSpecificVariation(dialogueKey, index) {
    const variations = VARIATIONS[dialogueKey];
    if (!variations || variations.length === 0) {
        console.warn(`No variations found for dialogue key: ${dialogueKey}`);
        return [];
    }

    if (index < 0 || index >= variations.length) {
        console.warn(`Invalid variation index ${index} for ${dialogueKey}. Defaulting to 0.`);
        return variations[0];
    }

    return variations[index];
}

/**
 * Preview all variations for a given key (for debugging/testing)
 * @param {string} dialogueKey - The dialogue identifier
 */
export function previewAllVariations(dialogueKey) {
    console.log(`\n=== PREVIEWING ALL VARIATIONS FOR: ${dialogueKey} ===`);

    if (dialogueKey === 'ending') {
        console.log('\nBROKE (0 coins):', ENDING_BROKE);
        console.log('\nDESPERATE (1-2 coins):', ENDING_DESPERATE);
        console.log('\nCLOSE (3-5 coins):', ENDING_CLOSE);
        console.log('\nEXACT (6 coins):', ENDING_EXACT);
        console.log('\nTIP (7-9 coins):', ENDING_TIP_SMALL);
        console.log('\nRICH (10+ coins):', ENDING_RICH);
        console.log('\nLEGEND (15+ coins):', ENDING_LEGEND);
        return;
    }

    const variations = VARIATIONS[dialogueKey];
    if (!variations) {
        console.log('No variations found!');
        return;
    }

    variations.forEach((variation, index) => {
        console.log(`\nVariation ${index}:`, variation);
    });
}

// Export all variations for direct access if needed
export {
    INTRO_VARIATION_A,
    INTRO_VARIATION_B,
    INTRO_VARIATION_C,
    L2_VARIATION_A,
    L2_VARIATION_B,
    L2_VARIATION_C,
    L3_VARIATION_A,
    L3_VARIATION_B,
    L3_VARIATION_C,
    L4_VARIATION_A,
    L4_VARIATION_B,
    L4_VARIATION_C,
    L5_VARIATION_A,
    L5_VARIATION_B,
    L5_VARIATION_C,
    ENDING_BROKE,
    ENDING_DESPERATE,
    ENDING_CLOSE,
    ENDING_EXACT,
    ENDING_TIP_SMALL,
    ENDING_RICH,
    ENDING_LEGEND
};
