import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import Axios from 'axios';

import {Container} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Head from './Head';
import Data from './Data';
import styled from 'styled-components';
import ReactLoading from 'react-loading'

const AppDataContext = createContext();
const useAppData = () => useContext(AppDataContext);

const AppWrapper = () => {
  const [data, setData] = useState(undefined);

  const updateData = useCallback(async () => {
    const path = process.env.REACT_APP_RESULT_URL || '/dashboard2_data';
    const resp = await Axios.get(path);
    setData(resp.data);
  }, [setData]);

  const dt = useMemo(() => data ? (Date.now() - data.updatedAt) / 1000 : '...', [data]);

  const contextValue = useMemo(() => ({ data, dt }), [data, dt])

  useEffect(() => {
    updateData();
    const i = setInterval(() => {
      updateData();
    }, 6000);
    return () => clearInterval(i);
  }, [updateData])

  return <AppDataContext.Provider value={contextValue}>
    <App data={data} />
  </AppDataContext.Provider>
}

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  place-content: center;
  height: 100vh;
  width: 100vw;
`
const Loading = () => <LoadingWrapper>
  <ReactLoading type={'bubbles'} color={'#ffffff'} height={'60px'} width={'60px'} />
</LoadingWrapper>

const App = ({ data }) => {
  return (
    <div className="App">
      {data
        ? <>
          <Head />
          <Data />
          <Foot />
        </>
        : <Loading />}
    </div>
  );
}

const FootLine = styled.p`
  text-align: center;
  margin: 24px auto 42px;
`

const Foot = () => {
  const { data, dt } = useAppData()
  return <section>
    <Container>
      <FootLine className="theme-dark">2020 Phala Network - Mining round: {data.roundNumber} - Last updated: {dt}s ago</FootLine>
    </Container>
  </section>
}

export default AppWrapper;
export {
  useAppData
};
