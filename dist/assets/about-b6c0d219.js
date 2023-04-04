import{d as z,h as r,c as h,a as y,b as m,e as R,u as k,r as q,f as E,g as G,i as S,j as K,p as Y,k as F,l as A,m as X,n as B,o as Z,t as J,w as Q,v as ee,N as te,q as ne,s as le,x as ae,y as oe,z as j,A as re,C as se,B as ie,D as H,_ as de,E as ce,F as pe,G as f,H as x,I as C}from"./index-7bb52833.js";import{f as ue}from"./fade-in-height-expand.cssr-c3885ef0.js";const me=z({name:"ChevronLeft",render(){return r("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r("path",{d:"M10.3536 3.14645C10.5488 3.34171 10.5488 3.65829 10.3536 3.85355L6.20711 8L10.3536 12.1464C10.5488 12.3417 10.5488 12.6583 10.3536 12.8536C10.1583 13.0488 9.84171 13.0488 9.64645 12.8536L5.14645 8.35355C4.95118 8.15829 4.95118 7.84171 5.14645 7.64645L9.64645 3.14645C9.84171 2.95118 10.1583 2.95118 10.3536 3.14645Z",fill:"currentColor"}))}}),fe=h("collapse","width: 100%;",[h("collapse-item",`
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 margin: var(--n-item-margin);
 `,[y("disabled",[m("header","cursor: not-allowed;",[m("header-main",`
 color: var(--n-title-text-color-disabled);
 `),h("collapse-item-arrow",`
 color: var(--n-arrow-color-disabled);
 `)])]),h("collapse-item","margin-left: 32px;"),R("&:first-child","margin-top: 0;"),R("&:first-child >",[m("header","padding-top: 0;")]),y("left-arrow-placement",[m("header",[h("collapse-item-arrow","margin-right: 4px;")])]),y("right-arrow-placement",[m("header",[h("collapse-item-arrow","margin-left: 4px;")])]),m("content-wrapper",[m("content-inner","padding-top: 16px;"),ue({duration:"0.15s"})]),y("active",[m("header",[y("active",[h("collapse-item-arrow","transform: rotate(90deg);")])])]),R("&:not(:first-child)","border-top: 1px solid var(--n-divider-color);"),m("header",`
 font-size: var(--n-title-font-size);
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition: color .3s var(--n-bezier);
 position: relative;
 padding: 16px 0 0 0;
 color: var(--n-title-text-color);
 cursor: pointer;
 `,[m("header-main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 color: var(--n-title-text-color);
 `),m("header-extra",`
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),h("collapse-item-arrow",`
 display: flex;
 transition:
 transform .15s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: 18px;
 color: var(--n-arrow-color);
 `)])])]),he=Object.assign(Object.assign({},S.props),{defaultExpandedNames:{type:[Array,String],default:null},expandedNames:[Array,String],arrowPlacement:{type:String,default:"left"},accordion:{type:Boolean,default:!1},displayDirective:{type:String,default:"if"},onItemHeaderClick:[Function,Array],"onUpdate:expandedNames":[Function,Array],onUpdateExpandedNames:[Function,Array],onExpandedNamesChange:{type:[Function,Array],validator:()=>!0,default:void 0}}),O=X("n-collapse"),ge=z({name:"Collapse",props:he,setup(e,{slots:a}){const{mergedClsPrefixRef:n,inlineThemeDisabled:l,mergedRtlRef:o}=k(e),t=q(e.defaultExpandedNames),c=E(()=>e.expandedNames),p=G(c,t),_=S("Collapse","-collapse",fe,K,e,n);function u(g){const{"onUpdate:expandedNames":i,onUpdateExpandedNames:v,onExpandedNamesChange:P}=e;v&&B(v,g),i&&B(i,g),P&&B(P,g),t.value=g}function d(g){const{onItemHeaderClick:i}=e;i&&B(i,g)}function s(g,i,v){const{accordion:P}=e,{value:I}=p;if(P)g?(u([i]),d({name:i,expanded:!0,event:v})):(u([]),d({name:i,expanded:!1,event:v}));else if(!Array.isArray(I))u([i]),d({name:i,expanded:!0,event:v});else{const w=I.slice(),T=w.findIndex(D=>i===D);~T?(w.splice(T,1),u(w),d({name:i,expanded:!1,event:v})):(w.push(i),u(w),d({name:i,expanded:!0,event:v}))}}Y(O,{props:e,mergedClsPrefixRef:n,expandedNamesRef:p,slots:a,toggleItem:s});const b=F("Collapse",o,n),$=E(()=>{const{common:{cubicBezierEaseInOut:g},self:{titleFontWeight:i,dividerColor:v,titleTextColor:P,titleTextColorDisabled:I,textColor:w,arrowColor:T,fontSize:D,titleFontSize:U,arrowColorDisabled:M,itemMargin:W}}=_.value;return{"--n-font-size":D,"--n-bezier":g,"--n-text-color":w,"--n-divider-color":v,"--n-title-font-size":U,"--n-title-text-color":P,"--n-title-text-color-disabled":I,"--n-title-font-weight":i,"--n-arrow-color":T,"--n-arrow-color-disabled":M,"--n-item-margin":W}}),N=l?A("collapse",void 0,$,e):void 0;return{rtlEnabled:b,mergedTheme:_,mergedClsPrefix:n,cssVars:l?void 0:$,themeClass:N==null?void 0:N.themeClass,onRender:N==null?void 0:N.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),r("div",{class:[`${this.mergedClsPrefix}-collapse`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse--rtl`,this.themeClass],style:this.cssVars},this.$slots)}}),ve=z({name:"CollapseItemContent",props:{displayDirective:{type:String,required:!0},show:Boolean,clsPrefix:{type:String,required:!0}},setup(e){return{onceTrue:Z(J(e,"show"))}},render(){return r(te,null,{default:()=>{const{show:e,displayDirective:a,onceTrue:n,clsPrefix:l}=this,o=a==="show"&&n,t=r("div",{class:`${l}-collapse-item__content-wrapper`},r("div",{class:`${l}-collapse-item__content-inner`},this.$slots));return o?Q(t,[[ee,e]]):e?t:null}})}}),xe={title:String,name:[String,Number],disabled:Boolean,displayDirective:String},_e=z({name:"CollapseItem",props:xe,setup(e){const{mergedRtlRef:a}=k(e),n=ne(),l=le(()=>{var s;return(s=e.name)!==null&&s!==void 0?s:n}),o=ae(O);o||oe("collapse-item","`n-collapse-item` must be placed inside `n-collapse`.");const{expandedNamesRef:t,props:c,mergedClsPrefixRef:p,slots:_}=o,u=E(()=>{const{value:s}=t;if(Array.isArray(s)){const{value:b}=l;return!~s.findIndex($=>$===b)}else if(s){const{value:b}=l;return b!==s}return!0});return{rtlEnabled:F("Collapse",a,p),collapseSlots:_,randomName:n,mergedClsPrefix:p,collapsed:u,mergedDisplayDirective:E(()=>{const{displayDirective:s}=e;return s||c.displayDirective}),arrowPlacement:E(()=>c.arrowPlacement),handleClick(s){o&&!e.disabled&&o.toggleItem(u.value,l.value,s)}}},render(){const{collapseSlots:e,$slots:a,arrowPlacement:n,collapsed:l,mergedDisplayDirective:o,mergedClsPrefix:t,disabled:c}=this,p=j(a.header,{collapsed:l},()=>[this.title]),_=a["header-extra"]||e["header-extra"],u=a.arrow||e.arrow;return r("div",{class:[`${t}-collapse-item`,`${t}-collapse-item--${n}-arrow-placement`,c&&`${t}-collapse-item--disabled`,!l&&`${t}-collapse-item--active`]},r("div",{class:[`${t}-collapse-item__header`,!l&&`${t}-collapse-item__header--active`]},r("div",{class:`${t}-collapse-item__header-main`,onClick:this.handleClick},n==="right"&&p,r("div",{class:`${t}-collapse-item-arrow`,key:this.rtlEnabled?0:1},j(u,{collapsed:l},()=>{var d;return[r(re,{clsPrefix:t},{default:(d=e.expandIcon)!==null&&d!==void 0?d:()=>this.rtlEnabled?r(me,null):r(se,null)})]})),n==="left"&&p),ie(_,{collapsed:l},d=>r("div",{class:`${t}-collapse-item__header-extra`,onClick:this.handleClick},d))),r(ve,{clsPrefix:t,displayDirective:o,show:!l},a))}}),Ce=h("a",`
 cursor: pointer;
 transition:
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 text-decoration-color: var(--n-text-color);
 color: var(--n-text-color);
`),be=Object.assign({},S.props),we=z({name:"A",props:be,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:n}=k(e),l=S("Typography","-a",Ce,H,e,a),o=E(()=>{const{common:{cubicBezierEaseInOut:c},self:{aTextColor:p}}=l.value;return{"--n-text-color":p,"--n-bezier":c}}),t=n?A("a",void 0,o,e):void 0;return{mergedClsPrefix:a,cssVars:n?void 0:o,themeClass:t==null?void 0:t.themeClass,onRender:t==null?void 0:t.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),r("a",{class:[`${this.mergedClsPrefix}-a`,this.themeClass],style:this.cssVars},this.$slots)}}),L=R("li",{transition:"color .3s var(--n-bezier)",lineHeight:"var(--n-line-height)",margin:"var(--n-li-margin)",marginBottom:0,color:"var(--n-text-color)"}),V=[R("&:first-child",`
 margin-top: 0;
 `),R("&:last-child",`
 margin-bottom: 0;
 `)],ye=R([h("ol",{fontSize:"var(--n-font-size)",padding:"var(--n-ol-padding)"},[y("align-text",{paddingLeft:0}),L,V]),h("ul",{fontSize:"var(--n-font-size)",padding:"var(--n-ul-padding)"},[y("align-text",{paddingLeft:0}),L,V])]),Re=Object.assign(Object.assign({},S.props),{alignText:Boolean}),Ee=z({name:"Ul",props:Re,setup(e){const{mergedClsPrefixRef:a,inlineThemeDisabled:n}=k(e),l=S("Typography","-xl",ye,H,e,a),o=E(()=>{const{common:{cubicBezierEaseInOut:c},self:{olPadding:p,ulPadding:_,liMargin:u,liTextColor:d,liLineHeight:s,liFontSize:b}}=l.value;return{"--n-bezier":c,"--n-font-size":b,"--n-line-height":s,"--n-text-color":d,"--n-li-margin":u,"--n-ol-padding":p,"--n-ul-padding":_}}),t=n?A("ul",void 0,o,e):void 0;return{mergedClsPrefix:a,cssVars:n?void 0:o,themeClass:t==null?void 0:t.themeClass,onRender:t==null?void 0:t.onRender}},render(){var e;const{mergedClsPrefix:a}=this;return(e=this.onRender)===null||e===void 0||e.call(this),r("ul",{class:[`${a}-ul`,this.themeClass,this.alignText&&`${a}-ul--align-text`],style:this.cssVars},this.$slots)}}),ze=z({name:"Li",render(){return r("li",null,this.$slots)}}),Ne={};function Pe(e,a){const n=_e,l=we,o=ze,t=Ee,c=ge;return ce(),pe(c,null,{default:f(()=>[x(n,{title:"最后编译时间"},{default:f(()=>[C(" unknown ")]),_:1}),x(n,{title:"项目地址"},{default:f(()=>[x(l,{href:"//github.com/XYY-huijiwiki",target:"_blank"},{default:f(()=>[C("Github")]),_:1})]),_:1}),x(n,{title:"使用说明"},{default:f(()=>[x(t,null,{default:f(()=>[x(o,null,{default:f(()=>[C("单个文件的大小不能超过10MB。")]),_:1}),x(o,null,{default:f(()=>[C("最好填写文件来源。文件来源不尽相同的时候需要一个一个上传、一个一个填写。")]),_:1}),x(o,null,{default:f(()=>[C("此处上传的文件无法通过wikitext直接使用，仅作为归档和备份。")]),_:1}),x(o,null,{default:f(()=>[C("如果要上传的文件格式是 png，jpg，jpeg，gif，svg，webm，ogg，ttf 中的一种，请"),x(l,{href:"https://xyy.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6",target:"_blank"},{default:f(()=>[C("点击这里")]),_:1}),C("上传。")]),_:1})]),_:1})]),_:1})]),_:1})}const Ie=de(Ne,[["render",Pe]]);export{Ie as default};
