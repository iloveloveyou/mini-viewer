import React, {
  useRef, useEffect, useCallback, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import {
  ViewerArticle,
  ViewerSection,
  ViewerContents,
} from '../../styles/viewer';

import * as viewerActions from '../../reducers/viewer';

import { VIEWER_PAGE_GAP } from '../../constants/viewer';

import { ReducerStates } from '../../interfaces';
import { EpubSpineItem } from '../../interfaces/books';
import { ViewerState, ViewerSettingState } from '../../interfaces/viewer';

import {
  usePageWithWithRatio,
  useSpinePosition,
  useSpineIndex,
} from '../../hooks';

interface ViewerPageProps {
  isSetViewerCountList: boolean;
  spineIndex: number;
  spineViewer: string;
  spine: EpubSpineItem;
  setCountCallback: (count: number, index: number) => void;
  clickLink: (spineHref: string, hashId: string) => void;
}

const Article = styled(ViewerArticle)`
  overflow: hidden;
`;

const ViewerPage: React.FunctionComponent<ViewerPageProps> = ({
  isSetViewerCountList,
  spineIndex, spineViewer, spine,
  setCountCallback,
  clickLink,
}) => {
  const dispatch = useDispatch();

  const {
    viewerLink, viewerPageCount, viewerCountList,
  }: ViewerState = useSelector((state: ReducerStates) => state.viewer);
  const {
    viewerWidth,
    fontSize, lineHeight, widthRatio,
    settingChangeToggle, isOpenSettingMenu,
  }: ViewerSettingState = useSelector((state: ReducerStates) => state.viewerSetting);

  const viewArticleRef = useRef(null);

  const [viewerStyle, setViewerStyle] = useState({
    fontSize,
    lineHeight,
    widthRatio,
  });

  const nowSpineIndex = useSpineIndex(viewerCountList, viewerPageCount);
  const nowSpinePosition = useSpinePosition(viewerCountList, viewerPageCount, spineIndex);
  const widthWithRatio = usePageWithWithRatio(viewerWidth, viewerStyle.widthRatio);

  const isSelectedSpineByLink = useMemo(() => viewerLink && viewerLink.spineIndex === spineIndex,
    [viewerLink, spine]);
  const isShowNowSpineIndex = useMemo(() => nowSpineIndex === spineIndex,
    [nowSpineIndex, spineIndex]);

  useEffect(() => {
    setViewerStyle({
      fontSize,
      lineHeight,
      widthRatio,
    });
  }, [settingChangeToggle]);

  useEffect(() => {
    if (isShowNowSpineIndex) {
      setViewerStyle({
        fontSize,
        lineHeight,
        widthRatio,
      });
    }
  }, [fontSize, lineHeight, widthRatio]);

  /**
   * When click a link in spine(page), Calculate new page offset
   */
  useEffect(() => {
    if (widthWithRatio > 0 && isSelectedSpineByLink) {
      const { current: viewArticleRefCurrent } = viewArticleRef;
      const tagElement = viewArticleRefCurrent.querySelector(`#${viewerLink.tag}`);
      if (tagElement) {
        const tagElementScroll = tagElement.offsetLeft;
        const pageMargin = (window.innerWidth - widthWithRatio) / 2;
        const pageScroll = Math.floor(
          tagElementScroll - (spineIndex * widthWithRatio) - pageMargin,
        );
        const pagePosition = Math.floor(pageScroll / widthWithRatio);
        dispatch(viewerActions.setViewerLinkPagePosition({
          ...viewerLink,
          position: pagePosition,
        }));
      }
    }
  }, [viewerLink, isSelectedSpineByLink]);

  /**
   * Calculate: Column count
   */
  useEffect(() => {
    const { current: viewArticleRefCurrent } = viewArticleRef;
    if (viewArticleRefCurrent) {
      setTimeout(() => {
        if (widthWithRatio > 0 && !isSetViewerCountList) {
          const count = viewArticleRefCurrent.scrollWidth / (widthWithRatio + VIEWER_PAGE_GAP);
          setCountCallback(Math.floor(count), spineIndex);
        }
      });
    }
  }, [widthWithRatio, isSetViewerCountList]);


  /**
   * Viewer: Set offset scroll value
   */
  useEffect(() => {
    if (nowSpinePosition >= 0 && isShowNowSpineIndex) {
      const { current: viewArticleRefCurrent } = viewArticleRef;
      // 계산식 constant
      viewArticleRefCurrent.scrollLeft = nowSpinePosition * (widthWithRatio + VIEWER_PAGE_GAP);
      dispatch(viewerActions.setViewerSpinePosition(nowSpinePosition));
    }
  }, [widthWithRatio, nowSpinePosition, isShowNowSpineIndex]);

  const clickPage = useCallback((e) => {
    let node = e.target;
    while (node && node.localName !== 'a') {
      node = node.parentNode;
    }
    if (node) {
      e.preventDefault();
      const [spineHref, hashId] = node.getAttribute('href').split('#');
      clickLink(spineHref || spine.href, hashId);
      return false; // stop handling the click
    }
    return true; // handle other clicks
  }, [clickLink, spine]);

  return (
    <Article
      ref={viewArticleRef}
      onClickCapture={clickPage}
      fontSize={viewerStyle.fontSize}
      lineHeight={viewerStyle.lineHeight}
    >
      <ViewerSection
        width={widthWithRatio}
      >
        <ViewerContents
          dangerouslySetInnerHTML={{ __html: spineViewer }}
        />
      </ViewerSection>
    </Article>
  );
};

export default ViewerPage;
