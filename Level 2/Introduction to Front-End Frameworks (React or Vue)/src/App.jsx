import React, { useState } from 'react';
import './App.css';

function Button({ label, onClick, variant = 'default' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={() => onClick(label)}>
      {label}
    </button>
  );
}

function Display({ value }) {
  return <div className="display" aria-label="display">{value}</div>;
}

function Keypad({ onDigit, onOperator, onClear, onEquals, onDecimal, onToggleSign, onPercent }) {
  const digit = (d) => () => onDigit(d);
  const op = (o) => () => onOperator(o);

  return (
    <div className="keypad">
      <Button label="C" onClick={onClear} variant="muted" />
      <Button label="±" onClick={onToggleSign} variant="muted" />
      <Button label="%" onClick={onPercent} variant="muted" />
      <Button label="÷" onClick={op('÷')} variant="accent" />

      <Button label="7" onClick={digit('7')} />
      <Button label="8" onClick={digit('8')} />
      <Button label="9" onClick={digit('9')} />
      <Button label="×" onClick={op('×')} variant="accent" />

      <Button label="4" onClick={digit('4')} />
      <Button label="5" onClick={digit('5')} />
      <Button label="6" onClick={digit('6')} />
      <Button label="−" onClick={op('−')} variant="accent" />

      <Button label="1" onClick={digit('1')} />
      <Button label="2" onClick={digit('2')} />
      <Button label="3" onClick={digit('3')} />
      <Button label="+" onClick={op('+')} variant="accent" />

      <Button label="0" onClick={digit('0')} />
      <Button label="." onClick={onDecimal} />
      <Button label="=" onClick={onEquals} variant="primary" />
    </div>
  );
}

function evaluate({ currentValue, previousValue, operator }) {
  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  if (Number.isNaN(a) || Number.isNaN(b)) return currentValue;
  switch (operator) {
    case '+':
      return String(a + b);
    case '−':
      return String(a - b);
    case '×':
      return String(a * b);
    case '÷':
      return b === 0 ? 'Error' : String(a / b);
    default:
      return currentValue;
  }
}

export default function App() {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);

  const handleDigit = (digit) => {
    if (overwrite) {
      setCurrentValue(digit);
      setOverwrite(false);
    } else {
      setCurrentValue((v) => (v === '0' ? digit : v + digit));
    }
  };

  const handleDecimal = () => {
    if (overwrite) {
      setCurrentValue('0.');
      setOverwrite(false);
      return;
    }
    setCurrentValue((v) => (v.includes('.') ? v : v + '.'));
  };

  const handleClear = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  };

  const handleToggleSign = () => {
    setCurrentValue((v) => (v.startsWith('-') ? v.slice(1) : v === '0' ? '0' : '-' + v));
  };

  const handlePercent = () => {
    setCurrentValue((v) => String(parseFloat(v) / 100));
  };

  const handleOperator = (nextOperator) => {
    if (operator && !overwrite && previousValue !== null) {
      const result = evaluate({ currentValue, previousValue, operator });
      setPreviousValue(result === 'Error' ? null : result);
      setCurrentValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    setOperator(nextOperator);
    setOverwrite(true);
  };

  const handleEquals = () => {
    if (operator === null || previousValue === null) return;
    const result = evaluate({ currentValue, previousValue, operator });
    setCurrentValue(result);
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  };

  return (
    <div className="app">
      <h1>React Calculator</h1>
      <div className="calculator">
        <Display value={currentValue} />
        <Keypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onClear={handleClear}
          onEquals={handleEquals}
          onDecimal={handleDecimal}
          onToggleSign={handleToggleSign}
          onPercent={handlePercent}
        />
      </div>
    </div>
  );
}


