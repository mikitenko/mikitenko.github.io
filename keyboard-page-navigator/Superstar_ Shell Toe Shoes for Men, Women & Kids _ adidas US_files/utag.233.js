//tealium universal tag - utag.233 ut4.0.202006161319, Copyright 2020 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;u.ev={"view":1};u.map={};u.extend=[function(a,b){try{if(1){if(a=='view'&&b.glass_version&&window.QSI){if(b.page_type=='CHECKOUT'){QSI.API.unload();}else{QSI.API.load();QSI.API.run();}}}}catch(e){utag.DB(e)}}];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f;u.data={"qsp_delim":"&","kvp_delim":"=","samplerate":"100","siteinterceptid":"ZN_6McRij6XnCfajoF","usezones":"yes","base_url":"//zn6mcrij6xncfajof-adidastrial.siteintercept.qualtrics.com/WRSiteInterceptEngine/?"};for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){if(typeof utag_err!='undefined'){utag_err.push({e:'extension error:'+e,s:utag.cfg.path+'utag.'+id+'.js',l:c,t:'ex'})}}};c=[];for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){if(e[f]==="siteinterceptid"||e[f]==="SiteInterceptID"){u.data.siteinterceptid=b[d];}else if(e[f]==="samplerate"||e[f]==="SampleRate"){u.data.samplerate=b[d];}else if(e[f]==="usezones"||e[f]==="base_url"){u.data[e[f]]=b[d];}else{c.push(e[f]+u.data.kvp_delim+encodeURIComponent(b[d]))}}}}
if(u.data.usezones==="yes"){c.push("Q_ZID="+u.data.siteinterceptid);}else{c.push("Q_SIID="+u.data.siteinterceptid);}
c.push("Q_LOC="+encodeURIComponent(window.location.href));window[u.data.siteinterceptid+"_ed"]="";window[u.data.siteinterceptid+"_sampleRate"]=u.data.samplerate;window[u.data.siteinterceptid+"_url"]=u.data.base_url+c.join(u.data.qsp_delim);if(Math.random()>=window[u.data.siteinterceptid+"_sampleRate"]/100){return;}
var go=function(){var e,s,scr;if(!document.getElementById(u.data.siteinterceptid)){e=document.createElement("div");e.setAttribute("id",u.data.siteinterceptid);document.getElementsByTagName("body")[0].appendChild(e);s=document.getElementsByTagName("script")[0];scr=document.createElement("script");scr.type="text/javascript";scr.src=u.data.base_url+c.join(u.data.qsp_delim);s.parentNode.insertBefore(scr,s);}};if(document.readyState==="complete"){go();}else if(window.addEventListener){window.addEventListener("load",go,!1);}else if(window.attachEvent){window.attachEvent("onload",go);}
}};utag.o[loader].loader.LOAD(id);}("233","adidas.adidasglobal"));}catch(error){utag.DB(error);}
