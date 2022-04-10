import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Icon = forwardRef(({ url, size, color, display, style, className, ...rest }, forwardedRef) => {
  return (
    <Icon.Root
      {...rest}
      ref={forwardedRef}
      className={className}
      style={{
        ...style,
        '--icon-url': `url(${url})`,
        '--icon-size': size ?? '48px',
        '--icon-color': color ?? 'black',
        '--icon-display': display ?? 'inline-block',
      }}
    />
  );
});

Icon.Root = styled.span`
  display: var(--icon-display);
  width: var(--icon-size);
  height: var(--icon-size);
  border: 0;
  outline: 0;
  background: var(--icon-color);
  mask-image: var(--icon-url);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
`;

Icon.propTypes = {
  url: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  display: PropTypes.string,
};
