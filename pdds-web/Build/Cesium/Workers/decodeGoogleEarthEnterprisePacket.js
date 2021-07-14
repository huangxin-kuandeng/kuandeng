/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
/**
  @license
  when.js - https://github.com/cujojs/when

  MIT License (c) copyright B Cavalier & J Hann

 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 */

!function(){define("Core/defined",[],function(){"use strict";function e(e){return void 0!==e&&null!==e}return e}),define("Core/DeveloperError",["./defined"],function(e){"use strict";function t(e){this.name="DeveloperError",this.message=e;var t;try{throw new Error}catch(e){t=e.stack}this.stack=t}return e(Object.create)&&(t.prototype=Object.create(Error.prototype),t.prototype.constructor=t),t.prototype.toString=function(){var t=this.name+": "+this.message;return e(this.stack)&&(t+="\n"+this.stack.toString()),t},t.throwInstantiationError=function(){throw new t("This function defines an interface and should not be called directly.")},t}),define("Core/Check",["./defined","./DeveloperError"],function(e,t){"use strict";function n(e){return e+" is required, actual value was undefined"}function r(e,t,n){return"Expected "+n+" to be typeof "+t+", actual typeof was "+e}var i={};return i.typeOf={},i.defined=function(r,i){if(!e(i))throw new t(n(r))},i.typeOf.func=function(e,n){if("function"!=typeof n)throw new t(r(typeof n,"function",e))},i.typeOf.string=function(e,n){if("string"!=typeof n)throw new t(r(typeof n,"string",e))},i.typeOf.number=function(e,n){if("number"!=typeof n)throw new t(r(typeof n,"number",e))},i.typeOf.number.lessThan=function(e,n,r){if(i.typeOf.number(e,n),n>=r)throw new t("Expected "+e+" to be less than "+r+", actual value was "+n)},i.typeOf.number.lessThanOrEquals=function(e,n,r){if(i.typeOf.number(e,n),n>r)throw new t("Expected "+e+" to be less than or equal to "+r+", actual value was "+n)},i.typeOf.number.greaterThan=function(e,n,r){if(i.typeOf.number(e,n),n<=r)throw new t("Expected "+e+" to be greater than "+r+", actual value was "+n)},i.typeOf.number.greaterThanOrEquals=function(e,n,r){if(i.typeOf.number(e,n),n<r)throw new t("Expected "+e+" to be greater than or equal to"+r+", actual value was "+n)},i.typeOf.object=function(e,n){if("object"!=typeof n)throw new t(r(typeof n,"object",e))},i.typeOf.bool=function(e,n){if("boolean"!=typeof n)throw new t(r(typeof n,"boolean",e))},i.typeOf.number.equals=function(e,n,r,o){if(i.typeOf.number(e,r),i.typeOf.number(n,o),r!==o)throw new t(e+" must be equal to "+n+", the actual values are "+r+" and "+o)},i}),define("Core/RuntimeError",["./defined"],function(e){"use strict";function t(e){this.name="RuntimeError",this.message=e;var t;try{throw new Error}catch(e){t=e.stack}this.stack=t}return e(Object.create)&&(t.prototype=Object.create(Error.prototype),t.prototype.constructor=t),t.prototype.toString=function(){var t=this.name+": "+this.message;return e(this.stack)&&(t+="\n"+this.stack.toString()),t},t}),define("Core/decodeGoogleEarthEnterpriseData",["./Check","./RuntimeError"],function(e,t){"use strict";function n(e,o){if(n.passThroughDataForTesting)return o;var a=e.byteLength;if(0===a||a%4!=0)throw new t("The length of key must be greater than 0 and a multiple of 4.");var s=new DataView(o),f=s.getUint32(0,!0);if(f===r||f===i)return o;for(var u,c=new DataView(e),l=0,h=o.byteLength,d=h-h%8,w=a,b=8;l<d;)for(b=(b+8)%24,u=b;l<d&&u<w;)s.setUint32(l,s.getUint32(l,!0)^c.getUint32(u,!0),!0),s.setUint32(l+4,s.getUint32(l+4,!0)^c.getUint32(u+4,!0),!0),l+=8,u+=24;if(l<h)for(u>=w&&(b=(b+8)%24,u=b);l<h;)s.setUint8(l,s.getUint8(l)^c.getUint8(u)),l++,u++}var r=1953029805,i=2917034100;return n.passThroughDataForTesting=!1,n}),define("Core/isBitSet",[],function(){"use strict";function e(e,t){return 0!=(e&t)}return e}),define("Core/GoogleEarthEnterpriseTileInformation",["./defined","./isBitSet"],function(e,t){"use strict";function n(e,t,n,r,i,o){this._bits=e,this.cnodeVersion=t,this.imageryVersion=n,this.terrainVersion=r,this.imageryProvider=i,this.terrainProvider=o,this.ancestorHasTerrain=!1,this.terrainState=void 0}var r=[1,2,4,8];return n.clone=function(t,r){return e(r)?(r._bits=t._bits,r.cnodeVersion=t.cnodeVersion,r.imageryVersion=t.imageryVersion,r.terrainVersion=t.terrainVersion,r.imageryProvider=t.imageryProvider,r.terrainProvider=t.terrainProvider):r=new n(t._bits,t.cnodeVersion,t.imageryVersion,t.terrainVersion,t.imageryProvider,t.terrainProvider),r.ancestorHasTerrain=t.ancestorHasTerrain,r.terrainState=t.terrainState,r},n.prototype.setParent=function(e){this.ancestorHasTerrain=e.ancestorHasTerrain||this.hasTerrain()},n.prototype.hasSubtree=function(){return t(this._bits,16)},n.prototype.hasImagery=function(){return t(this._bits,64)},n.prototype.hasTerrain=function(){return t(this._bits,128)},n.prototype.hasChildren=function(){return t(this._bits,15)},n.prototype.hasChild=function(e){return t(this._bits,r[e])},n.prototype.getChildBitmask=function(){return 15&this._bits},n}),function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define("ThirdParty/pako_inflate",[],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.pako=e()}}(function(){return function e(t,n,r){function i(a,s){if(!n[a]){if(!t[a]){var f="function"==typeof require&&require;if(!s&&f)return f(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[a]={exports:{}};t[a][0].call(c.exports,function(e){var n=t[a][1][e];return i(n||e)},c,c.exports,e,t,n,r)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(e,t,n){"use strict";var r="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;n.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}}return e},n.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,n,r,i){if(t.subarray&&e.subarray)return void e.set(t.subarray(n,n+r),i);for(var o=0;o<r;o++)e[i+o]=t[n+o]},flattenChunks:function(e){var t,n,r,i,o,a;for(r=0,t=0,n=e.length;t<n;t++)r+=e[t].length;for(a=new Uint8Array(r),i=0,t=0,n=e.length;t<n;t++)o=e[t],a.set(o,i),i+=o.length;return a}},o={arraySet:function(e,t,n,r,i){for(var o=0;o<r;o++)e[i+o]=t[n+o]},flattenChunks:function(e){return[].concat.apply([],e)}};n.setTyped=function(e){e?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,o))},n.setTyped(r)},{}],2:[function(e,t,n){"use strict";function r(e,t){if(t<65537&&(e.subarray&&a||!e.subarray&&o))return String.fromCharCode.apply(null,i.shrinkBuf(e,t));for(var n="",r=0;r<t;r++)n+=String.fromCharCode(e[r]);return n}var i=e("./common"),o=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch(e){o=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){a=!1}for(var s=new i.Buf8(256),f=0;f<256;f++)s[f]=f>=252?6:f>=248?5:f>=240?4:f>=224?3:f>=192?2:1;s[254]=s[254]=1,n.string2buf=function(e){var t,n,r,o,a,s=e.length,f=0;for(o=0;o<s;o++)n=e.charCodeAt(o),55296==(64512&n)&&o+1<s&&56320==(64512&(r=e.charCodeAt(o+1)))&&(n=65536+(n-55296<<10)+(r-56320),o++),f+=n<128?1:n<2048?2:n<65536?3:4;for(t=new i.Buf8(f),a=0,o=0;a<f;o++)n=e.charCodeAt(o),55296==(64512&n)&&o+1<s&&56320==(64512&(r=e.charCodeAt(o+1)))&&(n=65536+(n-55296<<10)+(r-56320),o++),n<128?t[a++]=n:n<2048?(t[a++]=192|n>>>6,t[a++]=128|63&n):n<65536?(t[a++]=224|n>>>12,t[a++]=128|n>>>6&63,t[a++]=128|63&n):(t[a++]=240|n>>>18,t[a++]=128|n>>>12&63,t[a++]=128|n>>>6&63,t[a++]=128|63&n);return t},n.buf2binstring=function(e){return r(e,e.length)},n.binstring2buf=function(e){for(var t=new i.Buf8(e.length),n=0,r=t.length;n<r;n++)t[n]=e.charCodeAt(n);return t},n.buf2string=function(e,t){var n,i,o,a,f=t||e.length,u=new Array(2*f);for(i=0,n=0;n<f;)if((o=e[n++])<128)u[i++]=o;else if((a=s[o])>4)u[i++]=65533,n+=a-1;else{for(o&=2===a?31:3===a?15:7;a>1&&n<f;)o=o<<6|63&e[n++],a--;a>1?u[i++]=65533:o<65536?u[i++]=o:(o-=65536,u[i++]=55296|o>>10&1023,u[i++]=56320|1023&o)}return r(u,i)},n.utf8border=function(e,t){var n;for(t=t||e.length,t>e.length&&(t=e.length),n=t-1;n>=0&&128==(192&e[n]);)n--;return n<0?t:0===n?t:n+s[e[n]]>t?n:t}},{"./common":1}],3:[function(e,t,n){"use strict";function r(e,t,n,r){for(var i=65535&e|0,o=e>>>16&65535|0,a=0;0!==n;){a=n>2e3?2e3:n,n-=a;do{i=i+t[r++]|0,o=o+i|0}while(--a);i%=65521,o%=65521}return i|o<<16|0}t.exports=r},{}],4:[function(e,t,n){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],5:[function(e,t,n){"use strict";function r(e,t,n,r){var o=i,a=r+n;e^=-1;for(var s=r;s<a;s++)e=e>>>8^o[255&(e^t[s])];return-1^e}var i=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=r},{}],6:[function(e,t,n){"use strict";function r(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}t.exports=r},{}],7:[function(e,t,n){"use strict";t.exports=function(e,t){var n,r,i,o,a,s,f,u,c,l,h,d,w,b,m,g,p,v,k,y,_,E,x,T,S;n=e.state,r=e.next_in,T=e.input,i=r+(e.avail_in-5),o=e.next_out,S=e.output,a=o-(t-e.avail_out),s=o+(e.avail_out-257),f=n.dmax,u=n.wsize,c=n.whave,l=n.wnext,h=n.window,d=n.hold,w=n.bits,b=n.lencode,m=n.distcode,g=(1<<n.lenbits)-1,p=(1<<n.distbits)-1;e:do{w<15&&(d+=T[r++]<<w,w+=8,d+=T[r++]<<w,w+=8),v=b[d&g];t:for(;;){if(k=v>>>24,d>>>=k,w-=k,0===(k=v>>>16&255))S[o++]=65535&v;else{if(!(16&k)){if(0==(64&k)){v=b[(65535&v)+(d&(1<<k)-1)];continue t}if(32&k){n.mode=12;break e}e.msg="invalid literal/length code",n.mode=30;break e}y=65535&v,k&=15,k&&(w<k&&(d+=T[r++]<<w,w+=8),y+=d&(1<<k)-1,d>>>=k,w-=k),w<15&&(d+=T[r++]<<w,w+=8,d+=T[r++]<<w,w+=8),v=m[d&p];n:for(;;){if(k=v>>>24,d>>>=k,w-=k,!(16&(k=v>>>16&255))){if(0==(64&k)){v=m[(65535&v)+(d&(1<<k)-1)];continue n}e.msg="invalid distance code",n.mode=30;break e}if(_=65535&v,k&=15,w<k&&(d+=T[r++]<<w,(w+=8)<k&&(d+=T[r++]<<w,w+=8)),(_+=d&(1<<k)-1)>f){e.msg="invalid distance too far back",n.mode=30;break e}if(d>>>=k,w-=k,k=o-a,_>k){if((k=_-k)>c&&n.sane){e.msg="invalid distance too far back",n.mode=30;break e}if(E=0,x=h,0===l){if(E+=u-k,k<y){y-=k;do{S[o++]=h[E++]}while(--k);E=o-_,x=S}}else if(l<k){if(E+=u+l-k,(k-=l)<y){y-=k;do{S[o++]=h[E++]}while(--k);if(E=0,l<y){k=l,y-=k;do{S[o++]=h[E++]}while(--k);E=o-_,x=S}}}else if(E+=l-k,k<y){y-=k;do{S[o++]=h[E++]}while(--k);E=o-_,x=S}for(;y>2;)S[o++]=x[E++],S[o++]=x[E++],S[o++]=x[E++],y-=3;y&&(S[o++]=x[E++],y>1&&(S[o++]=x[E++]))}else{E=o-_;do{S[o++]=S[E++],S[o++]=S[E++],S[o++]=S[E++],y-=3}while(y>2);y&&(S[o++]=S[E++],y>1&&(S[o++]=S[E++]))}break}}break}}while(r<i&&o<s);y=w>>3,r-=y,w-=y<<3,d&=(1<<w)-1,e.next_in=r,e.next_out=o,e.avail_in=r<i?i-r+5:5-(r-i),e.avail_out=o<s?s-o+257:257-(o-s),n.hold=d,n.bits=w}},{}],8:[function(e,t,n){"use strict";function r(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function i(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new p.Buf16(320),this.work=new p.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function o(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=z,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new p.Buf32(be),t.distcode=t.distdyn=new p.Buf32(me),t.sane=1,t.back=-1,A):U}function a(e){var t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,o(e)):U}function s(e,t){var n,r;return e&&e.state?(r=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?U:(null!==r.window&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,a(e))):U}function f(e,t){var n,r;return e?(r=new i,e.state=r,r.window=null,n=s(e,t),n!==A&&(e.state=null),n):U}function u(e){return f(e,ge)}function c(e){if(pe){var t;for(m=new p.Buf32(512),g=new p.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(_(x,e.lens,0,288,m,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;_(T,e.lens,0,32,g,0,e.work,{bits:5}),pe=!1}e.lencode=m,e.lenbits=9,e.distcode=g,e.distbits=5}function l(e,t,n,r){var i,o=e.state;return null===o.window&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new p.Buf8(o.wsize)),r>=o.wsize?(p.arraySet(o.window,t,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i=o.wsize-o.wnext,i>r&&(i=r),p.arraySet(o.window,t,n-r,i,o.wnext),r-=i,r?(p.arraySet(o.window,t,n-r,r,0),o.wnext=r,o.whave=o.wsize):(o.wnext+=i,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=i))),0}function h(e,t){var n,i,o,a,s,f,u,h,d,w,b,m,g,be,me,ge,pe,ve,ke,ye,_e,Ee,xe,Te,Se=0,Oe=new p.Buf8(4),Be=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;n=e.state,n.mode===G&&(n.mode=W),s=e.next_out,o=e.output,u=e.avail_out,a=e.next_in,i=e.input,f=e.avail_in,h=n.hold,d=n.bits,w=f,b=u,Ee=A;e:for(;;)switch(n.mode){case z:if(0===n.wrap){n.mode=W;break}for(;d<16;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(2&n.wrap&&35615===h){n.check=0,Oe[0]=255&h,Oe[1]=h>>>8&255,n.check=k(n.check,Oe,2,0),h=0,d=0,n.mode=j;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",n.mode=he;break}if((15&h)!==N){e.msg="unknown compression method",n.mode=he;break}if(h>>>=4,d-=4,_e=8+(15&h),0===n.wbits)n.wbits=_e;else if(_e>n.wbits){e.msg="invalid window size",n.mode=he;break}n.dmax=1<<_e,e.adler=n.check=1,n.mode=512&h?K:G,h=0,d=0;break;case j:for(;d<16;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(n.flags=h,(255&n.flags)!==N){e.msg="unknown compression method",n.mode=he;break}if(57344&n.flags){e.msg="unknown header flags set",n.mode=he;break}n.head&&(n.head.text=h>>8&1),512&n.flags&&(Oe[0]=255&h,Oe[1]=h>>>8&255,n.check=k(n.check,Oe,2,0)),h=0,d=0,n.mode=P;case P:for(;d<32;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.head&&(n.head.time=h),512&n.flags&&(Oe[0]=255&h,Oe[1]=h>>>8&255,Oe[2]=h>>>16&255,Oe[3]=h>>>24&255,n.check=k(n.check,Oe,4,0)),h=0,d=0,n.mode=F;case F:for(;d<16;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.head&&(n.head.xflags=255&h,n.head.os=h>>8),512&n.flags&&(Oe[0]=255&h,Oe[1]=h>>>8&255,n.check=k(n.check,Oe,2,0)),h=0,d=0,n.mode=M;case M:if(1024&n.flags){for(;d<16;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.length=h,n.head&&(n.head.extra_len=h),512&n.flags&&(Oe[0]=255&h,Oe[1]=h>>>8&255,n.check=k(n.check,Oe,2,0)),h=0,d=0}else n.head&&(n.head.extra=null);n.mode=L;case L:if(1024&n.flags&&(m=n.length,m>f&&(m=f),m&&(n.head&&(_e=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Array(n.head.extra_len)),p.arraySet(n.head.extra,i,a,m,_e)),512&n.flags&&(n.check=k(n.check,i,m,a)),f-=m,a+=m,n.length-=m),n.length))break e;n.length=0,n.mode=H;case H:if(2048&n.flags){if(0===f)break e;m=0;do{_e=i[a+m++],n.head&&_e&&n.length<65536&&(n.head.name+=String.fromCharCode(_e))}while(_e&&m<f);if(512&n.flags&&(n.check=k(n.check,i,m,a)),f-=m,a+=m,_e)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=V;case V:if(4096&n.flags){if(0===f)break e;m=0;do{_e=i[a+m++],n.head&&_e&&n.length<65536&&(n.head.comment+=String.fromCharCode(_e))}while(_e&&m<f);if(512&n.flags&&(n.check=k(n.check,i,m,a)),f-=m,a+=m,_e)break e}else n.head&&(n.head.comment=null);n.mode=q;case q:if(512&n.flags){for(;d<16;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(h!==(65535&n.check)){e.msg="header crc mismatch",n.mode=he;break}h=0,d=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=G;break;case K:for(;d<32;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}e.adler=n.check=r(h),h=0,d=0,n.mode=Y;case Y:if(0===n.havedict)return e.next_out=s,e.avail_out=u,e.next_in=a,e.avail_in=f,n.hold=h,n.bits=d,R;e.adler=n.check=1,n.mode=G;case G:if(t===O||t===B)break e;case W:if(n.last){h>>>=7&d,d-=7&d,n.mode=ue;break}for(;d<3;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}switch(n.last=1&h,h>>>=1,d-=1,3&h){case 0:n.mode=J;break;case 1:if(c(n),n.mode=ne,t===B){h>>>=2,d-=2;break e}break;case 2:n.mode=$;break;case 3:e.msg="invalid block type",n.mode=he}h>>>=2,d-=2;break;case J:for(h>>>=7&d,d-=7&d;d<32;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){e.msg="invalid stored block lengths",n.mode=he;break}if(n.length=65535&h,h=0,d=0,n.mode=Q,t===B)break e;case Q:n.mode=X;case X:if(m=n.length){if(m>f&&(m=f),m>u&&(m=u),0===m)break e;p.arraySet(o,i,a,m,s),f-=m,a+=m,u-=m,s+=m,n.length-=m;break}n.mode=G;break;case $:for(;d<14;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(n.nlen=257+(31&h),h>>>=5,d-=5,n.ndist=1+(31&h),h>>>=5,d-=5,n.ncode=4+(15&h),h>>>=4,d-=4,n.nlen>286||n.ndist>30){e.msg="too many length or distance symbols",n.mode=he;break}n.have=0,n.mode=ee;case ee:for(;n.have<n.ncode;){for(;d<3;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.lens[Be[n.have++]]=7&h,h>>>=3,d-=3}for(;n.have<19;)n.lens[Be[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,xe={bits:n.lenbits},Ee=_(E,n.lens,0,19,n.lencode,0,n.work,xe),n.lenbits=xe.bits,Ee){e.msg="invalid code lengths set",n.mode=he;break}n.have=0,n.mode=te;case te:for(;n.have<n.nlen+n.ndist;){for(;Se=n.lencode[h&(1<<n.lenbits)-1],me=Se>>>24,ge=Se>>>16&255,pe=65535&Se,!(me<=d);){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(pe<16)h>>>=me,d-=me,n.lens[n.have++]=pe;else{if(16===pe){for(Te=me+2;d<Te;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(h>>>=me,d-=me,0===n.have){e.msg="invalid bit length repeat",n.mode=he;break}_e=n.lens[n.have-1],m=3+(3&h),h>>>=2,d-=2}else if(17===pe){for(Te=me+3;d<Te;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}h>>>=me,d-=me,_e=0,m=3+(7&h),h>>>=3,d-=3}else{for(Te=me+7;d<Te;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}h>>>=me,d-=me,_e=0,m=11+(127&h),h>>>=7,d-=7}if(n.have+m>n.nlen+n.ndist){e.msg="invalid bit length repeat",n.mode=he;break}for(;m--;)n.lens[n.have++]=_e}}if(n.mode===he)break;if(0===n.lens[256]){e.msg="invalid code -- missing end-of-block",n.mode=he;break}if(n.lenbits=9,xe={bits:n.lenbits},Ee=_(x,n.lens,0,n.nlen,n.lencode,0,n.work,xe),n.lenbits=xe.bits,Ee){e.msg="invalid literal/lengths set",n.mode=he;break}if(n.distbits=6,n.distcode=n.distdyn,xe={bits:n.distbits},Ee=_(T,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,xe),n.distbits=xe.bits,Ee){e.msg="invalid distances set",n.mode=he;break}if(n.mode=ne,t===B)break e;case ne:n.mode=re;case re:if(f>=6&&u>=258){e.next_out=s,e.avail_out=u,e.next_in=a,e.avail_in=f,n.hold=h,n.bits=d,y(e,b),s=e.next_out,o=e.output,u=e.avail_out,a=e.next_in,i=e.input,f=e.avail_in,h=n.hold,d=n.bits,n.mode===G&&(n.back=-1);break}for(n.back=0;Se=n.lencode[h&(1<<n.lenbits)-1],me=Se>>>24,ge=Se>>>16&255,pe=65535&Se,!(me<=d);){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(ge&&0==(240&ge)){for(ve=me,ke=ge,ye=pe;Se=n.lencode[ye+((h&(1<<ve+ke)-1)>>ve)],me=Se>>>24,ge=Se>>>16&255,pe=65535&Se,!(ve+me<=d);){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}h>>>=ve,d-=ve,n.back+=ve}if(h>>>=me,d-=me,n.back+=me,n.length=pe,0===ge){n.mode=fe;break}if(32&ge){n.back=-1,n.mode=G;break}if(64&ge){e.msg="invalid literal/length code",n.mode=he;break}n.extra=15&ge,n.mode=ie;case ie:if(n.extra){for(Te=n.extra;d<Te;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.length+=h&(1<<n.extra)-1,h>>>=n.extra,d-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=oe;case oe:for(;Se=n.distcode[h&(1<<n.distbits)-1],me=Se>>>24,ge=Se>>>16&255,pe=65535&Se,!(me<=d);){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(0==(240&ge)){for(ve=me,ke=ge,ye=pe;Se=n.distcode[ye+((h&(1<<ve+ke)-1)>>ve)],me=Se>>>24,ge=Se>>>16&255,pe=65535&Se,!(ve+me<=d);){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}h>>>=ve,d-=ve,n.back+=ve}if(h>>>=me,d-=me,n.back+=me,64&ge){e.msg="invalid distance code",n.mode=he;break}n.offset=pe,n.extra=15&ge,n.mode=ae;case ae:if(n.extra){for(Te=n.extra;d<Te;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}n.offset+=h&(1<<n.extra)-1,h>>>=n.extra,d-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg="invalid distance too far back",n.mode=he;break}n.mode=se;case se:if(0===u)break e;if(m=b-u,n.offset>m){if((m=n.offset-m)>n.whave&&n.sane){e.msg="invalid distance too far back",n.mode=he;break}m>n.wnext?(m-=n.wnext,g=n.wsize-m):g=n.wnext-m,m>n.length&&(m=n.length),be=n.window}else be=o,g=s-n.offset,m=n.length;m>u&&(m=u),u-=m,n.length-=m;do{o[s++]=be[g++]}while(--m);0===n.length&&(n.mode=re);break;case fe:if(0===u)break e;o[s++]=n.length,u--,n.mode=re;break;case ue:if(n.wrap){for(;d<32;){if(0===f)break e;f--,h|=i[a++]<<d,d+=8}if(b-=u,e.total_out+=b,n.total+=b,b&&(e.adler=n.check=n.flags?k(n.check,o,b,s-b):v(n.check,o,b,s-b)),b=u,(n.flags?h:r(h))!==n.check){e.msg="incorrect data check",n.mode=he;break}h=0,d=0}n.mode=ce;case ce:if(n.wrap&&n.flags){for(;d<32;){if(0===f)break e;f--,h+=i[a++]<<d,d+=8}if(h!==(4294967295&n.total)){e.msg="incorrect length check",n.mode=he;break}h=0,d=0}n.mode=le;case le:Ee=C;break e;case he:Ee=I;break e;case de:return Z;case we:default:return U}return e.next_out=s,e.avail_out=u,e.next_in=a,e.avail_in=f,n.hold=h,n.bits=d,(n.wsize||b!==e.avail_out&&n.mode<he&&(n.mode<ue||t!==S))&&l(e,e.output,e.next_out,b-e.avail_out)?(n.mode=de,Z):(w-=e.avail_in,b-=e.avail_out,e.total_in+=w,e.total_out+=b,n.total+=b,n.wrap&&b&&(e.adler=n.check=n.flags?k(n.check,o,b,e.next_out-b):v(n.check,o,b,e.next_out-b)),e.data_type=n.bits+(n.last?64:0)+(n.mode===G?128:0)+(n.mode===ne||n.mode===Q?256:0),(0===w&&0===b||t===S)&&Ee===A&&(Ee=D),Ee)}function d(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,A}function w(e,t){var n;return e&&e.state?(n=e.state,0==(2&n.wrap)?U:(n.head=t,t.done=!1,A)):U}function b(e,t){var n,r,i=t.length;return e&&e.state?(n=e.state,0!==n.wrap&&n.mode!==Y?U:n.mode===Y&&(r=1,(r=v(r,t,i,0))!==n.check)?I:l(e,t,i,i)?(n.mode=de,Z):(n.havedict=1,A)):U}var m,g,p=e("../utils/common"),v=e("./adler32"),k=e("./crc32"),y=e("./inffast"),_=e("./inftrees"),E=0,x=1,T=2,S=4,O=5,B=6,A=0,C=1,R=2,U=-2,I=-3,Z=-4,D=-5,N=8,z=1,j=2,P=3,F=4,M=5,L=6,H=7,V=8,q=9,K=10,Y=11,G=12,W=13,J=14,Q=15,X=16,$=17,ee=18,te=19,ne=20,re=21,ie=22,oe=23,ae=24,se=25,fe=26,ue=27,ce=28,le=29,he=30,de=31,we=32,be=852,me=592,ge=15,pe=!0;n.inflateReset=a,n.inflateReset2=s,n.inflateResetKeep=o,n.inflateInit=u,n.inflateInit2=f,n.inflate=h,n.inflateEnd=d,n.inflateGetHeader=w,n.inflateSetDictionary=b,n.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,n){"use strict";var r=e("../utils/common"),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],o=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],a=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],s=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,n,f,u,c,l,h){var d,w,b,m,g,p,v,k,y,_=h.bits,E=0,x=0,T=0,S=0,O=0,B=0,A=0,C=0,R=0,U=0,I=null,Z=0,D=new r.Buf16(16),N=new r.Buf16(16),z=null,j=0;for(E=0;E<=15;E++)D[E]=0;for(x=0;x<f;x++)D[t[n+x]]++;for(O=_,S=15;S>=1&&0===D[S];S--);if(O>S&&(O=S),0===S)return u[c++]=20971520,u[c++]=20971520,h.bits=1,0;for(T=1;T<S&&0===D[T];T++);for(O<T&&(O=T),C=1,E=1;E<=15;E++)if(C<<=1,(C-=D[E])<0)return-1;if(C>0&&(0===e||1!==S))return-1;for(N[1]=0,E=1;E<15;E++)N[E+1]=N[E]+D[E];for(x=0;x<f;x++)0!==t[n+x]&&(l[N[t[n+x]]++]=x);if(0===e?(I=z=l,p=19):1===e?(I=i,Z-=257,z=o,j-=257,p=256):(I=a,z=s,p=-1),U=0,x=0,E=T,g=c,B=O,A=0,b=-1,R=1<<O,m=R-1,1===e&&R>852||2===e&&R>592)return 1;for(;;){v=E-A,l[x]<p?(k=0,y=l[x]):l[x]>p?(k=z[j+l[x]],y=I[Z+l[x]]):(k=96,y=0),d=1<<E-A,w=1<<B,T=w;do{w-=d,u[g+(U>>A)+w]=v<<24|k<<16|y|0}while(0!==w);for(d=1<<E-1;U&d;)d>>=1;if(0!==d?(U&=d-1,U+=d):U=0,x++,0==--D[E]){if(E===S)break;E=t[n+l[x]]}if(E>O&&(U&m)!==b){for(0===A&&(A=O),g+=T,B=E-A,C=1<<B;B+A<S&&!((C-=D[B+A])<=0);)B++,C<<=1;if(R+=1<<B,1===e&&R>852||2===e&&R>592)return 1;b=U&m,u[b]=O<<24|B<<16|g-c|0}}return 0!==U&&(u[g+U]=E-A<<24|64<<16|0),h.bits=O,0}},{"../utils/common":1}],10:[function(e,t,n){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],11:[function(e,t,n){"use strict";function r(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=r},{}],"/lib/inflate.js":[function(e,t,n){"use strict";function r(e){if(!(this instanceof r))return new r(e);this.options=s.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var n=a.inflateInit2(this.strm,t.windowBits);if(n!==u.Z_OK)throw new Error(c[n]);this.header=new h,a.inflateGetHeader(this.strm,this.header)}function i(e,t){var n=new r(t);if(n.push(e,!0),n.err)throw n.msg||c[n.err];return n.result}function o(e,t){return t=t||{},t.raw=!0,i(e,t)}var a=e("./zlib/inflate"),s=e("./utils/common"),f=e("./utils/strings"),u=e("./zlib/constants"),c=e("./zlib/messages"),l=e("./zlib/zstream"),h=e("./zlib/gzheader"),d=Object.prototype.toString;r.prototype.push=function(e,t){var n,r,i,o,c,l,h=this.strm,w=this.options.chunkSize,b=this.options.dictionary,m=!1;if(this.ended)return!1;r=t===~~t?t:!0===t?u.Z_FINISH:u.Z_NO_FLUSH,"string"==typeof e?h.input=f.binstring2buf(e):"[object ArrayBuffer]"===d.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new s.Buf8(w),h.next_out=0,h.avail_out=w),n=a.inflate(h,u.Z_NO_FLUSH),n===u.Z_NEED_DICT&&b&&(l="string"==typeof b?f.string2buf(b):"[object ArrayBuffer]"===d.call(b)?new Uint8Array(b):b,n=a.inflateSetDictionary(this.strm,l)),n===u.Z_BUF_ERROR&&!0===m&&(n=u.Z_OK,m=!1),n!==u.Z_STREAM_END&&n!==u.Z_OK)return this.onEnd(n),this.ended=!0,!1;h.next_out&&(0!==h.avail_out&&n!==u.Z_STREAM_END&&(0!==h.avail_in||r!==u.Z_FINISH&&r!==u.Z_SYNC_FLUSH)||("string"===this.options.to?(i=f.utf8border(h.output,h.next_out),o=h.next_out-i,c=f.buf2string(h.output,i),h.next_out=o,h.avail_out=w-o,o&&s.arraySet(h.output,h.output,i,o,0),this.onData(c)):this.onData(s.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(m=!0)}while((h.avail_in>0||0===h.avail_out)&&n!==u.Z_STREAM_END);return n===u.Z_STREAM_END&&(r=u.Z_FINISH),r===u.Z_FINISH?(n=a.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===u.Z_OK):r!==u.Z_SYNC_FLUSH||(this.onEnd(u.Z_OK),h.avail_out=0,!0)},r.prototype.onData=function(e){this.chunks.push(e)},r.prototype.onEnd=function(e){e===u.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Inflate=r,n.inflate=i,n.inflateRaw=o,n.ungzip=i},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")}),define("Core/freezeObject",["./defined"],function(e){"use strict";var t=Object.freeze;return e(t)||(t=function(e){return e}),t}),define("Core/defaultValue",["./freezeObject"],function(e){"use strict";function t(e,t){return void 0!==e&&null!==e?e:t}return t.EMPTY_OBJECT=e({}),t}),define("Core/formatError",["./defined"],function(e){"use strict";function t(t){var n,r=t.name,i=t.message;n=e(r)&&e(i)?r+": "+i:t.toString();var o=t.stack;return e(o)&&(n+="\n"+o),n}return t}),function(e){"use strict";e("ThirdParty/when",[],function(){function e(e,n,r,i){return t(e).then(n,r,i)}function t(e){var t,n;return e instanceof r?t=e:s(e)?(n=a(),e.then(function(e){n.resolve(e)},function(e){n.reject(e)},function(e){n.progress(e)}),t=n.promise):t=i(e),t}function n(t){return e(t,o)}function r(e){this.then=e}function i(e){return new r(function(n){try{return t(n?n(e):e)}catch(e){return o(e)}})}function o(e){return new r(function(n,r){try{return r?t(r(e)):o(e)}catch(e){return o(e)}})}function a(){function e(e,t,n){return h(e,t,n)}function n(e){return w(e)}function i(e){return w(o(e))}function s(e){return d(e)}var f,u,c,l,h,d,w;return u=new r(e),f={then:e,resolve:n,reject:i,progress:s,promise:u,resolver:{resolve:n,reject:i,progress:s}},c=[],l=[],h=function(e,t,n){var r,i;return r=a(),i="function"==typeof n?function(e){try{r.progress(n(e))}catch(e){r.progress(e)}}:function(e){r.progress(e)},c.push(function(n){n.then(e,t).then(r.resolve,r.reject,i)}),l.push(i),r.promise},d=function(e){return b(l,e),e},w=function(e){return e=t(e),h=e.then,w=t,d=g,b(c,e),l=c=y,e},f}function s(e){return e&&"function"==typeof e.then}function f(t,n,r,i,o){return m(2,arguments),e(t,function(t){function s(e){b(e)}function f(e){w(e)}var u,c,l,h,d,w,b,m,p,v;if(p=t.length>>>0,u=Math.max(0,Math.min(n,p)),l=[],c=p-u+1,h=[],d=a(),u)for(m=d.progress,b=function(e){h.push(e),--c||(w=b=g,d.reject(h))},w=function(e){l.push(e),--u||(w=b=g,d.resolve(l))},v=0;v<p;++v)v in t&&e(t[v],f,s,m);else d.resolve(l);return d.then(r,i,o)})}function u(e,t,n,r){function i(e){return t?t(e[0]):e[0]}return f(e,1,i,n,r)}function c(e,t,n,r){return m(1,arguments),h(e,p).then(t,n,r)}function l(){return h(arguments,p)}function h(t,n){return e(t,function(t){var r,i,o,s,f,u;if(o=i=t.length>>>0,r=[],u=a(),o)for(s=function(t,i){e(t,n).then(function(e){r[i]=e,--o||u.resolve(r)},u.reject)},f=0;f<i;f++)f in t?s(t[f],f):--o;else u.resolve(r);return u.promise})}function d(t,n){var r=k.call(arguments,1);return e(t,function(t){var i;return i=t.length,r[0]=function(t,r,o){return e(t,function(t){return e(r,function(e){return n(t,e,o,i)})})},v.apply(t,r)})}function w(t,n,r){var i=arguments.length>2;return e(t,function(e){return e=i?r:e,n.resolve(e),e},function(e){return n.reject(e),o(e)},n.progress)}function b(e,t){for(var n,r=0;n=e[r++];)n(t)}function m(e,t){for(var n,r=t.length;r>e;)if(null!=(n=t[--r])&&"function"!=typeof n)throw new Error("arg "+r+" must be a function")}function g(){}function p(e){return e}var v,k,y;return e.defer=a,e.resolve=t,e.reject=n,e.join=l,e.all=c,e.map=h,e.reduce=d,e.any=u,e.some=f,e.chain=w,e.isPromise=s,r.prototype={always:function(e,t){return this.then(e,e,t)},otherwise:function(e){return this.then(y,e)},yield:function(e){return this.then(function(){return e})},spread:function(e){return this.then(function(t){return c(t,function(t){return e.apply(y,t)})})}},k=[].slice,v=[].reduce||function(e){var t,n,r,i,o;if(o=0,t=Object(this),i=t.length>>>0,n=arguments,n.length<=1)for(;;){if(o in t){r=t[o++];break}if(++o>=i)throw new TypeError}else r=n[1];for(;o<i;++o)o in t&&(r=e(r,t[o],o,t));return r},e})}("function"==typeof define&&define.amd?define:function(e){"object"==typeof exports?module.exports=e():this.when=e()}),define("Workers/createTaskProcessorWorker",["../Core/defaultValue","../Core/defined","../Core/formatError","../ThirdParty/when"],function(e,t,n,r){"use strict";function i(e,t,n){try{return e(t,n)}catch(e){return r.reject(e)}}function o(o){var a;return function(s){var f=s.data,u=[],c={id:f.id,result:void 0,error:void 0};return r(i(o,f.parameters,u)).then(function(e){c.result=e}).otherwise(function(e){e instanceof Error?c.error={name:e.name,message:e.message,stack:e.stack}:c.error=e}).always(function(){t(a)||(a=e(self.webkitPostMessage,self.postMessage)),f.canTransferArrayBuffer||(u.length=0);try{a(c,u)
}catch(e){c.result=void 0,c.error="postMessage failed with error: "+n(e)+"\n  with responseMessage: "+JSON.stringify(c),a(c)}})}}return o}),define("Workers/decodeGoogleEarthEnterprisePacket",["../Core/decodeGoogleEarthEnterpriseData","../Core/GoogleEarthEnterpriseTileInformation","../Core/RuntimeError","../ThirdParty/pako_inflate","./createTaskProcessorWorker"],function(e,t,n,r,i){"use strict";function o(t,n){var r=h.fromString(t.type),i=t.buffer;e(t.key,i);var o=f(i);i=o.buffer;var u=o.length;switch(r){case h.METADATA:return a(i,u,t.quadKey);case h.TERRAIN:return s(i,u,n);case h.DBROOT:return n.push(i),{buffer:i}}}function a(e,r,i){function o(e,t,n){var r=!1;if(4===n){if(t.hasSubtree())return;r=!0}for(var i=0;i<4;++i){var a=e+i.toString();if(r)B[a]=null;else if(n<4)if(t.hasChild(i)){if(A===b)return void console.log("Incorrect number of instances");var s=k[A++];B[a]=s,o(a,s,n+1)}else B[a]=null}}var a=new DataView(e),s=0,f=a.getUint32(s,!0);if(s+=l,f!==d)throw new n("Invalid magic");var h=a.getUint32(s,!0);if(s+=l,1!==h)throw new n("Invalid data type. Must be 1 for QuadTreePacket");var w=a.getUint32(s,!0);if(s+=l,2!==w)throw new n("Invalid QuadTreePacket version. Only version 2 is supported.");var b=a.getInt32(s,!0);s+=c;var m=a.getInt32(s,!0);if(s+=c,32!==m)throw new n("Invalid instance size.");var g=a.getInt32(s,!0);s+=c;var p=a.getInt32(s,!0);s+=c;var v=a.getInt32(s,!0);if(s+=c,g!==b*m+s)throw new n("Invalid dataBufferOffset");if(g+p+v!==r)throw new n("Invalid packet offsets");for(var k=[],y=0;y<b;++y){var _=a.getUint8(s);++s,++s;var E=a.getUint16(s,!0);s+=u;var x=a.getUint16(s,!0);s+=u;var T=a.getUint16(s,!0);s+=u,s+=u,s+=u,s+=c,s+=c,s+=8;var S=a.getUint8(s++),O=a.getUint8(s++);s+=u,k.push(new t(_,E,x,T,S,O))}var B=[],A=0,C=0,R=k[A++];return""===i?++C:B[i]=R,o(i,R,C),B}function s(e,t,n){for(var r=new DataView(e),i=0,o=[];i<t;){for(var a=i,s=0;s<4;++s){var f=r.getUint32(i,!0);i+=l,i+=f}var u=e.slice(a,i);n.push(u),o.push(u)}return o}function f(e){var t=new DataView(e),i=0,o=t.getUint32(i,!0);if(i+=l,o!==w&&o!==b)throw new n("Invalid magic");var a=t.getUint32(i,o===w);i+=l;var s=new Uint8Array(e,i),f=r.inflate(s);if(f.length!==a)throw new n("Size of packet doesn't match header");return f}var u=Uint16Array.BYTES_PER_ELEMENT,c=Int32Array.BYTES_PER_ELEMENT,l=Uint32Array.BYTES_PER_ELEMENT,h={METADATA:0,TERRAIN:1,DBROOT:2};h.fromString=function(e){return"Metadata"===e?h.METADATA:"Terrain"===e?h.TERRAIN:"DbRoot"===e?h.DBROOT:void 0};var d=32301,w=1953029805,b=2917034100;return i(o)})}();