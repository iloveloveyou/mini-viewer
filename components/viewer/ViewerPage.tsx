
/* eslint-disable react/no-danger */
import React, {
  useState, useRef, useCallback, useMemo, useEffect,
} from 'react';

import {
  ViewArticle, ViewSection, Contents,
  LeftButton, RightButton,
} from '../../styles/viewer';

import { VIEWER_PAGE_GAP } from '../../constants/viewer';

interface Props {
  viewerWidth: number;
  viewerHeight: number;
  isShowPrevViewer: boolean;
  wholeColumnCount: number;
  viewerSpine: string;
  toggleNewViewer: boolean;
  setNextSpine: () => void;
  setPrevSpine: () => void;
}

const ViewerPage: React.FunctionComponent<Props> = ({
  viewerWidth, viewerHeight,
  isShowPrevViewer, wholeColumnCount,
  viewerSpine, toggleNewViewer,
  setNextSpine, setPrevSpine,
}) => {
  const [nowViewerCount, setNowViewerCount] = useState(0);

  const hasNextViewer = useMemo(() => nowViewerCount < wholeColumnCount, [nowViewerCount, wholeColumnCount]);
  const hasPrevViewer = useMemo(() => nowViewerCount > 0, [nowViewerCount]);

  const viewArticleRef = useRef(null);

  useEffect(() => {
    const { current: viewArticleRefCurrent } = viewArticleRef;
    if (isShowPrevViewer) {
      // Show prev view
      viewArticleRefCurrent.scrollLeft = wholeColumnCount * (viewerWidth + VIEWER_PAGE_GAP);
      setNowViewerCount(wholeColumnCount);
    } else {
      // Show new view
      viewArticleRefCurrent.scrollLeft = 0;
      setNowViewerCount(0);
    }
  }, [isShowPrevViewer, viewerWidth, wholeColumnCount, toggleNewViewer]);

  const clickRight = useCallback(() => {
    const { current: viewArticleRefCurrent } = viewArticleRef;
    if (hasNextViewer) {
      setNowViewerCount(nowViewerCount + 1);
      viewArticleRefCurrent.scrollLeft += (viewerWidth + VIEWER_PAGE_GAP);
    } else {
      setNextSpine();
    }
  }, [hasNextViewer, nowViewerCount, viewerWidth, setNextSpine]);

  const clickLeft = useCallback(() => {
    const { current: viewArticleRefCurrent } = viewArticleRef;

    if (hasPrevViewer) {
      setNowViewerCount(nowViewerCount - 1);
      viewArticleRefCurrent.scrollLeft -= (viewerWidth + VIEWER_PAGE_GAP);
    } else {
      setPrevSpine();
    }
  }, [hasPrevViewer, nowViewerCount, viewerWidth, setPrevSpine]);

  return (
    <>
      <ViewArticle
        ref={viewArticleRef}
        onClick={clickRight}
        styleProps={{
          width: viewerWidth,
          height: viewerHeight,
        }}
      >
        <ViewSection
          styleProps={{
            width: viewerWidth,
            height: viewerHeight,
          }}
        >
          <Contents dangerouslySetInnerHTML={{ __html: viewerSpine }} />
        </ViewSection>
      </ViewArticle>
      <LeftButton onClick={clickLeft}>Left</LeftButton>
      <RightButton onClick={clickRight}>Right</RightButton>
    </>
  );
};

export default ViewerPage;