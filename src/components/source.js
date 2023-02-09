import Web3 from "web3";
import {bep20ABI, tokenFactoryABI} from "./abi.js";
import { factoryABI } from "./abi.js";
import { poolABI } from "./abi.js";
import { createChart } from "lightweight-charts"
import {updateFunc} from "./Navbar";
import {updateFuncPhone} from "./Navphone";
import {usdbalupdate,tokenbalupdate,updatetokendata} from "../App";
import { contentChanger, visibleMaker } from "./alert.js";
import { visibleMakerL } from "./loading.js";
import { tkchange } from "./create.js";
import {  searched } from "./Manage.js";
import {  tradeSearch } from "./TradeContent.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let web3;
let factory;
export let USDAddress;
let dollar;
let connectedAccount;
export let tokenAD=urlParams.get('token');
let tokenSearched=null;
let chart;
let lineSeries;
export let frame='H';
var poolInfo={Address:"0x0000000000000000000000000000000000000000",
    token2usd: null,
    usd2token: null,
    buytax: null,
    saletax: null,
    name:null,
    supply:null,
    ben: null,
    usdinpool:null,
    tokeninpool:null,
    trading:true,
    yesvote:null,
    novote:null,
    thresh:null,
};
var pool;
let chartData


export let ref= urlParams.get('ref');

export const getFactoryContract = async ()=>{
    web3 = new Web3(window.ethereum);
    factory = await new web3.eth.Contract(factoryABI,"0x9057BfBB8De241c5b88a6DDb027928c87f337EC9");
    USDAddress = await factory.methods.usd().call();
    console.log(USDAddress);
    dollar= await new web3.eth.Contract(bep20ABI,USDAddress);
}

export const connectToWeb3 = async ()=>{

    await window.ethereum.request({method:"eth_requestAccounts"});
    connectedAccount = await web3.eth.getAccounts();
    await updateFunc(connectedAccount[0].slice(0,10)+"...");
    await updateFuncPhone(connectedAccount[0].slice(0,10)+"...");
    await updateBalances();

    const subscription = web3.eth.subscribe(
        "newBlockHeaders",
        async (err, result) => {
            if(tokenAD!=null){ 
                await updatePool();  
            }
             }
       );
}

const updateBalances =async ()=>{
   
    if(connectedAccount!=null){
        usdbalupdate("$"+(await dollar.methods.balanceOf(connectedAccount[0]).call()/1e18).toLocaleString())
        if(tokenAD){
            tokenbalupdate((await tokenSearched.methods.balanceOf(connectedAccount[0]).call()/1e18).toLocaleString())
        }else{
            tokenbalupdate(0);
        }
    }else{
        usdbalupdate("$"+0)
    }
}
export const getPool=async(tokenAddress)=>

{
        
        poolInfo={
            Address:"0x0000000000000000000000000000000000000000",
            token2usd: null,
            usd2token: null,
            buytax: null,
            saletax: null,
            name:null,
            supply:null,
            ben: null,
            usdinpool:null,
            tokeninpool:null,
            trading:true,
            yesvote:null,
            novote:null,
            thresh:null,
        };
        
    console.log(tokenAddress);
    tokenAD=tokenAddress;
    var bep20 = await new web3.eth.Contract(bep20ABI,tokenAddress);
    
    tokenSearched=bep20;
    var poolAddress = await factory.methods.showPoolAddress(tokenAddress).call();
    console.log(poolAddress);

    visibleMakerL("grid");
    if(poolAddress!="0x0000000000000000000000000000000000000000"){
            try{
                
                pool = await new web3.eth.Contract(poolABI,poolAddress);
                tokenSearched=bep20;
                await updateBalances();
                poolInfo.Address=poolAddress;
                poolInfo.token2usd= (await pool.methods.tokenPerUSD().call()/1e18);
                poolInfo.usd2token= (await pool.methods.USDPerToken().call()/1e18);                
                poolInfo.buytax= await pool.methods.totalBuyTax().call();
                poolInfo.saletax= await pool.methods.totalSaleTax().call();
                poolInfo.name= await tokenSearched.methods.name().call();
                poolInfo.supply= (await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString();
                poolInfo.ben= await pool.methods.beneficiery().call();
                poolInfo.usdinpool=(await dollar.methods.balanceOf(poolAddress).call()/1e18).toLocaleString();
                poolInfo.tokeninpool=(await tokenSearched.methods.balanceOf(poolAddress).call()/1e18).toLocaleString();
                poolInfo.trading= await pool.methods.tradingEnabled().call();
                poolInfo.yesvote=await pool.methods.yesVotes().call();
                poolInfo.novote=await pool.methods.noVotes().call();
                poolInfo.thresh= (await pool.methods.DAOThreshold().call()/1e18).toLocaleString();
                poolInfo.lpset= !(await tokenSearched.methods.poolAd().call())=="0x0000000000000000000000000000000000000000";
                await updatetokendata(poolInfo);
                await buildChart()
                console.log(poolInfo);
                visibleMakerL("none");
                await upChart();
            }
            catch(e){
                poolInfo.Address=poolAddress;
                              
                poolInfo.buytax= await pool.methods.totalBuyTax().call();
                poolInfo.saletax= await pool.methods.totalSaleTax().call();
                poolInfo.token2usd= 0;
                poolInfo.usd2token= 0;  
                poolInfo.name= await tokenSearched.methods.name().call();
                poolInfo.supply= (await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString();
                poolInfo.ben= await pool.methods.beneficiery().call();
                poolInfo.usdinpool=(await dollar.methods.balanceOf(poolAddress).call()/1e18);
                poolInfo.tokeninpool=(await tokenSearched.methods.balanceOf(poolAddress).call()/1e18).toLocaleString();
                poolInfo.trading= await pool.methods.tradingEnabled().call();
                poolInfo.yesvote=await pool.methods.yesVotes().call();
                poolInfo.novote=await pool.methods.noVotes().call();
                poolInfo.thresh= (await pool.methods.DAOThreshold().call()/1e18).toLocaleString();
                if(Number(poolInfo.usdinpool)>0 && Number(poolInfo.tokeninpool)>0){
                    poolInfo.token2usd= (await pool.methods.tokenPerUSD().call()/1e18).toLocaleString();
                    poolInfo.usd2token= (await pool.methods.USDPerToken().call()/1e18).toLocaleString();                
                }
                poolInfo.lpset= (await tokenSearched.methods.poolAd().call())!="0x0000000000000000000000000000000000000000";
                await updatetokendata(poolInfo);
                await buildChart()
                 
                visibleMakerL("none");
                await upChart();
            }
            }else{
                console.log("no pool")
                poolInfo={Address:"0x0000000000000000000000000000000000000000",
                token2usd: null,
                usd2token: null,
                buytax: null,
                saletax: null,
                name:await tokenSearched.methods.name().call(),
                supply:(await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString(),
                ben: null,
                usdinpool:null,
                tokeninpool:null,
                trading:true,
                yesvote:null,
                novote:null,
                thresh:null,
                    };
                await updatetokendata(poolInfo);
                contentChanger("Pool does not exist yet");
                visibleMaker("grid");
                visibleMakerL("none");
                await upChart();
            }
    await updatetokendata(poolInfo);
     
     
    visibleMakerL("none");
    await upChart();
    


}


 export const updatePool=async()=>{
        var sup = await tokenSearched.methods.totalSupply().call()/1e18
        var poolAD= await factory.methods.showPoolAddress(tokenAD).call();
        pool=await new web3.eth.Contract(poolABI,poolAD);
        if(poolAD!="0x0000000000000000000000000000000000000000"){
        try{
            poolInfo.token2usd= (await pool.methods.tokenPerUSD().call()/1e18);
                poolInfo.usd2token= (await pool.methods.USDPerToken().call()/1e18);                
                poolInfo.buytax= await pool.methods.totalBuyTax().call();
                poolInfo.saletax= await pool.methods.totalSaleTax().call();
                poolInfo.name= await tokenSearched.methods.name().call();
                poolInfo.supply= (await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString();
                poolInfo.ben= await pool.methods.beneficiery().call();
                poolInfo.usdinpool=(await dollar.methods.balanceOf(poolAD).call()/1e18).toLocaleString();
                poolInfo.tokeninpool=(await tokenSearched.methods.balanceOf(poolAD).call()/1e18).toLocaleString();
                poolInfo.trading= await pool.methods.tradingEnabled().call();
                poolInfo.yesvote=await pool.methods.yesVotes().call();
                poolInfo.novote=await pool.methods.noVotes().call();
                poolInfo.thresh= (await pool.methods.DAOThreshold().call()/1e18).toLocaleString();
                
            await updatetokendata(poolInfo);
             
             
            await updateBalances();
            visibleMakerL("none");
            if(tradeSearch.current){
                tradeSearch.current.value=tokenAD;
                await upChart();
            }
            visibleMakerL("none");
            if(searched.current){
                searched.current.value=tokenAD;
            }
            visibleMakerL("none");
            await upChart();
        }
        catch(e){
            poolInfo.Address=poolAD;            
                poolInfo.buytax= await pool.methods.totalBuyTax().call();
                poolInfo.saletax= await pool.methods.totalSaleTax().call();
                
                try{poolInfo.token2usd= (await pool.methods.tokenPerUSD().call()/1e18)
                    poolInfo.usd2token=(await pool.methods.USDPerToken().call()/1e18) }
                catch(e){
                    poolInfo.token2usd= 0;
                    poolInfo.usd2token= 0;
                  }

                poolInfo.name= await tokenSearched.methods.name().call();
                poolInfo.supply= (await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString();
                poolInfo.ben= await pool.methods.beneficiery().call();
                poolInfo.usdinpool=(await dollar.methods.balanceOf(poolAD).call()/1e18).toLocaleString();
                poolInfo.tokeninpool=(await tokenSearched.methods.balanceOf(poolAD).call()/1e18).toLocaleString();
                poolInfo.trading= await pool.methods.tradingEnabled().call();
                poolInfo.yesvote=await pool.methods.yesVotes().call();
                poolInfo.novote=await pool.methods.noVotes().call();
                poolInfo.thresh= (await pool.methods.DAOThreshold().call()/1e18).toLocaleString();
                
            await updatetokendata(poolInfo);
            await updateBalances();
            visibleMakerL("none");
           
            visibleMakerL("none");
            await upChart();
            await updatetokendata(poolInfo);
            await updateBalances();
            visibleMakerL("none");
           
            visibleMakerL("none");
            await upChart();
        }
        
        
    }else{
                poolInfo={Address:"0x0000000000000000000000000000000000000000",
                token2usd: null,
                usd2token: null,
                buytax: null,
                saletax: null,
                name:await tokenSearched.methods.name().call(),
                supply:(await tokenSearched.methods.totalSupply().call()/1e18).toLocaleString(),
                ben: null,
                usdinpool:null,
                tokeninpool:null,
                trading:true,
                yesvote:null,
                novote:null,
                thresh:null,
            };
            await updatetokendata(poolInfo);
             
             
            await updateBalances();
            visibleMakerL("none");

            await upChart();
    }
    await updatetokendata(poolInfo);
    await upChart();
     
     
}

export const setPoolAddress =async ()=>{
    await tokenSearched.methods.setPoolAddress(pool._address).send({from:connectedAccount[0]});
    contentChanger("Pool address set");
    visibleMaker("grid");
}

export const getMaxBalance= async (TKaddress)=>{
    var bep20 = await new web3.eth.Contract(bep20ABI,TKaddress);
    return await bep20.methods.balanceOf(connectedAccount[0]).call()/1e18;    
}

export const buyToken =async (USD)=>{

    USD=web3.utils.toWei(USD);
    try{
        
         var tx= await pool.methods.buyToken(USD).send({from:connectedAccount[0]});
         contentChanger("Transaction Successful");
         visibleMaker("grid");
         updatePool();
        }
    catch(e){
         return [e.message,0];
     }
}

export const sellToken =async (USD)=>{

    USD=web3.utils.toWei(USD);
    try{
        
         var tx= await pool.methods.sellToken(USD).send({from:connectedAccount[0]});
         contentChanger("Transaction Successful");
         visibleMaker("grid");
         updatePool();    }
    catch(e){
        return [e.message,0];
     }
}

export const approveTX = async(tokenToApprove,amount,addressToApprove)=>{
    amount=web3.utils.toWei(amount);
     try{
         var tokenContract = await new web3.eth.Contract(bep20ABI,tokenToApprove);
         var tx= await tokenContract.methods.approve(addressToApprove,amount).send({from:connectedAccount[0]});
         contentChanger("Approval Successful");
         visibleMaker("grid");     }
     catch(e){
        console.log(e)
         return [e.message,0];
      }
}

const get1hChartData = async()=>{
    let chartData=[];
    try{
        let data= await pool.methods.showTradeData(60).call();
        for(let i =1; i<data.length; i++){
            chartData.push({time:Number(data[i].time),open:data[i].Open/1e18,low: data[i].Low/1e18,high:data[i].High/1e18,close:data[i].Close/1e18})
        }
        return chartData;
    }
    catch(e){
        console.log(e.message);
    }  
}

const get1mChartData = async()=>{
    let chartData=[];
    try{
        let data= await pool.methods.showTradeData(1).call();
        for(let i =1; i<data.length; i++){
            chartData.push({time:Number(data[i].time),open:data[i].Open/1e18,low: data[i].Low/1e18,high:data[i].High/1e18,close:data[i].Close/1e18})
        }
        return chartData
    }
    catch(e){
        console.log(e.message);
    }
}

const get1dChartData = async()=>{
    let chartData=[];
    try{
        let data= await pool.methods.showTradeData(24).call();
        for(let i =1; i<data.length; i++){
            chartData.push({time:Number(data[i].time),open:data[i].Open/1e18,low: data[i].Low/1e18,high:data[i].High/1e18,close:data[i].Close/1e18})
        }
        return chartData;
    }
    catch(e){
        console.log(e.message);
    }
}

const upChart = async ()=>{
    let data;
    if(frame==='M'){
       data= await get1mChartData()
    }
    if(frame==="H"){
        data=await get1hChartData()
    }
    if(frame==="D"){
        data=await get1dChartData()
    }
    if( !document.getElementById('chrt').innerHTML){
        buildChart();
    }
    chartData=data
    await lineSeries.setData(data); 
}

export const changeFrame = async (fr)=>{
    console.log(fr)
    frame=fr
    await upChart();
}

export const buildChart=async()=>{
    try{lineSeries.setData([]);}
    catch(e){console.log(e.message);}
        let data;
        if(frame==='M'){
          data=  await get1mChartData()
        }
        if(frame==="H"){
           data= await get1hChartData()
        }
        if(frame==="D"){
            data =await get1dChartData()
        }
    document.getElementById('chrt').innerHTML="";
    chart = createChart(document.getElementById("chrt"), { width: document.getElementById("chrt").offsetWidth, height:  document.getElementById("chrt").offsetHeight,
        layout: {
            backgroundColor: '#3C444C',
            textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
            vertLines: {
                color: 'rgba(197, 203, 206, 0)',
            },
            horzLines: {
                color: 'rgba(197, 203, 206, 0)',
            },
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 0)',
        },
            });    
    lineSeries = chart.addCandlestickSeries();
    
   await lineSeries.setData(data);
}

export const requestLiquidityRemoval= async()=>{
    try{
        var tx = await pool.methods.requestLPRemovalDAO().send({from:connectedAccount[0]});
        contentChanger("DAO Voting Started");
        visibleMaker("grid");    }
    catch(e){
        return e.message;
    }
}

export const removeLP = async ()=>{
    var tx = await pool.methods.removeLP().send({from:connectedAccount[0]});
    contentChanger("Liquidity Removed Successfully");
    visibleMaker("grid");}

export const addLiquidity= async(USD,Token)=>{
    USD = web3.utils.toWei(USD);
    Token = web3.utils.toWei(Token);
    try{
        var tx = await pool.methods.addLiquidity(Token,USD).send({from:connectedAccount[0]});
        console.log(tx);
        await getPool(tokenAD);
        contentChanger("Liquidity Added Successfully");
        visibleMaker("grid");    }
    catch(e){
        return [e.message];
    }
}

window.addEventListener("load",()=>{
    chart = createChart(document.getElementById("chrt"), { width: document.getElementById("chrt").offsetWidth, height:  document.getElementById("chrt").offsetHeight,
    layout: {
		backgroundColor: '#3C444C',
		textColor: 'rgba(255, 255, 255, 0.9)',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0)',
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0)',
		},
	},
	rightPriceScale: {
		borderColor: 'rgba(197, 203, 206, 0)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0)',
	},
})

    lineSeries = chart.addCandlestickSeries();
})

export const createPool=async (thresh)=>{
    if(!ref){
        ref=factory._address;
        console.log(ref);
    }
    thresh=web3.utils.toWei(thresh);
    try{
    var tx = await factory.methods.createNewPool(tokenAD,connectedAccount[0],thresh,ref).send({from:connectedAccount[0]});
    await getPool(tokenAD);}
    catch(e){
        console.log(e);
    }

    
    contentChanger("Pool created successfully");
    visibleMaker("grid"); }


 export const createToken= async (name_,symbol,supply,LPTax,BurnTax,addition,wallets)=>{
    if(!ref){
        ref=factory._address;
        console.log(ref);
    }    var tokenFactory_=new web3.eth.Contract(tokenFactoryABI,"0x835f0accE04059930d4b8212A8291164d9542a73");
    console.log(BurnTax,LPTax,wallets,addition);
        if(!LPTax.current){
            LPTax="0";
        }else{
            LPTax=LPTax.current.value;
        }
        if(!BurnTax.current){
            BurnTax="0";
        }else{
            BurnTax=BurnTax.current.value;
        }
        if(!addition){
            addition=[];
        }else{
            for(var i =0;i <addition.length; i++){
                addition[i]=addition[i].current.value;
            }
        }
        if(!wallets){
            wallets=[];
        }else{
            for(var i =0;  i<wallets.length; i++){
                wallets[i]=wallets[i].current.value;
            }
        }
        console.log(BurnTax,LPTax,wallets,addition);
            var tx = await tokenFactory_.methods.createSimpleToken(name_,symbol,supply,addition,wallets,LPTax,BurnTax).send({from:connectedAccount[0]});
            var add = await tokenFactory_.methods.lastTkCreated(connectedAccount[0]).call();
            tkchange(add);
            contentChanger("Token created successfully");
            visibleMaker("grid");        

}


export const voteYes = async()=>{
    var tx = await pool.methods.vote(0).send({from:connectedAccount[0]});
    contentChanger("Vote Casted");
    visibleMaker("grid");
}

export const voteNo = async()=>{
    var tx = await pool.methods.vote(1).send({from:connectedAccount[0]});
    contentChanger("Vote Casted");
    visibleMaker("grid");}

window.addEventListener('resize',()=>{
    document.getElementsByClassName('tv-lightweight-charts')[0].remove();
    document.getElementById('chrt').innerHTML="";
    chart = createChart(document.getElementById("chrt"), { width: document.getElementById("chrt").offsetWidth, height:  document.getElementById("chrt").offsetHeight,
    layout: {
		backgroundColor: '#3C444C',
		textColor: 'rgba(255, 255, 255, 0.9)',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0)',
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0)',
		},
	},
	rightPriceScale: {
		borderColor: 'rgba(197, 203, 206, 0)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0)',
	},
})

    lineSeries = chart.addCandlestickSeries();
    lineSeries.setData(chartData);
})

window.ethereum.on("accountsChanged",async (acc)=>{
    connectedAccount[0]=acc[0];
    console.log(connectedAccount);
    await updateFunc(connectedAccount[0].slice(0,10)+"...");
    await updateBalances();

  })
  
  window.addEventListener("load",async ()=>{
    await getFactoryContract();
    await  connectToWeb3();
    console.log("TOken is",tokenAD)
    if(tokenAD){
        getPool(tokenAD);
        if(searched){
        searched.current.value=tokenAD}
        if(tradeSearch){
        tradeSearch.current.value=tokenAD}
    }
  })
