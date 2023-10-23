import { useEffect, useCallback, useState, useRef } from 'react';
import type { RefObject, Dispatch, SetStateAction, FocusEvent } from 'react';

export function useFocusLogic(
  mainRef: RefObject<HTMLElement>,
  ignoreRefs: RefObject<HTMLElement>[] = [],
): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  (event: FocusEvent) => void,
  (event: FocusEvent) => void,
] {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (isActive) mainRef.current?.focus();
    else mainRef.current?.blur();
  }, [isActive, mainRef]);

  const handleFocus = useCallback(
    (event: FocusEvent): void => {
      if (mainRef.current?.contains(event.relatedTarget)) return;
      else setIsActive(true);
    },
    [mainRef],
  );

  const handleBlur = useCallback(
    (event: FocusEvent): void => {
      if (mainRef.current?.contains(event.relatedTarget)) return;
      else if (ignoreRefs.some((ref) => ref.current?.contains(event.relatedTarget))) return;
      else setIsActive(false);
    },
    [mainRef, ignoreRefs],
  );

  return [isActive, setIsActive, handleFocus, handleBlur];
}

export function useHoverLogic(delay: number): [boolean, () => void, () => void] {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(() => {
    setShouldShow(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    const timerId = setTimeout(() => {
      setShouldShow(false);
    }, delay);
    timerRef.current = timerId;
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    setShouldShow(false);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  return [shouldShow, handleMouseMove, handleMouseLeave];
}
