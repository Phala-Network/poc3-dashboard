import AppNavBar from "./AppNavBar";
import { Container } from "react-bootstrap";
import { useAppData } from "./App";
import styled from "styled-components";
import { useMemo } from "react";
import { formatNumber } from "./utils";

const kUnlockHashPowerThreshold = [0, 140000, 280000, 560000];
const kUnlockHashPowerMax =
  kUnlockHashPowerThreshold[kUnlockHashPowerThreshold.length - 1];

const PopoverWrapper = styled.div`
  position: relative;
  background: #d1ff52;
  border-radius: 5px;
  color: black;
  width: 212px;
  height: 61px;
  left: 106px;
  top: -81px;
  display: flex;
  align-items: center;
  place-content: center;
  font-size: 17px;
  line-height: 20px;
  text-align: center;

  color: #000000;

  &:after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #d1ff52 transparent transparent transparent;
  }
`;

const Popover = () => {
  const { data } = useAppData();
  const onlineTimeMap = useMemo(() => {
    return JSON.parse(data.onlineTimeMap || '[]')
  }, [data]);

  return (
    <PopoverWrapper>
      Power: {`${data.currentTotalPower}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      <br />
      Miners: {onlineTimeMap.length}
    </PopoverWrapper>
  );
};

const DescLine = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  color: #ffffff;
  margin: 21px auto 56px;

  a {
    text-decoration: underline;
  }
`;

const Head = () => {
  return (
    <section className="page-head color-white">
      <div className="bg" />
      <AppNavBar />
      <Container>
        <h5 className="color-primary">Phala Testnet Vendetta</h5>
        <h1 className="color-primary">1605 Miner Race II</h1>
        <DescLine>
          1605 Race is a miner competition to stress-test Phala Testnet
          Vendetta. The prize pool will be unlocked according to "power"
          contributed by each miner, and PHA rewards will be distributed to your{" "}
          <a
            className="color-primary"
            href="https://forum.phala.network/t/how-to-create-a-phala-account-on-testnet-vendetta/1253"
          >
            Phala account
          </a>{" "}
          according to the ratio of your fire at the end of Jan 1. A Firedrop
          will be triggered each time when the prize pool breaks into the next
          stage, and **5%** of all the qualified miners(running for more than 6{" "}
          <a
            className="color-primary"
            href="https://wiki.phala.network/en-us/docs/poc3/4-faq/"
          >
            rounds
          </a>
          ) will share 720,000 Fires to improve their final ratio and earn more
          PHA.
        </DescLine>
        <InfoLine />
      </Container>
    </section>
  );
};

const TotalPrizeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #D1FF52;
  color: black;
  width: fit-content;
  padding: 10px 36px 0px 15px;
  p, h1 {
    width: fit-content;
  }
  h1 {
    font-size: 1rem;
  }
  p {
    font-size: 1.8rem;
    line-height: 1.4rem;
  }
`
const TotalPrize = () => {
  return <TotalPrizeWrapper>
    <h1>Total Prize Pool</h1>
    <p>100,000 PHA</p>
  </TotalPrizeWrapper>
}

const TotalInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 24px;
  place-content: center;
  p {
    line-height: 1.3rem;
    font-size: 0.9rem;
    margin: 0;
    width: fit-content;
  }
`
const TotalInfo = () => {
  const { data } = useAppData()
  return <TotalInfoWrapper>
    <p>Power: {formatNumber(data.totalPower)}</p>
    <p>Miners：{formatNumber(data.onlineWorkers)}</p>
    <p>Total Staking：{data.accumulatedStakeHuman}PHA</p>
  </TotalInfoWrapper>
}

const InfoLineWrapper = styled.div`
  display: flex;
  margin: -24px 0 20px;
`
const InfoLine = () => {
  return <InfoLineWrapper>
    <TotalPrize />
    <TotalInfo />
  </InfoLineWrapper>
}

export default Head;
