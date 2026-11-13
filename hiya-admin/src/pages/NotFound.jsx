import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card text-center">
          <div className="card-body p-5">
            <p className="page-title display-3 text-olive mb-2">404</p>
            <h2 className="h4 mb-2">This page doesn&apos;t exist</h2>
            <p className="text-body-secondary mb-4">The link may be broken, or the page was moved.</p>
            <Link to="/" className="btn btn-primary px-4">
              <i className="bi bi-arrow-left me-2" aria-hidden="true" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
