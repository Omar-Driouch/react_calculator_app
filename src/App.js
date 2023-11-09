import { useReducer } from 'react';
import './App.css';
import DigitButton from './DgitiButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT:'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}


const INTEGER_FORMATER = new Intl.NumberFormat("en-us",
{maximumFractionDigits:0})

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  const { currentOperand } = state;

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.operwrite === true)
      return {
        ...state,
        currentOperand: payload.digit,
        operwrite: false,
      };
      if (payload.digit === "0" && currentOperand === "0") {return state;}
      if (payload.digit === "." && currentOperand && currentOperand.includes(".")) {return state;}
      return {
        ...state,
        currentOperand: `${currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if( state.currentOperand == null || state.previousOperand == null || state.operation == null)
      {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        operwrite: true,
        previousOperand: null,
        operation: null,
        
      };
    case ACTIONS.CHOOSE_OPERATION:
      
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null)
      {
        return {
          ...state,
          operation: payload.operation,

        }
      }

      if (state.previousOperand == null)
      {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
       return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,

      }; 



    case ACTIONS.DELETE_DIGIT:
      if (state.operwrite === true) {
       
        return { ...state,
          currentOperand: null,
          operwrite: false,}
      }
      if (state.currentOperand === null) return {...state,};
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          
          currentOperand: null,
        };
      }
      return{
        ...state,
        currentOperand: currentOperand.slice(0,-1),
        
      }

    default:
      return {};

  }
}


export function evaluate({currentOperand, previousOperand, operation}) {
  let result = "";
  if (operation === '*') {
    result = parseFloat(currentOperand) * parseFloat(previousOperand);
  } else if (operation === '+') {
    result = parseFloat(currentOperand) + parseFloat(previousOperand);
  } else if (operation === '-') {
    result = parseFloat(currentOperand) - parseFloat(previousOperand);
  } else if (operation === '÷') {
    if (parseFloat(previousOperand) === 0) {
      result = "Error: Cannot divide by zero";
    } else {
      result = parseFloat(currentOperand) / parseFloat(previousOperand);
    }
  }
  return result.toString();
}

function App() {
  const [{previousOperand,currentOperand, operation}, dispatch] = useReducer(reducer, {})


  return (
    <div className="calculator-grid">   
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
       <button className="span-two" onClick={()=> dispatch({type:ACTIONS.CLEAR})}>AC</button>
       <button  onClick={()=> dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
       <OperationButton operation={'÷'} dispatch={dispatch}/>
       <DigitButton digit={"1"} dispatch={dispatch}/>
       <DigitButton digit={"2"} dispatch={dispatch}/>
       <DigitButton digit={"3"} dispatch={dispatch}/>
       <OperationButton operation={'*'} dispatch={dispatch}/>
       <DigitButton digit={"4"} dispatch={dispatch}/>
       <DigitButton digit={"5"} dispatch={dispatch}/>
       <DigitButton digit={"6"} dispatch={dispatch}/>
       <OperationButton operation={'+'} dispatch={dispatch}/>
       <DigitButton digit={"7"} dispatch={dispatch}/>
       <DigitButton digit={"8"} dispatch={dispatch}/>
       <DigitButton digit={"9"} dispatch={dispatch}/>
       <OperationButton operation={'-'} dispatch={dispatch}/>
       <DigitButton digit={"."} dispatch={dispatch}/>
       <DigitButton digit={"0"} dispatch={dispatch}/>
  
       <button className="span-two" onClick={()=> dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;

