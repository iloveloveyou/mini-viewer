import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPageContext, NextPage } from 'next';

import Layout from '../components/Layout';
import BookList from '../components/books/BookList';

import * as booksActions from '../reducers/books';

import { getBookInfo, isEpubFile, isProduction } from '../lib/util';

import { ReducerState } from '../interfaces';
import { BookInfo } from '../interfaces/books';

interface Props {
  test: string[];
}

const Home: NextPage<Props> = ({ test }) => {

  console.log('Test', test);
  const { list } = useSelector((state: ReducerState) => state.books);

  useEffect(() => {
    if (!list) {
      window.location.reload();
    }
  }, [list]);

  return (
    <Layout>
      {
        list
        && <BookList books={list} />
      }
    </Layout>
  );
};

const getBooksInfo = async (): Promise<BookInfo[]> => {
  const fs = require('fs');
  const path = require('path');
  const { EpubParser } = require('@ridi/epub-parser');
  const dirPath = isProduction() ? path.join(__dirname) : 'public';

  const files = fs.readdirSync(dirPath);
  const booksInfo: BookInfo[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    if (isEpubFile(file)) {
      const [fileName] = file.split('.epub');
      try {
        const bookInfo = await getBookInfo({
          EpubParser,
          FileSystem: fs,
          dirPath,
          fileName,
        });

        booksInfo.push({ ...bookInfo });
      } catch (error) {
        console.log('Error index.', error);
      }
    }
  }

  return booksInfo;
};

// eslint-disable-next-line @typescript-eslint/unbound-method
Home.getInitialProps = async (context: NextPageContext<any>): Promise<any> => {
  const { req, store } = context;
  if (req) {
    // Server side render
    const booksInfo = await getBooksInfo();
    store.dispatch(booksActions.setBookList(booksInfo));
  }
  return {
    test: 'WOWO',
  };
};

export default Home;
