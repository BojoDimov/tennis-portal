import React from 'react';
import { Link } from 'react-router-dom';

export class Breadcrumb extends React.Component {
  render() {
    return (
      <div className="breadcrumb">
        <Link to="/"><i className="fas fa-home"></i></Link>
        {this.props.path.map(part => (
          <span>{' / '}<Link to={part.link}>{part.name}</Link></span>
        ))}
      </div>
    );
  }
}

const BreadcrumbPath = React.createContext({
  path: [],
  updatePath: () => { }
});

export const ProvideBreadcrumbPath = BreadcrumbPath.Provider;
export const UseBreadcrumbPath = BreadcrumbPath.Consumer;