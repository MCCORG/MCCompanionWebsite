"use strict";(self.webpackChunkmccompanion=self.webpackChunkmccompanion||[]).push([["288"],{2734(e,r,t){t.r(r),t.d(r,{default:()=>w});var i=t(4848),o=t(6540),n=t(4312);let a="#191c23",s="#1f232c",l="#252931",d="rgba(255,255,255,0.07)",c="rgba(255,255,255,0.12)",p="#e8e9ec",m="#9299a6",h="#5a6070",u="#67e404",x="rgba(103,228,4,0.22)",g="#34d399",f="'Inter', system-ui, sans-serif",b="'JetBrains Mono', 'Fira Code', monospace",y="https://api.mccompanion.net",v=[{id:"lookup",method:"GET",path:"/api/lookup/bedrock-java/:identifier",title:"Player Lookup",description:"Resolve a Minecraft player by Xbox gamertag, Java username, or XUID. Automatically detects the account type and cross-links Bedrock \u2194 Java profiles where available.",params:[{name:"identifier",in:"path",required:!0,type:"string",description:"Xbox gamertag, Minecraft Java username, or numeric XUID"}],example:{request:`GET ${y}/api/lookup/bedrock-java/Notch`,response:`{
  "java": {
    "platform": "java",
    "username": "Notch",
    "uuid": "069a79f4-44e9-4726-a5be-fca90e38aaf5",
    "skinUrl": "http://textures.minecraft.net/texture/292009a4...",
    "headUrl": "https://crafatar.com/avatars/069a79f4...?size=64&overlay"
  },
  "bedrock": null,
  "linked": false
}`,responseAlt:`// Bedrock player example
{
  "java": null,
  "bedrock": {
    "platform": "bedrock",
    "gamertag": "KobeNetwork",
    "xuid": "2535461503960946",
    "gamerscore": 595,
    "tier": "Silver",
    "gamerpicUrl": "https://images-eds-ssl.xboxlive.com/image?url=..."
  },
  "linked": false
}`},note:"bedrock is null when no linked Bedrock account is found, and vice-versa. linked: true means both profiles were resolved and cross-linked.",responseFields:[{name:"java.username",desc:"Java in-game username"},{name:"java.uuid",desc:"Mojang UUID (dashed)"},{name:"java.skinUrl",desc:"Full skin texture URL"},{name:"java.headUrl",desc:"64\xd764 head avatar via Crafatar"},{name:"bedrock.gamertag",desc:"Xbox gamertag"},{name:"bedrock.xuid",desc:"Numeric Xbox Live identifier"},{name:"bedrock.gamerscore",desc:"Xbox Gamerscore"},{name:"bedrock.tier",desc:'Xbox account tier \u2014 "Gold", "Silver", etc.'},{name:"bedrock.gamerpicUrl",desc:"Xbox Live profile picture URL"},{name:"linked",desc:"true when both Java and Bedrock were resolved together"}]},{id:"metrics",method:"GET",path:"/api/metrics",title:"Server Metrics",description:"Top 30 Minecraft servers ranked by connection count through the MCCompanion app, plus global totals.",params:[],example:{request:`GET ${y}/api/metrics`,response:`{
  "totalCount": 264811,
  "totalServers": 9225,
  "top": [
    { "ip": "donutsmp.net",      "count": 100477 },
    { "ip": "mc.cosmosmc.org",   "count": 7788   },
    { "ip": "zeqa.net",          "count": 3913   },
    { "ip": "nl.lifestealsmp.com","count": 3848  }
  ]
}`}},{id:"bots",method:"GET",path:"/api/bots",title:"Bot Status",description:"Xbox relay bot accounts with their current friend counts and limits. Both EU and US bots are returned by default.",params:[{name:"region",in:"query",required:!1,type:'"eu" | "us"',description:"Target a specific region. Omit to use automatic geographic routing."}],example:{request:`GET ${y}/api/bots?region=eu`,response:`{
  "bots": [
    {
      "gamertag": "MCCompanion1",
      "friendCount": 1842,
      "maxFriends": 2000
    },
    {
      "gamertag": "MCCompanion2",
      "friendCount": 970,
      "maxFriends": 2000
    }
  ]
}`}},{id:"featured-servers",method:"GET",path:"/api/featured-servers",title:"Featured Servers",description:"The list of featured and partner Minecraft servers shown in the MCCompanion app.",params:[],example:{request:`GET ${y}/api/featured-servers`,response:`{
  "servers": [
    {
      "id": 3,
      "name": "ChillSMP",
      "address": "mc.chillsmp.org",
      "port": 19132,
      "description": "A relaxed survival server focused on community, building, and pure Minecraft fun.",
      "iconUrl": "https://raw.githubusercontent.com/NetherDevMc/NetherLinkData/main/featured/icons/chillsmp.png",
      "websiteUrl": "https://chillsmp.org",
      "featured": true,
      "createdAt": "2026-05-13T01:02:37.138Z",
      "updatedAt": "2026-05-14T01:14:52.694Z"
    }
  ]
}`}},{id:"notification",method:"GET",path:"/notification",title:"App Notification",description:"Current in-app notification shown to all MCCompanion users. Returns the active announcement title, message, and severity type.",params:[],example:{request:`GET ${y}/notification`,response:`{
  "title": "Relay Server Information",
  "message": "We're rebranding NetherLink to MCCompanion, and the new version will launch this week.",
  "type": "warning"
}`},responseFields:[{name:"title",desc:"Short notification heading"},{name:"message",desc:"Full notification body text"},{name:"type",desc:'Severity level \u2014 "info", "warning", "error"'}]},{id:"version",method:"GET",path:"/api/version",title:"App Version",description:"Current recommended version of the MCCompanion app.",params:[],example:{request:`GET ${y}/api/version`,response:`{
  "version": "3.5.4",
  "updated_at": "2026-05-12T23:26:18.992Z"
}`}},{id:"health",method:"GET",path:"/api/health",title:"Health Check",description:"Server health status, uptime, and cache size. Useful for monitoring whether the API is reachable.",params:[],example:{request:`GET ${y}/api/health`,response:`{
  "status": "ok",
  "time": "2026-05-28T12:00:00.000Z",
  "uptimeSeconds": 86412,
  "cache": {
    "size": 142
  }
}`},responseFields:[{name:"status",desc:'"ok" when the server is healthy'},{name:"time",desc:"Current server time (ISO 8601)"},{name:"uptimeSeconds",desc:"Seconds since the process started"},{name:"cache.size",desc:"Number of entries currently in the player cache"}]}];function j({method:e}){let r={GET:{bg:"rgba(103,228,4,0.12)",border:"rgba(103,228,4,0.28)",color:"#67e404"},POST:{bg:"rgba(96,165,250,0.12)",border:"rgba(96,165,250,0.28)",color:"#60a5fa"},DELETE:{bg:"rgba(248,113,113,0.12)",border:"rgba(248,113,113,0.28)",color:"#f87171"},PATCH:{bg:"rgba(251,191,36,0.12)",border:"rgba(251,191,36,0.28)",color:"#fbbf24"}},t=r[e]||r.GET;return(0,i.jsx)("span",{style:{fontFamily:b,fontSize:11,fontWeight:700,letterSpacing:"0.06em",padding:"3px 8px",borderRadius:5,background:t.bg,border:`1px solid ${t.border}`,color:t.color,flexShrink:0},children:e})}function k({required:e}){return e?(0,i.jsx)("span",{style:{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:"rgba(248,113,113,0.10)",border:"1px solid rgba(248,113,113,0.22)",color:"#f87171",fontFamily:b},children:"required"}):(0,i.jsx)("span",{style:{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:l,border:`1px solid ${d}`,color:h,fontFamily:b},children:"optional"})}function S({text:e}){let[r,t]=(0,o.useState)(!1);return(0,i.jsx)("button",{onClick:function(){navigator.clipboard?.writeText(e).then(()=>{t(!0),setTimeout(()=>t(!1),1800)})},style:{background:r?"rgba(52,211,153,0.10)":s,border:`1px solid ${r?"rgba(52,211,153,0.22)":d}`,color:r?g:h,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:f,transition:"all 0.15s",flexShrink:0},children:r?"Copied!":"Copy"})}function T({label:e,code:r}){return(0,i.jsxs)("div",{style:{marginTop:10},children:[(0,i.jsx)("p",{style:{fontSize:10,fontWeight:700,color:h,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px",fontFamily:b},children:e}),(0,i.jsxs)("div",{style:{position:"relative",borderRadius:10,overflow:"hidden",background:"rgba(0,0,0,0.25)",border:`1px solid ${d}`},children:[(0,i.jsx)("div",{style:{position:"absolute",top:8,right:8,zIndex:1},children:(0,i.jsx)(S,{text:r})}),(0,i.jsx)("pre",{style:{margin:0,padding:"14px 16px",paddingRight:70,fontFamily:b,fontSize:12,lineHeight:1.65,color:m,overflowX:"auto",whiteSpace:"pre"},children:r})]})]})}function C({ep:e}){let[r,t]=(0,o.useState)(!1);return(0,i.jsxs)("div",{id:e.id,style:{background:a,border:`1px solid ${d}`,borderRadius:14,overflow:"hidden",scrollMarginTop:80,transition:"border-color 0.2s"},onMouseEnter:e=>e.currentTarget.style.borderColor=c,onMouseLeave:e=>e.currentTarget.style.borderColor=d,children:[(0,i.jsxs)("button",{onClick:()=>t(e=>!e),style:{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"16px 18px",display:"flex",alignItems:"center",gap:10,textAlign:"left"},children:[(0,i.jsx)(j,{method:e.method}),(0,i.jsx)("code",{style:{fontFamily:b,fontSize:13,color:p,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e.path}),(0,i.jsx)("span",{style:{fontSize:13,fontWeight:600,color:m,flexShrink:0,marginLeft:4},children:e.title}),(0,i.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",style:{flexShrink:0,transition:"transform 0.2s",transform:r?"rotate(180deg)":"none",color:h},children:(0,i.jsx)("polyline",{points:"6 9 12 15 18 9",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),r&&(0,i.jsxs)("div",{style:{borderTop:`1px solid ${d}`,padding:"16px 18px",display:"flex",flexDirection:"column",gap:16},children:[(0,i.jsx)("p",{style:{fontSize:13,color:m,margin:0,lineHeight:1.6},children:e.description}),e.params.length>0&&(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{style:{fontSize:11,fontWeight:700,color:h,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 8px",fontFamily:b},children:"Parameters"}),(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:6},children:e.params.map(e=>(0,i.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:8,background:s,border:`1px solid ${d}`,flexWrap:"wrap"},children:[(0,i.jsxs)("div",{style:{minWidth:120,flexShrink:0},children:[(0,i.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:3},children:[(0,i.jsx)("code",{style:{fontFamily:b,fontSize:12,fontWeight:700,color:u},children:e.name}),(0,i.jsx)("span",{style:{fontSize:10,color:h,background:l,padding:"1px 6px",borderRadius:4,border:`1px solid ${d}`,fontFamily:b},children:e.in})]}),(0,i.jsx)(k,{required:e.required})]}),(0,i.jsxs)("div",{style:{flex:1,minWidth:200},children:[(0,i.jsx)("code",{style:{fontFamily:b,fontSize:11,color:m},children:e.type}),(0,i.jsx)("p",{style:{fontSize:12,color:h,margin:"4px 0 0"},children:e.description})]})]},e.name))})]}),(0,i.jsx)(T,{label:"Request",code:e.example.request}),(0,i.jsx)(T,{label:"Response",code:e.example.response}),e.example.responseAlt&&(0,i.jsx)(T,{label:"Response (Bedrock)",code:e.example.responseAlt}),e.note&&(0,i.jsxs)("div",{style:{padding:"10px 14px",borderRadius:8,background:"rgba(103,228,4,0.06)",border:`1px solid ${x}`,fontSize:12,color:m,lineHeight:1.6},children:[(0,i.jsx)("span",{style:{color:u,fontWeight:600},children:"Note \xb7 "}),e.note]}),e.responseFields&&(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{style:{fontSize:11,fontWeight:700,color:h,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 8px",fontFamily:b},children:"Response fields"}),(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:1},children:e.responseFields.map(e=>(0,i.jsxs)("div",{style:{display:"flex",alignItems:"baseline",gap:12,padding:"7px 0",borderBottom:`1px solid ${d}`},children:[(0,i.jsx)("code",{style:{fontFamily:b,fontSize:11,fontWeight:600,color:u,flexShrink:0,minWidth:180},children:e.name}),(0,i.jsx)("span",{style:{fontSize:12,color:h},children:e.desc})]},e.name))})]})]})]})}function w(){return(0,i.jsx)(n.A,{title:"API Reference",description:"MCCompanion public API endpoints",children:(0,i.jsx)("div",{style:{minHeight:"100vh",background:"#111318",fontFamily:f,padding:"64px 16px 80px"},children:(0,i.jsxs)("div",{style:{maxWidth:760,margin:"0 auto"},children:[(0,i.jsxs)("div",{style:{marginBottom:40},children:[(0,i.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,padding:"4px 12px",borderRadius:20,marginBottom:16,background:"rgba(103,228,4,0.10)",border:`1px solid ${x}`,color:u,fontFamily:b,letterSpacing:"0.1em",textTransform:"uppercase"},children:[(0,i.jsx)("span",{style:{width:6,height:6,borderRadius:"50%",background:g}}),"Public API"]}),(0,i.jsx)("h1",{style:{fontSize:30,fontWeight:700,color:p,letterSpacing:"-0.025em",margin:"0 0 10px"},children:"API Reference"}),(0,i.jsx)("p",{style:{fontSize:14,color:m,margin:"0 0 20px",lineHeight:1.6,maxWidth:520},children:"All endpoints are publicly accessible \u2014 no authentication required. The base URL is:"}),(0,i.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:s,border:`1px solid ${d}`},children:[(0,i.jsx)("code",{style:{fontFamily:b,fontSize:13,color:u},children:y}),(0,i.jsx)(S,{text:y})]})]}),(0,i.jsxs)("div",{style:{display:"flex",gap:6,flexWrap:"wrap",padding:"12px 14px",borderRadius:12,background:a,border:`1px solid ${d}`,marginBottom:24},children:[(0,i.jsx)("span",{style:{fontSize:11,color:h,fontWeight:600,alignSelf:"center",marginRight:4,fontFamily:b,textTransform:"uppercase",letterSpacing:"0.06em"},children:"Jump to:"}),v.map(e=>(0,i.jsxs)("a",{href:`#${e.id}`,style:{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"4px 10px",borderRadius:7,background:s,border:`1px solid ${d}`,color:m,textDecoration:"none",transition:"color 0.15s, border-color 0.15s"},onMouseEnter:e=>{e.currentTarget.style.color=p,e.currentTarget.style.borderColor=c},onMouseLeave:e=>{e.currentTarget.style.color=m,e.currentTarget.style.borderColor=d},children:[(0,i.jsx)(j,{method:e.method}),e.title]},e.id))]}),(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:10},children:v.map(e=>(0,i.jsx)(C,{ep:e},e.id))}),(0,i.jsx)("p",{style:{fontSize:11,color:h,marginTop:32,textAlign:"center"},children:"All responses are JSON \xb7 HTTPS only \xb7 No rate limiting on public endpoints"})]})})})}}}]);