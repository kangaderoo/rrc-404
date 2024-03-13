import {
  RadixDappToolkit,
  DataRequestBuilder,
} from '@radixdlt/radix-dapp-toolkit'


const mynetworkId = 1;

console.log ("network ID", mynetworkId);

// UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES 

// change and or update the following definition with the value obtained during publish and initiate actions.
const dAppcomponent = 'component_rdx1czscv9f2mv034hewjplej5ef4f2ecug2fxxelfpgxrsrhw4mglq2yp'
// change and update the folling definition with your own dApp-definitions wallet.
const dAppId = 'account_rdx128mrnm4upe8p94sfze0ka605ktgpr5ckv7dwzpynh4c750tl0tc7yn'
// change and update the following definition with your own redeemable coin
const iceAddress = 'resource_rdx1t4h4396mukhpzdrr5sfvegjsxl8q7a34q2vkt4quxcxahna8fucuz4'
// change and update the following definition with the correct radix definition
const iceNFTAddress = 'resource_rdx1n2y299ekzx4au2v9yjmxzu650ulvk5ndx3u5tlevfclk0uvdgs30px'
// change and update the following definition with the correct radix definition
const xrdAddress = 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd'
// UPDATES END 

const refreshButtonElement = document.getElementById("refreshwallet");

const freeze_amount_input = document.querySelector("#freeze_amount_input");
const performFreezeButtonElement = document.getElementById("performfreeze");
const melt_amount_input = document.querySelector("#melt_amount_input");
const performMeltButtonElement = document.getElementById("performmelt");
const melt_byNFTids_input = document.querySelector("#melt_bynftids_input");
const performMeltbyNFTidsButtonElement = document.getElementById("performmeltbyids");


let iceBallance = 0
let iceNFTBallance = 0
let clientAddress = "<undefined>"

performFreezeButtonElement.textContent = "Refresh wallet first"
performMeltButtonElement.textContent = "Refresh wallet first"
performMeltbyNFTidsButtonElement.textContent = "Refresh wallet first"

freeze_amount_input.addEventListener("input", (event) => {
  if (clientAddress == "<undefined>"){
    performFreezeButtonElement.textContent = "Refresh wallet first"
  }else{
    performFreezeButtonElement.textContent = "Freeze "+ freeze_amount_input.value +" Water for Ice";
  }
});

melt_amount_input.addEventListener("input", (event) => {
  if (clientAddress == "<undefined>"){
    performMeltButtonElement.textContent = "Refresh wallet first"
  }else{
    performMeltButtonElement.textContent = "Melt "+ melt_amount_input.value +" Ice for Water";
  }
});

document.getElementById('freeze_amount_input').max = 9
document.getElementById('melt_amount_input').max = 9

const radixDappToolkit = RadixDappToolkit({
   dAppDefinitionAddress: dAppId,
   networkId: mynetworkId,
 });

radixDappToolkit.walletApi.setRequestData(
  DataRequestBuilder.persona(),
  DataRequestBuilder.accounts().exactly(1),
);

refreshButtonElement.addEventListener("click", async () => {

  const temp = radixDappToolkit.walletApi.getWalletData();
  if (temp.accounts.length != 0){
    clientAddress = temp.accounts[0].address; 
  } else{

    const result = await radixDappToolkit.walletApi.sendRequest()

    if (result.isErr()) return alert(JSON.stringify(result.error, null, 2));

    clientAddress = result.value.accounts[0].address;
  }

/* */ 
    const getTokenDetails = await radixDappToolkit.gatewayApi.state.innerClient
      .entityFungibleResourceVaultPage({
        stateEntityFungibleResourceVaultsPageRequest: {
          address: clientAddress,
          resource_address: iceAddress,
        }
      });
  
  iceBallance = 0;
  if (getTokenDetails.total_count != 0){
    for (let i = 0; i < getTokenDetails.total_count; i++) {
	  	let amount = parseFloat(getTokenDetails.items[i].amount,10);
		  if (!isNaN(amount)){
			  iceBallance += amount
		  }
    }
  }

  const getNFTDetails = await radixDappToolkit.gatewayApi.state.innerClient
      .entityNonFungibleResourceVaultPage({
        stateEntityNonFungibleResourceVaultsPageRequest: {
          address: clientAddress,
          resource_address: iceNFTAddress,
        }
      });

//  console.log(getNFTDetails)

  iceNFTBallance = 0;
  if (getNFTDetails.total_count != 0){
    for (let i = 0; i < getNFTDetails.total_count; i++) {
	  	let amount = parseInt(getNFTDetails.items[i].total_count,10);
		  if (!isNaN(amount)){
			  iceNFTBallance += amount
		  }
    }
  }
  
  var gsup=0
  var bsup=0
  var rsup=0
  var osup=0
  var psup=0

  const getDappDetails = await radixDappToolkit.gatewayApi.state.getEntityDetailsVaultAggregated(dAppcomponent);
  const fieldsarray = getDappDetails.details.state.fields
  fieldsarray.forEach(element => {
    switch(element.field_name) {      
      case "green_supply" :
        gsup = parseFloat(element.value)
        break;
      case "blue_supply" :
        bsup = parseFloat(element.value)
        break;
      case "red_supply" :
        rsup = parseFloat(element.value)
        break;
      case "orange_supply" :
        osup = parseFloat(element.value)
        break;
      case "purple_supply" :
        psup = parseFloat(element.value)
        break;
      default:
        // code block
    }

  });

  const totalsupply = psup+osup+rsup+bsup+gsup
  
  document.getElementById('freeze_amount_input').max = Math.floor(iceBallance)
  document.getElementById('freeze_amount_input').value = 0
  performFreezeButtonElement.textContent = "Freeze "+ freeze_amount_input.value +" Water for Ice";

  document.getElementById('melt_amount_input').max = Math.floor(iceNFTBallance)
  document.getElementById('melt_amount_input').value = 0
  performMeltButtonElement.textContent = "Melt "+ melt_amount_input.value +" Ice for Water";

  performMeltbyNFTidsButtonElement.textContent = "Perform Melt by ID(s)"

  document.getElementById('walletAddress').innerText = clientAddress  
  document.getElementById('iceamount').innerText = iceBallance    
  document.getElementById('icenftamount').innerText = iceNFTBallance    

  document.getElementById('componentname').innerText = getDappDetails.details.blueprint_name    

  document.getElementById('componentgreen').innerText = gsup + " (" + Number(gsup/totalsupply).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + ")"; 
  document.getElementById('componentblue').innerText = bsup + " (" + Number(bsup/totalsupply).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + ")"; 
  document.getElementById('componentred').innerText = rsup + " (" + Number(rsup/totalsupply).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + ")"; 
  document.getElementById('componentorange').innerText = osup + " (" + Number(osup/totalsupply).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + ")"; 
  document.getElementById('componentpurple').innerText = psup + " (" + Number(psup/totalsupply).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) + ")"; 
  document.getElementById('componentallnft').innerText = totalsupply

 });

 performFreezeButtonElement.addEventListener("click", async () => {
		let manifest = `
CALL_METHOD Address("${clientAddress}") "withdraw" Address("${iceAddress}") Decimal("${freeze_amount_input.value}");
TAKE_ALL_FROM_WORKTOP Address("${iceAddress}") Bucket("bucket");
CALL_METHOD Address("${dAppcomponent}") "freeze" Bucket("bucket");
CALL_METHOD Address("${clientAddress}") "deposit_batch" Expression("ENTIRE_WORKTOP");
`
    console.log (manifest)
	
    if (clientAddress == "<undefined>"){
      performFreezeButtonElement.textContent = "Refresh wallet first"
      performMeltButtonElement.textContent = "Refresh wallet first"
    }else{
      if (freeze_amount_input.value==0) {
        alert('0 tokens selected, transaction aborted')
      }
      else{
        const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
          transactionManifest: manifest,
          version: 1,
        });

        if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
      }
//      console.log (TxDetails)
    }
  }
);

performMeltButtonElement.addEventListener("click", async () => {
  let manifest = `
CALL_METHOD Address("${clientAddress}") "withdraw" Address("${iceNFTAddress}") Decimal("${melt_amount_input.value}");
TAKE_ALL_FROM_WORKTOP Address("${iceNFTAddress}") Bucket("bucket");
CALL_METHOD Address("${dAppcomponent}") "melt" Bucket("bucket");
CALL_METHOD Address("${clientAddress}") "deposit_batch" Expression("ENTIRE_WORKTOP");
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    performFreezeButtonElement.textContent = "Refresh wallet first"
    performMeltButtonElement.textContent = "Refresh wallet first"
  }else{
    if (melt_amount_input.value==0) {
      alert('0 NFTs selected, transaction aborted')
    }
    else{
      const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
      });

      if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  //      console.log (TxDetails)
    }
  }
}
);

performMeltbyNFTidsButtonElement.addEventListener("click", async () => {

  if (clientAddress == "<undefined>"){
    performFreezeButtonElement.textContent = "Refresh wallet first"
    performMeltButtonElement.textContent = "Refresh wallet first"
    performMeltbyNFTidsButtonElement.textContent = "Refresh wallet first"
  }else{
    const idlist = melt_bynftids_input.value
    const words = idlist.split(' ');
//    if (words == [] || iceNFTBallance==0) {
    if (words == []) {
        alert('No IDs selctedt or your NFT balance is zero')
    }else{
        var manifestarray = ''
        words.forEach(element => {
          let entry = `NonFungibleLocalId("#${element}#")`
          if (manifestarray ==''){
            manifestarray=manifestarray+entry
          }else{
            manifestarray=manifestarray+', '+ entry
          }
        });
        
        if (clientAddress == "<undefined>"){
          performMeltbyNFTidsButtonElement.textContent = "Refresh wallet first"
        }else{
          let manifest = `
          CALL_METHOD Address("${clientAddress}") "withdraw_non_fungibles" Address("${iceNFTAddress}") 
          Array<NonFungibleLocalId>(${manifestarray});
          TAKE_NON_FUNGIBLES_FROM_WORKTOP Address("${iceNFTAddress}") 
          Array<NonFungibleLocalId>(${manifestarray}) Bucket("bucket");
          CALL_METHOD Address("${dAppcomponent}") "melt" Bucket("bucket");
          CALL_METHOD Address("${clientAddress}") "deposit_batch" Expression("ENTIRE_WORKTOP");
          `
          console.log (manifest)

          const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
            transactionManifest: manifest,
            version: 1,
          });
    
          if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
      //      console.log (TxDetails)
        }
      }
  }
});


