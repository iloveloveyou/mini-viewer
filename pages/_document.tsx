import React from 'react';
import Document, { DocumentContext } from 'next/document';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';

import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext): Promise<{
    styles: JSX.Element;
    html: string;
    head?: JSX.Element[];
  }> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> => originalRenderPage({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}

export default MyDocument;
