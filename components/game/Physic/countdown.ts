// countdown.ts
// ----------------


export function startCountdown(
  duration: number,
  setIsPaused: (isPaused: boolean) => void,
  setCountdown: (countdown: number | null) => void,
  callback: () => void
) {
  setIsPaused(true);
  setCountdown(duration);
  let cnt = duration;
  const iv = setInterval(() => {
    cnt--;
    if (cnt > 0) {
      setCountdown(cnt);
    } else {
      clearInterval(iv);
      setCountdown(null);
      setIsPaused(false);
      callback();
    }
  }, 500);
}
