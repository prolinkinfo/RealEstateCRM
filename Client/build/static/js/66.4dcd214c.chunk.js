"use strict";(self.webpackChunkreal_estate=self.webpackChunkreal_estate||[]).push([[66],{9201:(e,l,s)=>{s.d(l,{A:()=>f});var n=s(4034),o=s(9942),r=s(2554),t=s(4450),i=s(8510),a=s(7682),d=s(3458),c=s(9488),m=s(3516),u=s(5043),x=s(7149),h=s(2285),p=s(2145),j=s(9849),v=s(6305),g=s(579);const f=e=>{const{onClose:l,isOpen:s,setAction:f}=e,[b,S]=(0,u.useState)(!1),[N,y]=u.useState(!1),I=(0,m.Wx)({initialValues:{firstName:"",lastName:"",username:"",phoneNumber:"",password:""},validationSchema:j.vJ,onSubmit:e=>{B()}}),{errors:C,touched:A,values:z,handleBlur:T,handleChange:w,handleSubmit:k,setFieldValue:W,resetForm:F}=I,B=async()=>{try{S(!0);let s=await(0,v.d_)("api/user/register",z);var l;if(s&&200===s.status)e.onClose(),F(),f((e=>!e));else p.oR.error(null===(l=s.response.data)||void 0===l?void 0:l.message)}catch(s){console.log(s)}finally{S(!1)}};return(0,g.jsxs)(o.aF,{isOpen:s,isCentered:!0,children:[(0,g.jsx)(o.mH,{}),(0,g.jsxs)(o.$m,{children:[(0,g.jsxs)(o.rQ,{justifyContent:"space-between",display:"flex",children:["Add User",(0,g.jsx)(r.IconButton,{onClick:l,icon:(0,g.jsx)(n.CloseIcon,{})})]}),(0,g.jsx)(o.cw,{children:(0,g.jsxs)(t.Grid,{templateColumns:"repeat(12, 1fr)",gap:3,children:[(0,g.jsxs)(t.GridItem,{colSpan:{base:12},children:[(0,g.jsxs)(i.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["First Name",(0,g.jsx)(t.Text,{color:"red",children:"*"})]}),(0,g.jsx)(a.Input,{fontSize:"sm",onChange:w,onBlur:T,value:z.firstName,name:"firstName",placeholder:"firstName",fontWeight:"500",borderColor:C.firstName&&A.firstName?"red.300":null}),(0,g.jsxs)(t.Text,{mb:"10px",color:"red",children:[" ",C.firstName&&A.firstName&&C.firstName]})]}),(0,g.jsxs)(t.GridItem,{colSpan:{base:12},children:[(0,g.jsx)(i.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:"Last Name"}),(0,g.jsx)(a.Input,{fontSize:"sm",onChange:w,onBlur:T,value:z.lastName,name:"lastName",placeholder:"Last Name",fontWeight:"500",borderColor:C.lastName&&A.lastName?"red.300":null}),(0,g.jsxs)(t.Text,{mb:"10px",color:"red",children:[" ",C.lastName&&A.lastName&&C.lastName]})]}),(0,g.jsxs)(t.GridItem,{colSpan:{base:12},children:[(0,g.jsxs)(i.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["Email",(0,g.jsx)(t.Text,{color:"red",children:"*"})]}),(0,g.jsx)(a.Input,{fontSize:"sm",type:"email",onChange:w,onBlur:T,value:z.username,name:"username",placeholder:"Email Address",fontWeight:"500",borderColor:C.username&&A.username?"red.300":null}),(0,g.jsxs)(t.Text,{mb:"10px",color:"red",children:[" ",C.username&&A.username&&C.username]})]}),(0,g.jsxs)(t.GridItem,{colSpan:{base:12},children:[(0,g.jsxs)(i.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["Phone Number",(0,g.jsx)(t.Text,{color:"red",children:"*"})]}),(0,g.jsxs)(a.InputGroup,{children:[(0,g.jsx)(a.InputLeftElement,{pointerEvents:"none",children:(0,g.jsx)(n.PhoneIcon,{color:"gray.300",borderRadius:"16px"})}),(0,g.jsx)(a.Input,{type:"tel",fontSize:"sm",onChange:w,onBlur:T,value:z.phoneNumber,name:"phoneNumber",fontWeight:"500",borderColor:C.phoneNumber&&A.phoneNumber?"red.300":null,placeholder:"Phone number",borderRadius:"16px"})]}),(0,g.jsx)(t.Text,{mb:"10px",color:"red",children:C.phoneNumber&&A.phoneNumber&&C.phoneNumber})]}),(0,g.jsxs)(t.GridItem,{colSpan:{base:12},children:[(0,g.jsx)(i.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:"Password"}),(0,g.jsxs)(a.InputGroup,{size:"md",children:[(0,g.jsx)(a.Input,{isRequired:!0,fontSize:"sm",placeholder:"Enter Your Password",name:"password",size:"lg",variant:"auth",type:N?"text":"password",value:z.password,onChange:w,onBlur:T,borderColor:C.password&&A.password?"red.300":null,className:C.password&&A.password?"isInvalid":null}),(0,g.jsx)(a.InputRightElement,{display:"flex",alignItems:"center",mt:"4px",children:(0,g.jsx)(d.In,{color:"gray.400",_hover:{cursor:"pointer"},as:N?h.B6J:x.kIi,onClick:()=>y(!N)})})]}),(0,g.jsxs)(t.Text,{mb:"10px",color:"red",children:[" ",C.password&&A.password&&C.password]})]})]})}),(0,g.jsxs)(o.jl,{children:[(0,g.jsx)(r.Button,{variant:"brand",size:"sm",disabled:!!b,onClick:k,children:b?(0,g.jsx)(c.A,{}):"Save"}),(0,g.jsx)(r.Button,{sx:{marginLeft:2,textTransform:"capitalize"},variant:"outline",colorScheme:"red",size:"sm",onClick:()=>{I.resetForm(),l()},children:"Close"})]})]})]})}},2876:(e,l,s)=>{s.d(l,{A:()=>b});var n=s(9379),o=s(4034),r=s(9942),t=s(2554),i=s(4450),a=s(8510),d=s(7682),c=s(9488),m=s(3516),u=s(5043),x=s(2145),h=s(6739),p=s(9849),j=s(6305),v=s(7508),g=s(7610),f=s(579);const b=e=>{const{isOpen:l,fetchData:s,data:b,userData:S,setEdit:N}=e,y={firstName:b?null===b||void 0===b?void 0:b.firstName:"",lastName:b?null===b||void 0===b?void 0:b.lastName:"",username:b?null===b||void 0===b?void 0:b.username:"",phoneNumber:b?null===b||void 0===b?void 0:b.phoneNumber:""},I=JSON.parse(window.localStorage.getItem("user")),C=(0,m.Wx)({initialValues:y,validationSchema:p.vJ,enableReinitialize:!0,onSubmit:(e,l)=>{let{resetForm:s}=l;P(),s()}}),A=(0,v.wA)(),z=()=>{N(!1),G()},{errors:T,touched:w,values:k,handleBlur:W,handleChange:F,handleSubmit:B,resetForm:G}=C,[E,D]=(0,u.useState)(!1),P=async()=>{try{D(!0);let o=await(0,j.yP)("api/user/edit/".concat(e.selectedId),k);if(o&&200===o.status){N(!1);let l=S;if((null===I||void 0===I?void 0:I._id)===e.selectedId){l&&"object"===typeof l&&(l=(0,n.A)((0,n.A)({},l),{},{firstName:null===k||void 0===k?void 0:k.firstName,lastName:null===k||void 0===k?void 0:k.lastName}));const e=JSON.stringify(l);localStorage.setItem("user",e),A((0,g.gV)(e))}A((0,h.k)(null===I||void 0===I?void 0:I._id)),z(),s(),e.setAction((e=>!e))}else{var l;x.oR.error(null===(l=o.response.data)||void 0===l?void 0:l.message)}}catch(o){console.log(o)}finally{D(!1)}};return(0,f.jsxs)(r.aF,{isOpen:l,isCentered:!0,children:[(0,f.jsx)(r.mH,{}),(0,f.jsxs)(r.$m,{children:[(0,f.jsxs)(r.rQ,{justifyContent:"space-between",display:"flex",children:["Edit User",(0,f.jsx)(t.IconButton,{onClick:()=>N(!1),icon:(0,f.jsx)(o.CloseIcon,{})})]}),(0,f.jsx)(r.cw,{children:(0,f.jsxs)(i.Grid,{templateColumns:"repeat(12, 1fr)",gap:3,children:[(0,f.jsxs)(i.GridItem,{colSpan:{base:12},children:[(0,f.jsxs)(a.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["First Name",(0,f.jsx)(i.Text,{color:"red",children:"*"})]}),(0,f.jsx)(d.Input,{fontSize:"sm",onChange:F,onBlur:W,value:k.firstName,name:"firstName",placeholder:"firstName",fontWeight:"500",borderColor:T.firstName&&w.firstName?"red.300":null}),(0,f.jsxs)(i.Text,{mb:"10px",color:"red",children:[" ",T.firstName&&w.firstName&&T.firstName]})]}),(0,f.jsxs)(i.GridItem,{colSpan:{base:12},children:[(0,f.jsx)(a.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:"Last Name"}),(0,f.jsx)(d.Input,{fontSize:"sm",onChange:F,onBlur:W,value:k.lastName,name:"lastName",placeholder:"Last Name",fontWeight:"500",borderColor:T.lastName&&w.lastName?"red.300":null}),(0,f.jsxs)(i.Text,{mb:"10px",color:"red",children:[" ",T.lastName&&w.lastName&&T.lastName]})]}),(0,f.jsxs)(i.GridItem,{colSpan:{base:12},children:[(0,f.jsxs)(a.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["Email",(0,f.jsx)(i.Text,{color:"red",children:"*"})]}),(0,f.jsx)(d.Input,{fontSize:"sm",type:"email",onChange:F,onBlur:W,value:k.username,name:"username",placeholder:"Email Address",fontWeight:"500",borderColor:T.username&&w.username?"red.300":null}),(0,f.jsxs)(i.Text,{mb:"10px",color:"red",children:[" ",T.username&&w.username&&T.username]})]}),(0,f.jsxs)(i.GridItem,{colSpan:{base:12},children:[(0,f.jsxs)(a.FormLabel,{display:"flex",ms:"4px",fontSize:"sm",fontWeight:"500",mb:"8px",children:["Phone Number",(0,f.jsx)(i.Text,{color:"red",children:"*"})]}),(0,f.jsxs)(d.InputGroup,{children:[(0,f.jsx)(d.InputLeftElement,{pointerEvents:"none",children:(0,f.jsx)(o.PhoneIcon,{color:"gray.300",borderRadius:"16px"})}),(0,f.jsx)(d.Input,{type:"tel",fontSize:"sm",onChange:F,onBlur:W,value:k.phoneNumber,name:"phoneNumber",fontWeight:"500",borderColor:T.phoneNumber&&w.phoneNumber?"red.300":null,placeholder:"Phone number",borderRadius:"16px"})]}),(0,f.jsx)(i.Text,{mb:"10px",color:"red",children:T.phoneNumber&&w.phoneNumber&&T.phoneNumber})]})]})}),(0,f.jsxs)(r.jl,{children:[(0,f.jsx)(t.Button,{size:"sm",variant:"brand",disabled:!!E,onClick:B,children:E?(0,f.jsx)(c.A,{}):"Update"}),(0,f.jsx)(t.Button,{variant:"outline",colorScheme:"red",size:"sm",sx:{marginLeft:2,textTransform:"capitalize"},onClick:()=>z(),children:"close"})]})]})]})}},66:(e,l,s)=>{s.r(l),s.d(l,{default:()=>B});var n=s(4034),o=s(9754),r=s(4450),t=s(5376),i=s(2554),a=s(216),d=s(3994),c=s(9488),m=s(5043),u=s(4960),x=s(3216),h=s(5475),p=s(6305),j=s(9201),v=s(2876),g=s(9379),f=s(1206),b=s(1778),S=s(1094),N=s(6914),y=s(2853),I=s(5369),C=s(579);function A(e){const{columnsData:l,tableData:s,title:n,fetchData:o,selectedValues:t,setSelectedValues:d,roleModal:c,setRoleModal:u}=e,x=(0,m.useMemo)((()=>l),[l]),h=(0,m.useMemo)((()=>s),[s]),p=JSON.parse(localStorage.getItem("user")),[j,v]=(0,m.useState)(),A=(0,f.dU)("gray.200","white"),z=(0,f.dU)("secondaryGray.900","white"),T=(0,f.dU)("gray.200","whiteAlpha.100"),w=(0,S.useTable)({columns:x,data:h,initialState:{pageIndex:0}},S.useGlobalFilter,S.useSortBy,S.usePagination),{getTableProps:k,getTableBodyProps:W,headerGroups:F,prepareRow:B,page:G,pageOptions:E,state:{pageIndex:D,pageSize:P}}=w;return E.length<j&&v(E.length),(0,C.jsxs)(a.A,{direction:"column",w:"100%",padding:"0",px:"0px",style:{border:"1px solid gray.200"},overflowX:{sm:"scroll",lg:"hidden"},children:[(0,C.jsxs)(r.Flex,{px:"25px",justify:"space-between",mb:"20px",align:"center",children:[(0,C.jsxs)(r.Text,{color:z,fontSize:"22px",fontWeight:"700",lineHeight:"100%",children:[n,"  (",(0,C.jsx)(N.A,{targetNumber:null===h||void 0===h?void 0:h.length},null===h||void 0===h?void 0:h.length),")"]}),"superAdmin"===(null===p||void 0===p?void 0:p.role)&&(0,C.jsx)(i.Button,{onClick:()=>u(!0),leftIcon:(0,C.jsx)(I.obu,{}),bg:A,size:"sm",colorScheme:"gray",children:"Change Role"})]}),(0,C.jsx)(r.Box,{overflowY:"auto",className:"table-container-property",children:(0,C.jsxs)(b.XI,(0,g.A)((0,g.A)({},k()),{},{variant:"simple",color:"gray.500",mb:"24px",children:[(0,C.jsx)(b.d8,{children:null===F||void 0===F?void 0:F.map(((e,l)=>(0,m.createElement)(b.Tr,(0,g.A)((0,g.A)({},e.getHeaderGroupProps()),{},{key:l}),e.headers.map(((e,l)=>(0,m.createElement)(b.Th,(0,g.A)((0,g.A)({},e.getHeaderProps(e.getSortByToggleProps())),{},{pe:"10px",key:l,borderColor:T}),(0,C.jsx)(r.Flex,{justify:"space-between",align:"center",fontSize:{sm:"10px",lg:"12px"},color:"gray.400",children:e.render("Header")})))))))}),(0,C.jsxs)(b.NN,(0,g.A)((0,g.A)({},W()),{},{children:[0===(null===h||void 0===h?void 0:h.length)&&(0,C.jsx)(b.Tr,{children:(0,C.jsx)(b.Td,{colSpan:x.length,children:(0,C.jsx)(r.Text,{textAlign:"center",width:"100%",color:z,fontSize:"sm",fontWeight:"700",children:(0,C.jsx)(y.A,{})})})}),null===G||void 0===G?void 0:G.map(((e,l)=>{var s;return B(e),(0,m.createElement)(b.Tr,(0,g.A)((0,g.A)({},null===e||void 0===e?void 0:e.getRowProps()),{},{key:l}),null===e||void 0===e||null===(s=e.cells)||void 0===s?void 0:s.map(((e,l)=>{let s="";var n;"#"===(null===e||void 0===e?void 0:e.column.Header)?s=(0,C.jsx)(r.Flex,{align:"center",children:(0,C.jsx)(r.Text,{color:z,fontSize:"sm",fontWeight:"700",children:(null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.index)+1})}):"Role Name"===(null===e||void 0===e?void 0:e.column.Header)?s=(0,C.jsx)(r.Text,{me:"10px",color:z,fontSize:"sm",fontWeight:"700",children:null===e||void 0===e?void 0:e.value}):"Description"===(null===e||void 0===e?void 0:e.column.Header)&&(s=(0,C.jsx)(r.Text,{me:"10px",fontSize:"sm",fontWeight:"700",color:z,children:null===e||void 0===e?void 0:e.value}));return(0,m.createElement)(b.Td,(0,g.A)((0,g.A)({},null===e||void 0===e?void 0:e.getCellProps()),{},{key:l,fontSize:{sm:"14px"},minW:{sm:"150px",md:"200px",lg:"auto"},borderColor:"transparent"}),s)})))}))]}))]}))})]})}var z=s(9942),T=s(5066);const w=e=>{const{columnsData:l,tableData:s,fetchData:o,isOpen:t,id:a,onClose:d,interestRoles:u}=e,x=(0,f.dU)("secondaryGray.900","white"),h=(0,f.dU)("gray.200","whiteAlpha.100"),j=(0,m.useMemo)((()=>l),[l]),[v,N]=(0,m.useState)([]),[I,A]=(0,m.useState)(!1),[w,k]=(0,m.useState)(),W=(0,m.useMemo)((()=>s),[s]),F=(JSON.parse(localStorage.getItem("user")),(0,S.useTable)({columns:j,data:W,initialState:{pageIndex:0}},S.useGlobalFilter,S.useSortBy,S.usePagination)),{getTableProps:B,getTableBodyProps:G,headerGroups:E,prepareRow:D,page:P,pageOptions:R,state:{pageIndex:O,pageSize:H}}=F;R.length<w&&k(R.length);const L=[...new Set(v)];return(0,m.useEffect)((()=>{null===u||void 0===u||u.map((e=>N((l=>[...l,e]))))}),[u]),(0,C.jsxs)(z.aF,{onClose:d,size:"full",isOpen:t,children:[(0,C.jsx)(z.mH,{}),(0,C.jsxs)(z.$m,{children:[(0,C.jsx)(z.rQ,{children:"Change Role"}),(0,C.jsx)(z.s_,{}),(0,C.jsx)(z.cw,{children:I?(0,C.jsx)(r.Flex,{justifyContent:"center",alignItems:"center",width:"100%",children:(0,C.jsx)(c.A,{})}):(0,C.jsx)(r.Box,{overflowY:"auto",className:"table-fix-container",children:(0,C.jsxs)(b.XI,(0,g.A)((0,g.A)({},B()),{},{variant:"simple",color:"gray.500",mb:"24px",children:[(0,C.jsx)(b.d8,{children:null===E||void 0===E?void 0:E.map(((e,l)=>{var s;return(0,m.createElement)(b.Tr,(0,g.A)((0,g.A)({},e.getHeaderGroupProps()),{},{key:l}),null===(s=e.headers)||void 0===s?void 0:s.map(((e,l)=>(0,m.createElement)(b.Th,(0,g.A)((0,g.A)({},e.getHeaderProps(!1!==e.isSortable&&e.getSortByToggleProps())),{},{pe:"10px",key:l,borderColor:h}),(0,C.jsx)(r.Flex,{justify:"space-between",align:"center",fontSize:{sm:"10px",lg:"12px"},color:"gray.400",children:e.render("Header")})))))}))}),(0,C.jsx)(b.NN,(0,g.A)((0,g.A)({},G()),{},{children:I?(0,C.jsx)(b.Tr,{children:(0,C.jsx)(b.Td,{colSpan:null===j||void 0===j?void 0:j.length,children:(0,C.jsx)(r.Flex,{justifyContent:"center",alignItems:"center",width:"100%",color:x,fontSize:"sm",fontWeight:"700",children:(0,C.jsx)(c.A,{})})})}):0===(null===W||void 0===W?void 0:W.length)?(0,C.jsx)(b.Tr,{children:(0,C.jsx)(b.Td,{colSpan:j.length,children:(0,C.jsx)(r.Text,{textAlign:"center",width:"100%",color:x,fontSize:"sm",fontWeight:"700",children:(0,C.jsx)(y.A,{})})})}):null===P||void 0===P?void 0:P.map(((e,l)=>{var s;return D(e),(0,m.createElement)(b.Tr,(0,g.A)((0,g.A)({},null===e||void 0===e?void 0:e.getRowProps()),{},{key:l}),null===e||void 0===e||null===(s=e.cells)||void 0===s?void 0:s.map(((e,l)=>{let s="";var n;"#"===(null===e||void 0===e?void 0:e.column.Header)?s=(0,C.jsxs)(r.Flex,{align:"center",children:[(0,C.jsx)(T.Sc,{colorScheme:"brandScheme",value:v,isChecked:v.includes(null===e||void 0===e?void 0:e.value),onChange:l=>((e,l)=>{e.target.checked?N((e=>[...e,l])):N((e=>e.filter((e=>e!==l))))})(l,null===e||void 0===e?void 0:e.value),me:"10px"}),(0,C.jsx)(r.Text,{color:x,fontSize:"sm",fontWeight:"700",children:(null===e||void 0===e||null===(n=e.row)||void 0===n?void 0:n.index)+1})]}):"Role Name"===(null===e||void 0===e?void 0:e.column.Header)?s=(0,C.jsx)(r.Text,{me:"10px",color:x,fontSize:"sm",fontWeight:"700",children:null===e||void 0===e?void 0:e.value}):"Description"===(null===e||void 0===e?void 0:e.column.Header)&&(s=(0,C.jsx)(r.Text,{me:"10px",color:x,fontSize:"sm",fontWeight:"700",children:null!==e&&void 0!==e&&e.value?null===e||void 0===e?void 0:e.value:" - "}));return(0,m.createElement)(b.Td,(0,g.A)((0,g.A)({},null===e||void 0===e?void 0:e.getCellProps()),{},{key:l,fontSize:{sm:"14px"},minW:{sm:"150px",md:"200px",lg:"auto"},borderColor:"transparent"}),s)})))}))}))]}))})}),(0,C.jsxs)(z.jl,{children:[(0,C.jsxs)(i.Button,{size:"sm",variant:"brand",onClick:async()=>{try{A(!0);let e=await(0,p.yP)("api/user/change-roles/".concat(a),L);e&&200==e.status&&(o(),d())}catch(e){console.log(e)}finally{A(!1)}},disabled:!!I,leftIcon:(0,C.jsx)(n.AddIcon,{}),children:[" ",I?(0,C.jsx)(c.A,{}):"Add"]}),(0,C.jsx)(i.Button,{size:"sm",variant:"outline",colorScheme:"red",sx:{marginLeft:2,textTransform:"capitalize"},onClick:()=>d(),children:"Close"})]})]})]})};var k=s(7508),W=s(7610),F=s(8177);const B=()=>{var e,l;const s=[{Header:"#",accessor:"_id",width:10,display:!1},{Header:"Role Name",accessor:"roleName"},{Header:"Description",accessor:"description"}],g=(0,k.wA)(),f=(0,k.d4)((e=>e.user.user)),b="string"===typeof f?JSON.parse(f):f,S=(0,x.g)(),N=(0,x.Zp)(),[y,I]=(0,m.useState)(),[z,T]=(0,m.useState)([]),{isOpen:B,onOpen:G,onClose:E}=(0,o.j1)(),[D,P]=(0,m.useState)(!1),[R,O]=(0,m.useState)(!1),[H,L]=(0,m.useState)(!1),[U,J]=(0,m.useState)(!1),[_,M]=(0,m.useState)(!1),V=async()=>{J(!0);let e=await(0,p.x4)("api/user/view/",S.id);I(e.data),J(!1)};(0,m.useEffect)((()=>{S.id&&V()}),[_]),(0,m.useEffect)((async()=>{J(!0);let e=await(0,p.x4)("api/role-access");T(e.data),J(!1)}),[]);return(0,C.jsx)(C.Fragment,{children:U?(0,C.jsx)(r.Flex,{justifyContent:"center",alignItems:"center",width:"100%",children:(0,C.jsx)(c.A,{})}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(j.A,{isOpen:B,size:"lg",onClose:E}),(0,C.jsx)(v.A,{isOpen:D,size:"lg",onClose:P,userData:b,setAction:M,selectedId:null===S||void 0===S?void 0:S.id,setEdit:P,fetchData:V,data:y}),(0,C.jsx)(F.A,{isOpen:R,onClose:()=>O(!1),type:"User",handleDeleteData:async()=>{try{J(!0),200===(await(0,p.Gx)("api/user/delete/",S.id)).status&&(O(!1),N(-1),M((e=>!e)))}catch(e){console.log(e)}finally{J(!1)}},ids:"",selectedValues:S.id}),(0,C.jsxs)(a.A,{children:[(0,C.jsxs)(r.Grid,{templateColumns:"repeat(12, 1fr)",gap:4,children:[(0,C.jsx)(r.GridItem,{colSpan:{base:12,md:6},children:(0,C.jsxs)(r.Heading,{size:"md",mb:3,textTransform:"capitalize",children:[null!==y&&void 0!==y&&y.firstName||null!==y&&void 0!==y&&y.lastName?"".concat(null===y||void 0===y?void 0:y.firstName," ").concat(null===y||void 0===y?void 0:y.lastName):"User"," Information"]})}),(0,C.jsx)(r.GridItem,{colSpan:{base:12,md:6},children:(0,C.jsxs)(r.Flex,{justifyContent:{base:"start",sm:"start",md:"end"},children:["superAdmin"===(null===y||void 0===y?void 0:y.role)&&(0,C.jsxs)(t.W1,{children:[(0,C.jsx)(t.IU,{variant:"outline",colorScheme:"blackAlpha",size:"sm",va:!0,mr:2.5,as:i.Button,rightIcon:(0,C.jsx)(n.ChevronDownIcon,{}),children:"Actions"}),(0,C.jsx)(t.Nj,{}),(0,C.jsxs)(t.cO,{minWidth:"13rem",children:[(0,C.jsx)(t.Dr,{alignItems:"start",onClick:()=>G(),icon:(0,C.jsx)(n.AddIcon,{}),children:"Add"}),(0,C.jsx)(t.Dr,{alignItems:"start",onClick:()=>{P(!0)},icon:(0,C.jsx)(n.EditIcon,{}),color:"green",children:"Edit"}),"superAdmin"!==(null===y||void 0===y?void 0:y.role)&&"superAdmin"===(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.role)&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(t.Nj,{}),(0,C.jsx)(t.Dr,{alignItems:"start",onClick:()=>O(!0),icon:(0,C.jsx)(n.DeleteIcon,{}),children:"Delete"})]})]})]}),(0,C.jsx)(h.N_,{to:"/user",children:(0,C.jsx)(i.Button,{leftIcon:(0,C.jsx)(u.m6W,{}),variant:"brand",size:"sm",children:"Back"})})]})})]}),(0,C.jsx)(d.E,{}),(0,C.jsxs)(r.Grid,{templateColumns:"repeat(2, 1fr)",gap:4,mt:"5",children:[(0,C.jsxs)(r.GridItem,{colSpan:{base:2,md:1},children:[(0,C.jsx)(r.Text,{fontSize:"sm",fontWeight:"bold",color:"blackAlpha.900",children:" First Name "}),(0,C.jsx)(r.Text,{children:null!==y&&void 0!==y&&y.firstName?null===y||void 0===y?void 0:y.firstName:" - "})]}),(0,C.jsxs)(r.GridItem,{colSpan:{base:2,md:1},children:[(0,C.jsx)(r.Text,{fontSize:"sm",fontWeight:"bold",color:"blackAlpha.900",children:" Last Name "}),(0,C.jsx)(r.Text,{children:null!==y&&void 0!==y&&y.lastName?null===y||void 0===y?void 0:y.lastName:" - "})]}),(0,C.jsxs)(r.GridItem,{colSpan:{base:2,md:1},children:[(0,C.jsx)(r.Text,{fontSize:"sm",fontWeight:"bold",color:"blackAlpha.900",children:"Phone Number"}),(0,C.jsx)(r.Text,{children:null!==y&&void 0!==y&&y.phoneNumber?null===y||void 0===y?void 0:y.phoneNumber:" - "})]}),(0,C.jsxs)(r.GridItem,{colSpan:{base:2,md:1},children:[(0,C.jsx)(r.Text,{fontSize:"sm",fontWeight:"bold",color:"blackAlpha.900",children:" User Email "}),(0,C.jsx)(r.Text,{children:null!==y&&void 0!==y&&y.username?null===y||void 0===y?void 0:y.username:" - "})]})]})]}),"superAdmin"!==(null===y||void 0===y?void 0:y.role)&&(0,C.jsx)(a.A,{mt:3,children:(0,C.jsx)(A,{fetchData:V,columnsData:s,roleModal:H,setRoleModal:L,tableData:(null===y||void 0===y?void 0:y.roles)||[],title:"Role"})}),(0,C.jsx)(w,{fetchData:V,isOpen:H,onClose:L,columnsData:s,id:S.id,tableData:z,interestRoles:null===y||void 0===y?void 0:y.roles.map((e=>e._id))}),(0,C.jsx)(a.A,{mt:3,children:(0,C.jsx)(r.Grid,{templateColumns:"repeat(6, 1fr)",gap:1,children:(0,C.jsx)(r.GridItem,{colStart:6,children:(0,C.jsxs)(r.Flex,{justifyContent:"right",children:[(0,C.jsx)(i.Button,{onClick:()=>(e=>{P(!0),g((0,W.gV)(e))})(f),leftIcon:(0,C.jsx)(n.EditIcon,{}),mr:2.5,variant:"outline",size:"sm",colorScheme:"green",children:"Edit"}),"superAdmin"!==(null===y||void 0===y?void 0:y.role)&&"superAdmin"===(null===(l=JSON.parse(localStorage.getItem("user")))||void 0===l?void 0:l.role)&&(0,C.jsx)(i.Button,{size:"sm",style:{background:"red.800"},onClick:()=>O(!0),leftIcon:(0,C.jsx)(n.DeleteIcon,{}),colorScheme:"red",children:"Delete"})]})})})})]})})}}}]);
//# sourceMappingURL=66.4dcd214c.chunk.js.map