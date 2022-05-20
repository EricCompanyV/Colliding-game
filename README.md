# Collide game

https://ericcompanyv.github.io/Colliding-game/

## Description
This is a Space Invaders-like game. The user controls the player with the direction arrows and has to avoid colliding with obstacles or shoot them down with the spacebar. Obstacles and enemies shot down by player's missiles have a chance to drop different pills that can give the player plus one life to a maximum of 3, shield for 5 seconds or increased speed for 5 seconds.


## MVP
- Player moving in X and Y axis
- Obstacles droping from top of the screen
- Collision between obstacles and the player
- Game score
- Increase level/difficulty over time
- Player shooting missiles that collide with obstacles

## Backlog
- Pause screen
- Different obstacles 
- Power-ups droping from obstacles destruction
- Music
- Pause screen


## Data structure
Classes:
- Player
- Obstacle
- Missile
- Drop
- Enemy

Methods:
- drawPlayer
- collision
- damagePlayer
- objectDestruction
- restartGame
- updateVisuals
- randomSpawnByLevel
- toggleMuteGame
- drawObstacle
- drawMissile
- drawDrop
- drawEnemy
- animate
- startGame
- drawPauseScreen


## States y States Transitions
- Start screen
- Running game
- End game screen


## Task
_List of tasks in order of priority_

