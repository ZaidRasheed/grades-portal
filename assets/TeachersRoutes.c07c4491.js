import{U as h,r as a,a as d,N as l}from"./index.b267ccbb.js";function n({children:s}){const{currentUser:e,checkIfTeacherOrStudent:o}=h(),[i,f]=a.exports.useState(!1),[u,c]=a.exports.useState("");if(a.exports.useEffect(()=>{e!=null&&e.uid&&o(e==null?void 0:e.uid).then(t=>{t.state?t.role==="teacher"&&c("teacher"):logOut()}).catch(t=>{}).finally(()=>{f(!0)})},[e==null?void 0:e.uid]),i)return u==="teacher"?s:d(l,{to:"/student-profile"})}export{n as default};