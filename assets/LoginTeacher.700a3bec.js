import{j as r,F as d,a as e,L as c}from"./index.b267ccbb.js";import{M as p}from"./MainHeader.1e4040be.js";import{u as h}from"./useLogin.6c1edd1b.js";import{C as u}from"./Container.ec1b4897.js";import{C as i}from"./Card.f8854b59.js";import{F as a,B as f}from"./Form.22ee1a94.js";import{I as t}from"./InputGroup.1f65b5fa.js";import"./createWithBsPrefix.414b4e56.js";import"./InputGroupContext.42912dcc.js";function j(){const{emailRef:s,passwordRef:o,alert:l,loading:n,handleLogin:m}=h("teacher");return r(d,{children:[e(p,{}),e(u,{className:"d-flex mt-5 justify-content-center",style:{minHeight:"100vh"},children:r("div",{className:"w-100",style:{maxWidth:"450px"},children:[e(i,{className:"p-2",children:r(i.Body,{children:[e("h2",{className:"text-center mb-4",children:"Teacher Login"}),l,r(a,{onSubmit:m,children:[r(a.Group,{className:"mb-3",children:[e(a.Label,{children:"Email"}),r(t,{children:[e(t.Text,{children:"@"}),e(a.Control,{type:"email",ref:s,autoComplete:"email",placeholder:"Email","aria-label":"Email",required:!0})]})]}),r(a.Group,{className:"mb-3",children:[e(a.Label,{children:"Password"}),r(t,{children:[e(t.Text,{children:"*"}),e(a.Control,{type:"password",ref:o,autoComplete:"current-password",placeholder:"Password","aria-label":"Password",required:!0})]})]}),e(f,{disabled:n,className:"w-100 mt-3 mb-3",type:"submit",children:"Login"})]})]})}),r("div",{className:"w-100 text-center mt-2",children:["Forgot password? ",e(c,{to:"/reset-password",children:"Reset"})]})]})})]})}export{j as default};