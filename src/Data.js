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
  const payoutAccounts = useMemo(() =>
    Object.keys(data.payoutAccounts)
      .map(i => ({
        ...data.payoutAccounts[i],
        targetAddress: i,
        targetAddressHuman: getSubStr(i),
        fire2Bn: new BN(data.payoutAccounts[i].fire2)
      }))
      .sort((a, b) => !(b.fire2Bn.sub(a.fire2Bn).isNeg()))
  )
  console.log(payoutAccounts)

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
  }, [data, filter, isFilterValid]);

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
            <Button as="a" variant="light">Staking Calculator</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button as="a" target="_blank" href="https://google.com" variant="light">tPHA Swap</Button>
            <Button as="a" target="_blank" href="https://poc3.phala.network/polkadotjs/#/staking" variant="light">Add Stake</Button>
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
              <th>Rank</th>
              <th>Payout Address</th>
              <th>Miners</th>
              <th>Staking Amount</th>
              <th>Staking Ratio</th>
              <th>Fire2</th>
              <th>Prize Ratio</th>
            </tr>
          </thead>
          <tbody>
            {isFilterValid
              ? payoutAccounts.map((whale, idx) =>
                whale.targetAddress.indexOf(filter) > -1 ? (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {/* <td>{whale.targetAddressHuman}</td> */}
                    <td>{whale.targetAddress}</td>
                    <td>{whale.workerCount}</td>
                    <td>{whale.stakeHuman}</td>
                    <td>{formatPercentage(whale.stakeRatio)}</td>
                    <td>{whale.fire2Human}</td>
                    <td>{formatPercentage(whale.prizeRatio)}</td>
                  </tr>
                ) : null
              )
              : payoutAccounts.map((whale, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{whale.targetAddressHuman}</td>
                  <td>{whale.workerCount}</td>
                  <td>{whale.stakeHuman}</td>
                  <td>{formatPercentage(whale.stakeRatio)}</td>
                  <td>{whale.fire2Human}</td>
                  <td>{formatPercentage(whale.prizeRatio)}</td>
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
