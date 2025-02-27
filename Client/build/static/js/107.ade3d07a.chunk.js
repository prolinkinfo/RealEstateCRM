"use strict";(self.webpackChunkreal_estate=self.webpackChunkreal_estate||[]).push([[107],{3848:(e,t,l)=>{l.d(t,{A:()=>d});var i=l(1206),s=l(4450),o=l(3458),n=l(1997),a=l(7149),r=l(579);function d(e){const{count:t,text:l,onFileSelect:d}=e,c=(0,i.dU)("secondaryGray.900","white"),u=(0,i.dU)("brand.500","white");return(0,r.jsxs)(s.Grid,{templateColumns:"repeat(12, 1fr)",gap:2,children:[(0,r.jsx)(s.GridItem,{colSpan:{base:12},children:(0,r.jsx)(n.A,{w:{base:"100%"},me:"36px",minH:200,img:"Property Photos"===l?"img":"",csv:"csv",height:"100%",onFileSelect:d,isMultipleAllow:!1,content:(0,r.jsxs)(s.Box,{children:[(0,r.jsx)(o.In,{as:a.vpy,w:"80px",h:"80px",color:u}),(0,r.jsx)(s.Flex,{justify:"center",mx:"auto",mb:"12px",children:(0,r.jsx)(s.Text,{fontSize:"xl",fontWeight:"700",color:u,children:"Upload File"})}),t>0&&(0,r.jsxs)(s.Text,{fontSize:"sm",fontWeight:"500",color:"secondaryGray.500",children:["Selected Files : ",t]})]})})}),(0,r.jsx)(s.GridItem,{colSpan:{base:12},children:(0,r.jsxs)(s.Flex,{direction:"column",children:[(0,r.jsxs)(s.Text,{color:c,fontWeight:"bold",textAlign:"start",fontSize:"2xl",mt:{base:"20px"},children:["Upload ",l]}),(0,r.jsx)(s.Text,{color:"gray.400",fontSize:"md",my:{base:"auto"},mx:"auto",textAlign:"start",children:"Accepted File Type (csv, xlsx file - 15MB max) only 1 file"})]})})]})}},8700:(e,t,l)=>{l.d(t,{A:()=>h});var i=l(9379),s=l(4034),o=l(9942),n=l(2554),a=l(9488),r=l(3516),d=l(5043),c=l(6305),u=l(2030),p=l(8908),v=l(899),x=l(579);const h=e=>{var t,l;const[h,m]=(0,d.useState)(!1),j=Object.fromEntries(((null===e||void 0===e||null===(t=e.propertyData)||void 0===t?void 0:t.fields)||[]).map((e=>[null===e||void 0===e?void 0:e.name,""]))),y=(0,i.A)((0,i.A)({},j),{},{createBy:JSON.parse(localStorage.getItem("user"))._id}),f=(0,r.Wx)({initialValues:y,enableReinitialize:!0,validationSchema:v.Ik().shape((0,u.g)(null===e||void 0===e||null===(l=e.propertyData)||void 0===l?void 0:l.fields)),onSubmit:(e,t)=>{let{resetForm:l}=t;F()}}),{errors:S,touched:C,values:g,handleBlur:b,handleChange:A,handleSubmit:I,setFieldValue:z}=f,F=async()=>{try{var t;m(!0),200===(await(0,c.d_)("api/form/add",(0,i.A)((0,i.A)({},g),{},{moduleId:null===e||void 0===e||null===(t=e.propertyData)||void 0===t?void 0:t._id}))).status&&(e.onClose(),f.resetForm(),e.setAction((e=>!e)))}catch(l){console.log(l)}finally{m(!1)}};return(0,x.jsx)("div",{children:(0,x.jsxs)(o._s,{isOpen:e.isOpen,size:e.size,children:[(0,x.jsx)(o.QP,{}),(0,x.jsxs)(o.zj,{children:[(0,x.jsxs)(o.BE,{alignItems:"center",justifyContent:"space-between",display:"flex",children:["Add Property",(0,x.jsx)(n.IconButton,{onClick:e.onClose,icon:(0,x.jsx)(s.CloseIcon,{})})]}),(0,x.jsx)(o.ys,{children:(0,x.jsx)(p.A,{moduleData:e.propertyData,values:g,setFieldValue:z,handleChange:A,handleBlur:b,errors:S,touched:C})}),(0,x.jsxs)(o.tb,{children:[(0,x.jsx)(n.Button,{size:"sm",sx:{textTransform:"capitalize"},disabled:!!h,variant:"brand",type:"submit",onClick:I,children:h?(0,x.jsx)(a.A,{}):"Save"}),(0,x.jsx)(n.Button,{size:"sm",variant:"outline",colorScheme:"red",sx:{marginLeft:2,textTransform:"capitalize"},onClick:e.onClose,children:"Close"})]})]})]})})}},2943:(e,t,l)=>{l.d(t,{A:()=>j});var i=l(9379),s=l(4034),o=l(9942),n=l(2554),a=l(4450),r=l(9488),d=l(3516),c=l(5043),u=l(3216),p=l(6305),v=l(2030),x=l(8908),h=l(899),m=l(579);const j=e=>{var t,l;const j=Object.fromEntries(((null===e||void 0===e||null===(t=e.leadData)||void 0===t?void 0:t.fields)||[]).map((e=>[null===e||void 0===e?void 0:e.name,""]))),[y,f]=(0,c.useState)((0,i.A)((0,i.A)({},j),{},{createBy:JSON.parse(localStorage.getItem("user"))._id})),S=(0,u.g)(),C=(0,d.Wx)({initialValues:y,validationSchema:h.Ik().shape((0,v.g)(null===e||void 0===e||null===(l=e.propertyData)||void 0===l?void 0:l.fields)),enableReinitialize:!0,onSubmit:(e,t)=>{let{resetForm:l}=t;B()}}),{errors:g,touched:b,values:A,handleBlur:I,handleChange:z,handleSubmit:F,setFieldValue:O}=C,[w,D]=(0,c.useState)(!1),B=async()=>{try{D(!0),200===(await(0,p.yP)("api/property/edit/".concat((null===e||void 0===e?void 0:e.selectedId)||S.id),A)).status&&(e.onClose(),e.setAction((e=>!e)))}catch(t){console.log(t)}finally{D(!1)}};let k;return(0,c.useEffect)((()=>{(async()=>{if(null!==e&&void 0!==e&&e.selectedId||S.id)try{D(!0),k=await(0,p.x4)("api/property/view/",null!==e&&void 0!==e&&e.selectedId?null===e||void 0===e?void 0:e.selectedId:S.id),f((e=>{var t,l;return(0,i.A)((0,i.A)({},e),null===(t=k)||void 0===t||null===(l=t.data)||void 0===l?void 0:l.property)}))}catch(t){console.error(t)}finally{D(!1)}})()}),[null===e||void 0===e?void 0:e.selectedId]),(0,m.jsx)("div",{children:(0,m.jsxs)(o._s,{isOpen:e.isOpen,size:e.size,children:[(0,m.jsx)(o.QP,{}),(0,m.jsxs)(o.zj,{children:[(0,m.jsxs)(o.BE,{alignItems:"center",justifyContent:"space-between",display:"flex",children:["Edit Property",(0,m.jsx)(n.IconButton,{onClick:()=>{e.onClose(!1),e.setSelectedId&&(null===e||void 0===e||e.setSelectedId())},icon:(0,m.jsx)(s.CloseIcon,{})})]}),(0,m.jsx)(o.ys,{children:w?(0,m.jsx)(a.Flex,{justifyContent:"center",alignItems:"center",width:"100%",children:(0,m.jsx)(r.A,{})}):(0,m.jsx)(x.A,{moduleData:e.propertyData,values:A,setFieldValue:O,handleChange:z,handleBlur:I,errors:g,touched:b})}),(0,m.jsxs)(o.tb,{children:[(0,m.jsx)(n.Button,{size:"sm",sx:{textTransform:"capitalize"},variant:"brand",disabled:!!w,type:"submit",onClick:F,children:w?(0,m.jsx)(r.A,{}):"Update"}),(0,m.jsx)(n.Button,{size:"sm",variant:"outline",colorScheme:"red",sx:{marginLeft:2,textTransform:"capitalize"},onClick:()=>{e.onClose(!1)},children:"Close"})]})]})]})})}},2107:(e,t,l)=>{l.r(t),l.d(t,{default:()=>b});var i=l(5043),s=l(3216),o=l(5574),n=l(9754),a=l(4450),r=l(5376),d=l(4034),c=l(7368),u=l(6305),p=l(55),v=l(8700),x=l(2943),h=l(9942),m=l(2554),j=l(9488),y=l(3516),f=l(3848),S=l(579);const C=e=>{const{onClose:t,isOpen:l,fetchData:o,text:n,customFields:r}=e,[d,c]=(0,i.useState)(!1),u=(0,s.Zp)(),p=(0,y.Wx)({initialValues:{property:""},onSubmit:(e,t)=>{let{resetForm:l}=t;F(),l()}}),{errors:v,touched:x,values:C,handleBlur:g,handleChange:b,handleSubmit:A,setFieldValue:I,resetForm:z}=p,F=async()=>{try{c(!0),z(),C.property&&(t(),u("/propertyImport",{state:{fileData:C.property,customFields:r}}))}catch(e){console.log(e)}finally{c(!1)}};return(0,S.jsxs)(h.aF,{onClose:t,isOpen:l,isCentered:!0,children:[(0,S.jsx)(h.mH,{}),(0,S.jsxs)(h.$m,{children:[(0,S.jsx)(h.rQ,{children:"Import Properties"}),(0,S.jsx)(h.s_,{}),(0,S.jsx)(h.cw,{children:(0,S.jsx)(a.Grid,{templateColumns:"repeat(12, 1fr)",gap:3,children:(0,S.jsxs)(a.GridItem,{colSpan:{base:12},children:[(0,S.jsx)(f.A,{count:C.property.length,onFileSelect:e=>I("property",e),text:n}),(0,S.jsxs)(a.Text,{mb:"10px",color:"red",children:[" ",v.property&&x.property&&(0,S.jsxs)(S.Fragment,{children:["Please Select ",n]})]})]})})}),(0,S.jsxs)(h.jl,{children:[(0,S.jsx)(m.Button,{size:"sm",variant:"brand",onClick:A,disabled:!!d,children:d?(0,S.jsx)(j.A,{}):"Save"}),(0,S.jsx)(m.Button,{sx:{marginLeft:2,textTransform:"capitalize"},variant:"outline",colorScheme:"red",size:"sm",onClick:()=>{t(),p.resetForm()},children:"Close"})]})]})]})};var g=l(8177);const b=()=>{var e,t,l;const h=JSON.parse(localStorage.getItem("user")),m=(0,s.Zp)(),[j]=(0,o.h)(["Properties"]),[y,f]=(0,i.useState)(!1),[b,A]=(0,i.useState)([]),[I,z]=(0,i.useState)([]),[F,O]=(0,i.useState)([]),[w,D]=(0,i.useState)([]),[B,k]=(0,i.useState)([]),[_,P]=(0,i.useState)(!1),{isOpen:T,onOpen:V,onClose:E}=(0,n.j1)(),[N,G]=(0,i.useState)([]),[J,W]=(0,i.useState)(!1),[H,U]=(0,i.useState)(!1),[L,M]=(0,i.useState)(),[Q,R]=(0,i.useState)([]),[Z,$]=(0,i.useState)(!1);return(0,i.useEffect)((()=>{(async()=>{f(!0);let e=await(0,u.x4)("superAdmin"===h.role?"api/property/":"api/property/?createBy=".concat(h._id));A(null===e||void 0===e?void 0:e.data),f(!1)})(),(async()=>{var e,t,l,i;f(!0);const s=await(0,u.x4)("api/custom-field/?moduleName=Properties");G(null===s||void 0===s?void 0:s.data);const o={Header:"Action",accessor:"action",isSortable:!1,center:!0,cell:e=>{let{row:t}=e;return(0,S.jsx)(a.Text,{fontSize:"md",fontWeight:"900",textAlign:"center",children:(0,S.jsxs)(r.W1,{isLazy:!0,children:[(0,S.jsx)(r.IU,{children:(0,S.jsx)(c.txp,{})}),(0,S.jsxs)(r.cO,{minW:"fit-content",transform:"translate(1520px, 173px);",children:[(null===j||void 0===j?void 0:j.update)&&(0,S.jsx)(r.Dr,{py:2.5,icon:(0,S.jsx)(d.EditIcon,{fontSize:15,mb:1}),onClick:()=>{var e;W(!0),M(null===t||void 0===t||null===(e=t.values)||void 0===e?void 0:e._id)},children:"Edit"}),(null===j||void 0===j?void 0:j.view)&&(0,S.jsx)(r.Dr,{py:2.5,color:"green",icon:(0,S.jsx)(d.ViewIcon,{mb:1,fontSize:15}),onClick:()=>{var e;m("/propertyView/".concat(null===t||void 0===t||null===(e=t.values)||void 0===e?void 0:e._id))},children:"View"}),(null===j||void 0===j?void 0:j.delete)&&(0,S.jsx)(r.Dr,{py:2.5,color:"red",icon:(0,S.jsx)(d.DeleteIcon,{fontSize:15,mb:1}),onClick:()=>{var e,l;U(!0),R([null===t||void 0===t||null===(e=t.values)||void 0===e?void 0:e._id]),M(null===t||void 0===t||null===(l=t.values)||void 0===l?void 0:l._id)},children:"Delete"})]})]})})}},n=[{Header:"#",accessor:"_id",isSortable:!1,width:10},...null===s||void 0===s||null===(e=s.data)||void 0===e||null===(t=e[0])||void 0===t||null===(l=t.fields)||void 0===l||null===(i=l.filter((e=>!0===(null===e||void 0===e?void 0:e.isTableField))))||void 0===i?void 0:i.map((e=>({Header:null===e||void 0===e?void 0:e.label,accessor:null===e||void 0===e?void 0:e.name}))),...null!==j&&void 0!==j&&j.update||null!==j&&void 0!==j&&j.view||null!==j&&void 0!==j&&j.delete?[o]:[]];k(JSON.parse(JSON.stringify(n))),O(JSON.parse(JSON.stringify(n))),O(n),z(JSON.parse(JSON.stringify(n))),f(!1)})()}),[_]),(0,i.useEffect)((()=>{D(null===I||void 0===I?void 0:I.filter((e=>null===B||void 0===B?void 0:B.find((t=>(null===t||void 0===t?void 0:t.Header)===e.Header)))))}),[I,B]),(0,S.jsxs)("div",{children:[(0,S.jsx)(a.Grid,{templateColumns:"repeat(6, 1fr)",mb:3,gap:4,children:!y&&(0,S.jsx)(a.GridItem,{colSpan:6,children:(0,S.jsx)(p.A,{title:"Properties",isLoding:y,columnData:F,dataColumn:w,allData:b,tableData:b,tableCustomFields:(null===N||void 0===N||null===(e=N[0])||void 0===e||null===(t=e.fields)||void 0===t?void 0:t.filter((e=>!0===(null===e||void 0===e?void 0:e.isTableField))))||[],access:j,action:_,setAction:P,selectedColumns:B,setSelectedColumns:k,isOpen:T,onClose:onclose,onOpen:V,selectedValues:Q,setSelectedValues:R,setDelete:U,setIsImport:$})})}),T&&(0,S.jsx)(v.A,{propertyData:N[0],isOpen:T,size:"lg",onClose:E,setAction:P}),J&&(0,S.jsx)(x.A,{isOpen:J,size:"lg",propertyData:N[0],selectedId:L,setSelectedId:M,onClose:W,setAction:P}),H&&(0,S.jsx)(g.A,{isOpen:H,onClose:()=>U(!1),type:"Properties",handleDeleteData:async e=>{try{f(!0),200===(await(0,u.Vn)("api/property/deleteMany",e)).status&&(R([]),U(!1),P((e=>!e)))}catch(t){console.log(t)}finally{f(!1)}},ids:Q}),Z&&(0,S.jsx)(C,{text:"Property file",isOpen:Z,onClose:$,customFields:(null===N||void 0===N||null===(l=N[0])||void 0===l?void 0:l.fields)||[]})]})}}}]);
//# sourceMappingURL=107.ade3d07a.chunk.js.map