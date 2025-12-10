# Bubble Pop Game

A modern, interactive bubble-popping game built with vanilla HTML, CSS, and JavaScript. Features vibrant visual effects, multiple bubble types, power-ups, and an engaging combo system.

## Features

### Core Gameplay
- **Interactive Bubbles**: Click to pop colorful bubbles floating upward on the canvas
- **Tutorial System**: Learn all game mechanics before playing
- **Score System**: Earn points by popping bubbles and building combos
- **Progressive Difficulty**: Game gets harder as you advance through waves

### Advanced Mechanics

#### Bubble Types
1. **Normal Bubbles** (Blue/Red gradient)
   - Standard bubbles that build your combo
   - Base points: 10 points each

2. **Double-Points Bubbles** (Purple)
   - Worth 2x the base points
   - Perfect for quick score boosts

3. **Triple-Points Bubbles** (Gold)
   - Worth 3x the base points
   - Rare but valuable

4. **Bomb Bubbles** (Red with spikes)
   - Explodes and triggers chain reactions
   - Auto-pops nearby bubbles
   - Multiplies your combo meter

5. **Power-Up Bubbles** (Golden star)
   - Activates special effects when popped
   - Effects include: Slow Motion, 2X Points, Shield

### Combo System
- Chain pop bubbles to build a multiplier (up to 3x)
- Combo timer resets after 3 seconds of inactivity
- Higher combos multiply your score significantly
- Each combo level unlocks a new wave, increasing difficulty

### Power-Ups
- **Slow Motion**: Bubbles rise slower for 8 seconds
- **2X Points**: Double your points for 10 seconds
- **Shield**: Prevents losing when a bubble escapes for 8 seconds

### Visual Effects
- **Enhanced Sparkles**: 16 animated particles per bubble pop with glowing effects
- **Damage Numbers**: Floating points indicators showing what you earned
- **Smooth Animations**: Bubble spawning, popping, and UI transitions
- **Color-Matched Effects**: Sparkles match the bubble colors

## How to Play

1. **Start**: Click "Start Game" to begin
2. **Pop Bubbles**: Click on any bubble to pop it
3. **Build Combo**: Keep popping bubbles quickly to build your combo multiplier
4. **Collect Power-Ups**: Pop golden star bubbles to activate special effects
5. **Avoid Escapes**: Don't let bubbles reach the top of the screen (3 lives)
6. **Use Bombs**: Pop red bomb bubbles to trigger explosive chain reactions

### Game Controls
- **Left Click**: Pop a bubble
- **Pause Button**: Pause/Resume the game
- **Resume/Main Menu**: Options when paused

## Scoring

- **Base Points**: 10 points per normal bubble
- **Double Bubbles**: 20 points each
- **Triple Bubbles**: 30 points each
- **Combo Multiplier**: Applied to all points (1x → 3x based on combo level)
- **Bomb Chains**: Each nearby bubble popped adds to combo

## File Structure

\`\`\`
.
├── index.html       # Main HTML structure (game canvas, HUD, tutorial, pause screen)
├── style.css        # All styling and animations (modern gaming aesthetic)
├── script.js        # Complete game logic and mechanics
└── README.md        # This file
\`\`\`

## Code Organization (script.js)

### Key Sections
- **DOM Elements**: Canvas and UI element references
- **Game State**: Current score, lives, combo, wave, and pause status
- **Bubble Configuration**: Defines all bubble types and their properties
- **Initialization**: Sets up canvas, event listeners, and starts the game loop
- **Bubble Management**: Spawning, positioning, and removing bubbles
- **Game Logic**: Collision detection, scoring, combo system
- **Visual Effects**: Sparkles, damage numbers, and animations
- **Power-Up System**: Activation and effect management
- **Audio**: Sound effects for pops and interactions
- **UI Updates**: Score, combo, and wave display management
- **Pause System**: Game state freezing and resume functionality

## Game Loop

The game uses `requestAnimationFrame()` for smooth 60 FPS gameplay:
1. Update bubble positions
2. Check for bubbles escaping the screen
3. Update active power-up effects
4. Redraw all visual elements
5. Repeat

## Styling

The game uses a modern gaming aesthetic with:
- **Color Scheme**: Blue and red gradients with neon accents
- **Typography**: Poppins font for clean, modern feel
- **Effects**: Glass-morphism, glowing shadows, smooth transitions
- **Responsive**: Adapts to different screen sizes

## Getting Started

1. Open `index.html` in a web browser
2. Read the tutorial to understand all bubble types
3. Click "Start Game" to begin
4. Enjoy!

## Tips for High Scores

- **Build Combos**: Keep popping quickly to maintain your multiplier
- **Hunt for Bombs**: Red bomb bubbles trigger chain reactions and boost combos
- **Collect Power-Ups**: Golden stars provide significant advantages
- **Stay Focused**: Watch for patterns and don't let bubbles escape
- **Use Power-Up Effects**: Time your power-ups strategically for maximum impact

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (90+)
- Firefox (88+)
- Safari (14+)

## Future Enhancement Ideas

- Leaderboard system
- Multiple difficulty modes
- Additional power-ups
- Sound settings
- Mobile touch support optimization
- Multiplayer modes

---

**Made with ❤️ - Enjoy popping bubbles!**
