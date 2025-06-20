import { Vector3, Mesh } from "@babylonjs/core";
import { PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT, PADDLE_SPEED } from "../constants";

export interface AIState {
    targetX: number; // La position X que l'IA essaie d'atteindre.
    lastUpdateTime: number; // Horodatage de la dernière mise à jour de la cible.
    velocityX: number; // Vitesse actuelle de la raquette sur l'axe X pour un mouvement fluide.
}

export const initializeAI = (): AIState => {
    return {
        targetX: 0,
        lastUpdateTime: 0,
        velocityX: 0,
    };
};


export const updateAIMovement = (
    ball: Mesh,
    ballV: Vector3,
    paddle2: Mesh,
    aiState: AIState,
    deltaTime: number,
    stamina: { player1: number; player2: number },
    superPad: { player1: boolean; player2: boolean },
    triggerSuperPad: (player: 1 | 2) => void,
    enableSpecial: boolean
) => {
    const currentTime = Date.now();

    if (currentTime - aiState.lastUpdateTime > 1000) { // L'IA "réfléchit" toutes les secondes
        aiState.lastUpdateTime = currentTime;

        // L'IA ne réagit que si la balle se dirige vers elle.
        if (ballV.z > 0 && ball.position.z < paddle2.position.z) {
            
            // --- 1. Prédiction de  trajectoire avec rebonds sur les murs ---
            const timeToReachPaddle = (paddle2.position.z - ball.position.z) / ballV.z;
            let predictedX = ball.position.x + (ballV.x * timeToReachPaddle);

            if (predictedX > PADDLE_BOUND_RIGHT) {
                const overshoot = predictedX - PADDLE_BOUND_RIGHT;
                predictedX = PADDLE_BOUND_RIGHT - overshoot;
            } 
            else if (predictedX < PADDLE_BOUND_LEFT) {
                const overshoot = PADDLE_BOUND_LEFT - predictedX;
                predictedX = PADDLE_BOUND_LEFT + overshoot;
            }

            // --- 2. Vise un point d'impact varié sur la raquette ---
            // Au lieu de toujours centrer, l'IA choisit où frapper la balle sur sa raquette.
            const hitOffset = (Math.random() - 0.5) * 5; // Variation de -2.5 à +2.5
            


            // Pour frapper la balle à sur predictedX avec un offset, le centre de la raquette doit être à `predictedX - hitOffset`.
            aiState.targetX = predictedX - hitOffset;




            // 30% du temps, elle se  trmpe
            if (Math.random() < 0.3) {
                const mistake = (Math.random() - 0.5) * 2;
                aiState.targetX += mistake;
            }

            if (
                enableSpecial &&
                stamina.player2 === 5 &&
                !superPad.player2
            ) {
                const distanceToPredictedTarget = Math.abs(aiState.targetX - paddle2.position.x);
                if (distanceToPredictedTarget > 4) {
                    triggerSuperPad(2);
                }
            }
        } else {


            // Si la balle ne vient pas vers elle, l'IA retourne au centre.
            aiState.targetX = 0;
        }
    }







    const force = aiState.targetX - paddle2.position.x;




    const acceleration = 35; // augmenter  pour plus de réactivité
    aiState.velocityX += force * acceleration * deltaTime;





    const damping = 0.75; // Réduit pour moins d'inertie (freine plus vite)
    aiState.velocityX *= damping;





    if (Math.abs(aiState.velocityX) > PADDLE_SPEED) {
        aiState.velocityX = Math.sign(aiState.velocityX) * PADDLE_SPEED;
    }
    paddle2.position.x += aiState.velocityX * deltaTime;





    paddle2.position.x = Math.max(
        PADDLE_BOUND_LEFT,
        Math.min(PADDLE_BOUND_RIGHT, paddle2.position.x)
    );
}; 