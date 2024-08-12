import React, { useEffect, useRef, useState } from 'react';
import currencyapi from '@everapi/currencyapi-js'
import { Block } from './Block';
import './index.css';

function App() {
  const [fromCurrency, setFromCurrency]  = useState('RUB');
  const [toCurrency, setToCurrency]  = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  const ratesRef = useRef({})
  const client = new currencyapi('cur_live_nT3VCs3Ss8ibTVZqikrBU6isNicyNc2FsrbJXAcy')
  
  useEffect(()=>{
    client.latest({
      base_currency: 'USD'
    }).then((res) => {
        ratesRef.current = res.data;
        onChangeToPrice(1);
    }).catch(()=>{
      alert('Ошибка в получении данных')
    })
  }, [])

  const onChangeFromPrice = (value)=>{
    const price = value / ratesRef.current[fromCurrency].value;
    const result = price * ratesRef.current[toCurrency].value;
    setToPrice(result);
    setFromPrice(value);
  }

  const onChangeToPrice = (value)=>{
    const result = (ratesRef.current[fromCurrency].value / ratesRef.current[toCurrency].value) * value;
    setFromPrice(result)
    setToPrice(value);
  }

  useEffect(()=>{
    if (ratesRef.current[fromCurrency] && ratesRef.current[toCurrency]) {
      onChangeFromPrice(fromPrice);
    }
  }, [fromCurrency]);

  useEffect(()=>{
    if (ratesRef.current[fromCurrency] && ratesRef.current[toCurrency]) {
      onChangeToPrice(toPrice);
    }
  }, [toCurrency]);

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangeFromPrice}
      />
      <Block 
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={setToCurrency} 
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
