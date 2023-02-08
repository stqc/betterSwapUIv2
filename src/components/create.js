import React from "react";
import {approveTX,createToken,ref,USDAddress} from './source';
import { tradeselec,manageselect,createselect } from './Navbar';
import { createselectp,manageselectp,tradeselecp } from './Navphone';
import TaxInput from "./taxInputs";
export var tkchange;

function CreateToken(){

    let tkname = React.createRef();
    let tkym = React.createRef();
    let tksup =React.createRef();
    let LPTax = React.createRef();
    let burnTax = React.createRef();
       

    const [apprtxt,changeapprtxt]=React.useState("Approve Token Creation Fee");
    const [show,updateShow] =React.useState("none");
    const [tkad,setTkad]=React.useState("0");
    const [isVis,changeVis]=React.useState(false);
    const [showLPfiller,changeLPFiller]=React.useState(false);
    const [showBurnfiller,changeBurnFiller]=React.useState(false);
    const [MoreField,addMoreFields] = React.useState([]);
    const [TrefArr,addMoreRef]=React.useState([]);
    const [WrefArr,addMoreWall]=React.useState([]);

    tkchange=setTkad;
    React.useEffect(()=>{
      tradeselec("nav-options")
    manageselect("nav-options")
    createselect("nav-options-selected")
    tradeselecp("nav-options-p")
    manageselectp("nav-options-p")
    createselectp("nav-options-selected-p")
    },[])
    
    return (
        <div className="trade-content">
      <div className="chart-content">
        <h2 style={{padding:"0.5% 2%",fontFamily: "Montserrat", fontStyle: "normal",fontWeight: "400", fontSize:"40px"}}>Create A Token</h2>
        <div className="amount" style={{ margin: '2%' }}>
          <input ref={tkname}style={{ width: '100%', fontSize: 'large' }} placeholder="Enter Token Name" min="0"></input>
        </div>
        <div className="amount" style={{ margin: '2%' }}>
          <input ref={tkym}style={{ width: '100%', fontSize: 'large' }} placeholder="Enter Token Symbol" min="0"></input>
        </div>
        <div className="amount" style={{ margin: '2%' }}>
          <input ref={tksup}style={{ width: '100%', fontSize: 'large' }} placeholder="Enter Token Supply" type="number" min="0"></input>
        </div>
        <div className="amount" style={{margin:"2%" ,display:"flex", flexDirection:"column"}}>
          <div>
            <input type="checkbox"  id="lptax" style={{width:"auto"}} onChange={()=>{
              showLPfiller?changeLPFiller(false):changeLPFiller(true)
            }}/>
            <label for="lptax">Add AutoLiquidity Tax?</label>
          </div>
          {showLPfiller && <input ref={LPTax} type="number" min="1" max="30" style={{marginTop:"2%"}}placeholder="Enter Tax Value For Auto Liquidity"/>}
        </div>
        <div className="amount" style={{margin:"2%" ,display:"flex", flexDirection:"column"}}>
          <div>
            <input type="checkbox"  id="lptax" style={{width:"auto"}} onChange={()=>{
              showBurnfiller?changeBurnFiller(false):changeBurnFiller(true)
            }}/>
            <label for="lptax">Add Token Burn Tax?</label>
          </div>
          {showBurnfiller && <input ref={burnTax} type="number" min="1" max="30" style={{marginTop:"2%"}}placeholder="Enter Tax Value For Token Burn"/>}
        </div>
        <>{MoreField}</>
        
        <div style={{display:"flex", justifyContent:"flex-end", marginLeft:"2%",marginRight:"2%"}} >
            <div style={{cursor:"pointer"}}onClick={()=>{
              var tx= React.createRef();
              var wall=React.createRef();
             
          addMoreFields(MoreField.concat([<TaxInput reff={tx} reffWal={wall}key={MoreField.length}/>]));
          addMoreRef(TrefArr.concat([tx]));
          addMoreWall(WrefArr.concat([wall]));
        }}>+Add Additional Taxes</div>
        </div>
        
            {!isVis && <button style={{margin: "3%" }} onClick={async ()=>{
                await approveTX(USDAddress,"130000","0xc356A9C64d5363EE817d6C3Fcb80112bC3B1CfF7");
                changeapprtxt("USD Fee Approved")
                changeVis(true);
            }}>{apprtxt}</button>}
            {isVis && <button style={{margin: "0.5% 3% 2% 3%" }}
            onClick={async ()=>{
              console.log(WrefArr)
              await createToken(tkname.current.value,tkym.current.value,tksup.current.value,LPTax,burnTax,TrefArr,WrefArr)
              changeapprtxt("Approve Token Creation Fee")
              updateShow("initial")
              changeVis(false);
              
            }}> Create Token</button>}

        </div>
        <div className="swap-content">
            <div className="swp-main">
                <div className="info-table">
                    <h3>Creating your very own token has never been this easy!</h3>
                    <ul>
                        <li>Type in your desired token name</li>
                        <li>Type in your desired token symbol</li>
                        <li>Type in the supply for your token</li>
                        <li>Fill out any taxes that you may have on your token</li>
                        <li>Approve wFren for a small fee of 130,000 and then create your token!</li>
                        <li>Once the token is created head on over to Manage Token tab. This is where you will set your Taxes and create your pool to trade on BetterSwap!</li>
                    </ul>
                </div>    
                <button style={{display:show}} onClick={()=>{
                  window.location.href="/manage?token="+tkad+"&ref="+ref;
                }}>Go to Manage Token</button>            
            </div>
        </div>
    </div>
    )
}

export default CreateToken;
