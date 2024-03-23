import { Color } from 'chroma-js';
import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import type { RefObject, Dispatch, SetStateAction, FocusEvent } from 'react';
import { cleanHsv } from './math/color';

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
    [mainRef, ...ignoreRefs],
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

export function useElementSize(ref: RefObject<HTMLElement>): [number, number] {
  const [elWidth, setElWidth] = useState(1);
  const [elHeight, setElHeight] = useState(1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setElWidth(ref.current?.offsetWidth || 0);
      setElHeight(ref.current?.offsetHeight || 0);
    });

    if(ref.current) resizeObserver.observe(ref.current);
  });

  return [elWidth, elHeight];
}

export function usePreservedHsv(color: Color): [
  number,
  number,
  number,
  Dispatch<SetStateAction<number>>,
  Dispatch<SetStateAction<number>>
] {
  const [currentHue, currentSat, val] = useMemo(() => cleanHsv(color), [color]);
  const [knownHue, setKnownHue] = useState<number>(0);
  const [knownSat, setKnownSat] = useState<number>(0);

  const hue = useMemo(() => (currentHue === 0 ? knownHue : currentHue), [knownHue, currentHue]);
  const sat = useMemo(() => (currentSat === 0 ? knownSat : currentSat), [knownSat, currentSat]);

  useEffect(() => {
    if ((val !== 0) && (currentSat !== 0)) {
      setKnownHue(currentHue);
      setKnownSat(currentSat);
    }
  }, [currentHue, currentSat, val]);

  return [hue, sat, val, setKnownHue, setKnownSat];
}
