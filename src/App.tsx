import Accounts from './Accounts';
import { Routes, Route } from 'react-router-dom';
import { useNetwork } from './blockchain-utils';
import { Navbar, NetworkSelector } from './components';
import './App.css';

const changeNetwork = (network: string) => {
  const parts = window.location.pathname.split('/');
  parts[1] = network;
  window.location.pathname = parts.join('/');
};

function App() {
  const { network, isLoading, hasExtension } = useNetwork();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasExtension) {
    return (
      <div>
        Oops, it seems{' '}
        <a
          href="https://polkadot.js.org/extension/"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'orange' }}
        >
          Polkadot.js extension
        </a>{' '}
        not installed or permissions not given.
      </div>
    );
  }

  return (
    <div className="main-app">
      <Navbar>
        <NetworkSelector value={network} onChange={changeNetwork} />
      </Navbar>
      <div className="container">
        <Routes>
          <Route path="*" element={<Accounts />} />
          <Route path="/:selectedAccountId" element={<Accounts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
