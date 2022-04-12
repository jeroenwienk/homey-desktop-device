import React from 'react';
import { useLink } from 'react-aria';

export function ExternalLink(props) {
  const linkRef = React.useRef();
  const link = useLink({ ...props, elementType: 'span' }, linkRef);

  return (
    <span
      {...link.linkProps}
      ref={linkRef}
      style={{
        textDecoration: 'underline',
        cursor: 'pointer',
        outline: 0,
      }}
    >
      {props.children}
    </span>
  );
}
