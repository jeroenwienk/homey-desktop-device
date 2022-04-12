import React, {
  useRef,
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react';
import styled from 'styled-components';

import {
  useOverlayPosition,
  DismissButton,
  OverlayContainer,
  FocusScope,
} from 'react-aria';
import { getFocusableTreeWalker } from '@react-aria/focus';

import { useInteract } from './useInteract';
import { mergeRefs } from '../lib/mergeRefs';

const OverlayStackContext = createContext(null);
const OverlayPreventCloseContext = createContext();

export function useSetPreventOverlayClose() {
  return useContext(OverlayPreventCloseContext);
}

export function Overlay(props) {
  const [isPreventClose, setIsPreventClose] = useState(false);
  const [stackIndex, setStackIndex] = useState(-1);

  const overlayRef = useRef();
  const instanceRef = useRef({
    didFocus: false,
    isPreventClose: isPreventClose,
    onClose: props.overlayTriggerState?.close,
  });

  function onCloseMiddleWare() {
    // console.log(`onCloseMiddleWare:stackingIndex:${stackIndex}`, isPreventClose);
    if (isPreventClose) {
      return;
    }

    props.overlayTriggerState?.close();
  }

  instanceRef.current.onClose = onCloseMiddleWare;
  instanceRef.current.isPreventClose = isPreventClose;

  // The root defines the context which child overlays reuse.
  const stackContext = useContext(OverlayStackContext);
  const { stackContextValue, isRoot } = useMemo(() => {
    if (stackContext != null) return { stackContextValue: stackContext };

    return {
      stackContextValue: {
        root: [],
      },
      isRoot: true,
    };
  }, [stackContext]);

  // The root handles all interactions and decides what closes.
  isRoot === true &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInteract({
      overlays: stackContextValue.root,
      onInteractOutsideStart(event) {
        // console.log('onInteractOutsideStart', event);

        const stackLength = stackContextValue.root.length;
        const lastIndex = stackLength - 1;

        const overlaysToClose = [];

        for (let index = lastIndex; index >= 0; index--) {
          const item = stackContextValue.root[index];

          // We need to check here because we close with requestAnimationFrame the state variable might have changed already.
          if (item.getIsPreventClose() !== true) {
            overlaysToClose.push(stackContextValue.root[index]);
          }
        }

        if (overlaysToClose.length > 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      onInteractOutside(event) {
        // console.log('onInteractOutside', event);
        // These events should probably be prevented and stopped if we are closing something.

        const stackLength = stackContextValue.root.length;
        const lastIndex = stackLength - 1;

        const overlaysToClose = [];

        for (let index = lastIndex; index >= 0; index--) {
          const item = stackContextValue.root[index];

          // We need to check here because we close with requestAnimationFrame the state variable might have changed already.
          if (item.getIsPreventClose() !== true) {
            overlaysToClose.push(stackContextValue.root[index]);
          }
        }

        if (overlaysToClose.length > 0) {
          event.preventDefault();
          event.stopPropagation();
        }

        // We need this because FocusScope uses requestAnimationFrame to restore the focus. So
        // we close one and let the focus restore. In the first requestAnimationFrame and in the second
        // requestAnimationFrame we close the next one.
        Promise.resolve().then(async () => {
          for (const { onClose } of overlaysToClose) {
            await new Promise((resolve) => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve(onClose());
                });
              });
            });
          }
        });
      },
      onInteractInsideStart(event, interactedIndex) {
        console.log('onInteractInsideStart', interactedIndex, event);
        // console.log(stackContextValue.root);

        // Before anything first we get the current stack context and clone it.
        const clonedStack = [...stackContextValue.root];

        // This is needed because the reason for onInteractInsideStart might be the opening of a new overlay
        // on the same stacking context level.

        const lastIndex = clonedStack.length - 1;

        // If it's not the top most overlay.
        if (interactedIndex !== lastIndex) {
          const stackLength = clonedStack.length;
          const overlaysToClose = [];

          for (let index = stackLength - 1; index > interactedIndex; index--) {
            overlaysToClose.push(clonedStack[index]);

            // Remove from the original array.
            stackContextValue.root.splice(index, 1);
          }

          if (overlaysToClose.length > 0) {
            event.preventDefault();
            event.stopPropagation();
          }

          // We need this because FocusScope uses requestAnimationFrame to restore the focus. So
          // we close one and let the focus restore. In the first requestAnimationFrame and in the second
          // requestAnimationFrame we close the next one.
          Promise.resolve().then(async () => {
            for (const { onClose } of overlaysToClose) {
              await new Promise((resolve) => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    resolve(onClose());
                  });
                });
              });
            }
          });
        }
      },
      onInteractInside(event, index) {
        // console.log('onInteractInside', index, event);
      },
    });

  useLayoutEffect(() => {
    const source = {
      ref: overlayRef,
      onClose() {
        instanceRef.current.onClose();
      },
    };

    const length = stackContextValue.root.push({
      ref: overlayRef,
      onClose() {
        instanceRef.current.onClose();
      },
      getIsPreventClose() {
        return instanceRef.current.isPreventClose;
      },
    });
    setStackIndex(length - 1);

    return function () {
      // It might have been removed already onClose

      const index = stackContextValue.root.findIndex(
        (element) => element === source
      );

      if (index > -1) {
        stackContextValue.root.splice(index, 1);
      }
    };
  }, [stackContextValue]);

  const overlay = useOverlay(
    {
      isOpen: props.overlayTriggerState?.isOpen ?? true,
      isKeyboardDismissDisabled: false,
      onClose: onCloseMiddleWare,
    },
    overlayRef
  );

  const overlayPosition = useOverlayPosition({
    targetRef: props.targetRef,
    overlayRef: overlayRef,
    placement: 'bottom',
    offset: props.offset ?? 5,
    crossOffset: props.crossOffset ?? 0,
    isOpen: props.overlayTriggerState?.isOpen ?? true,
    shouldFlip: true,
    shouldUpdatePosition: true,
    onClose: onCloseMiddleWare,
  });

  // prevent using the OverlayContainer when nested in a other OverlayContainer
  const useFragment = props.useOverlayContainer === false;
  const Container = useFragment ? React.Fragment : OverlayContainer;

  if (overlayPosition.overlayProps.style?.zIndex != null) {
    overlayPosition.overlayProps.style.zIndex =
      overlayPosition.overlayProps.style?.zIndex + stackIndex;
  }

  let [tabIndex, setTabIndex] = useState(undefined);

  // Check if the overlay has a focusable child. If not we make the overlay itself focusable so it can be closed
  // with the keyboard.
  useLayoutEffect(() => {
    if (overlayRef?.current) {
      const update = () => {
        // Detect if there are any tabbable elements and update the tabIndex accordingly.
        let walker = getFocusableTreeWalker(overlayRef.current, {
          tabbable: true,
        });
        setTabIndex(walker.nextNode() ? undefined : 0);
      };

      update();

      // Update when new elements are inserted, or the tabIndex/disabled attribute updates.
      const observer = new MutationObserver(update);
      observer.observe(overlayRef.current, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['tabIndex', 'disabled'],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [overlayRef]);

  useLayoutEffect(() => {
    if (
      props.autoFocus === true &&
      tabIndex != null &&
      instanceRef.current.didFocus === false
    ) {
      instanceRef.current.didFocus = true;
      overlayRef.current.focus();
    }
  }, [props.autoFocus, tabIndex]);

  return (
    <OverlayStackContext.Provider value={stackContextValue}>
      <OverlayPreventCloseContext.Provider value={setIsPreventClose}>
        <Container>
          <FocusScope
            restoreFocus={props.restoreFocus ?? true}
            contain={props.containFocus ?? true}
            autoFocus={props.autoFocus ?? false}
          >
            <Overlay.Wrapper
              {...props.overlayProps}
              {...overlay.overlayProps}
              {...overlayPosition.overlayProps}
              ref={mergeRefs([overlayRef, props.overlayRef])}
              data-stacking-index={stackIndex}
              tabIndex={tabIndex}
            >
              <Overlay.Root
                animationRemainProps={props.animationRemainProps}
                placement={overlayPosition.placement}
                transformOriginX={overlayPosition.arrowProps.style.left}
              >
                <DismissButton
                  onDismiss={() => props.overlayTriggerState?.close()}
                />

                {props.children}

                {String(stackIndex)}

                <DismissButton
                  onDismiss={() => props.overlayTriggerState?.close()}
                />
              </Overlay.Root>
            </Overlay.Wrapper>
          </FocusScope>
        </Container>
      </OverlayPreventCloseContext.Provider>
    </OverlayStackContext.Provider>
  );
}

Overlay.Wrapper = styled.div`
  outline: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

Overlay.Root = styled.div`
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  flex: 1 1 auto;
  overflow: hidden;
`;

const visibleOverlays = [];

export function useOverlay(props, ref) {
  const { onClose, isOpen, isKeyboardDismissDisabled = false } = props;

  // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.
  useEffect(() => {
    if (isOpen) {
      visibleOverlays.push(ref);
    }

    return () => {
      const index = visibleOverlays.indexOf(ref);
      if (index >= 0) {
        visibleOverlays.splice(index, 1);
      }
    };
  }, [isOpen, ref]);

  // This can probably be move outside with the other stacking context.

  // Only hide the overlay when it is the topmost visible overlay in the stack.
  const onHide = () => {
    if (visibleOverlays[visibleOverlays.length - 1] === ref && onClose) {
      onClose();
    }
  };

  // Handle the escape key
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && !isKeyboardDismissDisabled) {
      e.preventDefault();
      onHide();
    }
  };

  const onPointerDownUnderlay = (e) => {
    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return {
    overlayProps: {
      onKeyDown,
    },
    underlayProps: {
      onPointerDown: onPointerDownUnderlay,
    },
  };
}
