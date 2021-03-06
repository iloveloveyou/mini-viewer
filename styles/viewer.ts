import styled from 'styled-components';

import { defaultColor, subColor } from './index';
import { VIEWER_PAGE_GAP } from '../constants/viewer';

export interface ViewerPageControllerStyleProps {
  backgroundColor?: string;
  width?: number;
  height?: number;
  menuHeight?: number;
}

interface ViewerArticleStyleProps {
  fontSize: number;
  lineHeight: number;
}

interface ViewerSectionStyleProps {
  width: number;
}

export const ViewerMenu = styled.div`
  width: 100%;
  position: fixed;
  display: flex;
  border-top: 1px solid ${subColor};
  border-bottom: 1px solid ${subColor};
  background-color: ${defaultColor};
  z-index: 5;
  font-family: initial;
`;

export const ViewerArticle = styled.div`
  box-sizing: border-box;
  visibility: visible;
  vertical-align: top;
  white-space: initial;
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: ${(props: ViewerArticleStyleProps): number => props.fontSize}em;
  line-height: ${(props: ViewerArticleStyleProps): number => props.lineHeight}em;
`;

export const ViewerSection = styled.div`
  height: 100%;
  column-gap: ${VIEWER_PAGE_GAP}px;
  column-fill: auto;
  column-width: ${(props: ViewerSectionStyleProps): number => props.width}px;
`;

export const ViewerContents = styled.div`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

export const ViewerButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const ViewerSettingItem = styled.div`
  height: 3em;
  text-align: center;
  padding: .4em;
  border-bottom: 1px solid ${subColor};
  margin: 0;
  display: flex;
  &:nth-last-child(1) {
    border-bottom: initial;
  }
`;

export const ViewerSettingLabel = styled.div`
  margin: auto .5em auto 0;
`;

export const ViewerSettingValue = styled.div`
  margin: auto auto auto 0;
`;
