export function handleMovement(e, currentMovementState = {}) {
    // Default state if not provided
    const movementState = { ...currentMovementState };
    
    // Determine if key is pressed or released
    const isKeyDown = e.type === "keydown";
    
    switch (e.key) {
        case 'ArrowUp':
            movementState.moveUp = isKeyDown;
            break;
        case 'ArrowDown':
            movementState.moveDown = isKeyDown;
            break;
        case 'ArrowLeft':
            movementState.moveLeft = isKeyDown;
            break;
        case 'ArrowRight':
            movementState.moveRight = isKeyDown;
            break;
        case ' ':
            movementState.moveForward = isKeyDown; 
            break;
        case '/':
            movementState.moveBackward = isKeyDown;
            break;
    }
    
    return movementState;
}