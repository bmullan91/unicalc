!function t(e,n,r){function i(o,s){if(!n[o]){if(!e[o]){var u="function"==typeof require&&require;if(!s&&u)return u(o,!0);if(a)return a(o,!0);throw new Error("Cannot find module '"+o+"'")}var l=n[o]={exports:{}};e[o][0].call(l.exports,function(t){var n=e[o][1][t];return i(n?n:t)},l,l.exports,t,e,n,r)}return n[o].exports}for(var a="function"==typeof require&&require,o=0;o<r.length;o++)i(r[o]);return i}({1:[function(t){function e(){i.clearErrors();var t=i.getInputData();return o.validate(t)?void i.updateScore(a.calculate(t)):i.showError("Check each years <em>worth</em> percentages, something isn't quite right.")}function n(){var t=i.prepForSave();t.length&&s.set(t)}function r(){i.setInputData(s.get())}var i=(t("./modules/polyfills")(),t("./view")),a=t("./modules/calculator"),o=t("./modules/validator"),s=t("./modules/localStorage");!function(){try{window.ANDROID=Android}catch(t){window.ANDROID=null}s.isAvailable()&&(s.get()?i.showOpenButton():i.showSaveButton()),i.setButtonListener("calculate",e),i.setButtonListener("save",n),i.setButtonListener("open",r),i.init()}()},{"./modules/calculator":2,"./modules/localStorage":3,"./modules/polyfills":4,"./modules/validator":5,"./view":6}],2:[function(t,e){e.exports.calculate=function(t){var e=0,n=[];return t.forEach(function(t){var r=Math.round(t.weight/100*t.average*100)/100;n.push({average:t.average,contributes:r}),e+=r}),{overall:e,years:n}}},{}],3:[function(t,e){var n="RESULTS_DATA",r=null,i=window.ANDROID||window.localStorage||null;e.exports={isAvailable:function(){return null!==i},get:function(){if(r)return r;try{var t=i.getItem(n);return t?r=JSON.parse(t):null}catch(e){return console.log("ERROR localStorage.getItem(KEY) "+e),null}},set:function(t){r=t,i.setItem(n,JSON.stringify(t))}}},{}],4:[function(t,e){e.exports=function(){function t(t){var e=n[t];return r(a[e])}var e,n,r=function(t){return"function"==typeof t},i=[].slice,a=Function.prototype;n={"function-bind":"bind"},t("function-bind")||(e=function(t){var e=i.call(arguments,1),n=this,r=function(){},a=function(){return n.apply(this instanceof r?this:t||{},e.concat(i.call(arguments)))};return r.prototype=this.prototype||{},a.prototype=new r,a},a.bind=e)}},{}],5:[function(t,e){e.exports={validate:function(t){if(!t.length)return!1;var e=0;return t.forEach(function(t){e+=t.weight}),e>0&&100>=e}}},{}],6:[function(t,e){function n(){o(),s(),window.ANDROID&&(w.footer.style.display="none"),w.btns.calculate.addEventListener("click",r),w.btns.save.addEventListener("click",i),w.btns.open.addEventListener("click",a),w.btns.addYear.addEventListener("click",o)}function r(){S.calculate&&S.calculate(),w.btns.open.style.display="none",w.btns.save.style.display="block"}function i(){var t=w.btns.save,e=t.innerHTML;S.save&&S.save(),t.innerHTML="Saved!",t.classList.add("icon-ok"),setTimeout(function(){t.innerHTML=e,t.classList.remove("icon-ok")},700)}function a(){S.open&&S.open(),r()}function o(){var t=w.yearsContainer.children.length,e=m.create(t+1);b.push(e),w.yearsContainer.appendChild(e.getElement())}function s(){var t=b[0];if(t){var e=t.getModules()[0];e&&e.applyTooltip()}}function u(){w.btns.save.style.display="none",w.btns.open.style.display="block"}function l(){w.btns.open.style.display="none",w.btns.save.style.display="block"}function c(t,e){S[t]=e}function p(){var t=[];return b.forEach(function(e){var n=e.getSaveData();n&&t.push(n)}),t}function f(){var t=[];return b.forEach(function(e){var n=e.getAverage(),r=e.getWeight();isNaN(n)||isNaN(r)||t.push({average:n,weight:r})}),t}function h(t){for(var e=0,n=b.length;n>e;e++)w.yearsContainer.removeChild(b[e].getElement());b=[],t.forEach(function(t,e){if(t){var n=m.create(e+1,!0);b.push(n),n.setWeight(t.weight),t.modules.forEach(function(t){n.addModule(t)}),w.yearsContainer.appendChild(n.getElement())}})}function d(){for(var t=0,e=w.errors.children.length;e>t;t++)w.errors.removeChild(w.errors.children[t])}function g(t){var e=document.createElement("div");e.innerHTML=t,w.errors.appendChild(e)}function v(t){b.forEach(function(e,n){var r=t.years[n];r&&e.setResults(r.average,r.contributes)}),y.update(t.overall)}var m=t("./year"),y=(t("./module"),t("./scoreMeter")),b=[],w={yearsContainer:document.getElementById("Years"),errors:document.getElementById("Errors"),footer:document.getElementById("Footer"),btns:{calculate:document.getElementById("Calculate"),save:document.getElementById("Save"),open:document.getElementById("Open"),addYear:document.getElementById("Add-Year")}},S={calculate:null,save:null,open:null};e.exports={init:n,setButtonListener:c,showOpenButton:u,showSaveButton:l,getInputData:f,setInputData:h,prepForSave:p,clearErrors:d,showError:g,updateScore:v}},{"./module":7,"./scoreMeter":9,"./year":10}],7:[function(t,e){function n(t){t=t||{},this.element=r(),void 0!==t.name&&this.setName(t.name),void 0!==t.percentage&&this.setPercentage(t.percentage),void 0!==t.weight&&this.setWeight(t.weight)}function r(){var t=document.createElement("div");return t.innerHTML=a.render(),t.firstChild}var i=t("hogan.js"),a=i.compile(t("./template"));n.prototype.getElement=function(){return this.element},n.prototype.getName=function(){return this.element.querySelector(".name input").value},n.prototype.setName=function(t){this.element.querySelector(".name input").value=t},n.prototype.getWeight=function(){return parseFloat(this.element.querySelector(".ratio input").value,10)||1},n.prototype.setWeight=function(t){this.element.querySelector(".ratio input").value=t},n.prototype.getPercentage=function(){return parseFloat(this.element.querySelector(".percentage input").value,10)},n.prototype.setPercentage=function(t){this.element.querySelector(".percentage input").value=t},n.prototype.applyTooltip=function(){this.element.querySelector(".ratio").className+=" tooltip"},e.exports={create:function(t){return new n(t)}}},{"./template":8,"hogan.js":13}],8:[function(t,e){e.exports=["<div class='module'>","<div class='name'>Name<input></div>","<div class='values'>","<span class='percentage'>","<span class='label'>Percentage</span>","<span class='icon'>%</span>","<input>","</span>","<span class='ratio' title='Half module: 0.5, Single module: 1, Double module: 2, etc'>Weight<input></span>","</div>","</div>"].join("")},{}],9:[function(t,e){function n(t){var e=["-webkit-transform","-moz-transform","-ms-transform","-o-transform","transform"];e.forEach(function(e){i.style[e]="translateX("+t+"px)"})}var r=document.getElementById("Score"),i=r.querySelector(".marker"),a=r.querySelector(".value");e.exports.update=function(t){t=Math.round(100*t)/100;var e=r.scrollWidth/100*t;n(e-1.5),a.innerHTML=t+"%"}},{}],10:[function(t,e){function n(t,e){this.number=t,this.element=r(t),this.modules=[],e||this.addModule()}function r(t){var e=document.createElement("div");return e.innerHTML=a.render({year:t}),e.firstChild}var i=t("hogan.js"),a=i.compile(t("./template")),o=t("../module");n.prototype.getElement=function(){return this.element},n.prototype.getModules=function(){return this.modules},n.prototype.addButtonListener=function(){this.element.querySelector("button").addEventListener("click",this.addModule.bind(this))},n.prototype.addModule=function(t){var e=o.create(t);this.modules.push(e),this.element.querySelector(".modules").appendChild(e.getElement())},n.prototype.getAverage=function(){var t=0,e=0;return this.modules.forEach(function(n){var r=n.getPercentage();if(!isNaN(r)){var i=n.getWeight();e+=i,t+=r*i}}),Math.round(t/e*100)/100},n.prototype.getWeight=function(){return parseFloat(this.element.querySelector(".year-weight input").value,10)},n.prototype.setWeight=function(t){this.element.querySelector(".year-weight input").value=t},n.prototype.setResults=function(t,e){var n=this.element.querySelector(".results"),r=n.querySelector(".avg"),i=n.querySelector(".weight");r.innerHTML=t+"%",i.innerHTML=e+"%"},n.prototype.getSaveData=function(){var t=this.getWeight();if(!isNaN(t)){var e=[];return this.getModules().forEach(function(t){var n=t.getPercentage(),r=t.getWeight();isNaN(n)||isNaN(r)||e.push({name:t.getName(),percentage:n,weight:r})}),{weight:t,modules:e}}},e.exports={create:function(t,e){var r=new n(t,e);return r.addButtonListener(),r}}},{"../module":7,"./template":11,"hogan.js":13}],11:[function(t,e){e.exports=['<div class="year card">','<div class="info">','<span class="year-title">Year {{year}}</span>','<span class="year-weight">Worth %<input class=""></span>',"</div>",'<div class="modules">','<div class="modules-label">','<div class="pull-left">Module(s):</div>','<div class="details">','<div class="details-name pull-left">Name: not required</div>','<div class="pull-right">Weight: default is 1</div>',"</div>","</div>",'<div class="clear-fix"></div>',"</div>",'<button class="btn btn-outline btn-small">Add Module</button>','<div class="results">',"<span>Average:",'<span class="avg box">0%</span>',"</span>",'<span class="pull-right">Weighted:','<span class="weight box">0%</span>',"</span>","</div>","</div>"].join("")},{}],12:[function(t,e,n){!function(t){function e(t){"}"===t.n.substr(t.n.length-1)&&(t.n=t.n.substring(0,t.n.length-1))}function n(t){return t.trim?t.trim():t.replace(/^\s*|\s*$/g,"")}function r(t,e,n){if(e.charAt(n)!=t.charAt(0))return!1;for(var r=1,i=t.length;i>r;r++)if(e.charAt(n+r)!=t.charAt(r))return!1;return!0}function i(e,n,r,s){var u=[],l=null,c=null,p=null;for(c=r[r.length-1];e.length>0;){if(p=e.shift(),c&&"<"==c.tag&&!(p.tag in b))throw new Error("Illegal content in < super tag.");if(t.tags[p.tag]<=t.tags.$||a(p,s))r.push(p),p.nodes=i(e,p.tag,r,s);else{if("/"==p.tag){if(0===r.length)throw new Error("Closing tag without opener: /"+p.n);if(l=r.pop(),p.n!=l.n&&!o(p.n,l.n,s))throw new Error("Nesting error: "+l.n+" vs. "+p.n);return l.end=p.i,u}"\n"==p.tag&&(p.last=0==e.length||"\n"==e[0].tag)}u.push(p)}if(r.length>0)throw new Error("missing closing tag: "+r.pop().n);return u}function a(t,e){for(var n=0,r=e.length;r>n;n++)if(e[n].o==t.n)return t.tag="#",!0}function o(t,e,n){for(var r=0,i=n.length;i>r;r++)if(n[r].c==t&&n[r].o==e)return!0}function s(t){var e=[];for(var n in t)e.push('"'+l(n)+'": function(c,p,t,i) {'+t[n]+"}");return"{ "+e.join(",")+" }"}function u(t){var e=[];for(var n in t.partials)e.push('"'+l(n)+'":{name:"'+l(t.partials[n].name)+'", '+u(t.partials[n])+"}");return"partials: {"+e.join(",")+"}, subs: "+s(t.subs)}function l(t){return t.replace(y,"\\\\").replace(g,'\\"').replace(v,"\\n").replace(m,"\\r")}function c(t){return~t.indexOf(".")?"d":"f"}function p(t,e){var n="<"+(e.prefix||""),r=n+t.n+w++;return e.partials[r]={name:t.n,partials:{}},e.code+='t.b(t.rp("'+l(r)+'",c,p,"'+(t.indent||"")+'"));',r}function f(t,e){e.code+="t.b(t.t(t."+c(t.n)+'("'+l(t.n)+'",c,p,0)));'}function h(t){return"t.b("+t+");"}var d=/\S/,g=/\"/g,v=/\n/g,m=/\r/g,y=/\\/g;t.tags={"#":1,"^":2,"<":3,$:4,"/":5,"!":6,">":7,"=":8,_v:9,"{":10,"&":11,_t:12},t.scan=function(i,a){function o(){y.length>0&&(b.push({tag:"_t",text:new String(y)}),y="")}function s(){for(var e=!0,n=E;n<b.length;n++)if(e=t.tags[b[n].tag]<t.tags._v||"_t"==b[n].tag&&null===b[n].text.match(d),!e)return!1;return e}function u(t,e){if(o(),t&&s())for(var n,r=E;r<b.length;r++)b[r].text&&((n=b[r+1])&&">"==n.tag&&(n.indent=b[r].text.toString()),b.splice(r,1));else e||b.push({tag:"\n"});w=!1,E=b.length}function l(t,e){var r="="+k,i=t.indexOf(r,e),a=n(t.substring(t.indexOf("=",e)+1,i)).split(" ");return x=a[0],k=a[a.length-1],i+r.length-1}var c=i.length,p=0,f=1,h=2,g=p,v=null,m=null,y="",b=[],w=!1,S=0,E=0,x="{{",k="}}";for(a&&(a=a.split(" "),x=a[0],k=a[1]),S=0;c>S;S++)g==p?r(x,i,S)?(--S,o(),g=f):"\n"==i.charAt(S)?u(w):y+=i.charAt(S):g==f?(S+=x.length-1,m=t.tags[i.charAt(S+1)],v=m?i.charAt(S+1):"_v","="==v?(S=l(i,S),g=p):(m&&S++,g=h),w=S):r(k,i,S)?(b.push({tag:v,n:n(y),otag:x,ctag:k,i:"/"==v?w-x.length:S+k.length}),y="",S+=k.length-1,g=p,"{"==v&&("}}"==k?S++:e(b[b.length-1]))):y+=i.charAt(S);return u(w,!0),b};var b={_t:!0,"\n":!0,$:!0,"/":!0};t.stringify=function(e){return"{code: function (c,p,i) { "+t.wrapMain(e.code)+" },"+u(e)+"}"};var w=0;t.generate=function(e,n,r){w=0;var i={code:"",subs:{},partials:{}};return t.walk(e,i),r.asString?this.stringify(i,n,r):this.makeTemplate(i,n,r)},t.wrapMain=function(t){return'var t=this;t.b(i=i||"");'+t+"return t.fl();"},t.template=t.Template,t.makeTemplate=function(t,e,n){var r=this.makePartials(t);return r.code=new Function("c","p","i",this.wrapMain(t.code)),new this.template(r,e,this,n)},t.makePartials=function(t){var e,n={subs:{},partials:t.partials,name:t.name};for(e in n.partials)n.partials[e]=this.makePartials(n.partials[e]);for(e in t.subs)n.subs[e]=new Function("c","p","t","i",t.subs[e]);return n},t.codegen={"#":function(e,n){n.code+="if(t.s(t."+c(e.n)+'("'+l(e.n)+'",c,p,1),c,p,0,'+e.i+","+e.end+',"'+e.otag+" "+e.ctag+'")){t.rs(c,p,function(c,p,t){',t.walk(e.nodes,n),n.code+="});c.pop();}"},"^":function(e,n){n.code+="if(!t.s(t."+c(e.n)+'("'+l(e.n)+'",c,p,1),c,p,1,0,0,"")){',t.walk(e.nodes,n),n.code+="};"},">":p,"<":function(e,n){var r={partials:{},code:"",subs:{},inPartial:!0};t.walk(e.nodes,r);var i=n.partials[p(e,n)];i.subs=r.subs,i.partials=r.partials},$:function(e,n){var r={subs:{},code:"",partials:n.partials,prefix:e.n};t.walk(e.nodes,r),n.subs[e.n]=r.code,n.inPartial||(n.code+='t.sub("'+l(e.n)+'",c,p,i);')},"\n":function(t,e){e.code+=h('"\\n"'+(t.last?"":" + i"))},_v:function(t,e){e.code+="t.b(t.v(t."+c(t.n)+'("'+l(t.n)+'",c,p,0)));'},_t:function(t,e){e.code+=h('"'+l(t.text)+'"')},"{":f,"&":f},t.walk=function(e,n){for(var r,i=0,a=e.length;a>i;i++)r=t.codegen[e[i].tag],r&&r(e[i],n);return n},t.parse=function(t,e,n){return n=n||{},i(t,"",[],n.sectionTags||[])},t.cache={},t.cacheKey=function(t,e){return[t,!!e.asString,!!e.disableLambda,e.delimiters,!!e.modelGet].join("||")},t.compile=function(e,n){n=n||{};var r=t.cacheKey(e,n),i=this.cache[r];if(i){var a=i.partials;for(var o in a)delete a[o].instance;return i}return i=this.generate(this.parse(this.scan(e,n.delimiters),e,n),e,n),this.cache[r]=i}}("undefined"!=typeof n?n:Hogan)},{}],13:[function(t,e){var n=t("./compiler");n.Template=t("./template").Template,n.template=n.Template,e.exports=n},{"./compiler":12,"./template":14}],14:[function(t,e,n){var r={};!function(t){function e(t,e,n){var r;return e&&"object"==typeof e&&(null!=e[t]?r=e[t]:n&&e.get&&"function"==typeof e.get&&(r=e.get(t))),r}function n(t,e,n,r,i,a){function o(){}function s(){}o.prototype=t,s.prototype=t.subs;var u,l=new o;l.subs=new s,l.subsText={},l.buf="",r=r||{},l.stackSubs=r,l.subsText=a;for(u in e)r[u]||(r[u]=e[u]);for(u in r)l.subs[u]=r[u];i=i||{},l.stackPartials=i;for(u in n)i[u]||(i[u]=n[u]);for(u in i)l.partials[u]=i[u];return l}function r(t){return String(null===t||void 0===t?"":t)}function i(t){return t=r(t),c.test(t)?t.replace(a,"&amp;").replace(o,"&lt;").replace(s,"&gt;").replace(u,"&#39;").replace(l,"&quot;"):t}t.Template=function(t,e,n,r){t=t||{},this.r=t.code||this.r,this.c=n,this.options=r||{},this.text=e||"",this.partials=t.partials||{},this.subs=t.subs||{},this.buf=""},t.Template.prototype={r:function(){return""},v:i,t:r,render:function(t,e,n){return this.ri([t],e||{},n)},ri:function(t,e,n){return this.r(t,e,n)},ep:function(t,e){var r=this.partials[t],i=e[r.name];if(r.instance&&r.base==i)return r.instance;if("string"==typeof i){if(!this.c)throw new Error("No compiler available.");i=this.c.compile(i,this.options)}if(!i)return null;if(this.partials[t].base=i,r.subs){e.stackText||(e.stackText={});for(key in r.subs)e.stackText[key]||(e.stackText[key]=void 0!==this.activeSub&&e.stackText[this.activeSub]?e.stackText[this.activeSub]:this.text);i=n(i,r.subs,r.partials,this.stackSubs,this.stackPartials,e.stackText)}return this.partials[t].instance=i,i},rp:function(t,e,n,r){var i=this.ep(t,n);return i?i.ri(e,n,r):""},rs:function(t,e,n){var r=t[t.length-1];if(!p(r))return void n(t,e,this);for(var i=0;i<r.length;i++)t.push(r[i]),n(t,e,this),t.pop()},s:function(t,e,n,r,i,a,o){var s;return p(t)&&0===t.length?!1:("function"==typeof t&&(t=this.ms(t,e,n,r,i,a,o)),s=!!t,!r&&s&&e&&e.push("object"==typeof t?t:e[e.length-1]),s)},d:function(t,n,r,i){var a,o=t.split("."),s=this.f(o[0],n,r,i),u=this.options.modelGet,l=null;if("."===t&&p(n[n.length-2]))s=n[n.length-1];else for(var c=1;c<o.length;c++)a=e(o[c],s,u),null!=a?(l=s,s=a):s="";return i&&!s?!1:(i||"function"!=typeof s||(n.push(l),s=this.mv(s,n,r),n.pop()),s)},f:function(t,n,r,i){for(var a=!1,o=null,s=!1,u=this.options.modelGet,l=n.length-1;l>=0;l--)if(o=n[l],a=e(t,o,u),null!=a){s=!0;break}return s?(i||"function"!=typeof a||(a=this.mv(a,n,r)),a):i?!1:""},ls:function(t,e,n,i,a){var o=this.options.delimiters;return this.options.delimiters=a,this.b(this.ct(r(t.call(e,i)),e,n)),this.options.delimiters=o,!1},ct:function(t,e,n){if(this.options.disableLambda)throw new Error("Lambda features disabled.");return this.c.compile(t,this.options).render(e,n)},b:function(t){this.buf+=t},fl:function(){var t=this.buf;return this.buf="",t},ms:function(t,e,n,r,i,a,o){var s,u=e[e.length-1],l=t.call(u);return"function"==typeof l?r?!0:(s=this.activeSub&&this.subsText&&this.subsText[this.activeSub]?this.subsText[this.activeSub]:this.text,this.ls(l,u,n,s.substring(i,a),o)):l},mv:function(t,e,n){var i=e[e.length-1],a=t.call(i);return"function"==typeof a?this.ct(r(a.call(i)),i,n):a},sub:function(t,e,n,r){var i=this.subs[t];i&&(this.activeSub=t,i(e,n,this,r),this.activeSub=!1)}};var a=/&/g,o=/</g,s=/>/g,u=/\'/g,l=/\"/g,c=/[&<>\"\']/,p=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}}("undefined"!=typeof n?n:r)},{}]},{},[1]);