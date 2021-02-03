import { Navbar, Nav } from 'react-bootstrap'
import styled from 'styled-components'

const NavLink = styled(Nav.Link)`
    color: white !important;
    margin: 0 0.36rem;
`


export default () => {
    return <Navbar collapseOnSelect expand="md" bg="transparent" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            <Nav activeKey="##">
                <NavLink eventKey={false} target="_blank" href="/dashboard">Dashboard I</NavLink>
                <NavLink eventKey={false} target="_blank" href="https://medium.com/phala-network/1-000-000-pha-announcing-1605-race-gkol-workshop-and-bounties-6319d3d62032">Rules</NavLink>
                <NavLink eventKey={false} target="_blank" href="https://wiki.phala.network/en-us/docs/poc3/">Join</NavLink>
                <NavLink eventKey={false} target="_blank" href="https://medium.com/phala-network/phala-testnet-vendetta-is-live-57089f4657cc">Events</NavLink>
                <NavLink eventKey={false} target="_blank" href="https://t.me/phalaminer">Telegram</NavLink>
                <NavLink eventKey={false} target="_blank" href="https://discord.gg/Q2NNQcA82q">Discord</NavLink>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}