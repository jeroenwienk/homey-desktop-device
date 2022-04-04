import React from 'react';
import styled from 'styled-components';

import { useSectionContext } from './ListBox';

export function Section(props) {
  const { section, item, state, children } = useSectionContext();

  return (
    <Section.Root
      {...section.itemProps}
      className={props.className}
      style={props.style}
      as={props.as}
    >
      {item.rendered && (
        <Section.Heading {...section.headingProps}>
          {item.rendered}
        </Section.Heading>
      )}
      <Section.List {...section.groupProps}>{children}</Section.List>
    </Section.Root>
  );
}

Section.Root = styled.li`
  &:not(:last-of-type) {
    padding-bottom: 8px;
  }
`;

Section.Heading = styled.div`
  padding: 8px;
  font-size: 1.125rem;
  font-weight: bold;
`;

Section.List = styled.ul`
  list-style: none;
`;
