import React from 'react';

import styled from 'styled-components';

import ViewerNcx from './ViewerNcx';
import ViewerSetting from './ViewerSetting';

import { EpubNcxItem } from '../../interfaces/books';

import { titleFontSize } from '../../styles';
import { ViewerMenu } from '../../styles/viewer';

const Container = styled(ViewerMenu)`
  top: 0;
`;

const Titles = styled.div`
  white-space: nowrap;
  vertical-align: top;
  margin: auto auto auto 7em;
  & div {
    display: inline-block;
    font-size: ${titleFontSize};
  }
`;

const HeaderNcx = styled.div`
  margin: auto 7em auto auto;
`;

const HeaderSetting = styled.div`
  margin: auto 7em auto 0;
`;

interface Props {
  titles: string[];
  ncxItem: EpubNcxItem;
}

const ViewerHeader: React.FunctionComponent<Props> = ({ titles, ncxItem }) => (
  <Container>
    <Titles>
      {
          titles.map((title) => (
            <div key={title}>{title}</div>
          ))
        }
    </Titles>
    <HeaderNcx>
      <ViewerNcx ncxItem={ncxItem} />
    </HeaderNcx>
    <HeaderSetting>
      <ViewerSetting />
    </HeaderSetting>
  </Container>
);

export default ViewerHeader;
