import React from 'react';
import './css/body.css';
import './css/swap.css';
import './css/chart.css';
import './css/nav.css';
import {sellToken,buyToken,approveTX,USDAddress,tokenAD,changeFrame, buildChart,frame,getMaxBalance,getPool, updatePool} from "./source"
import TokenList from './searchOption';
import { tradeselec,manageselect,createselect } from './Navbar';
import { createselectp,manageselectp,tradeselecp } from './Navphone';
export var scroll;
export var tradeSearch;
export var chtt;

function TradeContent(props) {
  const [selected,changeSelected] = React.useState('Buy')
  const [currentBuyState,changeBuyState] = React.useState('buy-selected');
  const [currentSellState,changeSellState] = React.useState('sell');
  const [currentTimeFrame,updateTimeFrame] =React.useState(frame);
  const [apprtxt,changeapprtxt] = React.useState("Approve Amount");
  const [scrollBar,updateScroll] = React.useState("none");
  const [estimateRec,updateEst] = React.useState(0);
  let searchVal = React.createRef();
  let amount = React.createRef();

  tradeSearch =searchVal;
  scroll=updateScroll;
  React.useEffect(()=>{
    tradeselec("nav-options-selected")
    manageselect("nav-options")
    createselect("nav-options")
    tradeselecp("nav-options-selected-p")
    manageselectp("nav-options-p")
    createselectp("nav-options-p")
    const f = async()=>{
      if(tokenAD){
        await getPool(tokenAD);
      }
    }
    f();
  },[])

  const calculateToken = ()=>{
    var inPoolUSD = Number(props.tokenData.usdinpool.replace(/\,/g,""))
    var inPoolToken = Number(props.tokenData.tokeninpool.replace(/\,/g,""))
    var currentVal= Number(amount.current.value);
    currentVal=currentVal-((currentVal/100)*Number(props.tokenData.buytax))
    var tokensBeforePriceImpact = currentVal*Number(props.tokenData.token2usd);
    inPoolUSD+=currentVal;
    inPoolToken=inPoolToken-tokensBeforePriceImpact;
    var newPrice = inPoolToken/inPoolUSD
    updateEst((newPrice*currentVal));
  }
  const calculateUSD = ()=>{
    var inPoolUSD = Number(props.tokenData.usdinpool.replace(/\,/g,""))
    var inPoolToken = Number(props.tokenData.tokeninpool.replace(/\,/g,""))
    var currentVal= Number(amount.current.value);
    currentVal=currentVal-((currentVal/100)*Number(props.tokenData.saletax))
    var tokensBeforePriceImpact = currentVal*Number(props.tokenData.usd2token);
    inPoolUSD-=currentVal;
    inPoolToken=inPoolToken+tokensBeforePriceImpact;
    var newPrice = inPoolUSD/inPoolToken;
    updateEst((newPrice*currentVal));
  }

  return (
    <div className="trade-content">
      <div className="chart-content">
        <div className="time-switch">
          <h2>{props.tokenData.name}</h2>
          <div className="time-selector">
            <div className={currentTimeFrame==="M"?"time-opt-selected":"time-opt"} onClick={()=>{
              updateTimeFrame("M");
              changeFrame("M")
            }}>1M</div>
            <div className={currentTimeFrame==="H"?"time-opt-selected":"time-opt"} onClick={()=>{
              updateTimeFrame("H");
              changeFrame("H")
            }}>1H</div>
            <div className={currentTimeFrame==="D"?"time-opt-selected":"time-opt"} onClick={()=>{
              updateTimeFrame("D");
              changeFrame("D")
            }}>1D</div>
          </div>
        </div>
        <div className="chart" id="chrt">

        </div>

      </div>
      <div className="swap-content">
        <div className="swp-main">
        <div className="search">
          <input placeholder="Enter Token Address" onClick={()=>{
            scrollBar=="none"?updateScroll("flex"):updateScroll("none")
          }} ref={searchVal}></input><button onClick={async()=>{
            updateScroll("none")
              await getPool(searchVal.current.value);
              await buildChart();
          }}>Search</button>        
      </div>
      <div className='dropDown' style={{position:"relative",Width:"100%", display:scrollBar}}>
            <TokenList changeScroll ={updateScroll} searc={searchVal}/>
          </div>
          <div className="buy-sell">
            <div className={currentBuyState} onClick={async()=>{
              changeSelected('Buy');
              changeBuyState('buy-selected');
              changeSellState('sell');
              await updatePool()
            }}>
              Buy
            </div>
            <div className={currentSellState} onClick={async()=>{
              changeSelected('Sell');
              changeBuyState('buy');
              changeSellState('sell-selected');
              await updatePool(); 
            }}>
              Sell
            </div>
          </div>
          <div className="info-table">
            <div>
              <div>Token Name:</div>
              <div id="name">{props.tokenData.name}</div>
            </div>
            <div>
              <div>Supply:</div>
              <div id="supply">{props.tokenData.supply}</div>
            </div>
            <div>
              <div>Token/wFren:</div>
              <div id="token2usd">{props.tokenData.token2usd}</div>
            </div>
            <div>
              <div>wFren/Token:</div>
              <div id="usd2token">{props.tokenData.usd2token}</div>
            </div>
            <div>
              <div>Buy Tax:</div>
              <div id="buytax">{props.tokenData.buytax}</div>
            </div>
            <div>
              <div>Sell Tax:</div>
              <div id="selltax">{props.tokenData.saletax}</div>
            </div>
            <div>
              <div>wFren in Pool:</div>
              <div id="usdin">{props.tokenData.usdinpool}</div>
            </div>
            <div>
              <div>Token in Pool:</div>
              <div id="tokenin">{props.tokenData.tokeninpool}</div>
            </div>
            <div>
              <div>DAO Threshold:</div>
              <div id="tokenin">{props.tokenData.thresh}</div>
            </div>
          </div>
          {props.tokenData.trading && <>
            <div className="amount">
              <input style={{ width: '100%', fontSize: 'large' }} onChange={()=>{
                selected==="Buy"?calculateToken():calculateUSD();
              }} ref={amount} placeholder="Enter Amount" type="number" min="0"></input>
              <><p style={{display:"flex",justifyContent:"space-between", alignItems:"center",    margin: "0px 5px 0.5px 5px"}} id="bal">Balance: {selected==="Buy"?props.currentUSDBal:props.currentTokenBal} <p style={{cursor:"pointer"}} onClick={async()=>{
                selected=="Buy"?amount.current.value =await getMaxBalance(USDAddress):amount.current.value =await getMaxBalance(tokenAD);
              }}>MAX</p></p>
              </>
            </div>
            {props.tokenData.usdinpool &&
            <div className='est'>
              <div>Estimated Received:</div>
              <div>{estimateRec}</div>
            </div>}
            {props.tokenData.trading?<><button onClick={ async()=>{
              selected==="Buy"? await approveTX(USDAddress,amount.current.value,props.tokenData.Address):await approveTX(tokenAD,amount.current.value,props.tokenData.Address)
              changeapprtxt("Amount Approved");
            }}>{apprtxt}</button>
            <button onClick={ async()=>{
              selected==="Buy"? await buyToken(amount.current.value):await sellToken(amount.current.value);
              changeapprtxt("Approve Amount");
            }}>{selected}</button></>:<span>Trading has been paused for this token for the purpose of liquidity removal vote head over to Manage Token tab and cast your vote if you are an investor</span>}
          </>}
        </div>
      </div>
    </div>
  );
}

export default TradeContent;
