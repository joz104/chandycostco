# Sound Design Document
## Chandler's Freedom Glizzy Run

A comprehensive audio design for the cutscene system.

---

## Scene 1: Intro - The Departure

**Setting**: Mexican village at dawn

### Ambient Layer
- **Primary**: `village_morning`
  - Birds chirping (distant)
  - Light wind through trees
  - Distant rooster crowing
  - Subtle village sounds (doors, distant voices)

### Music
- **Track**: `emotional_departure`
  - Gentle acoustic guitar
  - Soft strings building emotion
  - Reflective, bittersweet tone
  - Gradual build as Chandler leaves

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Chandler walks | `footsteps` | Soft flip-flop slaps |
| Birds background | `birds_chirping` | Morning songbirds |

### Emotional Arc
Starts peaceful and nostalgic, builds to hopeful determination.

---

## Scene 2: Desert - The Coyote

**Setting**: Scorching desert, midday

### Ambient Layer
- **Primary**: `desert_wind`
  - Constant low wind howl
  - Heat shimmer effect (subtle high frequencies)
  - Occasional tumbleweeds
  - Sparse, eerie emptiness

### Music
- **Track**: `desert_heat`
  - Suspenseful strings
  - Distant, echoing guitar
  - Minimalist, tense atmosphere
  - Building paranoia

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Coyote howls | `coyote_howl` | Long, haunting howl |
| Wind gusts | `heat_shimmer` | Shimmering, disorienting sound |
| Tumbleweed | `tumbleweeds` | Rolling dry brush |

### Emotional Arc
Desolate, unsettling, psychological tension. The heat is a character.

---

## Scene 3: River - The Alligator

**Setting**: River crossing, afternoon

### Ambient Layer
- **Primary**: `river_water`
  - Flowing water (medium current)
  - Splashing, bubbling
  - Frogs, insects
  - Water lapping against banks

### Music
- **Track**: `tension_river`
  - Low strings building tension
  - Percussion like heartbeat
  - Water-like synthesizers
  - Sudden stingers for danger

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Gator appears | `jaw_snap` | Heavy, mechanical jaw snap |
| Gator growls | `gator_hiss` | Deep, reptilian hiss |
| Chandler runs | `splash` | Water splashing, running through river |
| River flows | `water_flow` | Continuous water movement |

### Emotional Arc
Starts calm, escalates to immediate danger, relief at escape.

---

## Scene 4: The Wall - Border Patrol

**Setting**: Border wall, night

### Ambient Layer
- **Primary**: `night_tension`
  - Low ominous drone
  - Distant searchlights buzzing
  - Electric fence hum
  - Wind through metal structures

### Music
- **Track**: `border_patrol`
  - Heavy electronic beats
  - Industrial sounds
  - Alarm-like synths
  - Mechanical, oppressive atmosphere

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Agent scans | `scanner_beep` | Electronic scanning beeps |
| Drones launch | `drone_launch` | Whirring propellers, mechanical activation |
| Drones fly | `drone_hum` | Persistent buzzing/humming |
| Searchlights | `searchlight` | Electric motor, light beam sweep |
| Alarm triggers | `alarm` | Blaring warning siren |
| Agent radio | `walkie_talkie` | Radio static, distorted voice |

### Emotional Arc
Maximum tension, cat-and-mouse chase, technological oppression, adrenaline.

---

## Scene 5: Suburbia - The Final Stretch

**Setting**: American suburb, late afternoon

### Ambient Layer
- **Primary**: `suburban_quiet`
  - Light traffic in distance
  - Suburban neighborhood sounds
  - Lawnmowers (distant)
  - Kids playing (far off)
  - Pleasant, almost surreal calm

### Music
- **Track**: `final_stretch`
  - Hopeful, building melody
  - Triumphant brass emerging
  - Emotional strings
  - Victory is near

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Phone rings | `phone_ring` | Classic ringtone |
| Phone answered | `phone_dial` | Connection beep |
| Car passes | `car_pass` | Vehicle driving by |
| City sounds | `city_ambience` | Light urban background |

### Emotional Arc
Relief, hope, nostalgia for home, determination. The dream is in sight.

---

## Ending 1: Bad Ending - The Quarter

**Setting**: Inside Costco, fluorescent lighting

### Ambient Layer
- **Primary**: `costco_interior`
  - Muzak playing faintly
  - Shopping carts rattling
  - Cash registers beeping
  - Crowd murmuring
  - PA system announcements

### Music
- **Track**: `sad_ending`
  - Melancholic piano
  - Descending strings
  - Quiet, defeated tone
  - Brief moment of hope at end (stranger helps)

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Register opens | `cash_register` | Classic register ding/drawer |
| Counting coins | `coins_jingle` | Metallic coin sounds |
| Realization | `dramatic_sting` | Sharp, sudden musical hit |
| Security called | `security_whistle` | Sharp whistle blow |
| Stranger helps | `coins_jingle` | Single quarter drop |
| Crowd watches | `crowd_murmur` | Sympathetic murmuring |

### Emotional Arc
Hope → devastation → rock bottom → unexpected redemption → bittersweet hope.

---

## Ending 2: Good Ending - Freedom Achieved

**Setting**: Inside Costco, victorious

### Ambient Layer
- **Primary**: `costco_interior`
  - Same as bad ending but brighter
  - More energetic crowd sounds
  - Celebratory atmosphere

### Music
- **Track**: `victory_theme`
  - Triumphant brass fanfare
  - Uplifting strings
  - Celebration and joy
  - Full orchestral swell for reunion

### Sound Effects
| Trigger | Effect | Description |
|---------|--------|-------------|
| Register opens | `cash_register` | Triumphant register ding |
| Exact change | `coins_jingle` | Perfect coin clink |
| Victory moment | `victory_jingle` | Brief celebratory tune |
| Crowd reacts | `crowd_cheer` | Applause, celebration |
| Eating glizzy | `glizzy_bite` | Satisfying bite/crunch |

### Emotional Arc
Tension → relief → pure joy → satisfaction → emotional reunion → complete fulfillment.

---

## Audio Technical Specifications

### Ambient Sounds
- **Format**: MP3/OGG (looping)
- **Length**: 30-60 seconds with seamless loops
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 128-192 kbps
- **Channels**: Stereo
- **Default Volume**: 30%

### Music Tracks
- **Format**: MP3/OGG (looping)
- **Length**: 2-4 minutes with loop markers
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 192-256 kbps
- **Channels**: Stereo
- **Default Volume**: 50%

### Sound Effects
- **Format**: MP3/OGG (one-shot)
- **Length**: 0.1-2 seconds
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 128 kbps
- **Channels**: Stereo or Mono
- **Default Volume**: 70%

---

## Audio Mixing Guidelines

### Volume Levels
1. **Dialogue** (if added): Loudest, clear and intelligible
2. **Effects**: Clear but not overwhelming
3. **Music**: Supporting, emotional backdrop
4. **Ambient**: Subtle, sets mood without distraction

### Ducking Behavior
- Music reduces by 30% when dialogue/effects play
- Ambient reduces by 20% when dialogue plays
- Effects always play at full specified volume

### Crossfading
- Ambient transitions: 1-2 seconds
- Music transitions: 2-3 seconds
- Effects: No fade (immediate)

---

## Dynamic Audio Layers

### Intro Scene
```
0:00 - Birds chirping (ambient)
0:05 - Music fades in (emotional guitar)
0:10 - Dialogue begins
0:45 - Footsteps (when Chandler mentions running)
1:30 - Music swells (departure moment)
1:45 - Fade out for transition
```

### Desert Scene
```
0:00 - Desert wind fades in
0:03 - Music begins (tense, minimal)
0:15 - Heat shimmer effect (subtle)
0:40 - Coyote howl (dramatic entrance)
1:20 - Wind intensifies
1:45 - Music crescendo
2:00 - Transition out
```

### River Scene
```
0:00 - River water flowing
0:05 - Music fade in (tension building)
0:20 - Dialogue begins
0:45 - First jaw snap (shock moment)
1:10 - Gator hiss
1:30 - Splash sounds (escape)
1:50 - Music resolves
2:00 - Fade out
```

### Wall Scene
```
0:00 - Night drone, distant alarms
0:05 - Music (industrial, intense)
0:20 - Scanner beep (agent appears)
0:50 - Searchlight sweep
1:10 - Drone launch (multiple sounds)
1:15 - Drone hum (continuous)
1:30 - Walkie talkie static
1:50 - Full alarm activation
2:10 - Intense music peak
2:20 - Escape, fade out
```

### Suburbia Scene
```
0:00 - Suburban ambience fade in
0:05 - Hopeful music begins
0:25 - Phone ring (Mama calls)
0:30 - Phone connection beep
1:00 - Car passes in distance
1:30 - Music builds to climax
1:55 - Triumphant peak
2:10 - Transition to Costco
```

---

## Implementation Priority

### Phase 1: Essential Effects
1. `cash_register` - Critical for ending
2. `coins_jingle` - Critical for ending
3. `victory_jingle` - Good ending payoff
4. `security_whistle` - Bad ending impact
5. `dramatic_sting` - Key emotional moment

### Phase 2: Character Effects
6. `jaw_snap` - Alligator personality
7. `scanner_beep` - Agent presence
8. `coyote_howl` - Desert atmosphere
9. `phone_ring` - Emotional connection
10. `drone_launch` - Action moment

### Phase 3: Ambient Layers
11. `village_morning` - Sets tone
12. `desert_wind` - Atmosphere
13. `river_water` - Immersion
14. `night_tension` - Drama
15. `suburban_quiet` - Contrast
16. `costco_interior` - Final setting

### Phase 4: Music Tracks
17. `emotional_departure` - Opening emotion
18. `victory_theme` - Ending payoff
19. `sad_ending` - Emotional depth
20. `border_patrol` - Intensity peak
21. `tension_river` - Mid-game tension
22. `desert_heat` - Early challenge
23. `final_stretch` - Building hope

---

## Audio References & Inspiration

### Ambient
- **Desert**: Mad Max, Breaking Bad desert scenes
- **River**: Apocalypse Now river sounds
- **Suburbia**: Edward Scissorhands suburban soundscape
- **Costco**: Any big-box store ambience

### Music
- **Emotional**: Pixar's Coco, Up opening
- **Tension**: No Country for Old Men
- **Victory**: Rocky training montage
- **Desert**: The Good, The Bad and The Ugly

### Effects
- **Realistic**: Modern sound design, natural recordings
- **Stylized**: Slight exaggeration for clarity and impact
- **Consistent**: All effects match the game's tone

---

## Accessibility Considerations

- Provide subtitles/captions for important sound cues
- Allow independent volume control for each category
- Support complete audio disable option
- Visual indicators for important audio events
- Don't rely solely on audio for critical gameplay info

---

## Future Enhancements

- **Adaptive Music**: Changes based on player's health/score
- **3D Positional Audio**: Sounds come from character positions
- **Dynamic Mixing**: Real-time audio adjustments
- **Voice Acting**: Actual character voices (future expansion)
- **Audio Sprites**: Combine small effects for efficiency
- **Audio Variations**: Multiple versions of effects for variety
- **Reverb Zones**: Different acoustic spaces per scene
