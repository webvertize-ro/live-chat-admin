function LoadingComponent({ size }) {
  return (
    <div
      className={`spinner-border text-success ${
        size ? `spinner-border-${size}` : ''
      }`}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default LoadingComponent;
