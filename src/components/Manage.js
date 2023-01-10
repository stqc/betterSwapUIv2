import React, { useEffect } from 'react';
import './css/body.css';
import './css/swap.css';
import './css/chart.css';
import { requestLiquidityRemoval,removeLP,addLiquidity,approveTX, USDAddress,tokenAD,createPool,updatePoolTax,voteNo,voteYes, getPool,updatePool,getMaxBalance} from './source';
import TokenList from './searchOption';
import Alert from './alert';
import { createselect, manageselect, tradeselec } from './Navbar';
import { createselectp,manageselectp,tradeselecp } from './Navphone';
export let updateYes;
export let updateNo;
export var searched;

function Manage(props) {
  const [selected,changeSelected] = React.useState('Add Liquidity')
  const [currentBuyState,changeBuyState] = React.useState('buy-selected');
  const [currentSellState,changeSellState] = React.useState('sell');
  const [scrollBar,updateScroll] = React.useState("none");
  let searchVal = React.createRef();
  let usdAMT = React.createRef();
  let tokenAMT= React.createRef();
  let btx=React.createRef();
  let stx=React.createRef();
  let lp=React.createRef();
  let thresh=React.createRef();
searched=searchVal;
  useEffect(()=>{
    tradeselec("nav-options")
    manageselect("nav-options-selected")
    createselect("nav-options")
    tradeselecp("nav-options-p")
    manageselectp("nav-options-selected-p")
    createselectp("nav-options-p")
    var f = async()=>{
        if(props.tokenData.Address!="0x0000000000000000000000000000000000000000")
        await updatePool();
    }
    f();
  },[])

  return(
    <div className="trade-content">
      <div className="chart-content" style={{ padding: '2%' }}>
        {props.tokenData.trading?<>
        <span style={{ fontSize: '20px', padding: '2%' }}>
          Following are the required methods necessary for pool creation
          <br />
          These methods can be updated after the creation of the pool
          <br/> <h5>For creating a new pool please search for your token by pasting the token address in the search bar from the menu<br/>Once the pool is created you may add the liquidity as required</h5>
          <h4 style={{color:"rgb(16,255,27)"}}>NOTE: The total tax cannot exceed more than 30%<br/>Total Buy Tax= Development Tax on Buys + AutoLP Tax Eg: (5+2=7% Total Buy Tax)
          <br/>Total Sell Tax= Development Tax on Sells + AutoLP Tax Eg:(15+10=25% Total Sell Tax)</h4>
        </span>
        <div className="amount" style={{ margin: '2%' }}>
          <input
            style={{ width: '100%', fontSize: 'large' }}
            placeholder="Enter Development Tax On Buys (type 0 for none)"
            type="number"
            min="0" ref={btx}
          />
        </div>
        <div className="amount" style={{ margin: '2%' }}>
          <input
            style={{ width: '100%', fontSize: 'large' }}
            placeholder="Enter Development Tax On Sells (type 0 for none)"
            type="number"
            min="0" ref={stx}
          />
        </div>
        <div className="amount" style={{ margin: '2%' }}>
          <input ref={lp}
            style={{ width: '100%', fontSize: 'large' }}
            placeholder="Enter AutoLP Tax (type 0 for none)"
            type="number"
            min="0"
          /> 
        </div>
        {props.tokenData.Address!=="0x0000000000000000000000000000000000000000" || props.tokenData.Address!==null &&
        <div className="amount" style={{ margin: '2%' }}>
          <input ref={thresh}
            style={{ width: '100%', fontSize: 'large' }}
            placeholder="Enter Threshold to obtain a DAO token"
            type="number"
            min="1"
          /> 
        </div>}
        <button style={{ margin: '3%' }} onClick={()=>{
          props.tokenData.Address==="0x0000000000000000000000000000000000000000"?createPool(btx.current.value,stx.current.value,lp.current.value,thresh.current.value):updatePoolTax(btx.current.value,stx.current.value,lp.current.value);
        }}>{props.tokenData.Address==="0x0000000000000000000000000000000000000000"?"Create Pool":"Update Pool"}</button></>:
        <><span style={{ fontSize: '20px', padding: '2%' }}>
        Trading has been disabled for liquidity removal vote,
        <br />
        If you happen to hold DAO token for this project please cast your vote below..
        <br/><br/>NOTE: You can only vote once
        <br/><br/>Current Votes in Favour: {props.tokenData.yesvote}
        <br/><br/>Current Votes Against: {props.tokenData.novote}
      </span>
        <button onClick={async ()=>{
          await voteYes();
        }}style={{margin:"2%"}}>Vote in Favour</button>
        <button onClick={async ()=>{
          await voteNo();
        }}style={{margin:"2%"}}>Vote Against</button>
        </>
        }
      </div>
      <div className="swap-content">
        <div className="swp-main">
        <div className="search">
          <input placeholder="Enter Token Address" onClick={()=>{
            scrollBar=="none"?updateScroll("flex"):updateScroll("none")
          }} ref={searchVal}></input><button onClick={async()=>{
            updateScroll("none")
              await getPool(searchVal.current.value);
          }}>Search</button>        
      </div>
        <div className='dropDown' style={{position:"relative",Width:"100%", display:scrollBar}}>
            <TokenList changeScroll ={updateScroll} searc={searchVal}/>
          </div>
          <div className="buy-sell">
            <div className={currentBuyState} onClick={()=>{
              changeSelected('Add Liquidity');
              changeBuyState('buy-selected');
              changeSellState('sell');
            }}>Add Liquidity</div>
            <div className={currentSellState} onClick={()=>{
              changeSelected('Request Liquidity Removal Vote');
              changeBuyState('buy');
              changeSellState('sell-selected');
            }}>Remove Liquidity</div>
          </div>
          <div className="info-table">
          <div>
              <div>Token Name:</div>
              <div id="name">{props.tokenData.name}</div>
            </div>
            <div>
              <div>Supply:</div>
              <div id="supply" style={{overflow:"hidden"}}>{props.tokenData.supply}</div>
            </div>
            <div>
              <div>Token/USD:</div>
              <div id="token2usd">{props.tokenData.token2usd}</div>
            </div>
            <div>
              <div>USD/Token:</div>
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
              <div>USD in Pool:</div>
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
          
                { selected==="Add Liquidity" &&
                  <>
                    <div className="amount">
                        <input ref={usdAMT}style={{width: "100%", fontSize: "large", paddingTop:"0.5%",marginLeft:"5px",marginTop:"0px"}} placeholder="Enter USD Amount" type="number" min="0"></input>
                        <p style={{display:"flex",justifyContent:"space-between", alignItems:"center",margin: "0px 5px 0.5px 5px"}} id="bal">Balance: {props.currentUSDBal} <p style={{cursor:"pointer"}} onClick={ async()=>{
                          usdAMT.current.value= await getMaxBalance(USDAddress);
                        }}>MAX</p></p>
                    </div>
                    <div className="amount">
                        <input ref={tokenAMT}style={{width: "100%", fontSize: "large",marginTop:"0px"}} placeholder="Enter Token Amount" type="number" min="0"></input>
					              <p style={{display:"flex",justifyContent:"space-between", alignItems:"center",margin: "0px 5px 0.5px 5px"}} id="bal">Balance: {props.currentTokenBal} <p style={{cursor:"pointer"}} onClick={async ()=>{
                          
                            tokenAMT.current.value= await getMaxBalance(tokenAD);  
                        }}>MAX</p></p>
                    </div>
                    <button onClick={async ()=>{
                      await approveTX(USDAddress,usdAMT.current.value,props.tokenData.Address);
                    }}>Approve USD</button>
                    <button onClick={async()=>{
                      await approveTX(tokenAD,tokenAMT.current.value,props.tokenData.Address);
                    }}>Approve Token</button>
                  </>
                }
                {props.tokenData.trading ?<button onClick={async()=>{
                    selected==="Add Liquidity"?await addLiquidity(usdAMT.current.value,tokenAMT.current.value):await requestLiquidityRemoval();
                }}>{selected}</button>:<button onClick={async()=>{
                  selected==="Add Liquidity"?alert("Liquidity cannot be added because of trading being paused."):await removeLP();
              }}>{selected==="Add Liquidity"?selected:"Remove Liquidity"}</button>}
        </div>
        </div>
        </div>
  ) 
}
    
    
    
    
export default Manage;