import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import * as viewerActions from '../../reducers/viewer';

import { VIEWER_SLIDER_LEN_RATIO } from '../../constants/viewer';

import { ReducerStates } from '../../interfaces';
import { ViewerSettingState, ViewerState } from '../../interfaces/viewer';

const Container = styled.div`
  width: 100%;
  margin: auto 5%;
  flex-direction: column;
  display: flex;
`;

const Input = styled.input`
  margin-left: ${(100 - VIEWER_SLIDER_LEN_RATIO) / 2}%;
  width: ${VIEWER_SLIDER_LEN_RATIO}%;
  cursor: grab;
`;

const Marker = styled.div`
  margin-left: ${(100 - VIEWER_SLIDER_LEN_RATIO) / 2}%;
`;

interface Props {
  maxValue: number;
}

const ViewerSlider: React.FunctionComponent<Props> = ({ maxValue }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const {
    isOpenSettingMenu,
  }: ViewerSettingState = useSelector((state: ReducerStates) => state.viewerSetting);
  const { viewerPageCount }: ViewerState = useSelector((state: ReducerStates) => state.viewer);

  const hasMaxValue = useMemo(() => !!maxValue, [maxValue]);

  useEffect(() => {
    setValue(viewerPageCount);
  }, [viewerPageCount]);

  const onChangeSlider = useCallback((e) => {
    if (!isOpenSettingMenu) {
      dispatch(viewerActions.setViewerPageCount(Number(e.target.value)));
    }
  }, [isOpenSettingMenu]);

  return (
    <Container>
      {
        hasMaxValue
        && (
        <>
          <Marker>
            {`${value}/${maxValue}`}
          </Marker>
          <Input type="range" min="0" max={maxValue} value={value} onChange={onChangeSlider} />
        </>
        )
      }
    </Container>
  );
};

export default ViewerSlider;
