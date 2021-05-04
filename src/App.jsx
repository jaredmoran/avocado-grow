import React, { useEffect, useReducer } from 'react';
import './App.css';

const MULTIPLIER_WATER = 10;
const MULTIPLIER_COMPOST = 5;
const initState = {
  waterAmt: 0,
  compostAmt: 0,
  sunAmt: 0,
  health: 0,
  showDiagnosis: false,
  diagnosis: '',
};

const avoReducer = (avoState, action) => {
  switch (action.type) {
    case 'water':
      return { ...avoState, waterAmt: avoState.waterAmt + 1 };
    case 'compost':
      return { ...avoState, compostAmt: avoState.compostAmt + 1 };
    case 'sun':
      return { ...avoState, sunAmt: action.value };
    case 'reset':
      return { ...initState };
    case 'health':
      return { ...avoState, health: action.value };
    case 'diagnosis':
      return { ...avoState, showDiagnosis: true, diagnosis: action.value };
    default:
      throw new Error(`Unrecognized action dispatched: ${action.type}`);
  }
};

function App() {
  const [avoState, dispatch] = useReducer(avoReducer, initState);

  // For the sake of this exercise, let's say we want a 1:1 ratio
  // of water and compost to sunshine.
  const calculateHealth = () => {
    const sun = avoState.sunAmt;
    // Our simple health calculation won't work without sun, so let's
    // short circuit here.
    if (!sun) {
      dispatch({ type: 'health', value: 0 });
      return;
    }
    const water = avoState.waterAmt * MULTIPLIER_WATER;
    const compost = avoState.compostAmt * MULTIPLIER_COMPOST;
    const ratio = (water + compost) / sun;
    dispatch({ type: 'health', value: ratio });
  };

  useEffect(() => {
    let diagnosis = '';
    if (avoState.health) {
      if (0.8 <= avoState.health && avoState.health <= 1.2) {
        diagnosis = 'Yay! Your avocado is happy!';
      } else {
        diagnosis = 'Aw shucks, life is the pits :(';
      }
      dispatch({
        type: 'diagnosis',
        value: diagnosis
      });
    }
  }, [avoState.health]);

  return (
    <div className='app-wrapper'>
      <h1>Avocado Doctor</h1>
      <p>Tell the doctor how much water, compost and sunshine your avocado has been getting, and the doctor will tell you if your avocado is happy or not.</p>
      <div className='input-output'>
        <div className='inputs'>
          <button className='water' onClick={() => dispatch({ type: 'water' })}>
            Add Water
          </button>
          <br />
          <button
            className='compost'
            onClick={() => dispatch({ type: 'compost' })}
          >
            Add Compost
          </button>
          <label htmlFor='sun'>Sunshine (%)</label>
          <input
            type='range'
            value={avoState.sunAmt}
            name='sun'
            min='0'
            max='100'
            onChange={(evt) => {
              dispatch({ type: 'sun', value: parseInt(evt.target.value) });
            }}
            step='1'
          />
        </div>
        <div className='outputs'>
          <dl>
            <dt>Water</dt>
            <dd>{avoState.waterAmt}</dd>
            <dt>Compost</dt>
            <dd>{avoState.compostAmt}</dd>
            <dt>Sunshine</dt>
            <dd>{avoState.sunAmt}%</dd>
          </dl>
          <button className='health' onClick={calculateHealth}>
            Get a Check-Up
          </button>
          <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
        <div className='health'>
          {avoState.showDiagnosis ? (
            <dl>
              <dt>Diagnosis</dt>
              <dd>{avoState.diagnosis}</dd>
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
