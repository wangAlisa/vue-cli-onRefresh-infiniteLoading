
let picurl = '';
   
let test = window.location.href;
if(test.indexOf("sysvoctest")>-1){
    picurl = "test";
}else if(test.indexOf("sysvocdev")>-1){
    picurl = "develop";
}else if(test.indexOf("sysvoc")>-1){
    picurl = "online";
}else{
    picurl = "develop";
}



export default picurl

