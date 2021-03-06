import React from 'react';
import { NextPage } from 'next';


import Layout from '../components/Layout';
import Library from '../components/books/Library';

const Home: NextPage = () => (
  <Layout>
    <Library />
  </Layout>
);

export default Home;
