//Interface for debounce options
export interface DebounceOptions {
  leading?: boolean; //call immediately on first trigger
  trailing?: boolean; //call after delay (default: true)
  maxWait?: number; //ensure it runs at least once within this time
}

//Debounce function (returns a debounced version of input function)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  //Timer for main delay (reset after each keystroke)
  let timer: ReturnType<typeof setTimeout> | null = null;

  //Timestamps to track latest calls/invocations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let lastCallTime = 0;
  let lastInvokeTime = 0;

  //Timer for maxWait (ensures eventual execution)
  let maxTimer: ReturnType<typeof setTimeout> | null = null;

  //Store latest args passed to debounced function
  let lastArgs: Parameters<T> | null = null;

  //Extract options with default values
  const { leading = false, trailing = true, maxWait } = options;

  //Helper to run the actual function
  const invoke = () => {
    if (lastArgs) {
      func(...lastArgs); //call original function with latest args
      lastInvokeTime = Date.now(); //record timestamp of actual call
      lastArgs = null; //clear args after invoking
    }
  };

  //Main debounced function (returned)
  const debounced = (...args: Parameters<T>) => {
    const now = Date.now(); //current time
    const isInvoking = leading && !timer; //true only on first call if leading=true

    lastArgs = args; //save latest args
    lastCallTime = now; //record when this call happened

    //Call immediately on first trigger if leading=true
    if (isInvoking) {
      invoke();
    }

    //Clear any previous timer
    if (timer) {
      clearTimeout(timer);
    }

    //Set timer to run after wait (trailing edge)
    timer = setTimeout(() => {
      //Only call if trailing is true and maxWait is not violated
      if (trailing && (!maxWait || now - lastInvokeTime >= maxWait)) {
        invoke();
      }
      timer = null; //clear main timer
    }, wait);

    //Set a maxWait timer (if not already set)
    if (maxWait && !maxTimer) {
      maxTimer = setTimeout(() => {
        if (lastArgs) {
          invoke(); //force run after maxWait even if typing continues
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clearTimeout(timer!); //cancel main timer if pending
          timer = null;
        }
        maxTimer = null; //clear max timer
      }, maxWait);
    }
  };

  //Attach cancel method to clear timers manually
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    if (maxTimer) clearTimeout(maxTimer);
    timer = null;
    maxTimer = null;
    lastArgs = null;
  };

  return debounced;
}