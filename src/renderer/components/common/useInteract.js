import { useEffect, useRef } from 'react';

export function useInteract(props) {
  const {
    ref,
    overlays,
    isDisabled,
    onInteractOutside,
    onInteractOutsideStart,
    onInteractInside,
    onInteractInsideStart,
  } = props;
  const stateRef = useRef({
    isPointerDown: false,
    ignoreEmulatedMouseEvents: false,
    onInteractOutside,
    onInteractOutsideStart,
    onInteractInside,
    onInteractInsideStart,
    overlays: overlays,
  });
  const state = stateRef.current;
  state.onInteractOutside = onInteractOutside;
  state.onInteractOutsideStart = onInteractOutsideStart;
  state.onInteractInside = onInteractInside;
  state.onInteractInsideStart = onInteractInsideStart;
  state.overlays = overlays;

  useEffect(() => {
    if (isDisabled) {
      return;
    }

    let onPointerDown = (e) => {
      const { type, index } = isValidEvent(e, ref, stateRef.current.overlays);

      if (type != null) {
        if (type === 'outside' && state.onInteractOutsideStart) {
          state.onInteractOutsideStart(e, index);
        } else if (type === 'inside' && state.onInteractInsideStart) {
          state.onInteractInsideStart(e, index);
        }
        state.isPointerDown = true;
      }
    };

    // Use pointer events if available. Otherwise, fall back to mouse and touch events.
    if (typeof PointerEvent !== 'undefined') {
      let onPointerUp = (e) => {
        const { type, index } = isValidEvent(e, ref, stateRef.current.overlays);

        if (state.isPointerDown) {
          if (type != null) {
            state.isPointerDown = false;
            if (type === 'outside' && state.onInteractOutside) {
              state.onInteractOutside(e, index);
            } else if (type === 'inside' && state.onInteractInside) {
              state.onInteractInside(e, index);
            }
          }
        }
      };

      // changing these to capture phase fixed combobox
      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('pointerup', onPointerUp, true);

      return () => {
        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('pointerup', onPointerUp, true);
      };
    } else {
      let onMouseUp = (e) => {
        if (state.ignoreEmulatedMouseEvents) {
          state.ignoreEmulatedMouseEvents = false;
        } else if (state.isPointerDown) {
          const { type, index } = isValidEvent(e, ref, stateRef.current.overlays);

          if (type != null) {
            state.isPointerDown = false;
            if (type === 'outside' && state.onInteractOutside) {
              state.onInteractOutside(e, index);
            } else if (type === 'inside' && state.onInteractInside) {
              state.onInteractInside(e, index);
            }
          }
        }
      };

      let onTouchEnd = (e) => {
        state.ignoreEmulatedMouseEvents = true;
        if (state.isPointerDown) {
          const { type, index } = isValidEvent(e, ref, stateRef.current.overlays);

          if (type != null) {
            state.isPointerDown = false;
            if (type === 'outside' && state.onInteractOutside) {
              state.onInteractOutside(e, index);
            } else if (type === 'inside' && state.onInteractInside) {
              state.onInteractInside(e, index);
            }
          }
        }
      };

      document.addEventListener('mousedown', onPointerDown, true);
      document.addEventListener('mouseup', onMouseUp, true);
      document.addEventListener('touchstart', onPointerDown, true);
      document.addEventListener('touchend', onTouchEnd, true);

      return () => {
        document.removeEventListener('mousedown', onPointerDown, true);
        document.removeEventListener('mouseup', onMouseUp, true);
        document.removeEventListener('touchstart', onPointerDown, true);
        document.removeEventListener('touchend', onTouchEnd, true);
      };
    }
  }, [ref, state, isDisabled]);
}

function isValidEvent(event, ref, overlays) {
  if (event.button > 0) {
    return false;
  }

  // if the event target is no longer in the document
  if (event.target) {
    const ownerDocument = event.target.ownerDocument;
    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) {
      return false;
    }
  }

  if (Array.isArray(overlays)) {
    let foundIndex = null;

    const contains = overlays.some(({ ref }, index) => {
      if (ref.current?.contains(event.target)) {
        foundIndex = index;
        return true;
      }

      foundIndex = -1;
      return false;
    });

    let result = null;

    if (contains) {
      result = {
        type: 'inside',
        index: foundIndex,
      };
    } else {
      result = {
        type: 'outside',
        index: foundIndex,
      };
    }

    return result;
  }

  if (ref.current == null) return null;

  const contains = ref.current.contains(event.target);

  if (contains) {
    return {
      type: 'inside',
      index: -1,
    };
  }

  return {
    type: 'outside',
    index: -1,
  };
}
