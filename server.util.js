const fs = require('fs');
const { EpubParser } = require('@ridi/epub-parser');

const { getEpubFileKeys, getEpubFile } = require('./server.s3.js');
const { TEMP_EPUB_FILE, DEFAULT_COVER_IMAGE } = require('./server.constant.js');

const parsingBook = async (parser, {
  unzipPath,
}) => {
  try {
    const book = await parser.parse({
      validatePackage: true,
      parseStyle: false,
      unzipPath,
    });

    return book;
  } catch (error) {
    throw new Error(error);
  }
};

const parsingViewers = async (parser, {
  bookSpines,
  publicPath,
}) => {
  try {
    const viewers = await parser.readItems(bookSpines, {
      force: true,
      extractBody: true,
      ignoreScript: true,
      basePath: publicPath,
    });

    return viewers;
  } catch (error) {
    throw new Error(error);
  }
};

const getBookInfo = async (fileName) => {
  const parser = new EpubParser(`public/${TEMP_EPUB_FILE}.epub`);
  const styleText = [];
  try {
    const book = await parsingBook(parser, {
      unzipPath: `public/${TEMP_EPUB_FILE}`,
    });

    if (book) {
      const viewers = await parsingViewers(parser, {
        bookSpines: book.spines,
        publicPath: `${TEMP_EPUB_FILE}`,
      });

      const { styles } = book;
      // eslint-disable-next-line no-restricted-syntax
      for (const style of styles) {
        const text = fs.readFileSync(`public/${TEMP_EPUB_FILE}/${style.href}`, 'utf8');
        styleText.push(text);
      }

      return {
        fileName,
        book,
        viewers,
        styleText: styleText.join(''),
      };
    }
  } catch (error) {
    throw new Error(error);
  }

  return {
    fileName,
    book: null,
    viewers: [],
    styleText: '',
  };
};

const getCoverImage = (bookCover) => (
  new Promise((resolve, reject) => {
    if (bookCover) {
      const imagefileNameArr = bookCover.href.split('/');
      const imageFileName = imagefileNameArr[imagefileNameArr.length - 1];
      fs.copyFile(`public/${TEMP_EPUB_FILE}/${bookCover.href}`, `public/cover/${imageFileName}`, (error) => {
        if (error) {
          reject(error);
        }
        resolve(`cover/${imageFileName}`);
      });
    } else {
      resolve(DEFAULT_COVER_IMAGE);
    }
  })
);

const getTitle = (book) => book.creators.reduce((acc, cur, index) => `${acc}${index > 0 ? ', ' : ''}${cur.name}`, '');

const getBookListItems = async () => {
  const bookListItems = [];
  try {
    const fileKeys = await getEpubFileKeys();
    // eslint-disable-next-line no-restricted-syntax
    for (const fileKey of fileKeys) {
      const [fileName] = fileKey.split('.');
      await getEpubFile(fileName || 'jikji');
      const bookInfo = await getBookInfo(fileName);
      const imageFileName = await getCoverImage(bookInfo.book.cover);
      const title = getTitle(bookInfo.book);
      bookListItems.push({
        fileName,
        title,
        coverImage: imageFileName,
      });
    }
    return bookListItems;
  } catch (error) {
    throw new Error(error);
  }
};

const getBook = async (fileName) => {
  try {
    await getEpubFile(fileName || 'jikji');

    const bookInfo = await getBookInfo(fileName);
    const {
      book, styleText, viewers,
    } = bookInfo;

    return {
      ...book,
      styleText,
      spineViewers: viewers,
      fileName,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getBookListItems = getBookListItems;
module.exports.getBook = getBook;