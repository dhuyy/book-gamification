import React from 'react';

export default function LoaderButton({
  isLoading,
  disabled = false,
  ...props
}) {
  return (
    <button disabled={disabled || isLoading} {...props}>
      {isLoading && <h1>Loading...</h1>}
      {props.children}
    </button>
  );
}
