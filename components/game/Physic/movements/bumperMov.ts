import { Mesh } from "@babylonjs/core";
import { 
  BUMPER_SPEED,
  BUMPER_BOUND_LEFT,
  BUMPER_BOUND_RIGHT,
  BUMPER_MID_LEFT,
  BUMPER_MID_RIGHT
} from "../constants";

export function movebumper(
  bumperLeft: Mesh,
  bumperRight: Mesh,
  bumperDirRef: { current: number },
  deltaTime: number
) 
{
    // la distance en vecteur = vitesse + delta + direction
    const moveAmount = BUMPER_SPEED * deltaTime * bumperDirRef.current;



    // chaque frame = un deplacement de moveAmount 
    // new = calcul du mouv avant attribution reeelle en dessous.
    let newLeftX  = bumperLeft.position.x  + moveAmount;
    let newRightX = bumperRight.position.x - moveAmount;





    //  les limites des bumpers. calcul par rapport au deplacement
    // -8  8 . si on est a  10 il renvoit 8
    newLeftX  = Math.max(BUMPER_BOUND_LEFT,  Math.min(BUMPER_BOUND_RIGHT, newLeftX));
    newRightX = Math.max(BUMPER_BOUND_LEFT,  Math.min(BUMPER_BOUND_RIGHT, newRightX));



    // 1 = vers le centre 
    // stop net. 
    if (bumperDirRef.current > 0) 
    {

        // si on arrive au middle = on se stop net ici.
        if (newLeftX >= BUMPER_MID_LEFT)
            newLeftX = BUMPER_MID_LEFT;


        if (newRightX <= BUMPER_MID_RIGHT)
            newRightX = BUMPER_MID_RIGHT;


    }
    else 
    {
        if (newLeftX <= BUMPER_BOUND_LEFT)
            newLeftX = BUMPER_BOUND_LEFT;

        if (newRightX >= BUMPER_BOUND_RIGHT)
            newRightX = BUMPER_BOUND_RIGHT;
    }


    // vrai position du bumper à la fin 
    bumperLeft.position.x  = newLeftX;
    bumperRight.position.x = newRightX;



    // Pour inverser la direction.
    if (bumperDirRef.current > 0) 
    {
        if (newLeftX  === BUMPER_MID_LEFT || newRightX === BUMPER_MID_RIGHT)
            bumperDirRef.current = -1;
    }
    else 
    {
        // On inverse si l'un revient à sa borne exterieure
        if (newLeftX  === BUMPER_BOUND_LEFT || newRightX === BUMPER_BOUND_RIGHT)
            bumperDirRef.current = 1;
    }
}