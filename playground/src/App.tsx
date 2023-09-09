import { Button } from 'antd';
import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="App">
      <h2>{count}</h2>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>click me</Button>
    </div>
  );
}

export default App;
