import { Container, Table, InputGroup, FormControl, ButtonToolbar, ButtonGroup, Button, Modal, Form, Col, Alert } from "react-bootstrap";
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
function winningRate({ score = 200, stake = 1000, miners = 500, avgScore = 420, avgStake = 1000, myMiners = 1 }) {
  const n = 5;
  const weight = w(score, stake);
  const otherWeight = w(avgScore, avgStake);
  return p(weight, myMiners, otherWeight, miners, 1, n - myMiners);
}

function w(score, stake) {
  return score + Math.sqrt(stake) * 5
}

function p(a, m, b, n, x, y) {
  if (x === 0 && y === 0) return 1;
  if (m === 0 || n === 0) return 1;
  const sigma = a * m + b * n;
  return (
    (x > 0 ? (a * m / sigma) * p(a, m - 1, b, n, x - 1, y) : 0)
    + (y > 0 ? (b * n / sigma) * p(a, m, b, n - 1, x, y - 1) : 0)
  );
}
const Calculator = () => {
  const [showCalculator, setShowCalculator] = useState(false)
  const [stake, setStake] = useState(0)
  const [score, setScore] = useState(500)
  const { data: {
    avgScore,
    avgStake,
    onlineWorkers
  } } = useAppData()

  const onStakeChange = useCallback(e => {
    const input = e.target.value.trim()
    if (!input.length) {
      return setStake(0)
    }
    const num = parseFloat(input)
    if (num < 0) {
      return setStake(null)
    }
    setStake(num)
  }, [setStake])
  const onScoreChange = useCallback(e => {
    const input = e.target.value.trim()
    if (!input.length) {
      return setScore(500)
    }
    const num = parseFloat(input)
    if (num < 0) {
      return setScore(null)
    }
    setScore(num)
  }, [setScore])

  const rate = useMemo(() => {
    if (typeof stake !== 'number') { return }
    if (typeof score !== 'number') { return }
    return winningRate({
      score,
      stake,
      miners: parseInt(onlineWorkers),
      avgScore,
      avgStake
    })
  }, [stake, score, onlineWorkers, avgScore, avgStake])

  return <>
    <ButtonGroup>
      <Button as="a" variant="light" onClick={() => setShowCalculator(true)}>Staking Calculator</Button>
    </ButtonGroup>
    <Modal
      show={showCalculator}
      onHide={() => setShowCalculator(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Staking Calculator</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Label column sm={4}>
              Stake
            </Form.Label>
            <Col sm="8">
              <InputGroup className="mb-2">
                <Form.Control
                  id="inlineFormInputGroup"
                  placeholder="0"
                  onChange={onStakeChange}
                  type="number"
                  min="0"
                />
                <InputGroup.Append>
                  <InputGroup.Text>PHA</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Row>
          <Form.Row>
            <Form.Label column sm={4}>
              Score
            </Form.Label>
            <Col sm="8">
              <InputGroup className="mb-2">
                <Form.Control
                  id="inlineFormInputGroup"
                  placeholder="500"
                  onChange={onScoreChange}
                  type="number"
                  min="0"
                />
              </InputGroup>
            </Col>
          </Form.Row>
        </Form>
        <br />
        {typeof rate === 'number'
          ? <Alert variant="info">
            Estimated probability to win compute reward per hour:
            <Alert.Heading>{formatPercentage(rate)}</Alert.Heading>
          </Alert>
          : <Alert variant="secondary">
            Please input valid value.
          </Alert>
        }
      </Modal.Body>
    </Modal>
  </>
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

  const [filter, setFilter] = useState("")

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
          <Calculator />
          <ButtonGroup>
            <Button as="a" target="_blank" href="https://poc3-swap.phala.network/" variant="light">tPHA Swap</Button>
            <div style={{ width: 12 }} />
            <Button as="a" target="_blank" href="https://poc3.phala.network/polkadotjs/#/extrinsics" variant="light">Add Stake</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <InputGroup className="mb-3 filter">
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
