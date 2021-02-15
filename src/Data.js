import { Container, Table, InputGroup, FormControl, ButtonToolbar, ButtonGroup, Button } from "react-bootstrap";
import { useAppData } from "./App";
import { formatPercentage } from "./utils";
import {
  Search as SearchIcon,
  XCircle as XCircleIcon,
} from "react-bootstrap-icons";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import BN from "bn.js";
import { orderBy } from 'lodash';

const NotFoundLine = styled.p`
  text-align: center;
  width: 100%;
`;

const getSubStr = str => {
  const subStr1 = str.substr(0, 6)
  const subStr2 = str.substr(str.length - 6, 6)
  return subStr1 + '...' + subStr2
}

const Data = () => {
  const { data } = useAppData();
  const payoutAccounts = useMemo(() => {
    const _data = Object.keys(data.payoutAccounts)
      .map(i => ({
        ...data.payoutAccounts[i],
        targetAddress: i,
        targetAddressHuman: getSubStr(i),
        fire2Bn: new BN(data.payoutAccounts[i].fire2)
      }))
    return orderBy(_data, ['prizeRatio'], ['desc'])
  }, [data])

  const [filter, setFilter] = useState("");

  const isFilterValid = useMemo(() => filter.trim().length > 0, [filter]);
  const isFilterHasResult = useMemo(() => {
    if (!isFilterValid) {
      return true;
    }
    return (
      payoutAccounts.filter((i) => i.targetAddress.indexOf(filter) > -1)
        .length > 0
    );
  }, [filter, isFilterValid, payoutAccounts])

  const onFilterChange = useCallback(
    (e) => {
      setFilter(e.target.value.trim());
    },
    [setFilter]
  );

  return (
    <section className="page-data color-white">
      <Container>
        <ButtonToolbar className="justify-content-between">
          <ButtonGroup>
            {/* <Button as="a" variant="light">Staking Calculator</Button> */}
          </ButtonGroup>
          <ButtonGroup>
            <Button as="a" target="_blank" href="https://poc3-swap.phala.network/" variant="light">tPHA Swap</Button>
            <div style={{ width: 12 }} />
            <Button as="a" target="_blank" href="https://poc3.phala.network/polkadotjs/#/extrinsics" variant="light">Add Stake</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <SearchIcon />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-describedby="Search"
            placeholder="Search address..."
            aria-label="Search address..."
            onChange={onFilterChange}
            value={filter}
          />
          {isFilterValid ? (
            <InputGroup.Append onClick={() => setFilter("")}>
              <InputGroup.Text>
                <XCircleIcon />
              </InputGroup.Text>
            </InputGroup.Append>
          ) : null}
        </InputGroup>
        <Table responsive borderless variant="dark" size="sm" hover>
          <thead className="higher">
            <tr className="color-primary">
              <th className="datath">Rank</th>
              <th className="datath">Payout Address</th>
              <th className="datath">Online Miners</th>
              <th className="datath">Staking Amount</th>
              <th className="datath">Staking Ratio</th>
              <th className="datath">Compute Rewards</th>
              <th className="datath">Fire2</th>
              <th className="datath">Prize Ratio</th>
            </tr>
          </thead>
          <tbody>
            {isFilterValid
              ? payoutAccounts.map((whale, idx) =>
                whale.targetAddress.indexOf(filter) > -1 ? (
                  <tr key={idx}>
                    <td className="datath">{idx + 1}</td>
                    {/* <td>{whale.targetAddressHuman}</td> */}
                    <td className="datath">{whale.targetAddress}</td>
                    <td className="datath">{whale.workerCount}</td>
                    <td className="datath">{whale.stakeHuman}</td>
                    <td className="datath">{formatPercentage(whale.stakeRatio)}</td>
                    <td className="datath">{whale.payoutComputeReward}</td>
                    <td className="datath">{whale.fire2Human}</td>
                    <td className="datath">{formatPercentage(whale.prizeRatio)}</td>
                  </tr>
                ) : null
              )
              : payoutAccounts.map((whale, idx) => (
                <tr key={idx}>
                  <td className="datath">{idx + 1}</td>
                  <td className="datath">{whale.targetAddressHuman}</td>
                  <td className="datath">{whale.workerCount}</td>
                  <td className="datath">{whale.stakeHuman}</td>
                  <td className="datath">{formatPercentage(whale.stakeRatio)}</td>
                  <td className="datath">{whale.payoutComputeReward}</td>
                  <td className="datath">{whale.fire2Human}</td>
                  <td className="datath">{formatPercentage(whale.prizeRatio)}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        {!isFilterHasResult ? <NotFoundLine>Not Found</NotFoundLine> : null}
      </Container>
    </section>
  );
};
export default Data;
