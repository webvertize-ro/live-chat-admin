function LoadingComponent({ size, color }) {
  return (
    <div
      className={`spinner-border  ${size ? `spinner-border-${size}` : ''} ${
        color ? `text-${color}` : 'success'
      }`}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default LoadingComponent;
