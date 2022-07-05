import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="navbar">
      <div className="navbar-actions">{children}</div>
      <Link to="/" className="navbar-title">
        Kusama Balance App
      </Link>
    </div>
  );
};
