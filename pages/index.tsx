import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';

import { fetchGetBookListItems } from '../lib/fetch';
import { setLibraryOrder, getLibraryOrder } from '../lib/localStorage';

import Layout from '../components/Layout';
import Loading from '../components/common/Loading';
import NoBookList from '../components/books/NoBookList';
import BookList from '../components/books/BookList';
import UploadBook from '../components/books/UploadBook';

import * as booksActions from '../reducers/books';

import { ReducerStates } from '../interfaces';
import { BooksState, BookListItem } from '../interfaces/books';

const Home: NextPage = () => {
  const dispatch = useDispatch();

  const { list }: BooksState = useSelector((state: ReducerStates) => state.books);

  const getByOrderedItems = useCallback((
    orderedItems: string[],
    bookListItems: BookListItem[],
  ): BookListItem[] => {
    const newOrderedItems = [];
    orderedItems.forEach((orderedItem) => {
      bookListItems.some((bookListItem) => {
        if (bookListItem.fileName === orderedItem) {
          newOrderedItems.push(bookListItem);
          return true;
        }
        return false;
      });
    });

    bookListItems.forEach((bookListItem) => {
      if (!newOrderedItems.includes(bookListItem)) {
        newOrderedItems.push(bookListItem);
      }
    });

    return newOrderedItems;
  }, []);

  const setOrderedBookListItems = useCallback((bookListItems) => {
    const orderedItems = getLibraryOrder();
    let sortedBooksInfo = [...bookListItems];
    if (bookListItems && orderedItems) {
      sortedBooksInfo = getByOrderedItems(orderedItems, bookListItems);
    }
    setLibraryOrder(sortedBooksInfo.map((sortedBookInfo) => sortedBookInfo.fileName));
    dispatch(booksActions.setBookList([...sortedBooksInfo]));
  }, []);

  const getBookListItems = useCallback(async () => {
    try {
      const bookListItems = await fetchGetBookListItems();
      return bookListItems;
    } catch (error) {
      console.error(error);
    }

    return [];
  }, []);

  const initBookListItems = useCallback(async () => {
    const items = await getBookListItems();
    setOrderedBookListItems(items);
  }, []);

  useEffect(() => {
    if (!list) {
      initBookListItems();
    }
  }, []);

  const renderBookList = useCallback(() => (
    <>
      {
        list.length > 0
          ? <BookList bookListItems={list} />
          : <NoBookList />
      }
    </>
  ), [list]);

  return (
    <Layout>
      {
        list
          ? <>{renderBookList()}</>
          : <Loading text="책을 가져오고 있습니다. 잠시만 기다려주세요..." />
      }
      <UploadBook />
    </Layout>
  );
};

export default Home;
