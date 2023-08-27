import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [])


  async function getTransactions() {

    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];
    console.log(price);
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      })
    })
      .then(response => {
        setName('');
        setDateTime('');
        setDescription('');
        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status);
        }
        return response.json();
      })
      .then(json => {
        console.log('Result:', json);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  let balance=0;
  for(const transaction of transactions){
    balance=balance+parseInt(transaction.price)
  }
  return (
    <main>
      <h1>Rs {balance}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text"
            value={name}
            onChange={ev => setName(ev.target.value)} placeholder={'+15000 new mobile'}></input>
          <input value={datetime}
            onChange={ev => setDateTime(ev.target.value)} type="datetime-local"></input>
        </div>
        <div className="description">
          <input value={description}
            onChange={ev => setDescription(ev.target.value)}
            type="text" placeholder={'description'}></input>
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price "+(transaction.price[0]=='+'?'green':'red')}>{transaction.price}</div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
