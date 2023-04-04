import{c as f,W as y,e as a,a as d,b,d as k,u as M,ai as N,p as P,k as I,h as V,aj as z,r as h,E as A,a9 as D,H as s,G as i,I as $,aa as v,ab as w,ak as L,af as U,ag as q,al as H,am as K}from"./index-7bb52833.js";import{_ as J}from"./Input-0edfe7ee.js";import{_ as O}from"./InputGroup-ce740f40.js";const e="0!important",x="-1px!important";function m(t){return d(t+"-type",[a("& +",[f("button",{},[d(t+"-type",[b("border",{borderLeftWidth:e}),b("state-border",{left:x})])])])])}function g(t){return d(t+"-type",[a("& +",[f("button",[d(t+"-type",[b("border",{borderTopWidth:e}),b("state-border",{top:x})])])])])}const Q=f("button-group",`
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`,[y("vertical",{flexDirection:"row"},[y("rtl",[f("button",[a("&:first-child:not(:last-child)",`
 margin-right: ${e};
 border-top-right-radius: ${e};
 border-bottom-right-radius: ${e};
 `),a("&:last-child:not(:first-child)",`
 margin-left: ${e};
 border-top-left-radius: ${e};
 border-bottom-left-radius: ${e};
 `),a("&:not(:first-child):not(:last-child)",`
 margin-left: ${e};
 margin-right: ${e};
 border-radius: ${e};
 `),m("default"),d("ghost",[m("primary"),m("info"),m("success"),m("warning"),m("error")])])])]),d("vertical",{flexDirection:"column"},[f("button",[a("&:first-child:not(:last-child)",`
 margin-bottom: ${e};
 margin-left: ${e};
 margin-right: ${e};
 border-bottom-left-radius: ${e};
 border-bottom-right-radius: ${e};
 `),a("&:last-child:not(:first-child)",`
 margin-top: ${e};
 margin-left: ${e};
 margin-right: ${e};
 border-top-left-radius: ${e};
 border-top-right-radius: ${e};
 `),a("&:not(:first-child):not(:last-child)",`
 margin: ${e};
 border-radius: ${e};
 `),g("default"),d("ghost",[g("primary"),g("info"),g("success"),g("warning"),g("error")])])])]),X={size:{type:String,default:void 0},vertical:Boolean},Y=k({name:"ButtonGroup",props:X,setup(t){const{mergedClsPrefixRef:n,mergedRtlRef:_}=M(t);return N("-button-group",Q,n),P(z,t),{rtlEnabled:I("ButtonGroup",_,n),mergedClsPrefix:n}},render(){const{mergedClsPrefix:t}=this;return V("div",{class:[`${t}-button-group`,this.rtlEnabled&&`${t}-button-group--rtl`,this.vertical&&`${t}-button-group--vertical`],role:"group"},this.$slots)}}),Z=L("div",null,"移动至？（重命名为？）",-1),re=k({__name:"menu-btn",props:{input:{type:String,required:!0}},setup(t){const n=t;let _=location.host!=="xyy.huijiwiki.com",l=h(!1),u=h(n.input),B=h([{label:"移动（重命名）",key:"move"},{label:"删除",key:"delete?",children:[{label:"确认删除",key:"delete",props:{style:{color:"#e88080"}}}]}]);function E(r){r==="delete"?S():r==="move"?l.value=!0:console.log("无法处理菜单事件")}async function S(){$message.loading("正在删除……");for(let r=-1;;r++)try{await new mw.Api().postWithToken("csrf",{action:"delete",title:r===-1?n.input:n.input+"/"+r,tags:"Base64文件变更",deletetalk:!0})}catch(o){o!=="missingtitle"&&($message.success(`未知错误（${o}）`),console.log(o));break}$message.success("删除完成")}async function C(){if(n.input===u.value){_?console.log("文件名不能和原来的相同"):$message.error("文件名不能和原来的相同");return}let r=n.input.split(".").reverse()[0],o=u.value.split(".").reverse()[0];if(r!==o){_?console.log(`文件后缀名（${r}）不得发生改变`):$message.error(`文件后缀名（${r}）不得发生改变`);return}$message.loading("正在移动……");try{let c=await new mw.Api().postWithToken("csrf",{action:"move",from:n.input,to:u.value,tags:"Base64文件变更",movetalk:!0,movesubpages:!0,noredirect:!0});$message.success("文件移动成功"),$message.info("刷新页面后文件列表才会更新"),console.log(c)}catch(c){$message.error("文件移动失败，未知错误"),console.log(c)}l.value=!1}return(r,o)=>{const c=U,R=q,T=H,F=Y,G=J,W=O,j=K;return A(),D("div",null,[s(F,null,{default:i(()=>[s(c,{tertiary:"",tag:"a",href:`https://xyy.huijiwiki.com/wiki/${t.input}`,target:"_blank"},{default:i(()=>[$("查看")]),_:1},8,["href"]),s(T,{trigger:"click",options:v(B),onSelect:E},{default:i(()=>[s(c,{tertiary:""},{default:i(()=>[s(R,null,{default:i(()=>[$("more_vert")]),_:1})]),_:1})]),_:1},8,["options"])]),_:1}),s(j,{show:v(l),"onUpdate:show":o[2]||(o[2]=p=>w(l)?l.value=p:l=p),preset:"dialog",showIcon:!1,autoFocus:!1},{header:i(()=>[Z]),default:i(()=>[s(W,null,{default:i(()=>[s(G,{value:v(u),"onUpdate:value":o[0]||(o[0]=p=>w(u)?u.value=p:u=p)},null,8,["value"]),s(c,{onClick:o[1]||(o[1]=p=>C())},{default:i(()=>[$("确定")]),_:1})]),_:1})]),_:1},8,["show"])])}}});export{re as _};
