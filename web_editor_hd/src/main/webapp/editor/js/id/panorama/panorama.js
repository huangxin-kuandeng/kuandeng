/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
window.location.hash1 = '';//===========避免冲突===========
window.__qq_pano_options = {};
define("application/Config", [],
function() {
    var d = {
        defaultFovY: 100,
        tileDomain: "http://sv${x}.map.qq.com/tile",
        thumbDomain: "http://sv1.map.qq.com/thumb",
        xmlDomain: "http://sv.map.qq.com",
        test_tileDomain: "http://test.sv${x}.map.qq.com/tile",
        test_thumbDomain: "http://test.sv1.map.qq.com/thumb",
        test_xmlDomain: "http://test.sv.map.qq.com",
        admin_tileDomain: "http://admin.sv${x}.map.qq.com/tile",
        admin_thumbDomain: "http://admin.sv1.map.qq.com/thumb",
        admin_xmlDomain: "http://admin.sv.map.qq.com",
        blank: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7",
        streetTileDomain: "http://sv0.map.qq.com/road/",
        placeSearch: "http://apis.map.qq.com",
        placeSearchKey: "HGWBZ-A6SRV-TWHPL-UG2TZ-WSB2S-ZRFTQ",
        CDNPath: "http://s.map.qq.com/kepler/",
        uvStatUidKey: "QQMapKeplerUid4UV",
        poidetailPage: "http://mp.weixin.qq.com/mp/lifedetail?bid\x3ddianping_{dpId}#wechat_redirect",
        poidetailList: "http://a.map.gtimg.com",
        statAPPName: "h5streetview"
    };
    if (window.__keplerDevConfig) for (var c in __keplerDevConfig) d[c] = __keplerDevConfig[c];
    d.getImgUrl = function(c) {
        return d.CDNPath + c
    };
    d.getResPath = function(c) {
        return d.CDNPath + c
    };
    return d
});
define("common/TimeShaft", [],
function() {
    var d = "0",
    c = {},
    b = 60,
    a = 0,
    f = null,
    h = {
        init: function() {
            f = window.setInterval(function() {
                h.run((new Date).getTime())
            },
            1E3 / b)
        },
        run: function(e) {
            var k, g;
            for (g in c) k = c[g],
            !0 === k.handler(e - k.startTime) && h.remove(g);
            0 == a && (clearInterval(f), f = null)
        },
        add: function(e, h, g) {
            1 == arguments.length && (h = e, e = void 0);
            e = e || "R_" + (new Date).getTime().toString(32) + ++d;
            0 == a && null === f && this.init();
            c[e] || a++;
            c[e] = {
                startTime: (new Date).getTime(),
                handler: h
            };
            return e
        },
        remove: function(e) {
            c[e] && (delete c[e], a--)
        },
        getFPS: function() {
            return Math.min(avageFps, b)
        },
        setMaxFPS: function(a) {
            b = a
        }
    };
    return h
});
define("crystal/geom/Vector3D", [],
function() {
    function d(c, b, a, f) {
        this.x = c || 0;
        this.y = b || 0;
        this.z = a || 0;
        this.w = f || 0
    }
    d.prototype.clone = function() {
        return new d(this.x, this.y, this.z)
    };
    d.prototype.equals = function(c) {
        return 0.0010 <= Math.abs(this.x - c.x) && 0.0010 <= Math.abs(this.y - c.y) && 0.0010 <= Math.abs(this.z - c.z)
    };
    d.prototype.add = function(c) {
        return new d(this.x + c.x, this.y + c.y, this.z + c.z, 0)
    };
    d.prototype.subtract = function(c) {
        return new d(this.x - c.x, this.y - c.y, this.z - c.z, 0)
    };
    d.prototype.dotProduct = function(c) {
        return this.x * c.x + this.y * c.y + this.z * c.z
    };
    d.prototype.crossProduct = function(c) {
        var b = new d;
        b.x = this.y * c.z - this.z * c.y;
        b.y = this.z * c.x - this.x * c.z;
        b.z = this.x * c.y - this.y * c.x;
        b.w = 1;
        return b
    };
    d.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    };
    d.prototype.incrementBy = function(c) {
        this.x += c.x;
        this.y += c.y;
        this.z += c.z
    };
    d.prototype.project = function() {
        0 != this.w && (this.x /= this.w, this.y /= this.w, this.z /= this.w, this.w = 1)
    };
    d.prototype.normalize = function() {
        var c = this.length();
        0 != c && (this.x /= c, this.y /= c, this.z /= c)
    };
    d.prototype.scaleBy = function(c) {
        this.x *= c;
        this.y *= c;
        this.z *= c
    };
    d.prototype.toString = function() {
        return [this.x, this.y, this.z, this.w].join()
    };
    d.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z
    };
    d.distance = function(c, b) {};
    d.angleBetween = function(c, b) {};
    return d
});
define("common/Geom", [],
function() {
    function d(a, e, c) {
        var f = (a + e + c) / 2;
        return Math.sqrt(Math.abs(f * (f - a) * (f - e) * (f - c)))
    }
    function c(a, e) {
        return Math.sqrt(Math.pow(a.x - e.x, 2) + Math.pow(a.y - e.y, 2) + Math.pow(a.z - e.z, 2))
    }
    function b(a, e) {
        return a.x * e.x + a.y * e.y + a.z * e.z
    }
    function a(a, e, f, g) {
        var b = c(a, e),
        n = c(a, f),
        l = c(a, g);
        a = c(e, f);
        f = c(f, g);
        g = c(g, e);
        e = d(b, n, a);
        n = d(n, l, f);
        b = d(l, g, b);
        a = d(a, f, g);
        return 0.02 > Math.abs(e + n + b - a)
    }
    function f(a, e, c, f) {
        c = (b(f, c) - b(f, a)) / b(f, e);
        return 0 <= c ? {
            x: a.x + c * e.x,
            y: a.y + c * e.y,
            z: a.z + c * e.z
        }: null
    }
    return {
        areaOfTriangle: d,
        pointInTriangle: a,
        intersectPlane: f,
        intersectTriangle: function(c, e, b, g, d) {
            var n = g.x - b.x,
            l = g.y - b.y,
            m = g.z - b.z,
            v = d.x - b.x,
            u = d.y - b.y,
            s = d.z - b.z;
            return (c = f(c, e, b, {
                x: l * s - m * u,
                y: -(n * s - m * v),
                z: n * u - l * v
            })) && a(c, b, g, d) ? c: null
        }
    }
});
define("application/urlManager", [],
function() {
    function d(a) {
        var e = [],
        c;
        for (c in a) e.push(c + "\x3d" + encodeURIComponent(a[c]));
        return e.join("\x26")
    }
    function c(a) {
        if ("" === a.trim()) return {};
        a = a.split("\x26");
        for (var e = {},
        c = 0,
        f = a.length; c < f; c++) {
            var b = a[c].split("\x3d");
            e[b[0]] = decodeURIComponent(b[1] || "")
        }
        return e
    }
    var b = c(location.search && location.search.substr(1)),
    a = location.hash1,
    f = a.indexOf("?"); - 1 < f && (a = a.substring(0, f));
    a = c(a && a.substr(1));
    return {
        encodeParams: d,
        decodeParams: c,
        hash: a,
        query: b,
        updateHash: function() {
            location.replace("#" + d(a))
        },
        updateQuery: function(c) {
            c ? location.search = d(b) : history.pushState("", "", "?" + d(b) + "#" + d(a))
        },
        cloneHash: function() {
            var c = {},
            e;
            for (e in a) c[e] = a[e];
            return c
        }
    }
});
define("crystal/geom/Point", [],
function() {
    function d(c, b) {
        if (this instanceof d) 2 == arguments.length ? (this.x = c, this.y = b) : this.y = this.x = 0;
        else return new d(c, b)
    }
    d.prototype.add = function(c) {
        return new d(this.x + c.x, this.y + c.y)
    };
    d.prototype.subtract = function(c) {
        return new d(this.x - c.x, this.y - c.y)
    };
    d.prototype.dotProduct = function(c) {
        return this.x * c.x + this.y * c.y
    };
    d.prototype.crossProduct = function(c) {
        return this.x * c.y - this.y * c.x
    };
    d.prototype.length = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    };
    d.prototype.equals = function(c) {
        return this.x == c.x && this.y == c.y
    };
    d.prototype.clone = function() {
        return new d(this.x, this.y)
    };
    d.prototype.normalize = function(c) {
        var b = this.length();
        c ? (this.x *= c, this.y *= c) : b && (this.x /= b, this.y /= b)
    };
    d.prototype.offset = function(c, b) {
        this.x += c;
        this.y += b
    };
    d.prototype.toString = function() {
        return [this.x, this.y].join()
    };
    d.polar = function(c, b) {
        return new d(c * Math.cos(b), c * Math.sin(b))
    };
    d.distance = function(c, b) {
        return b.subtract(c).length()
    };
    d.interpolate = function(c, b, a) {
        if (0 == a) return b;
        if (1 == a) return c;
        c = c.subtract(b);
        c.normalize(a);
        return c.add(b)
    };
    d.toString = function() {
        return "(" + this.x + "," + this.y + ")"
    };
    return d
});
define("common/Platform", [],
function() {
    var d = window.navigator.userAgent,
    c = {
        android: /android\s(\d+\.\d)/i.test(d) ? +RegExp.$1: 0,
        ios: /iPad|iPod|iPhone/i.test(d),
        iphone: /iPhone\sOS\s(\d[_\d]*)/i.test(d) ? +parseFloat(RegExp.$1.replace(/_/g, ".")) : 0,
        ipad: /iPad.*OS\s(\d[_\d]*)/i.test(d) ? +parseFloat(RegExp.$1.replace(/_/g, ".")) : 0,
        ipod: /iPod\sOS\s(\d[_\d]*)/i.test(d) ? +parseFloat(RegExp.$1.replace(/_/g, ".")) : 0,
        mqqBrowser: /MQQBrowser\/(\d+)/i.test(d) ? +parseFloat(RegExp.$1) : 0,
        uc: /UC/i.test(d) || /UCWEB/i.test(window.navigator.vendor),
        micromessenger: /MicroMessenger/i.test(d),
        i9300: /i9300/i.test(d),
        sonyEricssonLT26i: /sonyEricssonLT26i/i.test(d),
        google: /google/i.test(window.navigator.vendor),
        chrome: /Chrome\/([.0-9]*) /.test(d) ? RegExp.$1: null,
        iosQQ: /(iPad|iPhone|iPod).*?QQ/g.test(d),
        androidQQ: /\bV1_AND_SQ_/.test(d)
    };
    c.mobileQQ = c.iosQQ || c.androidQQ;
    c.mqq = c.mqqBrowser;
    c.isQQBrowser4 = function() {
        return null != navigator && 0 <= navigator.userAgent.indexOf("MQQBrowser/4.0")
    };
    c.supportsCSS3 = function() {
        return c.sonyEricssonLT26i || c.i9300 ? !1 : c.ios && !c.uc || 4 <= c.android && c.google && !c.mqq && !c.uc
    };
    (function() {
        if (c.i9300) {
            var b = Math.sin,
            a = Math.cos;
            Math.sin = function(a) {
                return ! a ? 0 : b(a)
            };
            Math.cos = function(c) {
                return ! c ? 1 : a(c)
            }
        }
    })();
    return c
});
define("common/util", "crystal/geom/Vector3D common/Geom application/Config application/urlManager crystal/geom/Point common/Platform".split(" "),
function(d, c, b, a, f, h) {
    var e = {},
    k = a.hash;
    e.hashFilter = function(a) {
        var e = /(\?[^$]+)/i.test(a) ? RegExp.$1: "";
        return a.replace(e, "").replace(/[?]?isappinstalled=\d/i, "").replace(/[?]?from=[^&]+[&]?]/i, "")
    }; (function() {
        var a = Object.prototype,
        c = a.toString,
        f = a.hasOwnProperty;
        e.isArray = function(a) {
            return "[object Array]" === c.call(a)
        };
        e.isNodeList = function(a) {
            return "[object NodeList]" === c.call(a)
        };
        e.isObject = function(a) {
            return "[object Object]" === c.call(a)
        };
        e.isNumber = function(a) {
            return "[object Number]" === c.call(a)
        };
        var b = e.each = function(a, c) {
            if (e.isArray(a) || e.isNodeList(a)) for (var b = 0,
            h = a.length; b < h; b++) c.call(a, a[b], b);
            else if (e.isObject(a)) for (b in a) f.call(a, b) && c.call(a, a[b], b);
            else if (e.isNumber(a)) {
                b = 0;
                for (h = a; b < h; b++) c(b, a)
            }
        },
        h = {},
        d = /-(\w)/g,
        k = function(a, c, e) {
            return 0 == e ? c: c.toUpperCase()
        },
        s = function(a, c) {
            var e = [];
            b(c,
            function(a, c) {
                e.push(c + ":" + a)
            });
            a.style.cssText = e.join(";")
        };
        e.createElem = function(a, c) {
            var e = document.createElement(a);
            s(e, c, !0);
            return e
        };
        e.setStyles = function(a, c) {
            b(c,
            function(c, e) {
                var b = a.style,
                f;
                h[e] ? f = h[e] : (f = e.replace(d, k), h[e] = f);
                b[f] = c
            })
        }
    })();
    e.toCoreHeading = function(a, c) {
        a = parseFloat(a);
        if (!isNaN(a) && !isNaN(parseFloat(c))) {
            if (360 < a || -360 > a) a %= 360;
            0 > a && (a = 360 + a);
            return a >= c ? a - c: a + 360 - c
        }
    };
    e.toCorePitch = function(a) {
        a = parseFloat(a);
        if (!isNaN(a)) return a = Math.max(a, -90),
        a = Math.min(a, 90)
    };
    e.getWorldPosition = function(a, e, b) {
        a = a * Math.PI / 180;
        e = e * Math.PI / 180;
        e = {
            x: Math.cos(e) * Math.sin(a),
            y: Math.sin(e),
            z: Math.cos(e) * Math.cos(a)
        };
        b /= 2;
        b = [[{
            x: b,
            y: b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: -b
        },
        {
            x: -b,
            y: b,
            z: -b
        }], [{
            x: -b,
            y: -b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: -b
        },
        {
            x: -b,
            y: b,
            z: -b
        }], [{
            x: b,
            y: b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: -b
        },
        {
            x: b,
            y: b,
            z: b
        }], [{
            x: b,
            y: -b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: b
        },
        {
            x: b,
            y: b,
            z: b
        }], [{
            x: b,
            y: b,
            z: b
        },
        {
            x: b,
            y: -b,
            z: b
        },
        {
            x: -b,
            y: -b,
            z: b
        }], [{
            x: b,
            y: b,
            z: b
        },
        {
            x: -b,
            y: -b,
            z: b
        },
        {
            x: -b,
            y: b,
            z: b
        }], [{
            x: -b,
            y: b,
            z: b
        },
        {
            x: -b,
            y: b,
            z: -b
        },
        {
            x: -b,
            y: -b,
            z: -b
        }], [{
            x: -b,
            y: b,
            z: b
        },
        {
            x: -b,
            y: -b,
            z: b
        },
        {
            x: -b,
            y: -b,
            z: -b
        }], [{
            x: -b,
            y: b,
            z: -b
        },
        {
            x: b,
            y: b,
            z: -b
        },
        {
            x: b,
            y: b,
            z: b
        }], [{
            x: -b,
            y: b,
            z: -b
        },
        {
            x: -b,
            y: b,
            z: b
        },
        {
            x: b,
            y: b,
            z: b
        }], [{
            x: -b,
            y: -b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: -b
        },
        {
            x: b,
            y: -b,
            z: b
        }], [{
            x: -b,
            y: -b,
            z: -b
        },
        {
            x: -b,
            y: -b,
            z: b
        },
        {
            x: b,
            y: -b,
            z: b
        }]];
        for (a = 0; a < b.length; a++) {
            var f = b[a];
            if (f = c.intersectTriangle({
                x: 0,
                y: 0,
                z: 0
            },
            e, f[0], f[1], f[2])) return new d(f.x, f.y, -f.z, 1)
        }
    }; (function() {
        window.__KeplerJsonpCbHolder = {};
        var a = 0;
        e.loadJsonp = function(b, c) {
            var e = "_" + a++,
            f = document.createElement("script");
            document.body.appendChild(f);
            f.src = b + "\x26output\x3djsonp\x26cb\x3d__KeplerJsonpCbHolder." + e;
            f.onerror = function (eee) {
            	c && c(a, eee.type);
            }
            window.__KeplerJsonpCbHolder[e] = function(a) {
                c && c(a);
                document.body.removeChild(f);
                delete window.__KeplerJsonpCbHolder[e];
                e = c = f = null
            }
        };
        var c, f;
        c = {};
        e.getPanoInfo = function(a, f) {
            if (c["s_" + a]) setTimeout(function() {
                f(c["s_" + a])
            },
            0);
            else {
                var h = b.uvStatUidKey,
                d = e.getCookie(h);
                d || (d = (new Date).getUTCMilliseconds(), d = Math.round(2147483647 * Math.random()) * d % 1E10, document.cookie = h + "\x3d" + d + ";path\x3d/; expires\x3dSun, 18 Jan 2038 00:00:00 GMT;");
                h = b.xmlDomain + "/sv?svid\x3d" + a + "\x26pf\x3dhtml5\x26suid\x3d" + d; (d = k.ref) && (h += "\x26from\x3d" + d); (d = k.ch || d) && (h += "\x26ch\x3d" + d);
                e.loadJsonp(h,
                function(b) {
                    c["s_" + a] = b;
                    f(b)
                })
            }
        };
        e.getXfPanoInfo = function(a, b, c, f, h) {
            e.loadJsonp("http://sv.map.qq.com/xf?x\x3d" + b + "\x26y\x3d" + c + "\x26r\x3d" + f + "\x26target\x3d1\x26uid\x3d" + a, h)
        };
        f = {};
        e.getAddress = function(a, b, c) {
            f.lat == a && f.lng == b ? setTimeout(function() {
                c && c(f.address)
            },
            0) : e.loadJsonp("http://sv.map.qq.com/rarp?lat\x3d" + a + "\x26lng\x3d" + b,
            function(e) {
                0 == e.info.errno && (f = {
                    lat: a,
                    lng: b,
                    address: e.detail.AD
                },
                c && c(e.detail.AD))
            })
        };
        e.getPoi3D = function(a, b, c, f, h) {
            e.loadJsonp("http://sv.map.qq.com/poi3d?x\x3d" + a + "\x26y\x3d" + b + "\x26source\x3d" + c + "\x26type\x3d" + f + "\x26output\x3djsonp", h)
        };
        __qq_pano_options.__qq_util = e//===========开放对象===========
    })(); (function() {
        function a(b, c) {
            var e = new XMLHttpRequest;
            e.open("GET", b, !0);
            e.onload = function() {
                var a = JSON.parse(this.response);
                c(a);
            };
            e.onerror = function() {
                0 == this.status && console.error("\u672a\u627e\u5230\u670d\u52a1\uff01");
                c(null, "Net error")
            };
            e.send()
        }
        e.getPOIDetail = function(c, e, f, h) {
            a(b.poidetailList + "/poi/list/?x\x3d" + c + "\x26y\x3d" + e + "\x26type\x3d" + f, h)
        }
    })();
    e.getCookie = function(a) {
        if (!document.cookie) return null;
        a = document.cookie.match(RegExp("(^| )" + a + "\x3d([^;]*)(;|$)"));
        return null != a ? a[2] : null
    };
    e.getRandomID = function(a) {
        var b = 0;
        return function() {
            return "r_" + ++b
        }
    } (); (function() {
        e.lngFrom4326ToProjection = function(a) {
            return 111319.49077777778 * a
        };
        e.latFrom4326ToProjection = function(a) {
            a = Math.log(Math.tan(0.008726646259971648 * (90 + a))) / 0.017453292519943295;
            return 111319.49077777778 * a
        };
        e.lngFromProjectionTo4326 = function(a) {
            return a / 111319.49077777778
        };
        e.latFromProjectionTo4326 = function(a) {
            return a = 114.59155902616465 * Math.atan(Math.exp(0.017453292519943295 * (a / 111319.49077777778))) - 90
        }
    })();
    e.getPOV = function(a, b, c, e, h) {
        null == h && (h = 2.3);
        var d = h - 2.3,
        k = new f(c - a, e - b);
        k.normalize();
        var s = new f(0, 1);
        h = 180 * Math.acos(k.dotProduct(s)) / Math.PI;
        0 < s.crossProduct(k) && (h = 360 - h);
        a = Math.sqrt(Math.pow(c - a, 2) + Math.pow(e - b, 2));
        a = 180 * Math.atan(d / a) / Math.PI;
        return {
            heading: h,
            pitch: a
        }
    };
    e.setOpacity = function(a, b) {
        a.style.opacity = b / 100
    };
    e.bindThis = function(a, b) {
        return function() {
            a.apply(b, arguments)
        }
    };
    e.inherits = function(a, b) {
        a.super_ = b;
        a.prototype = Object.create(b.prototype, {
            constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        })
    };
    e.textWidth = function(a) {
        if (a.nodeType) {
            var b = a.style.position || "static",
            c;
            a.style.left = "-9999px";
            a.style.position = "absolute";
            document.body.appendChild(a);
            c = a.offsetWidth;
            a.style.position = b;
            document.body.removeChild(a);
            return c
        }
    };
    return e
});
define("common/EventDispatcher", [],
function() {
    function d() {
        this._listeners = {};
        this.maxListeners = 20
    }
    d.prototype.addListener = function(c, b) {
        if ("function" != typeof b) throw TypeError("Event Listener must be function");
        var a = this._listeners[c] || [];
        this._listeners[c] = a;
        a.push(b);
        a.length > this.maxListeners && console.warn(c, "Listeners for ", this, "is", a.length, ". May cause memory problem");
        return this
    };
    d.prototype.on = d.prototype.addListener;
    d.prototype.removeListener = function(c, b) {
        var a = this._listeners[c] || [],
        f = a.indexOf(b); - 1 < f && (a[f] = null)
    };
    d.prototype.dispatchEvent = function(c, b) {
        var a = this._listeners[c];
        if (a) for (var f = 0,
        h = a.length; f < h; f++) a[f] && a[f].call(this, {
            type: c,
            data: b
        })
    };
    d.prototype._cleanNullListeners = function(c, b) {
        b = b || this;
        for (var a = b[c], f = [], h = 0; h < a.length; h++) a[h] && f.push(a[h]);
        b[c] = f
    };
    d.prototype.clearListeners = function() {
        this._listeners = {}
    };
    return d
});
define("crystal/geom/Quaternion", [],
function() {
    function d(c) {
        this.v = [];
        c ? (this.v[0] = c[0], this.v[1] = c[1], this.v[2] = c[2], this.v[3] = c[3]) : this.v[0] = this.v[1] = this.v[2] = this.v[3] = 0
    }
    d.prototype.equal = function(c) {
        return this == c || 0.0010 > Math.abs(this.v[0] - c.v[0]) && 0.0010 > Math.abs(this.v[1] - c.v[1]) && 0.0010 > Math.abs(this.v[2] - c.v[2]) && 0.0010 > Math.abs(this.v[3] - c.v[3])
    };
    d.prototype.dotProduct = function(c) {
        return this.v[0] * c.v[0] + this.v[1] * c.v[1] + this.v[2] * c.v[2] + this.v[3] * c.v[3]
    };
    d.prototype.identity = function() {
        this.v[0] = 0;
        this.v[1] = 0;
        this.v[2] = 0;
        this.v[3] = 1
    };
    d.prototype.length = function() {
        var c = this.v[0],
        b = this.v[1],
        a = this.v[2],
        f = this.v[3];
        return Math.sqrt(c * c + b * b + a * a + f * f)
    };
    d.prototype.toMatrix3D = function() {
        var c = [],
        b = this.v[0],
        a = this.v[1],
        f = this.v[2],
        h = this.v[3],
        e = b + b,
        d = a + a,
        g = f + f,
        p = b * e,
        n = b * d,
        b = b * g,
        l = a * d,
        a = a * g,
        f = f * g,
        e = h * e,
        d = h * d,
        h = h * g;
        c[0] = 1 - (l + f);
        c[1] = n + h;
        c[2] = b - d;
        c[3] = 0;
        c[4] = n - h;
        c[5] = 1 - (p + f);
        c[6] = a + e;
        c[7] = 0;
        c[8] = b + d;
        c[9] = a - e;
        c[10] = 1 - (p + l);
        c[11] = 0;
        c[12] = 0;
        c[13] = 0;
        c[14] = 0;
        c[15] = 1;
        return c
    };
    d.prototype.toString = function() {
        return this.v.join(",")
    };
    return d
});
define("crystal/geom/Matrix3D", ["crystal/geom/Vector3D", "crystal/geom/Quaternion"],
function(d, c) {
    function b(a) {
        a && 16 == a.length ? this.v = a: (this.v = [], this.identity())
    }
    b.prototype.clone = function() {
        for (var a = [], c = this.v.length - 1; 0 <= c; c--) a[c] = this.v[c];
        return new b(a)
    };
    b.prototype.identity = function() {
        for (var a = 0; 16 > a; a++) this.v[a] = 0 == a || 5 == a || 10 == a || 15 == a ? 1 : 0
    };
    b.prototype.equal = function(a) {
        for (var b = 0; 16 > b; b++) if (0.01 <= Math.abs(this.v[b] - a.v[b])) return ! 1;
        return ! 0
    };
    b.prototype.determinant = function() {
        var a = this.v[0],
        b = this.v[1],
        c = this.v[2],
        e = this.v[3],
        d = this.v[4],
        g = this.v[5],
        p = this.v[6],
        n = this.v[7],
        l = this.v[8],
        m = this.v[9],
        v = this.v[10],
        u = this.v[11],
        s = this.v[12],
        z = this.v[13],
        y = this.v[14],
        w = this.v[15];
        return s * m * p * e - l * z * p * e - s * g * v * e + d * z * v * e + l * g * y * e - d * m * y * e - s * m * c * n + l * z * c * n + s * b * v * n - a * z * v * n - l * b * y * n + a * m * y * n + s * g * c * u - d * z * c * u - s * b * p * u + a * z * p * u + d * b * y * u - a * g * y * u - l * g * c * w + d * m * c * w + l * b * p * w - a * m * p * w - d * b * v * w + a * g * v * w
    };
    b.prototype.invert = function() {
        var a = this.v[0],
        b = this.v[1],
        c = this.v[2],
        e = this.v[3],
        d = this.v[4],
        g = this.v[5],
        p = this.v[6],
        n = this.v[7],
        l = this.v[8],
        m = this.v[9],
        v = this.v[10],
        u = this.v[11],
        s = this.v[12],
        z = this.v[13],
        y = this.v[14],
        w = this.v[15],
        q = a * g - b * d,
        A = a * p - c * d,
        x = a * n - e * d,
        B = b * p - c * g,
        F = b * n - e * g,
        G = c * n - e * p,
        H = l * z - m * s,
        D = l * y - v * s,
        E = l * w - u * s,
        C = m * y - v * z,
        J = m * w - u * z,
        K = v * w - u * y,
        I = q * K - A * J + x * C + B * E - F * D + G * H;
        I && (this.v[0] = (g * K - p * J + n * C) / I, this.v[1] = ( - b * K + c * J - e * C) / I, this.v[2] = (z * G - y * F + w * B) / I, this.v[3] = ( - m * G + v * F - u * B) / I, this.v[4] = ( - d * K + p * E - n * D) / I, this.v[5] = (a * K - c * E + e * D) / I, this.v[6] = ( - s * G + y * x - w * A) / I, this.v[7] = (l * G - v * x + u * A) / I, this.v[8] = (d * J - g * E + n * H) / I, this.v[9] = ( - a * J + b * E - e * H) / I, this.v[10] = (s * F - z * x + w * q) / I, this.v[11] = ( - l * F + m * x - u * q) / I, this.v[12] = ( - d * C + g * D - p * H) / I, this.v[13] = (a * C - b * D + c * H) / I, this.v[14] = ( - s * B + z * A - y * q) / I, this.v[15] = (l * B - m * A + v * q) / I)
    };
    b.prototype.transpose = function() {
        var a = this.v[1],
        b = this.v[2],
        c = this.v[3],
        e = this.v[6],
        d = this.v[7],
        g = this.v[11];
        this.v[1] = this.v[4];
        this.v[2] = this.v[8];
        this.v[3] = this.v[12];
        this.v[4] = a;
        this.v[6] = this.v[9];
        this.v[7] = this.v[13];
        this.v[8] = b;
        this.v[9] = e;
        this.v[11] = this.v[14];
        this.v[12] = c;
        this.v[13] = d;
        this.v[14] = g
    };
    b.prototype.append = function(a) {
        var b = a.v[0],
        c = a.v[1],
        e = a.v[2],
        d = a.v[3],
        g = a.v[4],
        p = a.v[5],
        n = a.v[6],
        l = a.v[7],
        m = a.v[8],
        v = a.v[9],
        u = a.v[10],
        s = a.v[11],
        z = a.v[12],
        y = a.v[13],
        w = a.v[14];
        a = a.v[15];
        var q = this.v[0],
        A = this.v[4],
        x = this.v[8],
        B = this.v[12];
        this.v[0] = q * b + A * c + x * e + B * d;
        this.v[4] = q * g + A * p + x * n + B * l;
        this.v[8] = q * m + A * v + x * u + B * s;
        this.v[12] = q * z + A * y + x * w + B * a;
        q = this.v[1];
        A = this.v[5];
        x = this.v[9];
        B = this.v[13];
        this.v[1] = q * b + A * c + x * e + B * d;
        this.v[5] = q * g + A * p + x * n + B * l;
        this.v[9] = q * m + A * v + x * u + B * s;
        this.v[13] = q * z + A * y + x * w + B * a;
        q = this.v[2];
        A = this.v[6];
        x = this.v[10];
        B = this.v[14];
        this.v[2] = q * b + A * c + x * e + B * d;
        this.v[6] = q * g + A * p + x * n + B * l;
        this.v[10] = q * m + A * v + x * u + B * s;
        this.v[14] = q * z + A * y + x * w + B * a;
        q = this.v[3];
        A = this.v[7];
        x = this.v[11];
        B = this.v[15];
        this.v[3] = q * b + A * c + x * e + B * d;
        this.v[7] = q * g + A * p + x * n + B * l;
        this.v[11] = q * m + A * v + x * u + B * s;
        this.v[15] = q * z + A * y + x * w + B * a
    };
    b.prototype.prepend = function(a) {
        var b = a.v[0],
        c = a.v[1],
        e = a.v[2],
        d = a.v[3],
        g = a.v[4],
        p = a.v[5],
        n = a.v[6],
        l = a.v[7],
        m = a.v[8],
        v = a.v[9],
        u = a.v[10],
        s = a.v[11],
        z = a.v[12],
        y = a.v[13],
        w = a.v[14];
        a = a.v[15];
        var q = this.v[0],
        A = this.v[1],
        x = this.v[2],
        B = this.v[3];
        this.v[0] = b * q + g * A + m * x + z * B;
        this.v[1] = c * q + p * A + v * x + y * B;
        this.v[2] = e * q + n * A + u * x + w * B;
        this.v[3] = d * q + l * A + s * x + a * B;
        q = this.v[4];
        A = this.v[5];
        x = this.v[6];
        B = this.v[7];
        this.v[4] = b * q + g * A + m * x + z * B;
        this.v[5] = c * q + p * A + v * x + y * B;
        this.v[6] = e * q + n * A + u * x + w * B;
        this.v[7] = d * q + l * A + s * x + a * B;
        q = this.v[8];
        A = this.v[9];
        x = this.v[10];
        B = this.v[11];
        this.v[8] = b * q + g * A + m * x + z * B;
        this.v[9] = c * q + p * A + v * x + y * B;
        this.v[10] = e * q + n * A + u * x + w * B;
        this.v[11] = d * q + l * A + s * x + a * B;
        q = this.v[12];
        A = this.v[13];
        x = this.v[14];
        B = this.v[15];
        this.v[12] = b * q + g * A + m * x + z * B;
        this.v[13] = c * q + p * A + v * x + y * B;
        this.v[14] = e * q + n * A + u * x + w * B;
        this.v[15] = d * q + l * A + s * x + a * B
    };
    b.prototype.transformVector = function(a) {
        var b = a.x,
        c = a.y;
        a = a.z;
        return new d(this.v[0] * b + this.v[4] * c + this.v[8] * a + this.v[12], this.v[1] * b + this.v[5] * c + this.v[9] * a + this.v[13], this.v[2] * b + this.v[6] * c + this.v[10] * a + this.v[14], this.v[3] * b + this.v[7] * c + this.v[11] * a + this.v[15])
    };
    b.prototype.transformVectors = function(a) {
        for (var b = a.length,
        c = [], e = 0; e < b; e++) c.push(this.transformVector(a[e]));
        return c
    };
    b.prototype.appendTranslate = function(a, b, c) {
        var e, d, g, p, n, l, m, v, u, s, z, y;
        e = this.v[0];
        d = this.v[1];
        g = this.v[2];
        p = this.v[3];
        n = this.v[4];
        l = this.v[5];
        m = this.v[6];
        v = this.v[7];
        u = this.v[8];
        s = this.v[9];
        z = this.v[10];
        y = this.v[11];
        this.v[0] = e;
        this.v[1] = d;
        this.v[2] = g;
        this.v[3] = p;
        this.v[4] = n;
        this.v[5] = l;
        this.v[6] = m;
        this.v[7] = v;
        this.v[8] = u;
        this.v[9] = s;
        this.v[10] = z;
        this.v[11] = y;
        this.v[12] = e * a + n * b + u * c + this.v[12];
        this.v[13] = d * a + l * b + s * c + this.v[13];
        this.v[14] = g * a + m * b + z * c + this.v[14];
        this.v[15] = p * a + v * b + y * c + this.v[15]
    };
    b.prototype.appendScale = function(a, b, c) {
        this.v[0] *= a;
        this.v[1] *= a;
        this.v[2] *= a;
        this.v[3] *= a;
        this.v[4] *= b;
        this.v[5] *= b;
        this.v[6] *= b;
        this.v[7] *= b;
        this.v[8] *= c;
        this.v[9] *= c;
        this.v[10] *= c;
        this.v[11] *= c
    };
    b.prototype.appendRotate = function(a, d) {
        var h = Math.sin(a / 2),
        e = h * d[0],
        k = h * d[1],
        h = h * d[2],
        g = Math.cos(a / 2),
        e = (new c([e, k, h, g])).toMatrix3D();
        this.append(new b(e))
    };
    b.prototype.interpolateTo = function(a, b) {};
    b.interpolate = function(a, b, c) {};
    b.prototype.toString = function() {
        return this.v.join(",")
    };
    b.prototype.glFrustum = function(a, b, c, e, d, g) {
        var p = b - a,
        n = e - c,
        l = g - d;
        this.v[0] = 2 * d / p;
        this.v[1] = 0;
        this.v[2] = 0;
        this.v[3] = 0;
        this.v[4] = 0;
        this.v[5] = 2 * d / n;
        this.v[6] = 0;
        this.v[7] = 0;
        this.v[8] = (b + a) / p;
        this.v[9] = (e + c) / n;
        this.v[10] = -(g + d) / l;
        this.v[11] = -1;
        this.v[12] = 0;
        this.v[13] = 0;
        this.v[14] = -(2 * g * d) / l;
        this.v[15] = 0
    };
    b.prototype.glPerspective = function(a, b, c, e) {
        a = c * Math.tan(a / 2);
        var d = -a;
        this.glFrustum(d * b, a * b, d, a, c, e)
    };
    b.prototype.glLookAt = function(a, b, c) {
        b = b.clone();
        b = b.subtract(a);
        b.normalize();
        b.w = 0;
        c = c.clone();
        c = c.crossProduct(b);
        c.normalize();
        c.w = 0;
        var e = b.clone(),
        e = e.crossProduct(c);
        e.w = 0;
        var k = new d;
        k.x = c.dotProduct(a);
        k.y = e.dotProduct(a);
        k.z = b.dotProduct(a);
        k.w = 1;
        this.v = [c.x, c.y, c.z, c.w, e.x, e.y, e.z, e.w, b.x, b.y, b.z, b.w, k.x, k.y, k.z, k.w]
    };
    b.prototype.glViewPort = function(a, b, c, e) {
        this.v = [c / 2, 0, 0, 0, 0, -e / 2, 0, 0, 0, 0, 1, 0, c / 2 + a, e / 2 + b, 0, 1]
    };
    return b
});
define("crystal/common/CanvasAction", ["common/EventDispatcher"],
function(d) {
    function c(a) {
        this.pool = [];
        this.canvas = a;
        //this.bindEvents = ["mousedown", "mousemove", "mouseup", "mousedown", "click"];
        this.bindEvents = ["mousedown", "click", "mousemove", "mouseup"];
        this.bindEvent()
    }
    d = c.prototype;
    d.append = function(a) {
        this.pool.push(a)
    };
    d.remove = function(a) {
        for (var b = 0,
        c = -1; b < this.pool.length; b++) this.pool[b] == a && (c = b); - 1 < c && this.pool.splice(c, 1)
    };
    d.bindEvent = function() {
        for (var a = this.canvas,
        b = this; this.bindEvents[0];) {
            var c = this.bindEvents.pop();
            a.addEventListener(c,
            function(a) {
                return function(c) {
                    b.check(c, a)
                }
            } (c), !1)
        }
    };
    d.check = function(a, b) {
        for (var c = this.pool.length - 1; 0 <= c; c--) {
            var e = this.pool[c];
            if (this.isInside(a, this.pool[c].eventPolygon) && e.dispatchEvent) {
                e.dispatchEvent(b, {
                    evt: a
                });
                break
            }
        }
    };
    d.isInside = function(a, b) {
        var c = !1,
        e, d;
        //a.changedTouches ? (d = a.changedTouches[0], e = d.pageX, d = d.pageY) : (e = a.pageX || a.offsetX, d = a.pageY || a.offsetY);
        var tans_len = this.canvas.height / __qq_pano_options._qq_trans_len;
        a ? (d = a, e = d.layerX - ( 0), d = d.layerY - tans_len) : (e = a.layerX - ( 0) || a.offsetX, d = (a.layerY || a.layerY) - tans_len);
        if (b) {
            this.canvas.getContext("2d");
            for (var g = -1,
            p = b.length,
            n = p - 1; ++g < p; n = g)(b[g][1] <= d && d < b[n][1] || b[n][1] <= d && d < b[g][1]) && e < (b[n][0] - b[g][0]) * (d - b[g][1]) / (b[n][1] - b[g][1]) + b[g][0] && (c = !c)
        }
        return c
    };
    var b;
    return {
        getInstance: function(a) {
            return b || (b = new c(a))
        }
    }
});
define("crystal/core/Object3D", ["crystal/geom/Matrix3D", "crystal/common/CanvasAction", "common/EventDispatcher"],
function(d, c, b) {
    function a() {
        b.apply(this);
        this.vertices = [];
        this.indices = [];
        this.uvtData = [];
        this._modelMatrix = new d;
        this.texture = new Image;
        this.fixMatrix = []
    }
    a.prototype = new b;
    a.prototype.addEventWatch = function() {
        c.getInstance().append(this)
    };
    a.prototype.removeEventWatch = function() {
        c.getInstance().remove(this)
    };
    a.prototype.getModelMatrix = function() {
        return this._modelMatrix
    };
    a.prototype.setModelMatrix = function(a) {
        this._modelMatrix = a
    };
    a.prototype.translate = function(a, b, c) {
        this._modelMatrix.appendTranslate(a, b, c)
    };
    a.prototype.translateSelf = function(a, b, c) {
        var k = new d;
        k.appendTranslate(a, b, c);
        this.vertices = k.transformVectors(this.vertices);
        this.eventCoords = k.transformVectors(this.eventCoords)
    };
    a.prototype.rotateSelf = function(a, b) {
        var c = new d;
        c.appendRotate(a, b);
        this.vertices = c.transformVectors(this.vertices);
        this.eventCoords = c.transformVectors(this.eventCoords)
    };
    a.prototype.scaleSelf = function(a, b, c) {
        var k = new d;
        k.appendScale(a, b, c);
        this.vertices = k.transformVectors(this.vertices);
        this.eventCoords = k.transformVectors(this.eventCoords)
    };
    a.prototype.scale = function(a, b, c) {
        this._modelMatrix.appendScale(a, b, c)
    };
    a.prototype.rotate = function(a, b) {
        this._modelMatrix.appendRotate(a, [b.x, b.y, b.z])
    };
    a.prototype.setTexture = function(a) {
        this.texture.src = a
    };
    a.prototype.render = function(a) {
        var b = a.canvas,
        c = a.camera,
        k = a.renderer,
        g = new d;
        g.append(c.viewMatrix);
        g.append(this.getModelMatrix());
        k.render(b, this.vertices, this.indices, this.uvtData, this.texture, c.projectMatrix, g, a, this)
    };
    return a
});
define("crystal/primitives/TileOverlay", ["crystal/core/Object3D", "crystal/geom/Vector3D", "crystal/geom/Matrix3D", "common/util"],
function(d, c, b, a) {
    function f(a, b, c) {
        d.apply(this);
        this.eventCoords = [];
        this._super = new d;
        this.build(a);
        b && c && this.rotateSelf(2 * b / 360 * Math.PI, c);
        this._isStopRender = !1
    }
    c = f.prototype = new d;
    c.constructor = f;
    c.clone = function() {
        var a = new this.constructor([]);
        a.vertices = this.vertices;
        a.indices = this.indices;
        return a
    };
    c.build = function(a) {
        this.vertices = a;
        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 0;
        this.indices[4] = 2;
        this.indices[5] = 3
    };
    c.clip = function(b) {
        var c = b.camera.projectMatrix,
        d = [],
        f,
        p;
        a.each(this.vertices,
        function(a, l) {
            f = b.coreMatrix.transformVector(a);
            p = c.transformVector(f);
            p.project();
            d.push(p)
        });
        indexBuffer = b.clip(d, this.indices);
        return 0 == indexBuffer.length ? [] : d
    };
    c.getScreenPosition = function(b, c) {
        var d = [];
        a.each(c,
        function(a, c) {
            var t = a;
            t = b.viewPortMatrix.transformVector(t);
            d.push({
                x: t.x,
                y: t.y
            })
        });
        return d
    };
    c.canvasRender = function(b, c) {
        var d = b.canvas.getContext("2d");
        d.beginPath();
        d.strokeStyle = "#000000";
        d.lineWidth = "1";
        d.fillStyle = "rgba(0,0,0,0)";
        d.moveTo(c[0], c[1]);
        a.each(c,
        function(a, b) {
            d.lineTo(a.x, a.y)
        });
        d.closePath();
        d.stroke();
        d.fill()
    };
    c.tileRender = function(a, b) {};
    c.stopRender = function() {
        this._isStopRender = !0
    };
    c.restoreRender = function() {
        this._isStopRender = !1
    };
    c.render = function(a) {
        if (!0 !== this._isStopRender) {
            var b = this.clip(a);
            0 != b.length && (b = this.getScreenPosition(a, b), this.tileRender(a, b))
        }
    };
    c.reset = function() {};
    return f
});
define("common/Animation", ["common/TimeShaft"],
function(d) {
    var c = function() {},
    b = Object.prototype.toString,
    a = {
        linear: function(a) {
            return a
        },
        easeIn: function(a) {
            return Math.pow(a, 2)
        },
        easeOut: function(a) {
            return Math.pow(a, 0.5)
        }
    },
    f = function(e, d) {
        1 == arguments.length && "[object Function]" === b.call(e) && (d = e, e = void 0);
        e = e || {};
        this.playFunc = d;
        this.playID = null;
        this.FPS = this.progress = 0;
        this._fpss = {
            n: 0,
            startTime: 0
        };
        this.status = 1;
        this.options = {
            begin: void 0 !== e.begin ? e.begin: 0,
            end: void 0 !== e.end ? e.end: 100,
            duration: e.duration || 1E3,
            times: e.times || 1,
            timingFunction: e.timingFunction || a.linear,
            onBegin: e.onBegin || c,
            onEnd: e.onEnd || c,
            FPS: e.FPS || void 0
        }
    };
    f.extend = function(a, b) {
        this.TIMING_FUNCTION[a] = b
    };
    f.TIMING_FUNCTION = a;
    var h = f.prototype;
    h.play = function() {
        this.playID && 3 !== this.status && this.stop();
        var a = this,
        b = this.options,
        c = this.progress,
        f = b.end - b.begin;
        b.onBegin(b.begin);
        var h = a.options.duration;
        this.status = 2;
        this.playID = d.add(null,
        function(d, m) {
            var v = c + d / h;
            if (1 > v) a.progress = v,
            v = b.begin + f * b.timingFunction(v),
            a.playFunc(v);
            else if (Infinity === b.times || 0 < --b.times) a.progress = 0,
            a.play();
            else return a.stop(),
            !0
        },
        b.FPS)
    };
    h.addTimes = function(a) {
        this.options.times += a
    };
    h.stop = function() {
        this.progress = 0;
        d.remove(this.playID);
        this.playFunc(this.options.end);
        this.options.onEnd();
        this.playID = null;
        this.FPS = 0;
        this.status = 4
    };
    h.pause = function() {
        this.status = 3;
        d.remove(this.playID)
    };
    h.getProgress = function() {
        return this.progress
    };
    h.getLeftTimes = function() {
        return this.options.times
    };
    return f
});
define("core/CSSPanoCore", "common/EventDispatcher application/Config common/util crystal/primitives/TileOverlay common/Animation common/Platform".split(" "),
//function(d, c, b, a, f, h) {
    function(eventDispatcher, appConfig, commonUtil, tileOverlay, animation, commonPlatform) {
    function e(a) {
        return false
    }
    function k(a) { (new animation(E,
        function(b) {
            a.style.opacity = b
        })).play()
    }
    function coreCSSPanoCore(a, c) {
        eventDispatcher.call(this);
        c = c || {};
        this._svid = null;
        this._heading = c.heading || 0;
        this._pitch = c.pitch || 0;
        this._fovy = null;
        H = this;
        s = a.clientWidth;
        z = a.clientHeight;
        w = y = c.fovy;
        this._containerDom = a;
        this.tileCount = Math.pow(2, u);
        this._buildTilesContainer();
        this._renderPending = !1;
        this._doRender = commonUtil.bindThis(this._doRender, this);
        c.svid && this.setSvid(c.svid)
    }
    function p(a, b) {
        0 < b.length && C.renderTile(this.imgID)
    }
    function n(a, b, c) {
        if (!a) return "";
        var d = 0 == u ? "cube": "mobile-cube";
        var dd = [A.replace("${x}", (b + 2 * c) % 8), "/tile?svid\x3d" + a, "\x26x\x3d" + b, "\x26y\x3d" + (c || 0), "\x26level\x3d" + ("cube" == d ? 0 : u - 1), "\x26mtype\x3d" + d, "\x26from\x3dweb"].join("")
        return dd
    }
    function l() {
        return 0.5 / Math.tan(y * Math.PI / 360) * z
    }
    function m(a, b) {
        r = q / 2 * (b || 1) * (u + 1);
        r--;
        return 3 >= a ? "rotateY(" + -90 * a + "deg) translateZ(-" + r + "px)": 4 == a ? "rotateX(-90deg) translateZ(-" + r + "px)": "rotateX(90deg) translateZ(-" + r + "px)"
    }
    function v(a) {
        var b = x + "?svid\x3d" + G + "\x26x\x3d0\x26y\x3d0\x26from\x3dhtml5\x26level\x3d0\x26mtype\x3dmobile-cube",
        c = F.querySelectorAll(".thumbs");
        c[0].onload = function() {
            a();
            H.dispatchEvent("thumbLoaded")
        };
        for (var d = c.length - 1; 0 <= d; d--) c[d].src = b
    }
    var u = 1,
    s, z, y, w, q = 256,
    A = "http://sv${x}.map.qq.com",
    x = appConfig.thumbDomain,
    B, F, G, H, D = !0,
    E = {
        begin: 0,
        end: 1,
        duration: 300
    },
    C = {
        _allowLoadTiles: !0,
        _tileImages: {},
        _tile3DOverlays: {},
        _tileData: {},
        _loadingCount: 0,
        _loadedCount: 0,
        setAllowLoadTiles: function(a) {
            this._allowLoadTiles = a
        },
        add: function(a, b) {
            this._tileData[a] = {
                overlay3D: b
            }
        },
        resetAllImgLoadState: function() {
            commonUtil.each(this._tileData,
            function(a, b) {
                a.overlay3D.restoreRender()
            })
        },
        getAllTile3D: function() {
            var a = [];
            commonUtil.each(this._tileData,
            function(b, c) {
                a.push(b.overlay3D)
            });
            return a
        },
        renderTile: function(a) {
            var b = this._tileData[a];
            this._allowLoadTiles && b && (D && (setTimeout(function() {
                D = !1
            },
            0), this._loadingCount++), b.overlay3D.stopRender(), b = a.split("_"), a = document.getElementById(a), a.style.opacity = 0, a.src = "", a.src = n(G, b[1], b[2]), a = null)
        },
        tileLoaded: function(a) {
            this._tileData[a] && (a = document.getElementById(a), 0 == a.parentNode.style.opacity && k(a), void 0 !== this._loadedCount && (this._loadedCount++, this._loadedCount >= this._loadingCount ? (H.dispatchEvent("tileLoaded"), this._loadedCount = void 0) : H.dispatchEvent("tileLoading", {
                percent: this._loadedCount / this._loadingCount
            })))
        }
    };
    __qq_pano_options.C = C;//用于街景未加载前就绘制椭圆
    commonUtil.inherits(coreCSSPanoCore, eventDispatcher);
    coreCSSPanoCore.prototype.get3DOverlays = function() {
        return C.getAllTile3D()
    };
    coreCSSPanoCore.prototype.setSvid = function(a) {
        G = this._svid = a;
        var b = this;
        this.refreshTile(function() {
            b.render()
        })
    };
    coreCSSPanoCore.prototype.setOptions = function(a) {
        this._pitch = a.pitch;
        this.setHeading(a.heading)
    };
    coreCSSPanoCore.prototype._buildTilesContainer = function() {
        var c = this.tileCount,
        d = q * c,
        f = l();
        B = commonUtil.createElem("div", {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            "-webkit-perspective": f
        });
        F = commonUtil.createElem("div", {
            position: "absolute",
            width: "100%",
            height: "100%",
            "-webkit-transform-style": "preserve-3d",
            "-webkit-transform": "translateZ(" + f + "px) rotateX(0deg) rotateY(0deg)",
            "z-index": 3
        });
        for (var h = [], g = 0; 6 > g; g++) {
            var k = commonUtil.createElem("div", {
                "-webkit-backface-visibility": "hidden",
                position: "absolute",
                width: d + "px",
                height: d + "px",
                left: (s - q * c) / 2 + "px",
                top: (z - q * c) / 2 + "px",
                "-webkit-transform": m(g),
                overflow: "hidden"
            });
            k.className = "cubes";
            var x = commonUtil.createElem("img", {
                position: "absolute",
                width: 6 * d + "px",
                height: d + "px",
                left: -g * d + "px"
            });
            x.className = "thumbs";
            x.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7";
            var n = commonUtil.createElem("div", {
                position: "absolute",
                width: d + "px",
                height: d + "px"
            });
            n.className = "tiles";
            h.push(n);
            k.appendChild(x);
            k.appendChild(n);
            F.appendChild(k)
        }
        var d = 2 * f,
        u = new tileOverlay([commonUtil.getWorldPosition( - 45, 35, d), commonUtil.getWorldPosition(0, 45, d), commonUtil.getWorldPosition(0, 0, d), commonUtil.getWorldPosition( - 45, 0, d)]),
        w = function() {
            0 > this.src.indexOf("http:") || C.tileLoaded(this.id)
        };
        commonUtil.each(h,
        function(a, d) {
            var s = d * c;
            commonUtil.each(c,
            function(h) {
                commonUtil.each(c,
                function(g) {
                    var k = s + g,
                    x = commonUtil.createElem("img", {
                        width: q + "px",
                        height: q + "px",
                        "float": "left",
                        top: h * q + "px",
                        left: g * q + "px",
                        "z-index": 2
                    });
                    x.ondragstart = e;
                    x.onselectstart = e;
                    x.onload = w;
                    g = "i_" + k + "_" + h;
                    x.id = g;
                    x.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7";
                    a.appendChild(x);
                    x = u.clone();
                    x.translateSelf(f * (k % c), -f * h, 0);
                    4 > d ? x.rotateSelf( - Math.PI / 2 * d, [0, 1, 0]) : 4 == d ? x.rotateSelf(Math.PI / 2, [1, 0, 0]) : x.rotateSelf(Math.PI / 2, [ - 1, 0, 0]);
                    x.imgID = g;
                    x.tileRender = p;
                    C.add(g, x)
                })
            })
        });
        B.appendChild(F);
        this._containerDom.appendChild(B);
        h = null
    };
    coreCSSPanoCore.prototype.setPov = function(a, b) {
        this._heading = a;
        this._pitch = b;
        this.render()
    };
    coreCSSPanoCore.prototype.setHeading = function(a) {
        this._heading = a;
        this.render()
    };
    coreCSSPanoCore.prototype.setPitch = function(a) {
        this._pitch = a;
        this.render()
    };
    coreCSSPanoCore.prototype.getFovy = function() {
        return y
    };
    coreCSSPanoCore.prototype.getFov = function() {
        return y
    };
    coreCSSPanoCore.prototype.setFovy = function(a) {
        y = a
    };
    coreCSSPanoCore.prototype.setZoom = function(a) {//console.log('4');
        this.setFovy(w - 20 * (a - 1));
        this.render();
        a = l();
        commonPlatform.android || (B.style.webkitPerspective = a);
        F.style.webkitTransform = F.style.webkitTransform.replace(/translateZ\(([^\)]+)\)/, "translateZ(" + a + "px)")
    };
    coreCSSPanoCore.prototype.setViewPort = function(a, c) {//console.log('5');
        s = a;
        z = c;
        var d = this.tileCount,
        e = l();
        B.style.webkitPerspective = e;
        F.style.webkitTransform = F.style.webkitTransform.replace(/translateZ\(([^\)]+)\)/, "translateZ(" + e + "px)");
        commonUtil.setStyles(B, {
            width: a + "px",
            height: c + "px"
        });
        commonUtil.setStyles(F, {
            width: a + "px",
            height: c + "px"
        });
        commonUtil.each(F.querySelectorAll(".cubes"),
        function(a) {
            commonUtil.setStyles(a, {
                left: (s - q * d) / 2 + "px",
                top: (z - q * d) / 2 + "px"
            })
        });
        var f = this;
        setTimeout(function() {
            f.render()
        },
        0)
    };
    coreCSSPanoCore.prototype.render = function() {
        this._renderPending || (this._renderPending = !0, requestAnimationFrame(this._doRender))
    };
    coreCSSPanoCore.prototype._doRender = function() {
        F.style.webkitTransform = F.style.webkitTransform.replace(/rotateX\(([^\)]+)\)/, "rotateX(" + -this._pitch + "deg)").replace(/rotateY\(([^\)]+)\)/, "rotateY(" + this._heading + "deg)");
        this._renderPending = !1;
        this.dispatchEvent("refresh")
    };
    coreCSSPanoCore.prototype.refreshTile = function(a) {//console.log('6');
        C.setAllowLoadTiles(!1);
        C.resetAllImgLoadState();
        l();
        v(function() {
            C.setAllowLoadTiles(!0);
            a && a()
        })
    };
    return coreCSSPanoCore
});
define("core/dompano/DOMPanoConfig", ["application/Config"],
function(d) {
    var c = {
        TILE_WIDTH: 256,
        TILE_HEIGHT: 256,
        COL_COUNT: 8,
        ROW_COUNT: 4
    };
    c.TILES_WIDTH = c.TILE_WIDTH * c.COL_COUNT;
    c.TILES_HEIGHT = c.TILE_HEIGHT * c.ROW_COUNT;
    c.FADE_TIME = 1E3;
    c.FADE_FRAME_COUNT = 40;
    c.BEGIN_HEADING = 180;
    c.debug = !1;
    c.THUMB_URL = d.thumbDomain;
    c.TILE_SITES = d.tileDomain;
    return c
});
define("crystal/geom/Rectangle", [],
function() {
    function d(c, b, a, d) {
        this.x = c;
        this.y = b;
        this.width = a;
        this.height = d
    }
    d.prototype.intersects = function(c) {
        return this.x > c.x + c.width || this.x + this.width < c.x || this.y > c.y + c.height || this.y + this.height < c.y ? !1 : !0
    };
    d.prototype.contains = function(c) {
        return c.x >= this.x && c.x <= this.x + this.width && c.y >= this.y && c.y <= this.y + this.height
    };
    d.prototype.toString = function() {
        return "[x\x3d" + this.x + ",y\x3d" + this.y + ",width\x3d" + this.width + ",height\x3d" + this.height + "]"
    };
    d.prototype.getClassName = function() {
        return "Rectangle"
    };
    return d
});
define("core/dompano/DOMTile", "require exports module core/dompano/DOMPanoConfig crystal/geom/Rectangle application/Config common/util".split(" "),
function(d, c, b) {
    function a(a, b) {
        this.cidx = a;
        this.ridx = b;
        this.bounds = new e(p * this.cidx, n * this.ridx, p, n);
        this.img = f();
        var c = this.cidx,
        d = this.ridx,
        s = document.createElement("p");
        s.textContent = c + "," + d;
        s.style.position = "absolute";
        this.label = s;
        this.setViewSize(p, n)
    }
    function f() {
        var a = document.createElement("img");
        a.style.position = "absolute";
        a.style.zIndex = 1;
        a.alt = "loading...";
        a.src = k.blank;
        a.onload = function(b) {
            a.style.zIndex = 3
        };
        return a
    }
    var h = d("core/dompano/DOMPanoConfig"),
    e = d("crystal/geom/Rectangle"),
    k = d("application/Config"),
    g = d("common/util"),
    p = h.TILE_WIDTH,
    n = h.TILE_HEIGHT;
    a.prototype.setViewSize = function(a, b) {
        this.img.style.width = a + "px";
        this.img.style.height = b + "px"
    };
    a.prototype.setPosition = function(a, b) {
        var c = this.img.style;
        c.left = a + "px";
        c.top = b + "px";
        h.debug && (this.img.style.border = "1px solid", this.label.style.left = a + p / 2 + "px", this.label.style.top = b + n / 2 + "px")
    };
    a.prototype.loadTile = function(a, b) {
        if (this.imgSrc != a) {
            var c = this.img;
            this.img.onload = function() {
                c.style.zIndex = 3;
                b()
            };
            this.img.src = this.imgSrc = a
        }
    };
    a.prototype.appendTo = function(a) {
        a.appendChild(this.img);
        h.debug && a.appendChild(this.label)
    };
    a.prototype.getBounds = function() {
        return this.bounds
    };
    a.prototype.setVisibility = function(a) {
        this.visibility != a && (this.visibility = a, this.img.style.display = this.label.style.display = a ? "": "none")
    };
    a.prototype.isVisible = function() {
        return "none" != this.img.style.display
    };
    a.prototype.setAlpha = function(a) {
        g.setOpacity(this.img, a)
    };
    return a
});
define("core/dompano/DOMThumb", ["require", "core/dompano/DOMPanoConfig", "application/Config", "common/util"],
function(d) {
    function c() {
        var a = document.createElement("img");
        a.style.position = "absolute";
        a.style.zIndex = 2;
        a.alt = "loading...";
        a.src = b.blank;
        this.img = a
    }
    d("core/dompano/DOMPanoConfig");
    var b = d("application/Config"),
    a = d("common/util");
    c.prototype.setViewSize = function(a, b) {
        this.img.style.width = a + "px";
        this.img.style.height = b + "px"
    };
    c.prototype.setPosition = function(a, b) {
        this.img.style.left = a + "px";
        this.img.style.top = b + "px"
    };
    c.prototype.loadThumb = function(a, b) {
        this.img.src == a ? b(!0) : (this.img.onload = function() {
            b()
        },
        this.img.src = a)
    };
    c.prototype.appendTo = function(a) {
        a.appendChild(this.img)
    };
    c.prototype.setVisibility = function(a) {
        this.img.style.display = a ? "": "none"
    };
    c.prototype.setAlpha = function(b) {
        a.setOpacity(this.img, b)
    };
    return c
});
define("core/dompano/FadeAnimation", ["require", "core/dompano/DOMPanoConfig"],
function(d) {
    function c() {}
    function b(b, c, d) {
        function g() {
            a(b, p);
            var n = (new Date).getTime(),
            s = n - m;
            p = c + (d - c) * (n - m) / f.FADE_TIME;
            p = Math.min(100, p);
            p = Math.max(0, p);
            v++;
            l = 0.5 * l + 0.5 * (s / v);
            s < f.FADE_TIME ? setTimeout(g, l) : a(b, d)
        }
        var p = c,
        n = f.FADE_TIME / f.FADE_FRAME_COUNT,
        l = n,
        m = (new Date).getTime(),
        v = 0;
        setTimeout(g, n)
    }
    function a(a, b) {
        for (var c = 0; c < a.length; c++) a[c].setAlpha(b)
    }
    var f = d("core/dompano/DOMPanoConfig");
    c.prototype.fadeIn = function(a) {
        b(a, 0, 100)
    };
    c.prototype.fadeOut = function(a) {
        b(a, 100, 0)
    };
    return c
});

define("core/dompano/DOMTileManager", "require exports module core/dompano/DOMPanoConfig core/dompano/DOMTile core/dompano/DOMThumb core/dompano/FadeAnimation crystal/geom/Point".split(" "),
function(d, c, b) {
    function a(a, b) {
        D = a;
        v = k(b, 100);
        u = k(b, 0);
        y = v;
        w = u;
        s = e(b, 100);
        z = e(b, 0);
        q = s;
        A = z;
        E = new l
    }
    function f(a, b) {
        var c = D.getSvid(),
        d = D.getHeading(),
        e = D.getPitch(),
        f = D.getTileZoom(),
        s = D.getBounds(),
        k = D.getCompositeBounds(),
        q = D.getCenter(),
        p = F * f,
        n = G * f;
        g.debug && console.log("refresh heading\x3d" + d + " pitch\x3d" + e + " zoom\x3d" + f + " center\x3d" + q + " bounds\x3d" + s + " compositeBounds\x3d" + k);
        var d = g.THUMB_URL + "?svid\x3d" + c,
        e = k.getSubCount(),
        q = h(e),
        s = k.getSubRectangle(0),
        z = -Math.floor(s.x * f),
        w = -Math.floor(s.y * f),
        u = b[0],
        l = b[1],
        y = g.TILES_WIDTH * f,
        A = g.TILES_HEIGHT * f;
        u.setPosition(z, w);
        u.loadThumb(d, q);
        u.setVisibility(!0);
        u.setViewSize(y, A);
        2 == e ? (z = s.width * f, l.setPosition(z, w), l.loadThumb(d, q), l.setVisibility(!0), l.setViewSize(y, A)) : l.setVisibility(!1);
        d = 0;
        z = [];
        for (e = 0; e < x; e++) for (q = 0; q < B; q++) w = a[e + q * x],
        u = k,
        D.preload ? u = !0 : (l = w.getBounds(), u = u.intersects(l)),
        w.setVisibility(u),
        u && (d++, z.push(w));
        q = h(d, "tile");
        k = 0;
        for (e = z.length; k < e; k++) w = z[k],
        d = g.TILE_SITES.replace("${x}", (w.cidx % 3 + 3 * (w.ridx % 3)) % 9) + "?svid\x3d" + c + "\x26x\x3d" + w.cidx + "\x26y\x3d" + w.ridx + "\x26level\x3d0\x26mtype\x3dmobile",
        y = s,
        u = f,
        A = w.getBounds(),
        l = A.x - y.x,
        y = A.y - y.y,
        l + g.TILE_WIDTH > g.TILES_WIDTH ? l -= g.TILES_WIDTH: l < -g.TILE_WIDTH && (l += g.TILES_WIDTH),
        l = Math.floor(l * u),
        y = Math.floor(y * u),
        u = new m(l, y),
        w.loadTile(d, q),
        w.setViewSize(p, n),
        w.setPosition(u.x, u.y)
    }
    function h(a, b) {
        if (!C) return function() {};
        var c = 0,
        d, e;
        "tile" == b ? (d = "tileLoaded", e = "tileLoading") : (d = "thumbLoaded", e = "thumbLoading");
        return function() {
            c++;
            c >= a && D.dispatchEvent(d);
            D.dispatchEvent(e, {
                percent: c / a
            })
        }
    }
    function e(a, b) {
        for (var c = Array(2), d = 0; 2 > d; d++) {
            var e = new n;
            e.setAlpha(b);
            e.appendTo(a);
            c[d] = e
        }
        return c
    }
    function k(a, b) {
        for (var c = Array(x), d = 0; d < x; d++) for (var e = 0; e < B; e++) {
            var f = new p(d, e),
            s = d + e * x;
            f.setAlpha(b);
            f.appendTo(a);
            c[s] = f
        }
        return c
    }
    var g = d("core/dompano/DOMPanoConfig"),
    p = d("core/dompano/DOMTile"),
    n = d("core/dompano/DOMThumb"),
    l = d("core/dompano/FadeAnimation"),
    m = d("crystal/geom/Point"),
    v,
    u,
    s,
    z,
    y,
    w,
    q,
    A,
    x = g.COL_COUNT,
    B = g.ROW_COUNT,
    F = g.TILE_WIDTH,
    G = g.TILE_HEIGHT,
    H,
    D,
    E,
    C = !0;
    a.prototype.refresh = function() {
        var a = D.getSvid();
        if (a) {
            if (H && H != a) {
                C = !0;
                var b = y;
                y = w;
                w = b;
                b = q;
                q = A;
                A = b;
                E.fadeOut(w);
                setTimeout(function() {
                    E.fadeIn(y)
                },
                0);
                E.fadeOut(A);
                setTimeout(function() {
                    E.fadeIn(q)
                },
                0)
            }
            f(y, q);
            H = a;
            C = !1
        }
    };
    return a
});
define("crystal/geom/CompositeRectangle", [],
function() {
    function d() {
        this.subRects = []
    }
    d.prototype.addSubRectangle = function(c) {
        this.subRects.push(c)
    };
    d.prototype.getSubCount = function() {
        return this.subRects.length
    };
    d.prototype.getSubRectangle = function(c) {
        return c >= this.subRects ? null: this.subRects[c]
    };
    d.prototype.intersects = function(c) {
        for (var b = 0; b < this.subRects.length; b++) if (c.intersects(this.subRects[b])) return ! 0;
        return ! 1
    };
    d.prototype.toString = function() {
        for (var c = "[",
        b = 0; b < this.subRects.length; b++) c = c + this.subRects[b].toString() + ",";
        return c + "]"
    };
    d.prototype.getClassName = function() {
        return "CompositeRectangle"
    };
    return d
});
define("core/dompano/DOMPanoCore", "core/dompano/DOMPanoConfig common/EventDispatcher core/dompano/DOMTileManager common/TimeShaft crystal/geom/Rectangle crystal/geom/CompositeRectangle crystal/geom/Point application/Config".split(" "),
function(d, c, b, a, f, h, e, k) {
    function g(a, c) {
        d.THUMB_URL = k.thumbDomain;
        d.TILE_SITES = k.tileDomain;
        F = c.fovy;
        K = this;
        D = a;
        fov = c.fovy;
        D.style.overflow = "hidden";
        J = new b(this, D);
        this.setViewPort(a.clientWidth, a.clientHeight);
        this.setOptions(c)
    }
    function p(a) {
        var b;
        b = x + 180 * (H / w / d.TILES_HEIGHT) / 2;
        var c;
        c = B - 180 * (H / w / d.TILES_HEIGHT) / 2;
        s = a;
        s = Math.max(b, s);
        s = Math.min(c, s)
    }
    function n(a) {
        z = Math.min(a, A);
        z = Math.max(z, q);
        w = z * y
    }
    function l(a, b, c, f) {
        f = f || d.BEGIN_HEADING;
        a = (a - f) / 360;
        a = 0 > a ? Math.ceil( - a) + a: 1 < a ? a - Math.floor(a) : a;
        return new e(E * a, C * (b / 180) + C / 2)
    }
    function m() {
        a.add("domPanoRender",
        function() {
            J.refresh();
            K.dispatchEvent("refresh");
            return ! 0
        })
    }
    var v, u = 0,
    s = 0,
    z = 1,
    y, w = 1,
    q = 1,
    A = 4,
    x = -90,
    B = 50,
    F, G, H, D, E = d.TILES_WIDTH,
    C = d.TILES_HEIGHT,
    J, K;
    g.prototype = new c;
    g.prototype.setOptions = function(a) {
        a = a || {};
        v = a.svid;
        isNaN(a.heading) || (u = a.heading);
        isNaN(a.pitch) || p(a.pitch);
        isNaN(a.zoom) || n(a.zoom);
        this.preload = a.preload || !1;
        m()
    };
    g.prototype.setSvid = function(a) {
        v = a;
        m()
    };
    g.prototype.setViewPort = function(a, b) {
        G = a;
        H = b;
        y = 180 * H / (F * C);
        w = z * y;
        var c = w * d.TILE_WIDTH,
        c = Math.round(c);
        w = c / d.TILE_WIDTH;
        y = w / z;
        m()
    };
    g.prototype.setPov = function(a) {
        isNaN(a.heading) || (u = a.heading);
        isNaN(a.pitch) || p(a.pitch);
        isNaN(a.zoom) || n(a.zoom);
        m()
    };
    g.prototype.setHeading = function(a) {
        u = a;
        m()
    };
    g.prototype.setPitch = function(a) {
        p(a);
        m()
    };
    g.prototype.setZoom = function(a) {
        n(a);
        m()
    };
    g.prototype.getSvid = function() {
        return v
    };
    g.prototype.getHeading = function() {
        return u
    };
    g.prototype.getPitch = function() {
        return s
    };
    g.prototype.getZoom = function() {
        return z
    };
    g.prototype.getFov = function() {
        return F
    };
    g.prototype.getTileZoom = function() {
        return w
    };
    g.prototype.getCenter = function() {
        return l(u, s, w)
    };
    g.prototype.getBounds = function() {
        var a = this.getCenter(),
        b = G / w,
        c = H / w;
        return new f(a.x - b / 2, a.y - c / 2, b, c)
    };
    g.prototype.getCompositeBounds = function() {
        var a = this.getCenter(),
        b = G / w,
        c = H / w,
        d = a.x - b / 2,
        a = a.y - c / 2;
        if (0 > d) {
            var d = b + d,
            e = b - d,
            s = E - e,
            b = new f(0, a, d, c),
            c = new f(s, a, e, c),
            e = new h;
            e.addSubRectangle(c);
            e.addSubRectangle(b)
        } else d + b > E ? (e = E - d, b = new f(0, a, b - e, c), c = new f(d, a, e, c), e = new h, e.addSubRectangle(c), e.addSubRectangle(b)) : (e = new h, c = new f(d, a, b, c), e.addSubRectangle(c));
        return e
    };
    g.prototype.setMinPitch = function() {};
    g.prototype.setMaxPitch = function() {};
    g.prototype.getProjectionPosition = function(a, b) {
        for (var c = l(a, -b, w), d = this.getCompositeBounds(), f = d.getSubCount(), s, g = 0; g < f; g++) {
            var h = d.getSubRectangle(g);
            if (h.contains(c)) {
                s = h;
                break
            }
        }
        if (null != s) return 2 == f ? (d = d.getSubRectangle(0), d = s == d ? s.x: -d.width) : d = s.x,
        new e((c.x - d) * w, (c.y - s.y) * w)
    };
    return g
});
define("crystal/core/Scene3D", ["crystal/geom/Matrix3D", "crystal/core/Object3D"],
function(d, c) {
    function b(a) {
        this.world = [];
        this.canvas = a;
        this.viewPortMatrix = new d;
        this.appParams = {}
    }
    b.prototype.setCamera = function(a) {
        this.camera = a
    };
    b.prototype.setRenderer = function(a) {
        this.renderer = a
    };
    b.prototype.addObject3D = function(a) {
        this.world.push(a)
    };
    b.prototype.removeObject3D = function(a) {
        for (var b = this.world.length,
        c = 0; c < b; c++) if (this.world[c] == a) {
            this.world.splice(c, 1);
            break
        }
    };
    b.prototype.clear = function() {
        this.world = []
    };
    b.prototype.render = function() {
        this.renderer.preRender();
        for (var a = this.world.length,
        b = 0; b < a; b++) this.renderObject3D(this.world[b])
    };
    b.prototype.renderObject3D = function(a) {
        a.render(this)
    };
    b.prototype.clip = function(a, b) {
        for (var c = [], d = b.length / 3, k = 0; k < d; k++) {
            var g = b[3 * k],
            p = b[3 * k + 1],
            n = b[3 * k + 2],
            l = a[g],
            m = a[p],
            v = a[n],
            u = l.x,
            s = l.y,
            l = l.z,
            z = m.x,
            y = m.y,
            m = m.z,
            w = v.x,
            q = v.y,
            v = v.z; ( - 1 <= u && 1 >= u && -1 <= s && 1 >= s && 0 <= l && 1 >= l || -1 <= z && 1 >= z && -1 <= y && 1 >= y && 0 <= m && 1 >= m || -1 <= w && 1 >= w && -1 <= q && 1 >= q && 0 <= v && 1 >= v) && c.push(g, p, n)
        }
        return c
    };
    b.prototype.viewPort = function(a, b, c, e) {
        this.viewPortMatrix = new d;
        this.viewPortMatrix.glViewPort(a, b, c, e);
        this.camera && (this.camera.aspect = c / e, this.camera.updateProjectMatrix())/////////////////////
    };
    return b
});
define("crystal/core/Camera", ["crystal/geom/Matrix3D"],
function(d) {
    function c(b, a, c, h) {
        this.projectMatrix = new d;
        this.viewMatrix = new d;
        this.fovy = b;
        this.aspect = a;
        this.near = c;
        this.far = h;
        this.updateProjectMatrix()
    }
    c.prototype.updateProjectMatrix = function() {
        this.projectMatrix.glPerspective(this.fovy, this.aspect, this.near, this.far)
    };
    c.prototype.lookAt = function(b, a, c) {
        this.viewMatrix.glLookAt(b, a, c)
    };
    return c
});
define("crystal/primitives/Plane", ["crystal/core/Object3D", "crystal/geom/Vector3D"],
function(d, c) {
    function b(b) {
        d.apply(this);
        this._super = new d;
        a = b;
        this.build()
    }
    var a = 10;
    b.prototype = new d;
    b.prototype.constructor = b;
    b.prototype.build = function() {
        for (var b = a,
        d = a,
        e = 0,
        k = 0,
        g = 1 / b,
        p = 1 / d,
        e = 0; e <= b; e++) for (k = 0; k <= d; k++) this.vertices.push(new c(g * e, 0, p * k));
        for (e = 0; e < b; e++) for (k = 0; k < d; k++) {
            var g = e * (d + 1) + k,
            p = g + 1,
            n = (e + 1) * (d + 1) + k,
            l = n + 1;
            this.indices.push(g, p, n);
            this.indices.push(p, l, n)
        }
        for (e = 0; e < this.vertices.length; e++) this.uvtData.push(this.vertices[e].x, this.vertices[e].z);
        this.translateSelf(0, -2, 3)
    };
    b.prototype.render = function(a) {
        this._super.render.apply(this, arguments)
    };
    return b
});
define("crystal/primitives/Arrow", ["crystal/core/Object3D", "crystal/geom/Vector3D", "crystal/geom/Matrix3D"],
function(d, c, b) {
    function a(a) {
        d.apply(this);
        this.eventCoords = [];
        this._super = new d;
        this.build();
        this.addEventWatch();
        this.createLabel()
    }
    var f, h, e;
    a.prototype = new d;
    a.prototype.constructor = a;
    a.prototype.createLabel = function() {
        this.labelDom = document.createElement("div");
        var a = this.labelDom.style;
        a.position = "absolute";
        a.top = 0;
        a.left = 0;
        a.whiteSpace = "nowrap";
        a.fontSize = "13px";
        a.visibility = "hidden";
        a.cursor = 'pointer';
        a.zIndex = 9
    };
    a.prototype.setLabel = function(a) {
        this.labelDom.textContent = a
    };
    a.prototype._setLabelPos = function(a) {
        var b = this.labelDom,  trans_len = (__qq_pano_options._qq_h || document.documentElement.clientHeight) / __qq_pano_options._qq_trans_len;
        a ? (b.style.visibility = "visible", b.style.webkitTransform = "translate(" + (a.x - b.offsetWidth / 2) + "px, " + (a.y - b.offsetHeight / 2 + trans_len) + "px)") : b.style.visibility = "hidden"
    };
    a.prototype.build = function() {
        this.vertices[0] = new c(0, 0, 100);
        this.vertices[1] = new c(3, 0, 99);
        this.vertices[2] = new c(55, 0, 42);
        this.vertices[3] = new c(56, 0, 39);
        this.vertices[4] = new c(55, 0, 37);
        this.vertices[5] = new c(52, 0, 36);
        this.vertices[6] = new c(30, 0, 36);
        this.vertices[7] = new c(30, 0, 3);
        this.vertices[8] = new c(29, 0, 1);
        this.vertices[9] = new c(27, 0, 0);
        this.vertices[10] = new c( - 27, 0, 0);
        this.vertices[11] = new c( - 29, 0, 1);
        this.vertices[12] = new c( - 30, 0, 3);
        this.vertices[13] = new c( - 30, 0, 36);
        this.vertices[14] = new c( - 52, 0, 36);
        this.vertices[15] = new c( - 55, 0, 37);
        this.vertices[16] = new c( - 56, 0, 39);
        this.vertices[17] = new c( - 55, 0, 42);
        this.vertices[18] = new c( - 3, 0, 99);
        this.labelVertexIndex = this.vertices.push(new c(0, 0, 51)) - 1;
        this.extraVerticeNum = 1;
        this.eventCoords[0] = new c(60, 0, 0);
        this.eventCoords[1] = new c(60, 0, 100);
        this.eventCoords[2] = new c( - 60, 0, 100);
        this.eventCoords[3] = new c( - 60, 0, 0);
        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 2;
        this.indices[4] = 3;
        this.indices[5] = 4;
        this.indices[6] = 2;
        this.indices[7] = 4;
        this.indices[8] = 5;
        this.indices[9] = 5;
        this.indices[10] = 6;
        this.indices[11] = 0;
        this.indices[12] = 0;
        this.indices[13] = 2;
        this.indices[14] = 5;
        /**
        this.scaleSelf(0.01, 1, 0.01);
        this.translateSelf(0, -4, 0.3)*/
        this.scaleSelf(0.006, 1, 0.009);
        this.translateSelf(0, 1.2, 0.3)
    };
    a.prototype.render = function(a) {
        var c = a.appParams;
        e = a;
        f = c.heading;
        h = c.pitch;
        var c = this.getTranslatePos(3, 50 * Math.PI / 180),
        d = new b;
        d.appendTranslate(c.x, c.y, c.z);
        this.setModelMatrix(d);
        /**c = 15 + 15 * Math.abs(Math.cos(f * Math.PI / 180));*/
        c = 55 + 1 * Math.abs(Math.cos(f * Math.PI / 180));
        d = new b;
        d.appendTranslate(0, 0, -3);
        d.appendRotate(c * Math.PI / 180, [1, 0, 0]);
        d.appendTranslate(0, 0, 3);
        this.fixMatrix[0] = d;
        this._super.render.apply(this, arguments);
        this._setLabelPos(this.screenCoords[this.labelVertexIndex])
    };
    a.prototype.getTranslatePos = function(a, b) {
        var d = h * Math.PI / 180,
        e = Math.min(d, b),
        e = Math.max(d, -b),
        d = a * Math.cos(e) * Math.sin( - f * Math.PI / 180),
        l = a * Math.sin(e),
        e = a * Math.cos(e) * Math.cos( - f * Math.PI / 180);
        return new c(d, l, e)
    };
    a.prototype.reset = function() { (this.labelDom.parentNode || this.labelDom.parentElement) && this.labelDom.parentNode.removeChild(this.labelDom);
        e && e.removeObject3D(this)
    };
    a.prototype.removeListener = function() {
        this.clearListeners && this.clearListeners();
        this.removeEventWatch && this.removeEventWatch()
    };
    return a
});
define("crystal/renderer/CanvasRenderer", ["crystal/geom/Matrix3D", "common/Platform"],
function(d, c) {
    function b(a) {
        this.canvas = a;
        this._2dContext = a.getContext("2d");
        this._2dContext.translate(0, this.canvas.height / __qq_pano_options._qq_trans_len);
    }
    c.ios || c.chrome || c.uc ? b.prototype.preRender = function() {
        this._2dContext.clearRect(0, -this.canvas.height / __qq_pano_options._qq_trans_len, this.canvas.width, this.canvas.height)
    }: (console.warn("Fix android duplicate arrow bug."), b.prototype.preRender = function() {
        this._2dContext.clearRect(0, -this.canvas.height / __qq_pano_options._qq_trans_len, this.canvas.width, this.canvas.height);
        this.canvas.width += 1;
        this.canvas.width -= 1;
        this.canvas.getContext("2d").translate(0, this.canvas.height / __qq_pano_options._qq_trans_len);
    });
    b.prototype.render = function(a, b, c, d, k, g, p, n, l) {
        if (l.fixMatrix) {
            k = l.fixMatrix;
            a = 0;
            for (d = k.length; a < d; a++) p.prepend(k[a])
        }
        p.prepend(g);
        k = p.clone();
        d = [];
        g = [];
        a = [];
        var m = l.eventCoords || [];
        p = l.renderOptions || {};
        l.screenCoords = [];
        var v = b.length;
        a = 0;
        for (var u; a < v; a++) u = k.transformVector(b[a]),
        u.project(),
        d.push(u);
        a = n.clip(d, c);
        if (0 != a.length) {
            for (a = 0; a < v; a++) u = d[a],
            u = n.viewPortMatrix.transformVector(u),
            g.push(u.x, u.y),
            l.screenCoords.push(u);
            b = [];
            a = 0;
            for (d = m.length; a < d; a++) u = k.transformVector(m[a]),
            u.project(),
            u = n.viewPortMatrix.transformVector(u),
            b.push([u.x, u.y]);
            l.eventPolygon = b;
            n = this._2dContext;
            n.beginPath();
            n.strokeStyle = p.strokeStyle || "#000000";
            n.lineWidth = "2";
            n.fillStyle = p.fillStyle || "#ffffff";
            b = g[0];
            c = g[1];
            n.moveTo(b, c);
            a = 1;
            for (d = g.length / 2 - (l.extraVerticeNum || 0); a < d; a++) b = g[2 * a],
            c = g[2 * a + 1],
            n.lineTo(b, c);
            n.closePath();
            n.stroke();
            n.fill()
        }
        var qq_lls = [];
        for (var idx = 0; idx < g.length - 1;idx++) {
        	qq_lls.push([g[idx], g[idx + 1] + this.canvas.height / __qq_pano_options._qq_trans_len]);
        	idx++;
        }
        __qq_pano_options._qq_lls[l.labelDom.textContent] = qq_lls;
    };
    return b
});
define("core/SceneManager", "crystal/core/Scene3D crystal/core/Camera crystal/geom/Vector3D crystal/primitives/Plane crystal/geom/Matrix3D crystal/primitives/Arrow crystal/common/CanvasAction common/util crystal/renderer/CanvasRenderer".split(" "),
function(d, c, b, a, f, h, e, k, g) {
    function p(a) {
        this.panorama = a;
        var h = __qq_pano_options._qq_w || document.documentElement.clientWidth,
        k = __qq_pano_options._qq_h || document.documentElement.clientHeight;
        y = document.createElement("canvas");
        y.id = "mainCanvas";
        y.width = h;
        y.height = k;
        this.panorama.getEventLayer().appendChild(y);
        n = new d(y);
        m = new g(y);
        z = e.getInstance(y);
        l = new c(100 * Math.PI / 180, h / k, 0.1, 1E3);/////////////////////////////////////
        s = new b(0, 0, 0);
        v = new b(0, 0, -1);
        u = new b(0, 1, 0);
        this.syncLookup();
        n.viewPort(0, 0, h, k);
        n.setCamera(l);
        n.setRenderer(m);
        n.cubeProjectMatrix = new f;
        n.cubeProjectMatrix.glPerspective(l.fovy, l.aspect, l.near, l.far);
        var x = this;
        a.addListener("render",
        function() {
            x.render()
        });

        /////////////////////////////////////////

        __qq_pano_options.a = a;

        var g2d = y.getContext("2d");
        y.onmousemove = function(a) {
        	var ff = false, q_model = x.panorama.getModel();
        	for (var kk in __qq_pano_options._qq_lls) {
        		if(isPointInPolygon([a.layerX, a.layerY],__qq_pano_options._qq_lls[kk])) {ff = true;break;}
        	}
        	n.render();
        	if (!q_model || !__qq_pano_options.C._allowLoadTiles) return;
    		var proj = x.panorama.screenPosToGeoPos(a.layerX, a.layerY);
    		ff ? this.style.cursor = 'pointer' : this.style.cursor = 'auto';
    		if (!proj || !proj.x || !proj.y || ff) return;

    		var q_lng = __qq_pano_options.__qq_util.lngFromProjectionTo4326(proj.x), q_lat = __qq_pano_options.__qq_util.latFromProjectionTo4326(proj.y),
    			q_orix = __qq_pano_options.__qq_util.lngFromProjectionTo4326(q_model.detail.basic.orix), q_oriy = __qq_pano_options.__qq_util.latFromProjectionTo4326(q_model.detail.basic.oriy);
    		var dis = iD.geo.sphericalDistance([q_lng, q_lat], [q_orix, q_oriy]), str = "前方: " + parseInt(dis) + '米';
    		__qq_pano_options.dis = dis;
    		(!__qq_pano_options.inter && (dis >= 3 && dis < 300)) ? bezierEllipse2(g2d, a.layerX, a.layerY - y.height / __qq_pano_options._qq_trans_len, 50, 25, str) : false;
        };
        y.onmouseout = function(a) {
        	n.render();
        };
        /////////////////////////////////////////


    }
    function isPointInPolygon (point, polygon){
        var pts = polygon;//获取多边形点

        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

        var N = pts.length;
        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        var intersectCount = 0;//cross points count of x
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        var p1, p2;//neighbour bound vertices
        var p = point; //测试点

         p1 = pts[0];//left vertex
        for(var i = 1; i <= N; ++i){//check all rays
            if(p[0] == p1[0] && p[1] == p1[1]){
                return boundOrVertex;//p is an vertex
            }

            p2 = pts[i % N];//right vertex
            if(p[1] < Math.min(p1[1], p2[1]) || p[1] > Math.max(p1[1], p2[1])){//ray is outside of our interests
                p1 = p2;
                continue;//next ray left point
            }

            if(p[1] > Math.min(p1[1], p2[1]) && p[1] < Math.max(p1[1], p2[1])){//ray is crossing over by the algorithm (common part of)
                if(p[0] <= Math.max(p1[0], p2[0])){//x is before of ray
                    if(p1[1] == p2[1] && p[0] >= Math.min(p1[0], p2[0])){//overlies on a horizontal ray
                        return boundOrVertex;
                    }

                    if(p1[0] == p2[0]){//ray is vertical
                        if(p1[0] == p[0]){//overlies on a vertical ray
                            return boundOrVertex;
                        }else{//before ray
                            ++intersectCount;
                        }
                    }else{//cross point on the left side
                        var xinters = (p[1] - p1[1]) * (p2[0] - p1[0]) / (p2[1] - p1[1]) + p1[0];//cross point of lng
                        if(Math.abs(p[0] - xinters) < precision){//overlies on a ray
                            return boundOrVertex;
                        }

                        if(p[0] < xinters){//before ray
                            ++intersectCount;
                        }
                    }
                }
            }else{//special case when ray is crossing through the vertex
                if(p[1] == p2[1] && p[0] <= p2[0]){//p crossing over p2
                    var p3 = pts[(i+1) % N]; //next vertex
                    if(p[1] >= Math.min(p1[1], p3[1]) && p[1] <= Math.max(p1[1], p3[1])){//p[1] lies between p1[1] & p3[1]
                        ++intersectCount;
                    }else{
                        intersectCount += 2;
                    }
                }
            }
            p1 = p2;//next ray left point
        }

        if(intersectCount % 2 == 0){//偶数在多边形外
            return false;
        } else { //奇数在多边形内
            return true;
        }
}
    function bezierEllipse2(ctx, x, y, a, b, str) {
       var k = .5522848,
       ox = a * k, // 水平控制点偏移量
       oy = b * k; // 垂直控制点偏移量

       ctx.strokeStyle = '#ffffff';
	   ctx.fillStyle = '#000000';
       ctx.beginPath();
       //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
       ctx.moveTo(x - a, y);
       ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
       ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
       ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
       ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
       ctx.closePath();
       ctx.stroke();
       //ctx.fill();

       ctx.strokeText(str, x - 28, y - 5);
	   ctx.fillText(str, x - 28, y - 5);
    };
    var n, l, m, v, u, s, z, y;
    p.prototype.extendSupportEvent = function(a) {
        z.canvas.addEventListener(a,
        function(b) {
            z.check(b, a)
        },
        !1)
    };
    p.prototype.syncLookup = function() {
        var a = new f;
        a.appendRotate(this.panorama.getPitch() * Math.PI / 180, [1, 0, 0]);
        a.appendRotate(this.panorama.getHeading() * Math.PI / 180, [0, 1, 0]);
        l.lookAt(s, a.transformVector(v), u);
        var a = this.panorama,
        b = new f,
        c = this.panorama.getCore();
        b.appendRotate(a.getPitch() * Math.PI / 180, [1, 0, 0]);
        b.appendRotate(a._getCoreHeading() * Math.PI / 180, [0, 1, 0]);
        n.coreMatrix = b;
        a = c.getFov() * Math.PI / 180;
        l.fovy != a && (l.fovy = a, l.updateProjectMatrix())
    };
    p.prototype.render = function() {
        n.appParams.heading = this.panorama.getHeading();
        n.appParams.pitch = this.panorama.getPitch();
        n.appParams.pano = this.panorama;
        this.syncLookup();
        n.render()
    };
    p.prototype.getProjectionPosition = function(a, b) {
        this.syncLookup();
        var c = this.panorama;
        c.getCore();
        var d = c.getFov(),
        c = c.getViewHeight(),
        d = 0.5 / Math.tan(d * Math.PI / 360) * c,
        d = k.getWorldPosition(a, b, 2 * d),
        d = n.coreMatrix.transformVector(d),
        c = l.projectMatrix.transformVector(d);
        c.project();
        if (0 != n.clip([c], [0, 0, 0]).length) return c = n.viewPortMatrix.transformVector(c),
        {
            z: d.z,
            x: c.x,
            y: c.y
        }
    };
    p.prototype.setHeading = function(a) {};
    p.prototype.setPitch = function(a) {};
    p.prototype.setViewport = function(a, b) {
        n.viewPort(0, 0, a, b);
        y.width = a;
        y.height = b;
        y.getContext("2d").translate(0, b / __qq_pano_options._qq_trans_len);
        this.syncLookup();
        this.render()
    };
    p.prototype.setZoom = function() {};
    p.prototype.addObject3D = function(a) {
        a = k.isArray(a) ? a: [a];
        k.each(a,
        function(a) {
            n.addObject3D(a)
        })
    };
    p.prototype.getScene = function() {
        return n
    };
    p.prototype.getCamera = function() {
        return l
    };
    return p
});
define("common/Event", [],
function() {
    function d(a, b) {
        return Math.sqrt(Math.pow(b.pageX - a.pageX, 2) + Math.pow(b.pageY - a.pageY, 2))
    }
    var c = 0,
    //b = "ongesturestart" in window,
    b = false,
    a = function(a) {
        this.elem = a;
        this.supportEvents = {};
        this.handlers = {};
        this.touches = [];
        this.startDelta = void 0
    };
    a.prototype = {
        on: function(a, b) {//console.log(arguments);
            var d = "eid" + (new Date).getTime().toString(32) + ++c;
            if (!this.hasEvent(a)) {
                var f = this,
                h = function(b) {
                    //"mousedown" == a && f.addTouch(b.changedTouches);
                    //b.extendData = f.getTouchData(b.changedTouches);
                    //"mouseup" == a && f.delTouch(b.changedTouches);

                    "mousedown" == a && f._addTouch(b);
                    b.extendData = f._getTouchData(b);
                    "mouseup" == a && f.delTouch(b);

                    return f.fire(a, [b])
                };
                this.elem.addEventListener(a, h, !1);
                this.supportEvents[a] = h;
                this.handlers[a] = {}
            }
            this.handlers[a][d] = {
                handler: b
            };
            return d
        },
        off: function(a, b) {
            if (this.hasEvent(a)) {
                var c, d = this.handlers[a];
                for (c in d) if (c == b) {
                    delete d[c];
                    break
                }
                this.hasEvent(a) || (this.elem.removeEventListener(a, this.supportEvents[a], !1), delete this.supportEvents[a], delete this.handlers[a]);
                if (!this.hasEvent()) return this.destory(),
                null
            }
        },
        fire: function(a, b) {
            if (this.hasEvent(a)) {
                var c = this.handlers[a];
                offList = [];
                for (eKey in c) ! 0 === c[eKey].handler.apply(this.elem, b) && offList.push(eKey);
                for (; offList.length;) this.off(a, offList.pop())
            }
        },
        hasEvent: function(a) {
            var b;
            if (0 == arguments.length) {
                for (b in this.handlers) if (b) return ! 0;
                return ! 1
            }
            if (!this.handlers[a]) return ! 1;
            for (b in this.handlers[a]) if (b) return ! 0;
            return ! 1
        },
        destory: function() {
            for (var a in this.supportEvents) this.elem.removeEventListener(a, this.supportEvents[a], !1);
            this.handlers = this.supportEvents = this.elem = null
        },
        addTouch: function(a) {
            for (var b, c = 0,
            f = a.length; c < f; c++) b = a[c],
            this.touches.push({
                id: b.identifier,
                pageX: b.pageX,
                pageY: b.pageY
            });
            2 == this.touches.length && (this.startDelta = d(this.touches[0], this.touches[1]))
        },
        _addTouch: function(a) {
            //console.log('_addTouch', a);
            var _a = [a];
            for (var b, c = 0, f = _a.length; c < f; c++) b = _a[c],
            this.touches.push({
                id: b.identifier,
                pageX: b.pageX,
                pageY: b.pageY
            });
            2 == this.touches.length && (this.startDelta = d(this.touches[0], this.touches[1]))
        },
        delTouch: function(a) {
            this.touches = []
        },
        _delTouch: function(a) {
        	//console.log('_delTouch', a);
        	this.touches = []
        },
        getTouchData: function(a) {
            var b, c, f; (b = 1 < this.touches.length ? !0 : !1) ? c = d(this.touches[0], this.touches[1]) : this.touches[0] && (f = {
                x: a[0].pageX - this.touches[0].pageX,
                y: a[0].pageY - this.touches[0].pageY
            });
            return {
                isGesturing: b,
                startDelta: this.startDelta,
                delta: c,
                offset: f
            }
        },
        _getTouchData: function(a) {
            //console.log('_getTouchData', a);
            var b, c, f;
            (b = 1 < this.touches.length ? !0 : !1) ? c = d(this.touches[0], this.touches[1]) : this.touches[0] && (f = {
                x: a.pageX - this.touches[0].pageX,
                y: a.pageY - this.touches[0].pageY
            });
            return {
                isGesturing: b,
                startDelta: this.startDelta,
                delta: c,
                offset: f
            }
        }
    };
    var f = {},
    h = {
        isSupportEvent: function(a, b) {
            b = b || document.createElement("div");
            a = "on" + a;
            var c = a in b;
            b.setAttribute && !c && (b.setAttribute(a, "return;"), c = "function" === typeof b[a]);
            return c
        },
        isSupportedGesturechange: b,
        on: function(b, d, h) {
            var p = b.getAttribute("lKey"),
            n = f[p];
            if (!n) {
                var n = new a(b),
                l = p = "eid" + (new Date).getTime().toString(32) + ++c;
                f[l] = n;
                b.setAttribute("lKey", l)
            }
            return {
                lKey: p,
                eName: d,
                eKey: n.on(d, h)
            }
        },
        off: function(a) {
            for (a = "[object Array]" === Object.prototype.toString.call(a) ? a: [a]; a.length;) {
                var b = a.pop(),
                c = f[b.lKey];
                c && null === c.off(b.eName, b.eKey) && delete f[b.lKey]
            }
        },
        fire: function(a, b, c) {
            if ((a = a.getAttribute("lKey")) && f[a]) c = c ? c.unshift(void 0) : [void 0],
            f[a].fire(b, c)
        },
        clearAll: function() {
            for (var a in f) f[a].destory(),
            f[a] = null;
            f = null
        },
        drag: function(a, b, c, f,out) {
            var h = this,
            l, m, v, u, s, z = !0;
            /**
            return this.on(a, "mousedown",
            function(y) {
                l || (l = h.on(a, "mousemove",
                function(f) {
                    f.extendData.isGesturing || (u = f.changedTouches[0].pageX, s = f.changedTouches[0].pageY, z ? (b && b.apply(a, [f]), m = {
                        pageX: u,
                        pageY: s,
                        timeStamp: f.timeStamp
                    },
                    z = !1) : 2 < d(m, f.changedTouches[0]) && (v = {
                        x: u - m.pageX,
                        y: s - m.pageY,
                        t: f.timeStamp - m.timeStamp
                    },
                    m = {
                        pageX: u,
                        pageY: s,
                        timeStamp: f.timeStamp
                    },
                    c.apply(a, [f, v])))
                }), h.on(a, "mouseup",
                function(b) {
                    f && f.apply(a, [b, b.extendData.offsetByPrev]);
                    h.off(l);
                    l = null;
                    return z = !0
                }))
            })*/
            return this.on(a, "mousedown",
                    function(y) {
                        l || (l = h.on(a, "mousemove",
                        function(f) {
                           // f.extendData.isGesturing ||
                            (u = f.pageX, s = f.pageY, z ? (b && b.apply(a, [f]), m = {
                                pageX: u,
                                pageY: s,
                                timeStamp: f.timeStamp
                            },
                            z = !1) : 2 < d(m, f) && (v = {
                                x: u - m.pageX,
                                y: s - m.pageY,
                                t: f.timeStamp - m.timeStamp
                            },
                            m = {
                                pageX: u,
                                pageY: s,
                                timeStamp: f.timeStamp
                            },
                            c.apply(a, [f, v])))
                        }),
                            h.on(a, "mouseout",
                            function(b) {
                                //f && f.apply(a, [b, false]);
                                out && out.apply(a, b);
                                l && h.off(l);
                                l = null;
                                return z = !0
                            }),
                            h.on(a, "mouseup",
                        function(b) {
                            f && f.apply(a, [b, b.extendData.offsetByPrev]);
                            l && h.off(l);
                            l = null;
                            return z = !0
                        }))
                    })
        },
        dbclick: function(a, b) {
            /**
        	var c, f;
            return this.on(a, "mousedown",
            function(a) {
                a.extendData.isGesturing || (f = {
                    pageX: a.touches[0].pageX,
                    pageY: a.touches[0].pageY,
                    time: (new Date).getTime()
                },
                c && 250 > f.time - c.time && 20 > d(f, c) ? b && b(a) : c = f)
            })*/
        	var c, f;
            return this.on(a, "mousedown",
            function(a) {
                a.extendData.isGesturing || (f = {
                    pageX: a.pageX,
                    pageY: a.pageY,
                    time: (new Date).getTime()
                },
                c && 250 > f.time - c.time && 20 > d(f, c) ? b && b(a) : c = f)
            })
        },
        clickHandlers: [],
        click: function(a, b) {
            /**
        	var c, d = null,
            f = -1 < b.toString().indexOf(".stopPropagation()"),
            l = this.on(a, "mousedown",
            function(a) {
                d ? (clearTimeout(d), d = null, c = 0, h.clickHandlers = []) : a.extendData.isGesturing || (c = new Date, f && a.stopPropagation())
            }),
            m = this.on(a, "mouseup",
            function(m) {
                if (!m.extendData.isGesturing && m && m.extendData && m.extendData.offset) {
                    var u = m.extendData.offset.x,
                    s = m.extendData.offset.y;
                    400 > u * u + s * s && 300 > new Date - c && (f && m.stopPropagation(), h.clickHandlers.push({
                        handler: b,
                        elem: a
                    }), d || (d = setTimeout(function() {
                        for (; h.clickHandlers[0];) {
                            var a = h.clickHandlers.shift();
                            a.handler.apply(a.elem, [m])
                        }
                        d = null
                    },
                    249)))
                }
            });
            return [l, m]*/
        	var c, d = null,
            f = -1 < b.toString().indexOf(".stopPropagation()"),
            l = this.on(a, "mousedown",
            function(a) {
                d ? (clearTimeout(d), d = null, c = 0, h.clickHandlers = []) : a.extendData.isGesturing || (c = new Date, f && a.stopPropagation())
            }),
            m = this.on(a, "mouseup",
            function(m) {
                if (!m.extendData.isGesturing && m && m.extendData && m.extendData.offset) {
                	if (__qq_pano_options.dis > 300) return;//暂且这么处理
                    var u = m.extendData.offset.x,
                    s = m.extendData.offset.y;
                    400 > u * u + s * s && 300 > new Date - c && (f && m.stopPropagation(), h.clickHandlers.push({
                        handler: b,
                        elem: a
                    }), d || (d = setTimeout(function() {
                        for (; h.clickHandlers[0];) {
                            var a = h.clickHandlers.shift();
                            a.handler.apply(a.elem, [m])
                        }
                        d = null
                    },
                    249)))
                }
            });
            return [l, m]
        },
        stopNextClick: function() {
            h.clickHandlers = []
        },
        gesture: function(a, c, d, f) {
            if (b) {
                var h = [];
                c && h.push(this.on(a, "gesturestart", c));
                d && h.push(this.on(a, "gesturechange", d));
                f && h.push(this.on(a, "gestureend", f));
                return h
            }
        }
    };
    window.onbeforeunload = function() {
        try {
            h.clearAll(),
            h = null
        } catch(a) {}
    };
    return h
});
define("core/PanoEvents", [],
function() {
    function d(c, b, a) {
        this._panoDom = c;
        this._startTouch = {
            pageX: null,
            pageY: null,
            timeStamp: null
        };
        this._lastDragEvt = this._clickTimer = this._touch2 = this._startTouch = null;
        this._listener = {
            onClick: null,
            onDbClick: null,
            onDragStart: null,
            onDrag: null,
            onDragEnd: null
        };
        this._listener = b; ! 1 !== a && this.enable()
    }
    d.prototype.CLICK_DURATION = 130;
    d.prototype.CLICK_INTERVAL = 170;
    d.prototype.CLICK_OFFSET = 30;
    d.prototype.handleEvent = function(c) {
        c.stopPropagation();
        c.preventDefault();
        /**
        var b = c.targetTouches;
        switch (c.type) {
        case "mousedown":
            if (1 == b.length) {
                b = b[0];
                if (!this._startTouch) {
                    this._startTouch = {
                        pageX: b.pageX,
                        pageY: b.pageY,
                        timeStamp: c.timeStamp
                    };
                    break
                }
                console.assert(!this._touch2, "\u6e05\u9664\u7b2c\u4e8c\u6b21touchstart\u5f02\u5e38");
                if (c.timeStamp - this._startTouch.timeStamp > this.CLICK_DURATION + this.CLICK_INTERVAL) {
                    console.log("Second touch start tool long, stop dbclick.");
                    break
                }
                var a = this._startTouch;
                if (Math.abs(b.pageX - a.pageX) > this.CLICK_OFFSET && Math.abs(b.pageY - a.pageY) > this.CLICK_OFFSET) {
                    console.log("Second touch start too far, stop dbclick.");
                    break
                }
                this._touch2 = {
                    pageX: b.pageX,
                    pageY: b.pageY,
                    timeStamp: c.timeStamp
                }
            } else this._clickTimer && (clearTimeout(this._clickTimer), this._clickTimer = null),
            this._touch2 = this._startTouch = null,
            this._lastDragEvt && this._dispatchDragEnd(c);
            break;
        case "mousemove":
            this._lastDragEvt ? this._dispatchDrag(c) : this._startTouch && this._dispatchDragStart(c);
            this._clickTimer && (clearTimeout(this._clickTimer), this._touch2 = this._clickTimer = null);
            this._startTouch = null;
            break;
        case "mouseup":
        case "touchcancel":
            b = this._startTouch;
            a = this._touch2;
            if (b) if (console.assert(!this._lastDragEvt, "startTouch not cleared when move."), a) c.timeStamp - a.timeStamp <= this.CLICK_DURATION && !this._lastDragEvt && (clearTimeout(this._clickTimer), this._clickTimer = null, this._dispatchDbClick(c));
            else {
                if (this._clickTimer) {
                    console.log("Click timer is set, cancel it.");
                    clearTimeout(this._clickTimer);
                    this._startTouch = this._clickTimer = null;
                    break
                }
                c.timeStamp - b.timeStamp <= this.CLICK_DURATION ? this._clickTimer = setTimeout(this._dispatchClick, this.CLICK_DURATION + this.CLICK_INTERVAL, c, this) : (this._startTouch = null, console.log("Click canceled, hold too long:" + (c.timeStamp - b.timeStamp) + ", which is greater than " + this.CLICK_DURATION))
            } else console.assert(!a, "No start touch but second touch for click");
            this._lastDragEvt && this._dispatchDragEnd(c);
            break;
        default:
            console.warn("Unexpected event for PanoEventDetector", c)
        }*/
        var b = c.targetTouches;
        switch (c.type) {
        case "mousedown":
            if (1 == b.length) {
                b = b[0];
                if (!this._startTouch) {
                    this._startTouch = {
                        pageX: b.pageX,
                        pageY: b.pageY,
                        timeStamp: c.timeStamp
                    };
                    break
                }
                console.assert(!this._touch2, "\u6e05\u9664\u7b2c\u4e8c\u6b21touchstart\u5f02\u5e38");
                if (c.timeStamp - this._startTouch.timeStamp > this.CLICK_DURATION + this.CLICK_INTERVAL) {
                    console.log("Second touch start tool long, stop dbclick.");
                    break
                }
                var a = this._startTouch;
                if (Math.abs(b.pageX - a.pageX) > this.CLICK_OFFSET && Math.abs(b.pageY - a.pageY) > this.CLICK_OFFSET) {
                    console.log("Second touch start too far, stop dbclick.");
                    break
                }
                this._touch2 = {
                    pageX: b.pageX,
                    pageY: b.pageY,
                    timeStamp: c.timeStamp
                }
            } else this._clickTimer && (clearTimeout(this._clickTimer), this._clickTimer = null),
            this._touch2 = this._startTouch = null,
            this._lastDragEvt && this._dispatchDragEnd(c);
            break;
        case "mousemove":
            this._lastDragEvt ? this._dispatchDrag(c) : this._startTouch && this._dispatchDragStart(c);
            this._clickTimer && (clearTimeout(this._clickTimer), this._touch2 = this._clickTimer = null);
            this._startTouch = null;
            break;
        case "mousedown":
        case "touchcancel":
            b = this._startTouch;
            a = this._touch2;
            if (b) if (console.assert(!this._lastDragEvt, "startTouch not cleared when move."), a) c.timeStamp - a.timeStamp <= this.CLICK_DURATION && !this._lastDragEvt && (clearTimeout(this._clickTimer), this._clickTimer = null, this._dispatchDbClick(c));
            else {
                if (this._clickTimer) {
                    console.log("Click timer is set, cancel it.");
                    clearTimeout(this._clickTimer);
                    this._startTouch = this._clickTimer = null;
                    break
                }
                c.timeStamp - b.timeStamp <= this.CLICK_DURATION ? this._clickTimer = setTimeout(this._dispatchClick, this.CLICK_DURATION + this.CLICK_INTERVAL, c, this) : (this._startTouch = null, console.log("Click canceled, hold too long:" + (c.timeStamp - b.timeStamp) + ", which is greater than " + this.CLICK_DURATION))
            } else console.assert(!a, "No start touch but second touch for click");
            this._lastDragEvt && this._dispatchDragEnd(c);
            break;
        default:
            console.warn("Unexpected event for PanoEventDetector", c)
        }
    };
    d.prototype._dispatchClick = function(c, b) {
        b = b || this;
        var a = b._startTouch;
        console.assert(a, "Dispatching click but no startTouch.");
        clearTimeout(b._clickTimer);
        b._clickTimer = null;
        b._startTouch = null;
        b._touch2 = null;
        b._listener.onClick({
            type: "click",
            pageX: a.pageX,
            pageY: a.pageY,
            timeStamp: c.timeStamp
        })
    };
    d.prototype._dispatchDbClick = function(c) {
        var b = this._startTouch,
        a = this._touch2;
        c = {
            type: "dbclick",
            pageX: (b.pageX + a.pageX) / 2,
            pageY: (b.pageY + a.pageY) / 2,
            timeStamp: c.timeStamp
        };
        this._touch2 = this._startTouch = null;
        this._listener.onDbClick(c)
    };
    d.prototype._dispatchDragStart = function(c) {
        c = c.changedTouches[0];
        var b = this._startTouch;
        this._lastDragEvt = c = {
            type: "dragstart",
            offsetX: c.pageX - b.pageX,
            offsetY: c.pageY - b.pageY,
            pageX: c.pageX,
            pageY: c.pageY
        };
        this._listener.onDragStart(c)
    };
    d.prototype._dispatchDrag = function(c) {
        c = c.changedTouches[0];
        var b = this._lastDragEvt;
        this._lastDragEvt = c = {
            type: "drag",
            offsetX: c.pageX - b.pageX,
            offsetY: c.pageY - b.pageY,
            pageX: c.pageX,
            pageY: c.pageY
        };
        this._listener.onDrag(c)
    };
    d.prototype._dispatchDragEnd = function(c) {
        c = this._lastDragEvt;
        this._lastDragEvt = null;
        c.type = "dragend";
        c.offsetX = 0;
        c.offsetY = 0;
        this._listener.onDragEnd(c)
    };
    d.prototype.enable = function() {
        /**
    	this._panoDom.addEventListener("mousedown", this, !0);
        this._panoDom.addEventListener("mousemove", this, !0);
        this._panoDom.addEventListener("mouseup", this, !0);
        this._panoDom.addEventListener("touchcancel", this, !0)*/

    	this._panoDom.addEventListener("mousedown", this, !0);
        this._panoDom.addEventListener("mousemove", this, !0);
        this._panoDom.addEventListener("mouseup", this, !0);
        this._panoDom.addEventListener("touchcancel", this, !0)
    };
    d.prototype.disable = function() {
        /**
    	this._panoDom.removeEventListener("mousedown", this, !0);
        this._panoDom.removeEventListener("mousemove", this, !0);
        this._panoDom.removeEventListener("mouseup", this, !0);
        this._panoDom.removeEventListener("touchcancel", this, !0)*/

    	this._panoDom.removeEventListener("mousedown", this, !0);
        this._panoDom.removeEventListener("mousemove", this, !0);
        this._panoDom.removeEventListener("mouseup", this, !0);
        this._panoDom.removeEventListener("touchcancel", this, !0)
    };
    return d
});
define("core/Panorama", "core/CSSPanoCore core/CSSPanoCore common/EventDispatcher common/Platform core/SceneManager crystal/geom/Matrix3D crystal/geom/Rectangle crystal/geom/Vector3D common/util common/Event crystal/geom/Point core/PanoEvents".split(" "),
    //function(d, c, b, a, f, h, e, k, g, p, n, l) {
    function(csspanoCore1, csspanoCore2, eventDispatcher, commonPlatform, sceneManager, geomMatrix3D, geomRectangle, vector3D, commonUtil, commonEvent, geomPoint, corePanoEvents) {
        function corePanorama(e, k, m) {
            eventDispatcher.apply(this);
            k.svid = k.pano;
            this._containerDom = e;
            this._pitch = this._heading = this._svid = this._eventDetector = this._controlLayer = this._eventLayer = this._tileLayer = this._panoContainer = null;
            this._minPitch = this.DEFAULT_MIN_PITCH;
            this._maxPitch = this.DEFAULT_MAX_PITCH;
            this._panoCore = this._zoom = null;
            this.config = {
                svDataUrl: null,
                fromProduct: null,
                fromChannel: null,
                logo: null,
                fovy: null,
                renderer: null
            };
            this.data = {
                geoPos: {
                    x: null,
                    y: null
                },
                cameraHeight: 2.3,
                cameraDir: 0,
                address: null,
                scenicId: null
            };
            this._cachedData = {};
            this._geoToWorldMatrix = new geomMatrix3D;
            this._viewWidth = e.clientWidth;
            this._viewHeight = e.clientHeight;
            this.stopOverlayChanged = !1;
            this.isOverlayVisible = !0;
            this.isForceRefresh = !1;
            this._model = null;
            this._onSvDataLoaded = commonUtil.bindThis(this._onSvDataLoaded, this);
            commonPlatform.android && (this.MAX_ZOOM = 3);
            m && (this.config = m);
            k = k || {};//console.log('7',k);
            this.setHeading(k.heading);
            this.setPitch(k.pitch);
            this.setZoom(k.zoom);
            this.setSvid(k.pano);
            this._buildContainer();
            this.markers = {
                length: 0,
                content: {}
            };
            var u = this;
            this.addListener("render",
                function() {
                    u.refreshMarkersPosition()
                });
            commonPlatform.supportsCSS3() && "dom" !== this.config.renderer ? (this._renderer = "css", this._panoCore = new csspanoCore1(this._tileLayer, k)) : (this._renderer = "dom", k.preload = commonPlatform.isQQBrowser4(), this._panoCore = new csspanoCore2(this._tileLayer, k));
            k.svid && this.setSvid(k.svid);
            this.scene = new sceneManager(this);
            this._panoCore.get3DOverlays && this.scene.addObject3D(this._panoCore.get3DOverlays());
            this.stopOverlayChanged = !1;
            this._initPanoListeners()
        }
        var v;
        commonUtil.inherits(corePanorama, eventDispatcher);
        corePanorama.prototype.DEFAULT_MIN_PITCH = -90;
        corePanorama.prototype.DEFAULT_MAX_PITCH = 5;
        corePanorama.prototype.MIN_ZOOM = 1;
        corePanorama.prototype.MAX_ZOOM = 4;
        corePanorama.prototype._updateGeoMatrix = function() {
            var a = model.detail.basic,
                a = new k(a.x, a.y, this.data.cameraHeight);
            target = new k(0, 1, 0);
            var b = new geomMatrix3D;
            b.appendRotate(30 * Math.PI / 180, [0, 0, 1]);
            target = b.transformVector(target);
            target = target.add(a);
            new k(0, 0, 1);
            target = [target.x, target.y, target.z]
        };
        corePanorama.prototype._initPanoListeners = function() {
            this._eventDetector = new corePanoEvents(this._tileLayer, this);
            var a = this;
            this._panoCore.addListener("tileLoading",
                function(b) {
                    a.dispatchEvent("tile_loading", b.data)
                });
            var b = null;
            this._panoCore.addListener("tileLoaded",
                function(c) {
                    b || (b = a.addListener("click",
                        function() {
                            a.stopOverlayChanged || (a.isOverlayVisible = !a.isOverlayVisible, a.dispatchEvent("overlay_visible_changed", {
                                isOverlayVisible: a.isOverlayVisible
                            }))
                        }));
                    a.dispatchEvent("tile_loaded")
                });
            this._panoCore.addListener("refresh",
                function(b) {
                    a.dispatchEvent("render")
                });
            this._panoCore.addListener("thumbLoaded",
                function(b) {
                    a.dispatchEvent("thumb_loaded")
                })
        };
        corePanorama.prototype.onClick = function(a) {
            console.log("pano event:", a.type)
        };
        corePanorama.prototype.onDbClick = function(a) {
            console.log("pano event:", a.type)
        };
        corePanorama.prototype.onDragStart = function(a) {
            console.log("pano event:", a.type)
        };
        corePanorama.prototype.onDrag = function(a) {
            console.log("pano event:", a.type)
        };
        corePanorama.prototype.onDragEnd = function(a) {
            console.log("pano event:", a.type)
        };
        corePanorama.prototype._buildContainer = function() {
            /***/
            this._panoContainer = commonUtil.createElem("div", {
                position: "absolute",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            });
            this._panoContainer.className = "pano_container";
            this._containerDom.appendChild(this._panoContainer);
            v = commonUtil.createElem("div", {
                position: "absolute",
                "z-index": "30",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "none"
            });
            v.id = "mask_layer";
            v.className = "mask_layer";
            document.body.appendChild(v);
            this._tileLayer = commonUtil.createElem("div", {
                position: "absolute",
                zIndex: "1",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            });
            this._tileLayer.className = "tile_container";
            this._panoContainer.appendChild(this._tileLayer);
            //logo div层
            var a = commonUtil.createElem("div", {
                position: "absolute",
                right: "2px",
                width: "73px",
                height: "20px",
                "z-index": "9",
                overflow: "hidden",
                bottom: "0px",
                "background-image": "url(" + this.config.logo + ")",
                "background-size": "73px 20px"
            });
            this._panoContainer.appendChild(a);
            this._eventLayer = commonUtil.createElem("div", {
                position: "absolute",
                "z-index": "10",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            });
            /*****************************************///蓝屏问题
            this._eventLayer.onselectstart = function(a) {
                a.preventDefault();
                a.stopPropagation()
            };
            /*****************************************/
            this._eventLayer.className = "event_layer";
            this._panoContainer.appendChild(this._eventLayer);
            this._controlLayer = commonUtil.createElem("div", {
                position: "absolute",
                zIndex: "20",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "1px"
            });
            this._controlLayer.className = "control_layer";
            this._eventLayer.appendChild(this._controlLayer);
            commonEvent.on(this._controlLayer, "dragging",
                function(a) {
                    a.preventDefault()
                });
            commonEvent.on(this._controlLayer, "dblclick",
                function(a) {
                    a.preventDefault();
                    a.stopPropagation()
                });
            var b = this;
            commonEvent.click(this._eventLayer,
        function(a) { (!b.onadvance || b.isMiniAlbum() || !b.onadvance(a)) /**&& b.dispatchEvent("click", {
                    rawEvent: a
            })*/
        })

        };
        corePanorama.prototype.addPlugin = function(a) {
            a.addToPano(this)
        };
        corePanorama.prototype.getOverlayVisible = function() {
            return this.isOverlayVisible
        };
        corePanorama.prototype.setOverlayVisible = function(a) {
            this.isOverlayVisible !== a && (this.isOverlayVisible = a, this.dispatchEvent("overlay_visible_changed", {
                isOverlayVisible: this.isOverlayVisible
            }))
        };
        corePanorama.prototype.getModel = function() {
            return this._model
        };
        corePanorama.prototype._svidChangedAnimation = function(a) {
            if (this._panoCore && "dom" !== this._renderer) {
                var b = this._zoom,
                    c = null,
                    d = this._panoCore,
                    e = function(a) {
                        null === c && (c = a);
                        a -= c;
                        d.setZoom(b + 0.0020 * a);
                        1E3 > a ? requestAnimationFrame(e) : d.setZoom(b)
                    };
                requestAnimationFrame(e)
            }
        };
        corePanorama.prototype.setSvid = function(a) {
            if (!a || "string" != typeof a) throw Error("Pano id must be string");
            a != this._svid && (this._svid = a, this._panoCore && this._panoCore.setSvid(a), this.stopOverlayChanged = !0, this._loadPanoInfo())
        };
        corePanorama.prototype.getSvid = function() {
            return this._svid
        };
        corePanorama.prototype._loadPanoInfo = function() {
            try {
                var a = localStorage && localStorage.getItem("suid");
                if (!a) {
                    var b = (new Date).getUTCMilliseconds(),
                        a = Math.round(2147483647 * Math.random()) * b % 1E10;
                    localStorage && localStorage.setItem("suid", a)
                }
            } catch(c) {
                a = ""
            }
            b = this.config;
            commonUtil.loadJsonp(b.svDataUrl + "/sv?pf\x3dhtml5\x26svid\x3d" + this._svid + "\x26suid\x3d" + a + "\x26from\x3d" + b.fromProduct + "\x26ch\x3d" + b.fromChannel, this._onSvDataLoaded)
        };
        corePanorama.prototype._onSvDataLoaded = function(b) {
            if ( - 1 == b.info.error) console.error("\u573a\u666f\u70b9\u7d22\u5f15\u6570\u636e\u9519\u8bef\uff01", b),
                this.dispatchEvent("error", {
                    msg: "\u573a\u666f\u70b9\u7d22\u5f15\u6570\u636e\u9519\u8bef\uff01"
                });
            else {
                var c = b.detail.basic;
                this._svid != c.svid ? console.warn("Request svid and response svid not the same!") : (this._svid = c.svid, this._model = b, this.data.cameraDir = Number(c.dir), this.data.scenicId = c.scenic_id, this._minPitch = c.pitch_min || this.DEFAULT_MIN_PITCH, this._maxPitch = c.pitch_max || this.DEFAULT_MAX_PITCH, c = {
                    heading: this._getCoreHeading(),
                    pitch: this.getPitch(),
                    preload: commonPlatform.isQQBrowser4(),
                    svid: this._svid
                },
            this._panoCore.setOptions(c), this.stopOverlayChanged = !1, this.dispatchEvent("svid_changed", b))
            }
        };
        corePanorama.prototype.faceToPlace = function(a, b, c, d) {
            var e = this;
            e.stopOverlayChanged = !0;
            commonUtil.getXfPanoInfo(a, b, c, d,
                function(a) {
                    e.stopOverlayChanged = !1;
                    if ( - 1 == a.info.error) console.error("\u5438\u9644\u63a5\u53e3\u8fd4\u56de\u9519\u8bef", a),
                        e.dispatch("error", "\u5438\u9644\u63a5\u53e3\u8fd4\u56de\u9519\u8bef");
                    else {
                        var d = e.data.geoPos,
                            d = commonUtil.getPOV(d.x, d.y, b, c);
                        e.setHeading(d.heading);
                        e.setSvid(a.detail.svid)
                    }
                })
        };
        corePanorama.prototype.addMarker = function(a, b, c, d) {
            if (!this.getModel()) return ! 1;
            var e = commonUtil.getRandomID();
            a = {
                elem: c,
                heading: a,
                pitch: b,
                isVisibile: void 0 == d ? this.isOverlayVisible: d
            };
            this._avoidMarkers(a);
            this.markers.content[e] = a;
            this.markers.length++;
            return e
        };
        corePanorama.prototype._avoidMarkers = function(a) {
            var b = this.markers.content,
                c = parseInt(a.elem.style.width || a.elem.clientWidth) + 2,
                d = parseInt(a.elem.style.height || a.elem.clientHeight) + 2,
                f = 0.5 / Math.tan(this.config.fovy * Math.PI / 360) * this.getViewHeight(),
                h = 360 * Math.atan(0.5 * c / f) / Math.PI,
                x = 360 * Math.atan(0.5 * d / f) / Math.PI,
                g,
                k,
                m;
            for (m in b) g = b[m],
                c = parseInt(g.elem.style.width || g.elem.clientWidth) + 2,
                d = parseInt(g.elem.style.height || g.elem.clientHeight) + 2,
                c = 360 * Math.atan(0.5 * c / f) / Math.PI,
                d = 360 * Math.atan(0.5 * d / f) / Math.PI,
                c = new geomRectangle(g.heading, g.pitch, c, d),
                k = new geomRectangle(a.heading, a.pitch, h, x),
                180 < g.heading - a.heading ? k.x += 360 : -180 > g.heading - a.heading && (c.x += 360),
            k.intersects(c) && (a.pitch = g.pitch + d)
        };
        corePanorama.prototype.getHeadingRangeByCenter = function(a) {
            var b = this.getFov(),
                b = 0.5 / Math.tan(b * Math.PI / 360) * this.getViewHeight();
            return 360 * Math.atan(0.5 * a / b) / Math.PI
        };
        corePanorama.prototype.getAllMarkers = function() {
            return this.markers.content
        };
        corePanorama.prototype.getMarker = function(a) {
            return this.markers.content[a]
        };
        corePanorama.prototype.removeMarker = function(a) {
            if (a && this.markers.content[a]) {
                var b = this.markers.content[a].elem;
                b.ontouchend = b.ontouchstart = null;
                b.parentNode.removeChild(b);
                delete this.markers.content[a];
                this.markers.length--
            } else if (!a) for (b in this.markers.content) this.removeMarker(b)
        };
        corePanorama.prototype.showMarker = function(a) {
            this._refreshMarkers(a, !0, !0)
        };
        corePanorama.prototype.hideMarker = function(a) {
            this._refreshMarkers(a, !1, !1, !1)
        };
        corePanorama.prototype.setIsForceRefresh = function(a) {
            this.isForceRefresh = a
        };
        corePanorama.prototype.refreshMarkersPosition = function(a) {
            if (!this.isForceRefresh && !this.isOverlayVisible) return ! 1;
            this._refreshMarkers(a, !0, !0)
        };
        corePanorama.prototype._refreshMarkers = function(a, b, c, d) {
            var e = this.markers,
                f = this,
                h, g, k;
            if (0 == e.length) return ! 0;
            var m = function(a) {
                if (a) {
                    var e = f._panoCore;
                    if (b) {
                        var g = f._getCoreHeading(a.heading),
                            s = a.pitch;
                        if (h = e.getProjectionPosition ? e.getProjectionPosition(g, s) : f.scene.getProjectionPosition(g, s)) a.elem.style.left = h.x + "px",
                            a.elem.style.top = h.y + "px"
                    }
                    c && void 0 === d && (h && !1 === a.isVisibile ? (a.elem.style.display = "block", a.isVisibile = !0) : void 0 === h && !0 == a.isVisibile && (a.elem.style.display = "none", a.isVisibile = !1));
                    void 0 !== d && (!0 === d && !1 == a.isVisibile ? (a.elem.style.display = "", a.isVisibile = !0) : !0 == a.isVisibile && (a.elem.style.display = "none", a.isVisibile = !1))
                }
            };
            if (a) {
                g = 0;
                for (k = a.length; g < k; g++) m(e.content[a[g]])
            } else for (g in e.content) m(e.content[g]);
            this.dispatchEvent("marker_refresh");
            return this
        };
        corePanorama.prototype.setPov = function(a, b) {//console.log('9');
            this.setHeading(a.heading);
        this.setPitch(a.pitch)
        };
        corePanorama.prototype.getPOIPos = function(a, b) {
            var c = this._getCoreHeading(a),
                d = -b;
            return this._panoCore.getProjectionPosition ? this._panoCore.getProjectionPosition(c, d) : this.scene.getProjectionPosition(c, d)
        };
        corePanorama.prototype._getCoreHeading = function(a) {
            return (a || this._heading) - this.data.cameraDir
        };
        corePanorama.prototype.setHeading = function(a) {
            if (null != a) {
                a = Number(a);
                if (isNaN(a)) throw TypeError("Heading must be number.");
                a %= 360;
                0 > a && (a += 360);
                a !== this._heading && (this._heading = a, this._panoCore && (this._panoCore.setHeading(this._getCoreHeading()), this.dispatchEvent("pov_change")))
            }
        };
        corePanorama.prototype.getHeading = function() {
            return this._heading
        };
        corePanorama.prototype.setPitch = function(a) {
            if (null != a) {
                a = Number(a);
                if (isNaN(a)) throw TypeError("Pitch must be number.");
                a %= 360;
                0 > a && (a += 360);
                270 < a ? a -= 360 : 180 < a && (a = 180 - a);
                a = Math.min(a, this._maxPitch);
                a = Math.max(this._minPitch, a);
                a !== this._pitch && (this._pitch = a, this._panoCore && (this._panoCore.setPitch(a), this.dispatchEvent("pov_change")))
            }
        };
        corePanorama.prototype.getPitch = function() {
            return this._pitch
        };
        corePanorama.prototype.setZoom = function(a) {
            if (null != a) {
                a = Number(a);
                if (isNaN(a)) throw TypeError("Zoom must be number.");
                a = Math.max(Math.min(a, this.MAX_ZOOM), this.MIN_ZOOM);
                a !== this._zoom && (this._zoom = a, this._panoCore && (this._panoCore.setZoom(a), this.dispatchEvent("pov_change")))
            }
        };
        corePanorama.prototype.getZoom = function() {
            return this._zoom
        };
        corePanorama.prototype.getCore = function() {
            return this._panoCore
        };
        corePanorama.prototype.getFov = function() {
            return this._panoCore.getFov()
        };
        corePanorama.prototype.getContainer = function() {
            return this._containerDom
        };
        corePanorama.prototype.getMaskLayer = function() {
            return v
        };
        corePanorama.prototype.getControlLayer = function() {
            return this._controlLayer
        };
        corePanorama.prototype.getTileLayer = function() {
            return this._tileLayer
        };
        corePanorama.prototype.getEventLayer = function() {
            return this._eventLayer
        };
        corePanorama.prototype.getViewWidth = function() {
            return this._viewWidth
        };
        corePanorama.prototype.getViewHeight = function() {
            return this._viewHeight
        };
        var u = null;
        corePanorama.prototype.updateViewport = function(a, b) {
            a = a || this._containerDom.clientWidth;
            b = b || this._containerDom.clientHeight;
            a == this._viewWidth && b == this._viewHeight || (this.stopOverlayChanged = !0, null !== u && clearTimeout(u), u = setTimeout(function() {
                    self.stopOverlayChanged = !1;
                    u = null
                },
                200), this._viewWidth = a, this._viewHeight = b, this._panoCore.setViewPort(a, b), this.scene.setViewport(a, b), this.dispatchEvent("resize"))
        };
        corePanorama.prototype.setViewPort = function(a, b) {
            this.updateViewport(a, b)
        };
        corePanorama.prototype.addOverlay = function(a) {
            this.scene.addObject3D(a)
        };
        corePanorama.prototype.screenPosToHeadingPitch = function(a, b) {
            var c = this.scene.getScene().viewPortMatrix.clone();
            c.invert();
            var d = new vector3D(a, b, 1),
                d = c.transformVector(d),
                c = this.scene.getCamera().projectMatrix.clone();
            c.invert();
            d = c.transformVector(d);
            c = this.scene.getScene().coreMatrix.clone();
            c.invert();
            var d = c.transformVector(d),
                c = new geomPoint(0, -1),
                e = new geomPoint(d.x, d.z);
            e.normalize();
            c = 180 * Math.acos(c.dotProduct(e)) / Math.PI;
            0 > d.x && (c = 360 - c);
            e = new vector3D(d.x, 0, d.z);
            e.normalize();
            var f = d.clone();
            f.normalize();
            e = 180 * Math.acos(f.dotProduct(e)) / Math.PI;
            90 < e && (e = 180 - e);
            0 > d.y && (e = -e);
            return {
                heading: c,
                pitch: e
            }
        };
        corePanorama.prototype.screenPosToGeoPos = function(a, b) {
            var c = this.screenPosToHeadingPitch(a, b);
            if (! (0 <= c.pitch)) {
                var d = c.heading + this.data.cameraDir,
                    e = -2.3 / Math.tan(c.pitch * Math.PI / 180),
                    f = e * Math.cos(d * Math.PI / 180),
                    e = e * Math.sin(d * Math.PI / 180),
                    h = this.getModel().detail.basic;
                return {
                    x: h.x + e,
                    y: h.y + f,
                    h: 0,
                    heading: d,
                    pitch: c.pitch
                }
            }
        };
        corePanorama.prototype.isMiniAlbum = function() {
            return this.data.scenicId ? !0 : !1
        };
        corePanorama.prototype.getRenderType = function() {
            return "css" === this._renderer ? 1 : 0
        };
        return corePanorama;
    });
define("plugins/QuickAdvance", ["require", "common/util"],
function(d) {
    function c(a, b) {
        var c = a.x - b.x,
        d = a.y - b.y;
        return Math.sqrt(c * c + d * d)
    }
    var b = d("common/util"),
    a;
    return {
        /**
    	addToPano: function(d) {
            a = d;
            a.onadvance = function(d) {
                a: {
                    d = d.changedTouches[0];
                    var e = a.getModel().detail.basic.type;
                    if ( - 1 !== ["park", "street"].indexOf(e) && (d = a.screenPosToGeoPos(d.clientX, d.clientY))) {
                        for (var e = [], f = a.getModel().detail, g = f.roads || [], p = 0; p < g.length; p++) e = e.concat(g[p].points);
                        var e = e.concat(f.vpoints),
                        e = e.concat(f.points || []),
                        f = Number.MAX_VALUE,
                        n = null,
                        g = null,
                        p = a.getModel().detail.basic,
                        n = c(d, p);
                        if (5 > n) d = void 0;
                        else {
                            for (n = e.length - 1; 0 <= n; n--) {
                                var l = e[n];
                                if (l.svid !== a.getSvid()) {
                                    var m = c(d, l);
                                    c(p, l);
                                    var v = b.getPOV(p.x, p.y, l.x, l.y),
                                    v = Math.abs(a.getHeading() - v.heading) % 180;
                                    m < f && 90 > v && (f = m, g = l)
                                }
                            }
                            d = g
                        }
                        if (d) {
                            a.setSvid(d.svid);
                            a.scene.setViewport(innerWidth, innerHeight);
                            d = d.svid;
                            break a
                        }
                    }
                    d = void 0
                }
                return d
            }
        }*/

    	addToPano: function(d) {
        a = d;
        a.onadvance = function(d) {
            a: {
                d = d;
                var e = a.getModel().detail.basic.type;
                if ( - 1 !== ["park", "street"].indexOf(e) && (d = a.screenPosToGeoPos(d.clientX, d.clientY))) {
                    for (var e = [], f = a.getModel().detail, g = f.roads || [], p = 0; p < g.length; p++) e = e.concat(g[p].points);
                    var e = e.concat(f.vpoints),
                    e = e.concat(f.points || []),
                    f = Number.MAX_VALUE,
                    n = null,
                    g = null,
                    p = a.getModel().detail.basic,
                    n = c(d, p);
                    //if (5 > n) d = void 0;
                    if (__qq_pano_options.dis < 3) d = void 0;
                    else {
                        for (n = e.length - 1; 0 <= n; n--) {
                            var l = e[n];
                            if (l.svid !== a.getSvid()) {
                                var m = c(d, l);
                                c(p, l);
                                var v = b.getPOV(p.x, p.y, l.x, l.y),
                                v = Math.abs(a.getHeading() - v.heading) % 180;
                                m < f && 90 > v && (f = m, g = l)
                            }
                        }
                        d = g
                    }
                    if (d) {
                        a.setSvid(d.svid);
                        a.scene.setViewport(__qq_pano_options._qq_w || innerWidth, innerHeight);
                        d = d.svid;
                        break a
                    }
                }
                d = void 0
            }
            return d
        }
    }
    }
});
define("common/cookies", {
    getItem: function(d) {
        if (!document.cookie) return "";
        if ((d = document.cookie.match(RegExp("\\b" + d + "\x3d([^;]*)"))) && 1 < d.length) return decodeURIComponent(d[1])
    },
    set: function(d, c) {
        document.cookie = d + "\x3d" + encodeURIComponent(c)
    }
});
define("application/stat", ["require", "common/cookies", "application/urlManager", "application/Config"],
function(d) {
    var c = d("common/cookies"),
    b = d("application/urlManager"),
    a = d("application/Config");
    window._speedMark || (/**console.log("Page load start time not marked."),*/ window._speedMark = new Date);
    return {
        fromProduct: "",
        fromChannel: "",
        appId: "",
        os: "",
        report: function(a, d) {
            var e;
            if (! (e = c.getItem("suid"))) e = (new Date).getUTCMilliseconds(),
            e = Math.round(2147483647 * Math.random()) * e % 1E10,
            c.set("suid", e);
            var k = e;
            e = new Image(1, 1);
            k = {
                appid: this.appId,
                suid: k,
                logid: a,
                rand: Math.random(),
                from: this.fromProduct,
                ch: this.fromChannel
            };
            if (d) for (var g in d) k[g] = d[g];
            e.src = "http://pr.map.qq.com/pingd?" + b.encodeParams(k)
        },
        openMapAppBySearch: function() {
            this.report("openbysearch_click");
            this.report("openbyall_click")
        },
        openMapAppBySharePoi: function() {
            this.report("openbyshare_click");
            this.report("openbyall_click")
        },
        downloadMapAppBySharePoi: function() {
            this.report("downloadbyshare_click");
            this.report("downloadbyall_click")
        },
        downloadMapAppBySearch: function() {
            this.report("downloadbysearch_click");
            this.report("downloadbyall_click")
        },
        sharePoiCancelMenu: function() {
            this.report("cancel_share_poi_menu_click")
        },
        clickdetailPoiMarker: function() {
            this.report("detailpoi_click")
        },
        openSharePoi: function() {
            this.report("share_poi_open")
        },
        openPanoMark: function() {
            this.report("pano_mark_open")
        },
        clickPanoMark: function() {
            this.report("pano_mark_click")
        },
        clickAddressbar: function() {
            this.report("adressbar_click")
        },
        clickSearchBtn: function() {
            this.report("searchbar_click")
        },
        tiledLoaded1: function() {
            this.report("tileload_time", {
                time: Date.now() - _speedMark.getTime()
            })
        },
        clickMiniAlbumThumb: function() {
            this.report("pano_thumbnail_click")
        },
        clickMiniAlbumFloorCtrl: function() {
            this.report("pano_floor_control_click")
        },
        clickMiniAlbumFloor: function() {
            this.report("pano_floor_click")
        },
        clickRegionQuitBtn: function() {
            this.report("region_quit_btn_click")
        },
        clickRegionEntranceMarker: function() {
            this.report("region_entrance_marker_click")
        },
        renderCore: function(a) {
            1 === a ? this.report("css3") : this.report("dom")
        },
        minimapXfFailed: function() {
            this.report("minimap_xf_error")
        },
        netSpeed: function() {
            var b = new Image,
            c = new Date;
            self = this;
            b.src = a.getImgUrl("images/t.png?q\x3d" + Math.random());
            b.onload = function() {
                var a = parseInt(new Date - c, 10);
                self.report("speed", {
                    cdnspeed: a
                })
            };
            b = null
        }
    }
});
define("plugins/AddressBar", ["application/urlManager", "common/util", "application/Config", "application/stat"],
function(d, c, b, a) {
    function f() {
        m = h();
        l.addListener("POIDetail_refresh",
        function(a) {
            m.style.visibility = 0 < a.data.data.length ? "hidden": "visible"
        });
        //document.body.appendChild(m);
        var apc = iD.util.getDom('KDSEditor-Panorama-Container');
        apc && apc.appendChild(m);
        m.addEventListener("mouseup",
        function(b) {
            a.clickAddressbar()
        })
    }
    function h() {
        m = document.createElement("div");
        m.id = "addressbar";m.className = "addressbar";
        var a = m.style;
        a.visibility = "hidden";
        a.color = "#dbdbdb";
        a.textShadow = "0 1px 1px #000";
        a.position = "absolute";
        a.fontSize = "14px";
        a.whiteSpace = "nowrap";
        a.textOverflow = "ellipsis";
        a.overflow = "hidden";
        /**a.zIndex = 9;*/
        a.zIndex = 1000;
        a.height = "20px";
        a.maxWidth = l.getViewWidth() - 16 - 43 + "px";
        v = document.createElement("span");
        m.appendChild(v);
        e(m);
        __qq_pano_options.m = m;
        return m
    }
    function e(a) {
        a.addEventListener("click",
        function(a) {
            a.stopPropagation();
            l.dispatchEvent("addressbar_click", {
                originEvent: a
            })
        },
        !1);
        /**
        a.addEventListener("mousedown",
        function(a) {
            a.stopPropagation()
        },
        !1);
        a.addEventListener("mouseup",
        function(a) {
            a.stopPropagation()
        },
        !1);*/
        a.addEventListener("mousedown",
        function(a) {
            a.stopPropagation()
        },
        !1);
        a.addEventListener("mouseup",
        function(a) {
            a.stopPropagation()
        },
        !1);
        a = null
    }
    //加载地址用的，左上角显示地址的
    function k() {
        var a = l.getModel().detail.basic,
        b = c.latFromProjectionTo4326(a.y),
        a = c.lngFromProjectionTo4326(a.x);
        c.loadJsonp("http://sv.map.qq.com/rarp?lat\x3d" + b + "\x26lng\x3d" + a,
        function(a) {
            0 == a.info.errno ? (l.data.addr = a.detail.AD, l.dispatchEvent("addr_loaded")) : console.error("\u5730\u5740\u89e3\u6790\u5931\u8d25\uff01")
        })
    }
    function g() {
        v.textContent = l.data.addr || "";
        m.style.visibility = ""
    }
    function p(a) {
        v.textContent = a && a.data || "";
        m.style.visibility = ""
    }
    var n = d.hash,
    l, m, v;
    return {
        addToPano: function(a) {
            l = a;
            0 != n.addr && (l.addListener("addr_loaded", g), l.addListener("MiniAlbum_addressbar_changed", p), l.addListener("svid_changed",
            function(a) {
            	__qq_pano_options.m || f();
                l.isMiniAlbum() || k();
                "detail" !== n.poi || l.isMiniAlbum() || !m ? (a = m.style, a.left = 16 + 0/**此处暂时这么改*/ + "px", a.top = "20px", a.paddingRight = "", a.bottom = "", a.boxSizing = "") : (a = m.style, a.left = "1px", a.bottom = "1px", a.paddingRight = "75px", a.boxSizing = "border-box", a.top = "")
            }), l.addListener("resize",
            function() {
                m && (m.style.maxWidth = l.getViewWidth() - 16 - 43 + "px")
            }), l.addListener("fadeOutAddressBar",
            function() {
                m && (m.style.opacity = 0)
            }), l.addListener("fadeInAddressBar",
            function() {
                m && (m.style.opacity = 1)
            }))
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/ClickToGo", ["crystal/primitives/Arrow", "crystal/primitives/Plane", "application/urlManager", "common/Event"],
function(d, c, b, a) {
    function f(a) {
        var b = m.getModel().detail.vpoints.filter(function(b, c, d) {
            return b.svid == a
        });
        return 1 == b.length ? b[0].link: []
    }
    function h(a, b) {
        var c = b.filter(function(b, c, d) {
            return 0 != b.points.filter(function(b, c, d) {
                return b.svid == a
            }).length
        });
        return 1 == c.length ? c[0] : null
    }
    function e(a) {
        if (!a || 0 == a.length) return [];
        var b = m.getSvid(),
        c = [];
        h(b, a) && h(b, a).points.forEach(function(a, d, e) {
            a.svid == b && (e[d - 1] ? c.push(e[d - 1]) : c = c.concat(f(b)), 1 != e.length && (e[d + 1] ? c.push(e[d + 1]) : c = c.concat(f(b))))
        });
        return c
    }
    function k(a) {
        return a.filter(function(a, b, c) {
            return 1 == a.connected
        })
    }
    function g() {
        v.reset();
        m.scene.render()
    }
    function p(a) {
        var b = Math.PI;
        a += b / 8;
        a >= 2 * b && (a -= 2 * b);
        a = parseInt(4 * a / b);
        return "\u5317 \u4e1c\u5317 \u4e1c \u4e1c\u5357 \u5357 \u897f\u5357 \u897f \u897f\u5317".split(" ")[a]
    }
    function n(b) {
        var c, d;
        b.forEach(function(b, e, f) {
            function h(a) {
                g();
                m.setSvid(u)
            }
            var x = v.getArrow(),
            k = m.getModel().detail.basic,
            n = b.x - k.x,
            k = b.y - k.y,
            k = Math.acos(k / Math.sqrt(n * n + k * k)),
            k = 0 > n ? 2 * Math.PI - k: k;
            d || (d = k);

            ///////////////////////////////////////////////////
            x.labelDom.addEventListener("mousedown",
            function(a) {//鼠标跟随问题
                a.stopPropagation();
            },
            !1);
            x.labelDom.addEventListener("mouseup",
            function(a) {
                a.stopPropagation();
                g();
                m.setSvid(u);
            },
            !1);

            var n = p(k),
            l = Math.abs(k - c);
            l > Math.PI && (l = Math.PI - l);
            l = Math.PI;
            d && (l = Math.abs(k - d), l > Math.PI && (l = Math.PI - l));
            /**e === f.length - 1 && */(x.setLabel(n), m.getControlLayer().appendChild(x.labelDom), c = k);
            x.rotateSelf( - k, [0, 1, 0]);
            m.scene.addObject3D(x);
            var u = b.svid,
            D = !1;
            x.addListener("mousedown",
            function(a) {
                a.data.evt.stopPropagation();
                a.data.evt.preventDefault();
                D = !0;
                x.renderOptions = {
                    fillStyle: "#ccffff"
                };
                m.scene.render()
            });
            x.addListener("mousemove",
            function(a) {
                D = !1;
                x.renderOptions = {};
                m.scene.render()
            });
            x.addListener("mouseup",
            function(b) {
                D && (D = null, h.apply(this, [b]), setTimeout(function() {
                    a.stopNextClick()
                },
                0))
            })
        });
        m.scene.render()
    }
    var l = b.hash,
    m, v = {
        inUse: [],
        getArrow: function() {
            var a = new d;
            this.inUse.push(a);
            return a
        },
        reset: function() {
            for (; this.inUse[0];) {
                var a = this.inUse.pop();
                a.removeListener();
                a.reset()
            }
        }
    };
    return {
        addToPano: function(a) {
            0 != l.arrow && (m = a, m.addListener("thumb_loaded",
            function(b) {
                setTimeout(function() {
                    a.scene.syncLookup();
                    var b;
                    b = m.getModel();
                    var c = b.detail.roads;
                    b = c ? e(c) : (b = b.detail.points) ? k(b) : null;
                    b && n(b)
                },
                500)
            }), m.addListener("svid_changed", g))
        },
        removeFromPano: function() {}
    }
});
define("plugins/Dragging", ["common/Event"],
function(d) {
    function c() {
        k = null;
        h.dispatchEvent("movestart")
    }
    function b(a, b) {
        var c = h.getHeading() - 0.25 * b.x,
        d = h.getPitch() - 0.25 * b.y;
        h.setPov({
            pitch: d,
            heading: c
        });
        k = b
    }
    function a(a, b) {
        if (k) {
            var c = 0.25 * k.x / k.t * g,
            d = 0.25 * k.y / k.t * g,
            z = Math.sqrt(c * c + d * d),
            y = 1;
            z > n * p && (y = n * p / z, z *= y, c *= y, d *= y);
            var w = z / n,
            q = c * c / (2 * n);
            0 > c && (q = -q);
            var A = d * d / (2 * n);
            0 > d && (A = -A);
            var x = Date.now(),
            B = h.getHeading(),
            F = h.getPitch(),
            G = l.Circ.easeOut;
            f();
            e = setInterval(function() {
                var a = Date.now() - x;
                if (a > w) f();
                else {
                    var b = G(a, B, -q, w),
                    a = G(a, F, -A, w);
                    h.setPov({
                        heading: b,
                        pitch: a
                    })
                }
            },
            100 / 60);
            k = null
        }
    }
    function f() {
        e && (clearInterval(e), e = null, h.dispatchEvent("moveend"))
    }
    var h, e, k, g = 1,
    p = 1200,
    n = 180 / (p * p),
    l = {
        Circ: {
            easeIn: function(a, b, c, d) {
                return - c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
            },
            easeOut: function(a, b, c, d) {
                return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
            },
            easeInOut: function(a, b, c, d) {
                return 1 > (a /= d / 2) ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b: c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
            }
        }
    };
    return {
        addToPano: function(e) {
            h = e;
            d.drag(h.getEventLayer(), c, b, a);
            //h.getEventLayer().addEventListener("mousedown", f, !0)
            h.getEventLayer().addEventListener("mousedown", f, !0)
        },
        removeFromPano: function(a) {}
    }
});
define("common/Filter", [],
function() {
    function d(c) {
        this.list = [];
        this.maxLength = c | 4
    }
    d.prototype.getNext = function(c) {
        this.list.length > this.maxLength && this.list.shift();
        this.list.push(c);
        c = this.list;
        if (0 == c.length) c = [];
        else {
            for (var b = [], a = c.length, d = 0; d < a; d++) b.push(c[d]);
            b.sort();
            c = b
        }
        return c[Math.floor(c.length / 2)]
    };
    d.prototype.clear = function() {
        this.list = []
    };
    return d
});
define("plugins/Gyrometer", ["common/Filter", "application/urlManager", "common/Platform", "common/Animation"],
function(d, c, b, a) {
    function f(a) {
        function c() {
            M.listener || (M.listener = setInterval(function() {
                WeixinJSBridge.invoke("getHeadingAndPitch", {},
                function(a) {
                    if (a && void 0 !== a.heading && void 0 !== a.pitch) - 1E4 != a.heading && -1E4 != a.pitch && (M.update(parseFloat(a.heading), parseFloat(a.pitch)), g || (g = !0, ("wx" == E.ref || 1 == E.direction) && h(a.heading)));
                    else if (!g && (clearInterval(M.listener), M.enable = !1, 0 < b.iphone || 0 < b.ipad || 4 <= b.android)) g = !0,
                    ("wx" == E.ref || 1 == E.direction) && F(h)
                })
            },
            O))
        }
        D.removeListener("svid_changed", f);
        e();
        var d = !1,
        g = !1;
        4 <= b.android ? O = 60 : 0 < b.android && (O = 120);
        window.WeixinJSBridge ? (d = !0, c()) : document.addEventListener("WeixinJSBridgeReady",
        function() {
            d || (d = !0, c())
        })
    }
    function h(a) {
        if (isNaN(a)) 0 < b.android && 4 > b.android && clearInterval(M.listener);
        else {
            var c = D.getHeading();
            D.dispatchEvent("turnstart", {
                beginHeading: c,
                endHeading: a,
                speed: 0.07
            })
        }
    }
    function e() {
        b.supportsCSS3() ? window.addEventListener("deviceorientation", G) : L = Y;
        D.getContainer().addEventListener("mouseup",
        function(a) {
            L[C] && "function" == typeof L[C].click && L[C].click()
        });
        D.addListener("movestart",
        function(a) {
            L[C] && "function" == typeof L[C].dragging && L[C].dragging()
        });
        D.addListener("moveend",
        function(a) {
            L[C] && "function" == typeof L[C].dragend && L[C].dragend()
        });
        D.addListener("turnstart",
        function(a) {
            L[C] && "function" == typeof L[C].turnstart && L[C].turnstart(a.data)
        });
        D.addListener("turnend",
        function() {
            L[C] && "function" == typeof L[C].turnend && L[C].turnend()
        })
    }
    function k(a, b) {
        L[C] && "function" === typeof L[C].shake && L[C].shake()
    }
    function g() {
        C = "dragging"
    }
    function p() {
        C = "normal"
    }
    function n() {
        C = "dragging"
    }
    function l() {
        C = "normal"
    }
    function m(a) {
        C = "turn";
        J = "dragging";
        A(a)
    }
    function v() {
        C = "normal";
        x()
    }
    function u() {
        C = "dragging";
        x()
    }
    function s() {
        switch (J) {
        case "normal":
            v();
            break;
        case "gyro":
            C = "gyro";
            x();
            w();
            break;
        case "dragging":
            u()
        }
        J = ""
    }
    function z(a) {
        C = "turn";
        J = "hover";
        A(a)
    }
    function y(a) {
        C = "turn";
        A(a);
        J = "normal"
    }
    function w() {
        I = K = void 0; ("wx" == E.ref || 1 == E.direction) && "gyro" !== J && F(h);
        window.addEventListener("deviceorientation", H)
    }
    function q() {
        I = K = void 0;
        window.removeEventListener("deviceorientation", H)
    }
    function A(a) {
        T = B(a.beginHeading, a.endHeading, a.speed)
    }
    function x() {
        T && T.pause();
        T && D.dispatchEvent("turnstop");
        T = null
    }
    function B(b, c, d, e) {
        e = c - b;
        var f = b,
        h = c,
        g = !1;
        180 < e && 360 > e ? (h = 0, g = !0) : -180 > e && -360 < e && (h = 360, g = !0);
        Math.abs(f - h);
        var x = new a({
            begin: f,
            end: h,
            duration: Math.abs(f - h) / d,
            onEnd: function() {
                g ? (f = {
                    "0": 360,
                    360 : 0
                } [h], B(f, c, d, !0)) : (x = null, D.dispatchEvent("turnend"))
            }
        },
        function(a) {console.log('11');
            D.setHeading(a);
            D.dispatchEvent("turn", {
                currentHeading: a,
                speed: d + "heading/ms"
            })
        });
        x.play();
        return x
    }
    function F(a) {
        function b(d) {
            var e, f;
            "undefined" !== typeof d.webkitCompassHeading ? (e = d.webkitCompassHeading, "undefined" !== typeof window.orientation && (e += window.orientation)) : e = 360 - d.alpha;
            "undefined" !== typeof d.webkitCompassAccuracy && (f = d.webkitCompassAccuracy);
            for (c = e; 360 <= c;) c -= 360;
            for (; 0 > c;) c += 360;
            c = Math.round(c);
            if (0 != c && (void 0 === f || -1 != f)) a(c),
            window.removeEventListener("deviceorientation", b, !1)
        }
        var c;
        "ondeviceorientation" in window ? window.addEventListener("deviceorientation", b, !1) : a(NaN)
    }
    function G(a) {
        if (! (3 > Math.abs(a.beta) && 3 > Math.abs(a.gamma))) {
            if (Q) {
                var b = W.getNext(a.beta),
                c = Math.abs(Q - b),
                c = Math.min(c, 90 - c - -90);
                Q = b
            } else Q = W.getNext(a.beta);
            if (R) {
                var d = X.getNext(a.gamma),
                e = Math.abs(R - d),
                e = Math.min(e, 180 - e - -180);
                R = d
            } else R = X.getNext(a.gamma);
            if (P) {
                a = V.getNext(a.alpha.toFixed(1));
                var f = Math.abs(P - a),
                f = Math.min(f, 360 - f);
                P = a
            } else P = V.getNext(a.alpha);
            10 < e && 10 < c ? (R = Q = P = null, k()) : 90 >= b && (50 <= b && 7 < f) && (R = Q = P = null, k())
        }
    }
    function H(a) {
        if (! (3 > Math.abs(a.beta) && 3 > Math.abs(a.gamma))) {
            var c;
            if (M.enable) c = M.getPov(),
            c.pitch = -c.pitch;
            else if (0 < b.iphone || 0 < b.ipad) {
                c = Math.PI / 180;
                var d = {
                    yaw: a.alpha * c,
                    pitch: a.beta * c,
                    roll: a.gamma * c
                };
                a = Math.cos(d.yaw);
                c = Math.sin(d.yaw);
                var e = Math.cos(d.pitch),
                f = Math.sin(d.pitch),
                h = Math.cos(d.roll),
                d = Math.sin(d.roll),
                e = [c * d - a * f * h, -a * e, a * f * d + c * h, e * h, -f, -e * d, c * f * h + a * d, c * e, -c * f * d + a * h];
                0.9999 < e[3] ? (a = Math.atan2(e[2], e[8]), e = Math.PI / 2, c = 0) : -0.9999 > e[3] ? (a = Math.atan2(e[2], e[8]), e = -Math.PI / 2, c = 0) : (a = Math.atan2( - e[6], e[0]), c = Math.atan2( - e[5], e[4]), e = Math.asin(e[3]));
                a = d = {
                    yaw: a,
                    pitch: e,
                    roll: c
                };
                c = {
                    heading: 180 * -a.yaw / Math.PI,
                    pitch: 180 * -a.pitch / Math.PI
                }
            } else return;
            void 0 === K && (K = c.heading, U = D.getHeading());
            void 0 === I && (I = c.pitch, S = D.getPitch());
            a = S + I - c.pitch;
            c = U + c.heading - K;
            N ? (0.4 > Math.abs(N.heading - c) ? c = N.heading: N.heading = c, 0.4 > Math.abs(N.pitch - a) ? a = N.pitch: N.pitch = a) : N = {
                pitch: a,
                heading: c
            };
            D.setPov({
                pitch: a,
                heading: c
            })
        }
    }
    var D, E = c.hash,
    C = "normal",
    J = "normal",
    K, I, U, S, O = 30,
    L = {
        normal: {
            shake: function() {
                C = "gyro";
                w()
            },
            dragging: g,
            turnstart: y
        },
        hover: {
            dragging: n,
            shake: function() {
                w();
                C = "gyro"
            },
            click: p,
            turnstart: z
        },
        gyro: {
            dragging: function() {
                q();
                C = "dragging"
            },
            click: function() {
                q();
                C = "normal"
            },
            turnstart: function(a) {
                q();
                C = "turn";
                J = "gyro";
                A(a)
            }
        },
        dragging: {
            dragend: l,
            turnstart: m
        },
        turn: {
            dragging: u,
            click: v,
            turnend: s
        }
    },
    Y = {
        normal: {
            dragging: g,
            turnstart: y
        },
        hover: {
            dragging: n,
            click: p,
            turnstart: z
        },
        dragging: {
            dragend: l,
            turnstart: m
        },
        turn: {
            dragging: u,
            click: v,
            turnend: s
        }
    },
    M = {
        heading: void 0,
        pitch: void 0,
        listener: void 0,
        enable: !1,
        update: function(a, b) {
            this.enable = !0;
            this.heading = a;
            this.pitch = b
        },
        getPov: function() {
            return {
                heading: this.heading,
                pitch: this.pitch
            }
        }
    },
    T = null; (function() {
        var a = 0,
        b, c, d, e, f, h;
        return function(g) {
            g = g.accelerationIncludingGravity;
            var x = (new Date).getTime();
            100 < x - a && (a = x, b = g.x, c = g.y, d = g.z, Math.abs(b + c + d - e - f - h), e = b, f = c, h = d)
        }
    })();
    var V = new d,
    W = new d,
    X = new d,
    P, Q, R, N;
    return {
        addToPano: function(a) {
            D = a;
            D.addListener("svid_changed", f)
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/ImportantPOI", ["application/urlManager", "common/Event", "common/util"],
function(d, c, b) {
    function a(a) {
        0 !== s.length && (w.style.visibility = "hidden", a.data.isOverlayVisible ? v.showMarker(y) : v.hideMarker(y), setTimeout(function() {
            w.style.visibility = "visible"
        },
        300))
    }
    function f() {
        0 !== s.length && s.forEach(function(a, b, c) {
            if ((a = v.getMarker(a.rid)) && !a.reserve) a.isVisibile && x < A ? (x++, a.reserve = 1, a.elem.style.display = "") : a.elem.style.display = "none"
        })
    }
    function h() {
        x = 0;
        s.length && (g(), s = []);
        u = v.getModel();
        b.getPoi3D(u.detail.basic.x, u.detail.basic.y, u.detail.basic.source, u.detail.basic.type,
        function(a) {
            if (z = a.detail.pois) if (z = z.filter(function(a) {
                return 0 == a.level
            }), "detail" !== m.poi) p(z);
            else if (q.length) {
                a = 0;
                for (var b = q.length; a < b; a++) q[a]();
                q = []
            }
        })
    }
    function e() {
        y = [];
        w = document.createElement("div");
        s.forEach(function(a, b, c) {
            k(a, w)
        });
        v.getControlLayer().appendChild(w);
        v.refreshMarkersPosition()
    }
    function k(a, b) {
        var d = a.data,
        e = a.dom,
        f = a.displayData;
        e.style.display = "none";
        e.style.opacity = 0.55;
        b.appendChild(e);
        c.on(e, "mousedown",
        function(a) {
            this.style.backgroundColor = "#035abc";
            a.stopPropagation()
        });
        c.on(e, "mouseup",
        function() {
            this.style.backgroundColor = "#000"
        });
        c.click(e,
        function(a) {
            a.stopPropagation();
            v.faceToPlace(d.uid, d.x, d.y, 1E3)
        });
        a.rid = v.addMarker(f.heading, f.pitch, e);
        y.push(a.rid)
    }
    function g() {
        s.forEach(function(a, b, c) {
            a.rid && v && v.removeMarker(a.rid)
        })
    }
    function p(a) {
        a && (n(a), l(s), setTimeout(e, 500))
    }
    function n(a) {
        a.forEach(function(a, c, d) {
            c = u.detail.basic.y;
            Math.sqrt(Math.pow(a.x - u.detail.basic.x, 2) + Math.pow(a.y - c, 2));
            c = a.name;
            d = 0;
            var e = b.createElem("div", {
                position: "absolute",
                height: "22px",
                overflow: "hidden",
                "text-align": "center",
                padding: "0 2px",
                "font-size": "12px",
                "line-height": "22px",
                color: "#FFF",
                "background-color": "#000",
                "border-radius": "2px",
                "-webkit-transition": "opacity 0.3s ease-in",
                opacity: 0,
                "white-space": "nowrap",
                "z-index": "9999"
            });
            e.textContent = c;
            e.style.left = "-9999px";
            document.body.appendChild(e);
            d = e.offsetWidth;
            e.style.left = -d / 2 + "px";
            e.style.width = d + "px";
            document.body.removeChild(e);
            e.style.zIndex = 10;
            s.push({
                data: a,
                dom: e
            })
        })
    }
    function l(a) {
        a.forEach(function(a, c, d) {
            c = a.data;
            c = b.getPOV(u.detail.basic.x, u.detail.basic.y, c.x, c.y, c.h);
            a.displayData = {
                heading: c.heading,
                pitch: c.pitch
            }
        })
    }
    var m = d.hash,
    v, u, s = [],
    z,
    y = [],
    w,
    q = [],
    A = 3,
    x = 0;
    return {
        addToPano: function(b) {
            0 != m.poi && (v = b, v.addListener("svid_changed", h), v.addListener("overlay_visible_changed", a), v.addListener("marker_refresh", f), "detail" === m.poi && (v.removeListener("overlay_visible_changed", a), v.addListener("POIDetail_refresh",
            function(a) {
                var b = function() {
                    "default" === a.data.status ? p(z) : (x = 0, s.length && (g(), s = []))
                };
                z ? b() : q.push(b)
            })))
        },
        removeFromPano: function() {}
    }
});
define("plugins/LinkPOI", ["application/urlManager", "application/Config", "common/util"],
function(d, c, b) {
    function a(a, b) {
        this.panorama = a;
        this.createMarkerContainer();
        this.cachedNodes = [];
        this.builder = b;
        var c = this;
        this.markerClickHandler = function(a) {
            c.markerClickHandler_(a)
        }
    }
    var f = d.hash,
    h, e = {
        elementPrototype: null,
        createElement: function() {
            if (this.elementPrototype) return this.elementPrototype.cloneNode(!0);
            var a = document.createElement("div"),
            b = a.style;
            b.position = "absolute";
            b.border = "1px #fff outset";
            b.fontFamily = "SimHei";
            b.fontSize = "13px";
            b.backgroundColor = "rgba(0, 0, 0, 0.55)";
            b.borderRadius = "3px";
            b.color = "#fff";
            b.padding = "4px";
            b.zIndex = 999;
            b.whiteSpace = "nowrap";
            b = new Image;
            a.appendChild(b);
            b.style.verticalAlign = "text-top";
            b.style.marginRight = "2px";
            b.src = c.getImgUrl("images/linkPoiMarker.png");
            b = document.createElement("span");
            a.appendChild(b);
            this.elementPrototype = a;
            return a.cloneNode(!0)
        },
        update: function(a, b) {
            a.children[1].textContent = b.name;
            a.dataset.svid = b.svid;
            a.ontouchstart = function(a) {
                this.style.backgroundColor = "rgba(80, 80, 80, 0.6)";
                this.style.borderStyle = "inset"
            };
            a.ontouchend = function() {
                this.style.backgroundColor = "rgba(0, 0, 0, 0.55)";
                this.style.borderStyle = "outset"
            }
        }
    };
    a.prototype.createMarkerContainer = function() {
        this.markerContainer = document.createElement("div");
        this.markerContainer.className = "link-poi";
        this.markerContainer.style.webkitUserSelect = "none";
        this.panorama.getControlLayer().appendChild(this.markerContainer)
    };
    a.prototype.prepareEls = function(a) {
        for (var b = this.markerContainer.children.length - 1; 0 <= b; b--) {
            var c = this.markerContainer.children[b];
            this.panorama.removeMarker(c.dataset.rid);
            this.cachedNodes.push(c)
        }
        for (b = a - this.cachedNodes.length - 1; 0 <= b; b--) this.cachedNodes.push(this.builder.createElement())
    };
    a.prototype.refreshMarkers = function() {
        this.setVisiblity(!1);
        var a = this.panorama,
        c = a.getModel().detail.linkpois || [],
        d = a.getModel().detail.basic,
        e = c.length;
        this.prepareEls(e);
        for (var f = 0; f < e; f++) {
            var h = c[f],
            v = this.cachedNodes[f];
            this.buildMarker(v, h);
            h = b.getPOV(d.x, d.y, h.x, h.y, h.h);
            h = a.addMarker(h.heading, h.pitch, v);
            v.dataset.rid = h;
            this.markerContainer.appendChild(v)
        }
        this.showIfNeeded();
        this.panorama.refreshMarkersPosition();
        this.cachedNodes = this.cachedNodes.slice(e)
    };
    a.prototype.buildMarker = function(a, b) {
        this.builder.update(a, b);
        a.addEventListener("mouseup", this.markerClickHandler, !1)
    };
    a.prototype.markerClickHandler_ = function(a) {
        console.log("Pin poi clicked...", this.panorama.getModel());
        a.stopPropagation();
        a.preventDefault();
        var b = this.panorama.getModel().detail.basic.scenic_name,
        c = a.currentTarget,
        d = c.dataset.svid;
        d ? (this.panorama.dispatchEvent("MiniAlbum_addressbar_changed", (b || "") + " " + c.children[1].textContent), this.panorama.setSvid(d)) : console.warn("Pin marker element does not contain svid, click event", a)
    };
    a.prototype.showIfNeeded = function() {
        this.setVisiblity(this.panorama.getOverlayVisible())
    };
    a.prototype.setVisiblity = function(a) {
        this.markerContainer.style.visibility = a ? "visible": "hidden"
    };
    a.prototype.destroy = function() {
        this.markerContainer.remove()
    };
    return {
        addToPano: function(b) {
            0 != f.linkpoi && (h = new a(b, e), b.addListener("svid_changed",
            function() {
                h.refreshMarkers()
            }), b.addListener("overlay_visible_changed",
            function(a) {
                h.showIfNeeded()
            }), b.addListener("marker_refresh",
            function() {}))
        },
        removeFromPano: function() {
            h.destroy()
        }
    }
});
define("plugins/MiniAlbum", ["application/Config", "application/urlManager", "common/Event", "common/util", "application/stat"],
function(d, c, b, a, f) {
    var h = c.hash,
    e = function(a) {
        return a * Math.min(window.innerWidth, window.innerHeight) / 640
    },
    k,
    g = void 0,
    p = Math.max(e(78), 50),
    n = e(10);
    e(40);
    var l = d.getImgUrl("images/exit_insideview.png");
    d.getImgUrl("images/shadow-cover.png");
    e(60);
    var m = function(b) {
        a.setStyles(b, {
            "border-color": "rgba(95,95,95,0.6)",
            opacity: 0.8,
            "box-shadow": "0 0 2px 1px rgba(255,255,255,0.8)",
            "-webkit-transform": "scale(1)"
        })
    },
    v = function(b) {
        a.setStyles(b, {
            "border-color": "rgba(255,255,255,1)",
            opacity: "1",
            "box-shadow": "0 0 2px rgba(255,255,255,0.7)",
            "-webkit-transform": "scale(1.2)"
        })
    },
    u = function() {
        f.clickMiniAlbumThumb();
        if (w.selectedImg !== this) {
            var a = this.getAttribute("svid"),
            b = this.getAttribute("vsrc"),
            c = this.getAttribute("vname");
            a && !b && (k.setSvid(a), w.selectedImg && m(w.selectedImg), v(this), w.selectedImg = this, k.dispatchEvent("MiniAlbum_addressbar_changed", w.scenicName == c ? c: w.scenicName + " " + c), z(this))
        }
    },
    s = function() {
        this.onload = null;
        this.style.opacity = this === w.selectedImg ? 1 : 0.8;
        this.setAttribute("vsrc", "");
        if (0 < w.requireImgs.length) {
            var a = w.requireImgs.shift();
            a.src = a.getAttribute("vsrc")
        }
    },
    z = function(a) {
        a && (a = parseInt(a.getAttribute("index")) + 1, w.moveTo(Math.floor((document.body.clientWidth - 0) / 2) - ((p + 2 * (n + 1)) * a + 0.5 * p + n + 1)))
    },
    y = function(a, c) {
        var d = null;
        b.drag(a,
        function() {
            d = (new Date).getTime();
            beginLeft = c.left
        },
        function(a, b) {
            c.moveBy(b.x)
        },
        function(a, b) {
            if (d) {
                var e = (new Date).getTime() - d,
                f = c.left - beginLeft;
                300 < e || 10 > Math.abs(f) || (e = Math.abs(f) / e, f = e * e / 0.0020 * (0 > f ? -1 : 1), c.moveAnim(e / 0.0010), c.moveBy(f))
            }
        })
    },
    w = {
        status: 3,
        inited: !1,
        requireImgs: [],
        init: function() {
            this.inited = !0;
            this.albumContainer = a.createElem("div", {
                position: "absolute",
                "z-index": 1E3,
                "background-color": "rgba(0,0,0,0.6)",
                width: "100%",
                bottom: 0,
                "-webkit-transition": "all 0.3s"
            });
            this.albumContainer.id = "album_container";
            b.on(this.albumContainer, "mousedown",
            function() {
                var b = getComputedStyle(w.imgContainer, null).webkitTransform.replace(/[^0-9-.,]/g, "").split(",");
                a.setStyles(w.imgContainer, {
                    "-webkit-transition-duration": "0",
                    "-webkit-transform": "translateX(" + b[4] + "px)"
                });
                w.left = parseInt(b[4]) || 0
            });
            this.albumContent = a.createElem("div", {
                "margin-top": 0.2 * p + "px",
                "margin-bottom": 0.2 * p + "px",
                overflow: "hidden",
                height: 1.3 * p + "px",
                "margin-left": "0px"
            });
            this.albumContainer.appendChild(this.albumContent);
            this.leftShadow = a.createElem("div", {
                position: "absolute",
                "z-index": 1E3,
                width: "10px",
                height: "100%",
                left: "0px",
                top: 0,
                "background-image": "-webkit-gradient(linear, left top, right top, from(rgba(112,112,112,0.3)), to(rgba(112,112,112,0)))"
            });
            this.rightShadow = this.leftShadow.cloneNode();
            a.setStyles(this.rightShadow, {
                left: "",
                right: "0px",
                "background-image": "-webkit-gradient(linear, left top, right top, from(rgba(112,112,112,0)), to(rgba(112,112,112,0.3)))"
            });
            this.albumContainer.appendChild(this.leftShadow);
            this.albumContainer.appendChild(this.rightShadow);
            y(this.albumContent, this);
            //document.getElementById("container").appendChild(this.albumContainer)
            __qq_pano_options.panoramaDom.appendChild(this.albumContainer);
        },
        drawQuit: function() {
        	__qq_pano_options.inter = true;
        	d3.select('.KDSEditor-Panorama-Close').node().style.display = 'none';
            var c = a.createElem("img", {
                margin: n + "px",
                "z-index": 1E3,
                width: p + 2 + "px",
                height: p + 2 + "px",
                left: e(20) + "px",
                bottom: n + "px",
                "-webkit-transform-origin": "bottom center",
                "border-radius": "3px",
                "box-shadow": "0 0 10px rgba(0,0,0,0.5)",
                "-webkit-transform-origin": "center center"
            });
            c.src = l;
            b.click(c,
            function() {
            	__qq_pano_options.inter = false;
                f.clickRegionQuitBtn();
                var b = w.quit_svid;
                b && a.getPanoInfo(b,
                function(c) {
                	d3.select('.KDSEditor-Panorama-Close').node().style.display = 'block';
                    if (c = c.detail.region.entrances[0]) c = a.getPOV(c.svx, c.svy, c.rex, c.rey),
                    k.setSvid(b),
                    k.setHeading(c.heading)
                })
            });
            return c
        },
        insertNum: 0,
        insertBefore: function() {
            0 != h.quit_btn && (this.imgContainer.appendChild(w.drawQuit()), this.insertNum++)
        },
        load: function(c, d) { ! 1 === this.inited && this.init();
            this.clear();
            this.imgContainer = a.createElem("div", {
                "-webkit-transition-timing-function": "cubic-bezier(0.33, 0.66, 0.66, 1)"
            });
            k.getModel();
            var e, f = {};
            d = d.filter(function(a) {
                return c == a.svid ? (f = a, f.isCurrect = !0, !1) : !0
            });
            f.svid && d.unshift(f);
            this.insertBefore();
            for (var h = d.length,
            g = 0; g < h; g++) e = a.createElem("img", {
                margin: n + "px",
                "z-index": 1E3,
                border: "1px solid rgba(95,95,95,0.6)",
                width: p + "px",
                height: p + "px"
            }),
            e.setAttribute("svid", d[g].svid),
            e.setAttribute("index", g),
            e.setAttribute("vsrc", "http://sv4.map.qq.com/image?svid\x3d" + d[g].svid + "\x26source\x3dsoso\x26from\x3dmobilepano\x26type\x3dexhibit"),
            e.setAttribute("vname", d[g].name),
            b.click(e, u),
            e.onload = s,
            this.requireImgs.push(e),
            d[g].isCurrect ? (v(e), this.selectedImg = e, k.dispatchEvent("MiniAlbum_addressbar_changed", w.scenicName == d[g].name ? d[g].name: w.scenicName + " " + d[g].name)) : m(e),
            this.imgContainer.appendChild(e);
            this.albumContent.appendChild(this.imgContainer);
            this.status = 1;
            this.resize = function() {
                if (this.imgContainer) {
                    var a = document.body.clientWidth - 0;
                    this.albumContent.style.width = a + "px";
                    var b = (this.insertNum + h) * (p + 2 * (n + 1));
                    this.imgContainer.style.width = b + "px";
                    this.minLeft = Math.min(a - b - 3, 0);
                    this.moveBy(0)
                }
            };
            this.resize();
            z(this.selectedImg);
            this.show();
            0 < this.requireImgs.length && (e = this.requireImgs.shift(), e.src = e.getAttribute("vsrc"));
            this.refreshShadow()
        },
        clear: function() {
            if (this.imgContainer) {
                for (; this.imgContainer.firstChild;) this.imgContainer.removeChild(this.imgContainer.firstChild);
                this.albumContent.removeChild(this.imgContainer);
                this.imgContainer = null
            }
            this.requireImgs = [];
            this.left = 0
        },
        show: function() { ! 1 !== this.inited && (this.albumContainer.style.display = "")
        },
        hide: function() { ! 1 !== this.inited && (this.albumContainer.style.display = "none")
        },
        toggle: function(a) {
            this.inited ? 1 == this.status ? (this.albumContainer.style.bottom = "-150px", this.status = 2) : 2 == this.status && (this.albumContainer.style.bottom = 0, this.status = 1) : this.status = a ? 1 : 2
        },
        resize: function() {},
        moveTo: function(b) {
            a.setStyles(this.imgContainer, {
                "-webkit-transition-duration": "500ms"
            });
            this.moveBy(b - this.left);
            this.refreshShadow()
        },
        refreshShadow: function() {
            var a = this.left,
            b = 0,
            c = 0; - 3 > a && (b = 1);
            a > this.minLeft + 6 && (c = 1);
            this.shadowStaus !== b + "," + c && (this.leftShadow.style.display = b ? "": "none", this.rightShadow.style.display = c ? "": "none")
        },
        moveBy: function(a) {
            this.imgContainer && (a = this.left + a, 3 < a ? a = 3 : a < this.minLeft && (a = this.minLeft), this.refreshShadow(), a != this.left && (this.imgContainer.style.webkitTransform = "translateX(" + a + "px) translateZ(0)", this.left = a))
        },
        moveAnim: function(b) {
            a.setStyles(w.imgContainer, {
                "-webkit-transition-duration": "" + b + "ms"
            })
        }
    },
    q = {
        share: function() {
            if ("hr" === h.ref || "hrbypano" === h.ref) {
                var b = {
                    sz: "\u6df1\u5733",
                    bj: "\u5317\u4eac",
                    gz: "\u5e7f\u5dde"
                } [h.city] || "",
                c = k.getModel();
                a.getShareTitle = function() {
                    return "\u817e\u8baf" + b + c.detail.basic.append_addr + "\u5b9e\u62cd"
                }
            }
        },
        floorClass: function() {},
        isFloor: function() {
            return this.data && Array.isArray(this.data.floors) && this.data.floors.length && 0 != h.floor ? !0 : !1
        },
        init: function() {
            var b = w.albumContainer;
            b && (this.floorContainer = a.createElem("div", {
                height: "32px",
                "line-height": "32px",
                "font-size": "12px",
                color: "rgba(255,255,255,1)",
                "padding-top": 0.2 * p + "px"
            }), this.imgContainer = a.createElem("div", {
                height: "100%",
                "-webkit-transform": "translateZ(0)",
                "padding-left": "17px"
            }), y(this.floorContainer, q), b.insertBefore(this.floorContainer, b.firstChild))
        },
        load: function() {
            this.floorContainer ? this.clearTexts() : this.init();
            this.checkCurrentFloor();
            this.drawTexts();
            this.selected(this.floors[this.currentFloorId].dom);
            this.minLeft = Math.min(document.body.clientWidth - this.imgContainerWidth - 3, 0);
            this.show()
        },
        drawBox: function() {
            var c = a.createElem("div", {
                margin: n + "px",
                "z-index": 1E3,
                "font-size": "12px",
                color: "#333",
                "background-color": "rgba(255,255,255,0.6)",
                width: p + 2 + "px",
                height: p + 2 + "px",
                "-webkit-transform-origin": "bottom center",
                "border-radius": "3px",
                "box-shadow": "0 0 10px rgba(0,0,0,0.5)",
                display: "inline-block",
                "text-align": "center",
                "vertical-align": "top",
                position: "relative",
                "-webkit-transform-origin": "center center"
            });
            this.checkCurrentFloor();
            var d = this.floors[this.currentFloorId].data.name,
            e = a.strLengthByCN2(d);
            if (8 === e) var h = Math.min(27, 0.9 * (p + 2)),
            e = 27;
            else h = Math.min(12 * e / 2 + 3, 0.9 * (p + 2)),
            e = 12 * (e / 6 + e % 6 ? 1 : 0) + 3;
            h = a.createElem("span", {
                "word-wrap": "break-word",
                "text-overflow": "ellipsis",
                position: "absolute",
                width: h + "px",
                height: e + "px",
                left: "50%",
                top: "50%",
                "margin-left": -h / 2 + "px",
                "margin-top": -e / 2 + "px"
            });
            c.appendChild(h);
            var g = this;
            b.click(c,
            function() {
                g.toggle();
                f.clickMiniAlbumFloorCtrl()
            });
            h.textContent = d;
            return c
        },
        drawTexts: function() {
            var b = this;
            this.data.floors.forEach(function(c) {
                var d = a.createElem("div", {
                    "margin-right": "17px",
                    "font-size": "12px",
                    display: "inline-block"
                }),
                e = a.createElem("div", {
                    height: "7px",
                    width: "7px",
                    "background-color": "#ffcc00",
                    margin: "0 auto",
                    "border-radius": "10px",
                    visibility: "hidden"
                }),
                f = a.createElem("span");
                d.appendChild(e);
                d.appendChild(f);
                b.click(d);
                d.dataset.floorid = c.id;
                c.name && (f.textContent = c.name);
                b.floors[c.id] || (b.floors[c.id] = new q.floorClass);
                b.floors[c.id].dom = d;
                b.imgContainer.appendChild(d)
            });
            this.imgContainer.style.visibility = "hidden";
            this.imgContainer.style.position = "absolute";
            this.imgContainer.style.left = "-9999px";
            this.imgContainer.style.width = "";
            document.body.appendChild(this.imgContainer);
            //this.imgContainerWidth = this.imgContainer.offsetWidth - 17;
            //this.imgContainerWidth = this.imgContainer.offsetWidth + 4;
            this.imgContainerWidth = this.data.floors.length * 80;
            this.imgContainer.style.width = this.imgContainerWidth + "px";
            this.imgContainer.style.position = "";
            this.imgContainer.style.left = "";
            document.body.removeChild(this.imgContainer);
            this.imgContainer.style.visibility = "inherit";
            this.floorContainer.appendChild(this.imgContainer)
        },
        clearTexts: function() {
            for (var a; a = this.imgContainer.firstChild;) this.imgContainer.removeChild(a);
            this.floorContainer.removeChild(this.imgContainer);
            this.currentFloorId = "";
            this.floors = {}
        },
        currentFloorId: "",
        floors: {},
        checkCurrentFloor: function() {
            var a = this;
            this.currentFloorId = this.data.info && this.data.info.current_floor || "";
            this.data.floors.forEach(function(b) {
                a.floors[b.id] || (a.floors[b.id] = new q.floorClass);
                a.floors[b.id].data = b
            })
        },
        isHidden: !1,
        toggle: function() {
            this.isHidden ? this.show() : this.hide()
        },
        click: function(a) {
            var c = this;
            b.click(a,
            function() {
                f.clickMiniAlbumFloor();
                this.dataset.floorid !== c.currentFloorId && k.setSvid(c.floors[this.dataset.floorid].data.svid)
            })
        },
        selected: function(a) {
            a.style.color = "#ffcc00";
            a.firstChild.style.visibility = "inherit"
        },
        normal: function(a) {
            a.style.color = "#fff";
            a.firstChild.style.visibility = "hidden"
        },
        show: function() {
            this.floorContainer.style.display = "block";
            this.isHidden = !1
        },
        hide: function() {
            this.floorContainer && (this.floorContainer.style.display = "none");
            this.isHidden = !0
        },
        resize: function() {
            this.imgContainer && (this.minLeft = Math.min(document.body.clientWidth - this.imgContainerWidth - 3, 0), this.moveBy(0))
        },
        left: 0,
        moveBy: w.moveBy,
        moveAnim: w.moveAnim,
        moveTo: w.moveTo,
        refreshShadow: function() {}
    },
    A = function(b) {
        b = k.getModel();
        if (!b || !b.detail) w.clear();
        else if (g !== b.detail.basic.scenic_id) if (b.detail.basic.scenic_id) {
            w.scenicName = b.detail.basic.scenic_name;
            a.getShareTitle = function() {
                return w.scenicName
            };
            w.quit_svid = b.detail.basic.quit_svid;
            q.data = b.detail.building;
            q.isFloor() ? q.share() : q.hide();
            w.show();
            g = b.detail.basic.scenic_id;
            var c = d.xmlDomain + "/photos?id\x3d" + g,
            e = b.detail.basic.svid;
            b = null;
            a.loadJsonp(c,
            function(a) {
                0 == a.info.error && (w.load(e, a.detail.scenes), q.isFloor() && q.load())
            })
        } else w.clear(),
        g = "-1",
        w.hide()
    };
    __qq_pano_options.__qq_ablum_w = w;
    __qq_pano_options.__qq_ablum_q = q;
    return {
        addToPano: function(a) {
            0 != h.minialbum && (k = a, a.addListener("overlay_visible_changed",
            function(a) {
                w.toggle(a)
            }), a.addListener("svid_changed", A), a.addListener("resize",
            function() {
                w.resize();
                q.resize()
            }))
        },
        removeFromPano: function() {}
    }
});
define("plugins/MiniMap", ["application/Config", "application/urlManager", "common/util", "common/Event", "application/stat"],
function(d, c, b, a, f) {
    var h = d.getImgUrl,
    e = c.hash,
    k = h("images/mapCamera.png"),
    g = h("images/mapCameraMoving.png"),
    p = h("images/mapCameraMovingShadow.png"),
    n = [0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 7, 0, 7, 0, 15, 0, 15, 0, 31, 0, 31, 0, 63, 4, 59, 0, 127, 12, 115, 0, 225, 28, 227, 356, 455, 150, 259, 720, 899, 320, 469, 1440, 1799, 650, 929, 2880, 3589, 1200, 2069, 5760, 7179, 2550, 3709, 11520, 14349, 5100, 7999, 23060, 28689, 10710, 15429, 46120, 57369, 20290, 29849, 89990, 124729, 41430, 60689, 184228, 229827, 84169, 128886];
    window.minimapinit = function() {
        q.init();
        //delete window.minimapinit
    };
    var l, m = document.documentElement.clientWidth < document.documentElement.clientHeight ? !0 : !1,
    v = Math.pow(5, 2),
    u = !0,
    s = !0,
    z = 2,
    y = {
        freeze: function() {
            this.isFreeze = z;
            q.setSize(0, 0)
        },
        unfreeze: function() {
            this.isFreeze && (this.isFreeze = void 0)
        },
        1 : {
            onEntry: function(a) {
                z = 1;
                a = void 0 == a ? m: a;
                q.layoutChangeEnd = function() {
                    q.hide()
                };
                a ? (a = q.getSize().height + 20, q.setPostition(null, null, -a, null)) : (a = q.getSize().width + 20, q.setPostition(null, null, null, -a))
            },
            onExit: function() {
                if (u) if (m) {
                    var a = q.getSize().height + 20;
                    q.setPostition(null, null, -a, 10)
                } else a = q.getSize().width + 20,
                q.setPostition(null, null, 10, -a);
                else {
                    var b = document.documentElement.clientWidth,
                    c = document.documentElement.clientHeight;
                    m ? (a = q.getSize().height + 20, q.setPostition(null, null, -a, 0), q.setSize(b - 4, 0.25 * c - 4)) : (a = q.getSize().width + 20, q.setPostition(null, null, 0, -a), q.setSize(0.25 * b - 4, c - 4))
                }
            },
            panoClick: function() {
                y.isFreeze || (this.onExit(), setTimeout(function() {
                    if (u) y[2].onEntry();
                    else y[3].onEntry()
                },
                10))
            },
            click: function() {},
            resize: function() {},
            resizeEnd: function() {}
        },
        2 : {
            onEntry: function() {
                q.show();
                u = !0;
                z = 2;
                var a = document.documentElement.clientWidth,
                b = document.documentElement.clientHeight,
                c = 0.25 * Math.min(a, b),
                d = 0.25 * Math.min(a, b);
                setTimeout(function() {
                    q.setSize(c, d);
                    q.setPostition(null, null, 10, 10)
                },
                100)
            },
            panoClick: function() {
                if (!y.isFreeze) y[1].onEntry()
            },
            click: function() {
                if (!y.isFreeze) y[3].onEntry()
            },
            resize: function() {
                if (!y.isFreeze) {
                    var a = document.documentElement.clientWidth,
                    b = document.documentElement.clientHeight,
                    c = 0.25 * Math.min(a, b),
                    a = 0.25 * Math.min(a, b);
                    q.setSize(c, a)
                }
            }
        },
        3 : {
            onEntry: function(a) {
                q.show();
                u = !1;
                z = 3;
                if (a) q.hide(),
                setTimeout(function() {
                    q.show();
                    y[1].panoClick()
                },
                600);
                else {
                    a = document.documentElement.clientWidth;
                    var b = document.documentElement.clientHeight;
                    m ? q.setSize(a - 4, 0.25 * b - 4) : q.setSize(0.25 * a - 4, b - 4);
                    q.setPostition(null, null, 0, 0)
                }
            },
            panoClick: function() {
                if (!y.isFreeze) y[1].onEntry()
            },
            click: function() {
                if (!y.isFreeze) y[2].onEntry()
            },
            resizingTimer: null,
            resize: function() {
                y.isFreeze || (q.hide(), this.resizingTimer && clearTimeout(resizingTimer), resizingTimer = setTimeout(function() {
                    y[1].onExit();
                    setTimeout(function() {
                        q.show();
                        y[3].onEntry();
                        resizingTimer = null
                    },
                    10)
                },
                200))
            }
        }
    },
    w = {
        HEIGHT: 50,
        WIDTH: 150,
        inited: !1,
        tipDiv: null,
        closeTimer: !1,
        init: function() {
            this.tipDiv = b.createElem("div", {
                width: this.WIDTH + "px",
                "line-height": this.HEIGHT + "px",
                height: this.HEIGHT + "px",
                "background-color": "rgba(0,0,0,0.8)",
                "text-align": "center",
                "-webkit-transition": "opacity 0.4s",
                opacity: "0",
                position: "absolute",
                "z-index": "9999",
                color: "white",
                "border-radius": "4px",
                left: (document.documentElement.clientWidth - this.WIDTH) / 2 + "px",
                top: (document.documentElement.clientHeight - this.HEIGHT) / 2 + "px"
            });
            document.body.appendChild(this.tipDiv);
            this.inited = !0
        },
        destory: function() {
            this.inited = !1;
            document.body.removeChild(this.tipDiv);
            this.tipDiv = null;
            this.closeTimer && (clearTimeout(this.closeTimer), this.closeTimer = null)
        },
        resize: function() {
            if (this.inited) {
                var a = document.documentElement.clientHeight;
                this.tipDiv.style.left = (document.documentElement.clientWidth - this.WIDTH) / 2 + "px";
                this.tipDiv.style.top = (a - this.HEIGHT) / 2 + "px"
            }
        },
        show: function(a, b) {
            this.closeTimer && clearTimeout(this.closeTimer);
            this.inited || this.init();
            var c = w.tipDiv;
            c.textContent = a;
            c.style.display = "";
            setTimeout(function() {
                c.style.opacity = 1
            },
            50);
            this.closeTimer = setTimeout(function() {
                c.style.opacity = 0;
                setTimeout(function() {
                    c.style.display = "none";
                    c = w.closeTimer = null
                },
                450)
            },
            b || 1300)
        }
    },
    q = {
        enableCustomMapLayer: function() {
            var a = this.map,
            b = function(a) {};
            b.prototype = new soso.maps.TileLayer({
                //tileUrlTemplate: "http://{s}.map.qq.com/road/15_ext/{dx}/{dy}/{x}_{y}.png",
            	tileUrlTemplate: "http://{s}.map.qq.com/road/{z}/{dx}/{dy}/{x}_{y}.png",
                tileSubdomains: "sv0,sv1,sv2,sv3,sv4,sv5,sv6,sv7",
                minZoom: d.minZoom,
                maxZoom: d.maxZoom
            });
            b.prototype.getTileImageUrl = function(a, b, c) {
                var e = d.tileDomains,
                f = d.domain + "imgs/transparent.gif";
                tileUrlTemplate = this.get("tileUrlTemplate");
                tileSubdomains = this.get("tileSubdomains");
                var e = tileSubdomains.split(","),
                h = e.length,
                g = this.get("tileSize").getHeight();
                b = (1 << c + Math.floor(256 / g / 2)) - 1 - b;
                g = b.toString();
                h = g.charAt(g.length - 1) % h;
                tileUrlTemplate && (f = tileUrlTemplate.replace(/\{x\}/, a), f = f.replace(/\{y\}/, b), f = f.replace(/\{z\}/, c), f = f.replace(/\{dx\}/, Math.floor(a / 16)), f = f.replace(/\{dy\}/, Math.floor(b / 16)));
                e.length && (f = f.replace(/\{s\}/, e[h]));
                return f
            };
            var c = function(a) {};
            c.prototype = new soso.maps.TileLayer({
                isBase: !0
            });
            c.prototype.getTileImageUrl = function(x,y,z) {
                //return "http://p2.map.qq.com/maptilesv2/404.png"
            	var url = "http://webrd0{1,2,3,4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=[x]&y=[y]&z=[z]",
            		matchs;
	    		if ((matchs = url.match(/\{.*\}/))) {
	    			var balanced = matchs.toString().replace('{', '').replace('}', '');
	    			balanced = balanced.split(',');
	    			balanced = balanced[Math.abs(x + y) % balanced.length];
	    			url = url.replace(matchs, balanced);
	    		}
	    		return url.replace('[x]', x).replace('[y]', y).replace('[z]', z);
            };
            b = new b;
            c = new c;
            c = new soso.maps.MapType({
                name: "\u8def\u7f51\u5730\u56fe",
                alt: "\u8def\u7f51\u5730\u56fe",
                layers: [c, b]
            });
            a.mapTypes.set("hTiles", c);
            a.setMapTypeId("hTiles");
            return ! 0
        },
        destory: function() {
            soso.maps.Event.clearListeners(this.map);
            this.mapContainer.appendChild(this.centerPoint);
            this.centerPoint = null;
            this.mapContainer.appendChild(this.centerMovingPointContainer);
            this.centerMovingPointContainer = null;
            //document.getElementById("container").removeChild(this.mapContainer);
            __qq_pano_options.panoramaDom.removeChild(this.mapContainer);
            this.mapContainer = null;
            this._isLocked = !1;
            u = !0;
            z = 2
        },
        isLocked: function() {
            return this._isLocked
        },
        lock: function() {},
        unLock: function() {},
        inited: !1,
        init: function() {
            this.mapContainer = b.createElem("div", {
                position: "absolute",
                "z-index": 1E3,
                bottom: "-1px",
                left: "-1px",
                border: "2px solid white"
            });
            var c = !1;
            this.mapContainer.addEventListener("webkitTransitionEnd",
            function(a) {
                c || (c = !0, q.layoutChangeEnd && (q.layoutChangeEnd(a), q.layoutChangeEnd = null), q.map.notifyResize(), setTimeout(function() {
                    c = !1
                },
                0))
            });
            this.mapDiv = b.createElem("div", {
                width: "100%",
                height: "100%"
            });
            this.mapContainer.appendChild(this.mapDiv);
            this.centerPoint = b.createElem("img", {
                position: "absolute",
                "-webkit-transform-origin": "center center",
                bottom: "-1000px",
                "-webkit-transition": "right 0.3s, bottom 0.3s"
            });
            this.mapContainer.onselectstart = function(a) {//不让其选中
                a.preventDefault();
                a.stopPropagation()
            };
            this.centerPoint.src = k;
            this.centerPoint.style.pointerEvents = "none";
            this.centerPoint.disabled = false;
            this.mapContainer.appendChild(this.centerPoint);
            this.centerPoint.onmousedown   =  function (ee) {ee.stopPropagation();  ee.preventDefault();};
            this.centerMovingPointContainer = b.createElem("div", {
                position: "absolute",
                display: "none",
                "background-image": "url(" + p + ")",
                "background-position": "50%",
                "background-size": "100%",
                "-webkit-transition": "right 0.3s, bottom 0.3s"
            });
            this.centerMovingPoint = this.centerPoint.cloneNode();
            this.centerMovingPoint.src = g;
            this.centerMovingPoint.style.top = "-10%";
            this.centerMovingPoint.style.width = "100%";
            this.centerMovingPoint.style.height = "100%";
            this.centerMovingPointContainer.appendChild(this.centerMovingPoint);
            this.centerMovingPointContainer.disabled = false;
            this.centerMovingPointContainer.onmousedown   =  function (ee) {ee.stopPropagation();  ee.preventDefault();};
            this.mapContainer.appendChild(this.centerMovingPointContainer);
            this.mapContainer.id = "map_container";
            this.mapContainer.onmousewheel = function (ee) {ee.stopPropagation();};
            this.mapContainer.onselectstart = function (ee) {ee.stopPropagation();  ee.preventDefault();};
            this.shadowLayout = b.createElem("div", {
                top: 0,
                left: 0,
                position: "absolute",
                "z-index": 1E3,
                "-webkit-transition": "all 0.3s",
                "box-shadow": "0 0 0 1px rgba(0,0,0,0.2) inset",
                "pointer-events": "none"
            });

            this.mapContainer.appendChild(this.shadowLayout);
            //document.getElementById("container").appendChild(this.mapContainer);
            (document.getElementById("container") || __qq_pano_options.panoramaDom).appendChild(this.mapContainer);//===========开放对象===========
            var e = this.map = new soso.maps.Map(this.mapDiv, {
                __hideLogo__: !0,
                __disablegesture__: !0,
                maxZoom: 18,
                minZoom: 1,
                zoomLevel: 15,
                zoomInByDblClick: !1
            }),
            h = this.enableCustomMapLayer(),
            m = d.blank,
            u = d.streetTileDomain,
            s = new soso.maps.TileLayer;
            s.getTileImageUrl = function(a, b, c) {
                var d = m;
                if (c >= this.get("minZoom") && c <= this.get("maxZoom")) {
                    var e = 4 * c,
                    f = n[e++],
                    h = n[e++],
                    g = n[e++],
                    e = n[e]; - 1 === u.indexOf("http://") && (u = "http://sv" + (a + b) % 4 + "." + u);
                    a >= f && (a <= h && b >= g && b <= e) && (b = Math.pow(2, c) - 1 - b, d = [u, c, "/", Math.floor(a / 16), "/", Math.floor(b / 16), "/", a, "_", b, ".png"].join(""))
                }
                return d
            };
            var w = null,
            A = function(a, c, d) {
                w && clearTimeout(w);
                w = setTimeout(function() {
                    q.centerPoint.style.display = "";
                    q.centerMovingPointContainer.style.display = "none";
                    var a = !1,
                    c = e.getCenter();
                    if (!c.equals(q.panoCenter) && q.panoCenter) {
                        var d = e.fromLatLngToContainerPixel(c),
                        h = e.fromLatLngToContainerPixel(q.panoCenter);
                        if (! (Math.pow(d.x - h.x, 2) + Math.pow(d.y - h.y, 2) < v)) {
                            q.lock();
                            var g = setTimeout(function() {
                                a = !0;
                                q.xfFaild();
                                f.minimapXfFailed()
                            },
                            1E4);
                            b.getXfPanoInfo(null, b.lngFrom4326ToProjection(c.getLng()), b.latFrom4326ToProjection(c.getLat()), 400,
                            function(b) {
                                a || (clearTimeout(g), b && b.detail && b.detail.svid ? l.getSvid() == b.detail.svid ? (q.unLock(), q.updateMapCenter()) : l.setSvid(b.detail.svid) : q.xfFaild())
                            });
                            w = null
                        }
                    }
                },
                300)
            };
            soso.maps.Event.addListenerOnce(e, "idle",
            function() {
                h || s.setMap(e);
                soso.maps.Event.addListener(this, "idle", A)
            });
            soso.maps.Event.addListener(e, "resize",
            function() {
                setTimeout(function() {
                    q.updateMapCenter()
                },
                20)
            });
            a.drag(this.mapContainer, null,
            function(a, b, c, d) {
                q.centerPoint.style.display = "none";
                q.centerMovingPointContainer.style.display = ""
            },null,function(e){
                    q.centerPoint.style.display = "none";
                    q.centerMovingPointContainer.style.display = ""
            });
            a.click(this.mapContainer,
            function() {
                y[z].click()
            });
            var J = this.mapContainer;
            setTimeout(function() {
                J.style.webkitTransition = "all 0.3s"
            },
            200);
            l.addListener("overlay_visible_changed",
            function(a) { (a.data.isOverlayVisible && 1 == z || !a.data.isOverlayVisible && 1 !== z) && y[z].panoClick()
            });
            this.inited = !0;
            q.panoChanged()
        },
        xfFaild: function() {
            w.show("\u8be5\u70b9\u6682\u65e0\u8857\u666f");
            this.updateMapCenter();
            q.unLock()
        },
        getSize: function() {
            return this.mapSize
        },
        setSize: function(a, c) {
        	if (!this.mapContainer) return;
            var d = document.documentElement.clientWidth,
            e = document.documentElement.clientHeight;
            a = Math.max(100, a);
            c = Math.max(100, c);
            this.mapContainer.style.width = a + "px";
            this.mapContainer.style.height = c + "px";
            this.shadowLayout.style.width = a + "px";
            this.shadowLayout.style.height = c + "px";
            this.mapSize = {
                width: a,
                height: c
            };
            d = Math.min(0.25 * Math.min(d, e), 100);
            b.setStyles(this.centerPoint, {
                width: d + "px",
                height: d + "px",
                right: (a - d) / 2 + "px",
                bottom: (c - d) / 2 + "px"
            });
            b.setStyles(this.centerMovingPointContainer, {
                width: d + "px",
                height: d + "px",
                right: (a - d) / 2 + "px",
                bottom: (c - d) / 2 + "px"
            });
            setTimeout(function() {
                q.map.notifyResize()
            },
            100)
        },
        setPostition: function(a, b, c, d) {
            if (a || 0 === a) this.mapContainer.style.top = a + "px";
            if (b || 0 === b) this.mapContainer.style.right = b + "px";
            if (c || 0 === c) this.mapContainer.style.bottom = c + "px";
            if (d || 0 === d) this.mapContainer.style.left = d + "px"
        },
        updateMapCenter: function() {
            this.panoCenter && this.map.setCenter(this.panoCenter)
        },
        panoChanged: function() {
            var a = l.getModel();
            if (a) if (a.detail.basic.scenic_id) y.isFreeze || (y.freeze(), y[1].onEntry());
            else {
                y.unfreeze();
                if (u && s) y[2].onEntry();
                else if (s) y[3].onEntry();
                this.panoCenter || (this.panoCenter = new soso.maps.LatLng(a.detail.addr.y_lat, a.detail.addr.x_lng));
                this.panoCenter.lat = Number(a.detail.addr.y_lat);
                this.panoCenter.lng = Number(a.detail.addr.x_lng);
                this.updateMapCenter();
                this.povChanged()
            }
        },
        povChanged: function() {
            if (this.inited) {
                var a = l.getHeading();
                this.centerPoint.style.webkitTransform = "rotate(" + a + "deg) ";
                this.centerMovingPoint.style.webkitTransform = "rotate(" + a + "deg) "
            }
        },
        layoutChangeEnd: function(a) {},
        hide: function() {
            this.stopAnim();
            this.mapContainer.style.visibility = "hidden"
        },
        show: function() {
            this.mapContainer.style.visibility = "";
            this.revertAnim()
        },
        stopAnim: function() {
            this.mapContainer.style.webkitTransition = ""
        },
        revertAnim: function() {
            this.mapContainer.style.webkitTransition = "all 0.3s"
        }
    },
    A = function() {
        l.addListener("resize",
        function() {
            m = document.documentElement.clientWidth < document.documentElement.clientHeight ? !0 : !1;
            w.resize();
            y[z].resize()
        });
        l.addListener("svid_changed",
        function() {
            q.panoChanged()
        });
        l.addListener("thumb_loaded",
        function() {
            q.unLock()
        });
        l.addListener("pov_change",
        function() {
            q.povChanged()
        });
        var a = document.createElement("script");
        a.src = "http://map.qq.com/api/js?v\x3d1\x26callback\x3dminimapinit";
        document.getElementsByTagName("head")[0].appendChild(a)
            };
    __qq_pano_options.__qq_minimap_q = q;
    return {
        addToPano: function(a) {
            if (! ("wx" == e.ref || 0 == e.minimap)) {
                l = a;
                l.addListener("overlay_visible_changed",
                function(a) {
                    s = a.data.isOverlayVisible
                });
                var b = function() {
                    l.getModel().detail.basic.scenic_id || (l.removeListener("svid_changed", b), setTimeout(function() {
                        A()
                    },
                    300))
                };
                l.addListener("svid_changed", b)
            }
        },
        removeFromPano: function() {}
    }
});
define("plugins/PanoMark", "require application/Config common/Platform application/urlManager common/Event common/util application/stat".split(" "),
function(d) {
    function c(a) {
        v ? (m.removeMarker(s), m.removeListener("svid_changed", c)) : g.l && n.loadJsonp("http://map.qq.com/?qt\x3dstol\x26url\x3d" + g.l, b)
    }
    function b(b) {
        if (b.PanoramaView && b.PanoramaView.panoMark) {
            var c = b.PanoramaView.panoMark;
            b = c.coord.x;
            var d = c.coord.y,
            c = c.desc;
            v = f();
            m.getControlLayer().appendChild(v);
            s = m.addMarker(b, d, v);
            m.refreshMarkersPosition();
            u = a(c);
            v.appendChild(u);
            m.addListener("overlay_visible_changed",
            function() {
                v.style.display = m.getOverlayVisible() ? "block": "none"
            });
            l.openPanoMark()
        }
    }
    function a(a) {
        var b = document.createElement("div");
        b.style.position = "absolute";
        b.style.top = "12px";
        b.style.left = "35px";
        var c = document.createElement("div");
        c.style.maxWidth = "11em";
        c.style.borderRadius = "3px";
        c.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        c.style.padding = "3px 6px";
        c.style.color = "#FFF";
        c.style.fontSize = "12px";
        c.style.lineHeight = "18px";
        c.style.wordWrap = "break-word";
        c.style.whiteSpace = "nowrap";
        c.textContent = a;
        b.appendChild(c);
        a = document.createElement("div");
        b.appendChild(a);
        a.style.cssText = "border-right: 6px rgba(0,0,0,0.7) solid;border-top: 6px rgba(0,0,0,0) solid;border-bottom: 6px rgba(0,0,0,0) solid;top: 6px;position: absolute;left: -6px;";
        k.i9300 && (k.google && !k.mqq && !k.micromessenger) && (c.style.fontSize = "10px");
        return b
    }
    function f() {
        var a = document.createElement("div");
        a.style.position = "absolute";
        a.style.zIndex = 10;
        a.style.webkitTransform = "translate3d(" + -y / 2 + "px, " + -w / 2 + "px, 0)";
        var b = document.createElement("img");
        b.src = e.getImgUrl("images/marker_orange.png");
        a.appendChild(b);
        p.click(b, h);
        return a
    }
    function h(a) {
        z ? (u.style.display = "none", z = !1) : (u.style.display = "block", z = !0);
        a.stopPropagation();
        l.clickPanoMark()
    }
    var e = d("application/Config"),
    k = d("common/Platform"),
    g = d("application/urlManager").hash,
    p = d("common/Event"),
    n = d("common/util"),
    l = d("application/stat"),
    m,
    v,
    u,
    s,
    z = !0,
    y = 29,
    w = 36;
    return {
        addToPano: function(a) {
            m = a;
            m.addListener("svid_changed", c)
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/RegionPassageway", ["application/Config", "common/util", "common/Event", "application/urlManager", "application/stat"],
function(d, c, b, a, f) {
    var h = null;
    d.getImgUrl("images/exit_insideview.png");
    var e = d.getImgUrl("images/regionEntrance.png"),
    k = a.hash,
    g = !1,
    p = !0,
    n = {
        init: function() {
            this.labels = [];
            var a = function(a) {
                f.clickRegionEntranceMarker();
                var b = this.getAttribute("enterIndex"),
                c = n.getData();
                c[b] && h.setSvid(c[b].reid);
                a.stopPropagation()
            };
            this.createLabel = function(d, f) {
                var g = h.getModel(),
                g = c.getPOV(g.detail.basic.x, g.detail.basic.y, d.rex, d.rey, d.h),
                k = c.createElem("div", {
                    "font-family": "SimHei",
                    position: "absolute",
                    overflow: "hidden",
                    padding: "2px",
                    "padding-right": "4px",
                    "font-size": "12px",
                    color: "#FFF",
                    "background-color": "rgba(0, 0, 0, 0.55)",
                    "border-radius": "3px",
                    "white-space": "nowrap",
                    visibility: p ? "visible": "hidden",
                    "z-index": "9999999"
                }),
                m = c.createElem("img", {
                    width: "20px",
                    height: "17px",
                    "float": "left"
                });
                k.appendChild(m);
                m.src = e;
                m = c.createElem("span", {
                    "margin-left": "1px",
                    "line-height": "17px"
                });
                k.appendChild(m);
                m.textContent = d.name;
                k.setAttribute("enterIndex", f);
                this.clickEventer = b.click(k, a);
                return {
                    heading: g.heading,
                    pitch: g.pitch,
                    elem: k
                }
            };
            var d = h.getControlLayer();
            this.markerLayer = c.createElem("div");
            d.appendChild(this.markerLayer)
        },
        clear: function() {
            for (var a; this.labels.length;) a = this.labels.pop(),
            b.off(a.elem, this.clickEventer),
            h.removeMarker(a.markerId),
            a.elem = null;
            this.labels = []
        },
        destory: function() {
            for (var a; this.labels.length;) a = this.labels.pop(),
            b.off(a.elem, this.clickEventer),
            h.removeMarker(a.markerId),
            a.elem = null;
            this.labels = [];
            this.markerLayer.parentNode.removeChild(this.markerLayer);
            this.markerLayer = null;
            delete this.labelClickHandler;
            delete this.createLabel
        },
        show: function() {
            var a = this.labels.map(function(a) {
                return a.markerId
            });
            h.showMarker(a);
            setTimeout(function() {
                n.markerLayer.style.visibility = "visible"
            },
            1)
        },
        hide: function() {
            var a = this.labels.map(function(a) {
                return a.markerId
            });
            h.hideMarker(a);
            n.markerLayer.style.visibility = "hidden"
        },
        setData: function(a) {
            this._data = a;
            this.clear();
            for (var b, c = 0,
            d = a.length; c < d; c++) b = this.createLabel(a[c], c),
            this.markerLayer.appendChild(b.elem),
            b.markerId = h.addMarker(b.heading, b.pitch, b.elem),
            this.labels.push(b);
            h.refreshMarkersPosition()
        },
        getData: function() {
            return this._data
        },
        resize: function() {}
    },
    l = function(a) {
        n.hide();
        var b = h.getModel();
        b.detail.region && b.detail.region.entrances && b.detail.region.entrances[0] && !b.detail.basic.scenic_id ? (g = !0, setTimeout(function() {
            //n.setData(b.detail.region.entrances);
            p && n.show()
        },
        500)) : (g = !1, n.clear())
    },
    m = function(a) {
        p = a.data.isOverlayVisible;
        g && (p ? n.show() : n.hide())
    },
    v = function() {
        g && n.resize()
    };
    return {
        addToPano: function(a) {
    		__qq_pano_options.qq__n = n;__qq_pano_options.qq__a = a;//===========开放对象===========
            "wx" == k.ref || 0 == k.region || (h = a, n.init(), a.addListener("svid_changed", l), a.addListener("overlay_visible_changed", m), a.addListener("resize", v))
        },
        removeFromPano: function() {
            n.destory();
            h.removeListener("svid_changed", l);
            h = null
        }
    }
});
define("common/loadScript", [],
function() {
    var d = {};
    return function(c, b) {
        d[c] && setTimeout(function() {
            b && b()
        },
        0);
        var a = document.getElementsByTagName("head")[0] || document.documentElement,
        f = document.createElement("script");
        f.src = c;
        var h = !1;
        f.onload = f.onreadystatechange = function() {
            if (!h && (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState)) h = !0,
            b && b(),
            d[c] = 1,
            f.onload = f.onreadystatechange = null,
            a && f.parentNode && a.removeChild(f)
        };
        a.insertBefore(f, a.firstChild)
    }
});
define("application/qutil", ["require", "common/Platform", "common/loadScript", "application/Config"],
function(d) {
    var c = d("common/Platform"),
    b = d("common/loadScript");
    d = d("application/Config");
    var a = {},
    f = [],
    h = function(a) {
        WeixinJSBridge.invoke("getInstallState", c.android ? {
            packageName: "com.tencent.map"
        }: {
            packageUrl: "txmap001://"
        },
        function(b) { / get_install_state: yes / .test(b.err_msg) ? a(!0) : a(!1)
        })
    },
    e = function(a) {
        mqq.app.isAppInstalled(c.android ? "com.tencent.map": "txmap001://", a)
    },
    k = function(a) {
        for (var b = 0; b < f.length; b++) a(f[b]);
        f = null
    };
    c.micromessenger && !window.WeixinJSBridge && document.addEventListener("WeixinJSBridgeReady",
    function() {
        k(h)
    },
    !1);
    c.mobileQQ && !window.mqq && b(d.getResPath("lib/qqapi.js"),
    function() {
        k(e)
    });
    a.isMapAppInstalled = function(a) {
        c.mobileQQ ? window.mqq ? e(a) : f.push(a) : c.micromessenger ? window.WeixinJSBridge ? h(a) : f.push(a) : a("unkown")
    };
    return a
});
define("plugins/SharePOI", "require application/urlManager application/urlManager common/util common/Event crystal/geom/Point application/Config common/Platform application/qutil application/stat".split(" "),
function(d) {
    function c() {
        z && s.removeMarker(z.dataset.markerId);
        w ? q || (delete n.rn, delete n.a, delete n.p, delete n.m, delete n.n, delete n.coord, p.updateHash(), q = !0) : w = s.getSvid();
        if (f()) {
            var a = s.getModel().detail.basic,
            a = l.getPOV(a.x, a.y, x.x, x.y);
            z.dataset.markerId = s.addMarker(a.heading, a.pitch, z, s.getOverlayVisible());
            s.getControlLayer().appendChild(z);
            s.refreshMarkersPosition()
        }
    }
    function b() {
        z = l.createElem("div", {
            position: "absolute",
            height: "27px",
            "white-space": "nowrap",
            "background-color": "rgba(0, 0, 0, 0.7)",
            "z-index": 9
        });
        z.addEventListener("click", a, !0);
        z.addEventListener("mouseup", a, !0);
        z.addEventListener("touchcancel", a, !0);
        var b = l.createElem("div", {
            height: "100%",
            background: "url(" + m.getImgUrl("images/marker_orange.png") + ") no-repeat center center",
            "background-size": "18px 22px",
            width: "27px",
            display: "inline-block"
        });
        z.appendChild(b);
        b = l.createElem("div", {
            "line-height": "27px",
            color: "#fff",
            "padding-right": "5px",
            display: "inline-block",
            "border-right": "1px rgba(255, 255, 255, 0.2) solid",
            "vertical-align": "top",
            "font-family": "Microsoft YaHei",
            "font-size": "13px"
        });
        z.appendChild(b);
        b.textContent = decodeURIComponent(B);
        b = l.createElem("div", {
            "line-height": "27px",
            color: "#5ad941",
            display: "inline-block",
            "vertical-align": "top",
            "font-family": "Microsoft YaHei",
            "font-size": "13px",
            "padding-right": "8px",
            background: "url(" + m.getImgUrl("images/nav.png") + ") no-repeat center center",
            "background-size": "17px",
            width: "17px",
            height: "100%"
        });
        z.appendChild(b);
        z.style.width = l.textWidth(z) + "px";
        return z
    }
    function a(a) {
        a.stopPropagation();
        a.preventDefault();
        y || e();
        y.style.display = "block"
    }
    function f() {
        var a = s.getModel().detail.basic,
        b = x.x - a.x,
        a = x.y - a.y,
        b = Math.sqrt(b * b + a * a);
        parseInt(b);
        return b < A
    }
    function h() {
        var a = F.split(",");
        x = {};
        x.x = l.lngFrom4326ToProjection(parseFloat(a[0]));
        x.y = l.latFrom4326ToProjection(parseFloat(a[1]));
        if (isNaN(x.x) || isNaN(x.y)) throw Error("Custom marker latlng invalid.");
    }
    function e() {
        y = s.getMaskLayer();
        var a = document.getElementById("mask");
        a || (a = document.createElement("div"), a.className = "mask", a.id = "mask", y.appendChild(a));
        a.innerHTML = "";
        l.setStyles(a, {
            top: "0px",
            margin: "0px",
            padding: "0px",
            position: "absolute",
            "z-index": 3E4,
            background: "rgba(0, 0, 0, 0.5)",
            height: "100%",
            width: "100%"
        });
        y.style.display = "none";
        var b = document.createElement("div");
        b.id = "confirmControl";
        var c = document.createElement("span");
        c.textContent = "\u5bfc\u822a\u81f3\u201c" + (decodeURIComponent(B) || "") + "\u201d\u7684\u8def\u7ebf";
        b.appendChild(c);
        l.setStyles(b, {
            position: "absolute",
            background: "#f2f2f2",
            bottom: "60px",
            color: "#666",
            left: "8px",
            right: "8px",
            "border-radius": "4px"
        });
        l.setStyles(c, {
            "font-size": "14px",
            display: "block",
            "text-align": "center",
            height: "49px",
            "line-height": "49px",
            "margin-top": "2px",
            "text-overflow": "ellipsis",
            overflow: "hidden",
            "white-space": "nowrap"
        });
        c = document.createElement("div");
        c.className = "cancel";
        c.innerHTML = "\u53d6\u6d88";
        a.appendChild(b);
        a.appendChild(c);
        var d = {
            color: "#007aff",
            height: "44px",
            "line-height": "44px",
            "text-align": "center",
            "border-top": "1px solid #c3c3c3",
            "-webkit-border-radius": "2px",
            "border-radius": "2px",
            "font-size": "14px"
        };
        v.isMapAppInstalled(function(a) { ! 0 === a ? b.appendChild(g(d)) : (!1 !== a && b.appendChild(g(d)), b.appendChild(k(d)))
        });
        l.setStyles(c, d);
        l.setStyles(c, {
            position: "absolute",
            bottom: "7px",
            left: "8px",
            right: "8px",
            background: "#f2f2f2",
            "border-radius": "4px"
        });
        c.addEventListener("click",
        function(a) {
            y.style.display = "none";
            u.sharePoiCancelMenu()
        },
        !1);
        y.addEventListener("mousemove",
        function(a) {
            a.preventDefault();
            a.stopPropagation()
        },
        !1);
        return ! 0
    }
    function k(a) {
        var b = document.createElement("div");
        b.innerHTML = "\u4e0b\u8f7d\u817e\u8baf\u5730\u56fe\u5ba2\u6237\u7aef";
        b.className = "highlight";
        l.setStyles(b, a);
        b.addEventListener("click",
        function() {
            y.style.display = "none";
            u.downloadMapAppBySharePoi();
            window.open(G)
        },
        !1);
        return b
    }
    function g(a) {
        var b = document.createElement("div");
        b.innerHTML = "\u5728\u817e\u8baf\u5730\u56fe\u5ba2\u6237\u7aef\u67e5\u770b";
        l.setStyles(b, a);
        b.addEventListener("click",
        function(a) {
            y.style.display = "none";
            u.openMapAppBySharePoi();
            setTimeout(function() {
                var a = window.location,
                b;
                s.getModel() ? f() ? (b = l.hashFilter(window.location.hash1), b = "sososv://" + b.slice(1, b.length) + "\x26detail\x3d1\x26referer\x3dh5_sv_" + (n.ref || "")) : b = "sososv://pano\x3d" + s.getSvid() + "\x26heading\x3d" + s.getHeading() + "\x26pitch\x3d" + s.getPitch() + "\x26zoom\x3d" + s.getZoom() + "\x26n\x3d" + encodeURIComponent("\u8857\u666f\u5730\u70b9") + "\x26m\x3d" + l.lngFromProjectionTo4326(s.getModel().detail.basic.x) + "," + (l.latFromProjectionTo4326(s.getModel().detail.basic.y) + 0.01) + "\x26referer\x3dh5_sv_" + (n.ref || "") : b = void 0;
                a.href = b
        },
            100)
        },
        !1);
        return b
    }
    var p = d("application/urlManager"),
    n = d("application/urlManager").hash,
    l = d("common/util");
    d("common/Event");
    d("crystal/geom/Point");
    var m = d("application/Config");
    d("common/Platform");
    var v = d("application/qutil"),
    u = d("application/stat"),
    s,
    z,
    y,
    w = "",
    q = !1,
    A = 1500,
    x,
    B = n.n,
    F = n.m,
    G = "http://softroute.map.qq.com/downloadfile?cid\x3d00164";
    return {
        addToPano: function(a) {
            if (F) {
                n.ref && 0 === n.ref.indexOf("qqnew") && (G = "http://softroute.map.qq.com/downloadfile?cid\x3d00168");
                s = a;
                try {
                    h()
                } catch(d) {
                    console.warn("Latlng of custom marker is invalid.");
                    return
                }
                b();
                s.addListener("svid_changed", c);
                s.addListener("overlay_visible_changed",
                function(a) {
                    a.data.isOverlayVisible ? z && s.showMarker([z.dataset.markerId]) : z && s.hideMarker([z.dataset.markerId])
                });
                u.openSharePoi()
            }
        },
        removeFromPano: function(a) {}
    }
});
define("common/GestureDetector", [],
function() {
    function d(c, b) {
        this._target = c;
        this.onend = this.onchange = this.onstart = this._lastEvt = this._startTouchDistanceSquare = null; ! 1 !== b && this.enable()
    }
    d.prototype.enable = function() {
        this._target.addEventListener("mousedown", this, !1);
        this._target.addEventListener("mousemove", this, !1);
        this._target.addEventListener("mouseup", this, !1);
        this._target.addEventListener("touchcancel", this, !1)
    };
    d.prototype.handleEvent = function(c) {
        switch (c.type) {
        case "mousedown":
            c.preventDefault();
            if (this._startTouchDistanceSquare) break;
            if (2 > c.targetTouches.length) break;
            this._startTouchDistanceSquare = this._touchDistanceSquare(c.targetTouches);
            break;
        case "mousemove":
            if (!this._startTouchDistanceSquare) break;
            this._lastEvt ? this.onchange && this.onchange(this._createGestureEvent(c, "gesturechange")) : this.onstart && this.onstart(this._createGestureEvent(c, "gesturestart"));
            break;
        case "mouseup":
        case "touchcancel":
            if (!this._lastEvt) {
                this._startTouchDistanceSquare = null;
                break
            }
            if (2 <= c.targetTouches.length) break;
            c = this._lastEvt;
            this._startTouchDistanceSquare = this._lastEvt = null;
            c.type = "gestureend";
            this.onend && this.onend(c);
            break;
        default:
            console.warn("Unexpected event for GestureDetector", c)
        }
    };
    d.prototype._touchDistanceSquare = function(c) {
        var b = c[0],
        a = c[1];
        c = b.clientX - a.clientX;
        b = b.clientY - a.clientY;
        return c * c + b * b
    };
    d.prototype._createGestureEvent = function(c, b) {
        var a = {
            type: b
        },
        d = c.targetTouches,
        h = d[0],
        e = d[1],
        d = this._touchDistanceSquare(d);
        a.scale = Math.sqrt(d / this._startTouchDistanceSquare);
        a.clientX = (h.clientX + e.clientY) / 2;
        a.clientY = (h.clientX + e.clientY) / 2;
        a.pageX = (h.pageX + e.pageX) / 2;
        a.pageY = (h.pageY + e.pageY) / 2;
        return this._lastEvt = a
    };
    d.prototype.disable = function() {
        this._target.removeEventListener("mousedown", this, !1);
        this._target.removeEventListener("mousemove", this, !1);
        this._target.removeEventListener("mouseup", this, !1);
        this._target.removeEventListener("touchcancel", this, !1)
    };
    return d
});
define("plugins/ZoomControl", ["common/Platform", "common/Event", "common/TimeShaft", "common/GestureDetector"],
function(d, c, b, a) {
    function f(a) {
        k.removeListener("tile_loaded", f);
        k.getZoom();
        d.supportsCSS3() && (h(), e())
    }
    function h() {
        function b(a) {
            k.setZoom(d * (1 + (a - 1) / 2))
        }
        var c = new a(k.getContainer()),
        d;
        c.onstart = function(a) {
            d = k.getZoom();
            b(a.scale)
        };
        c.onchange = function(a) {
            b(a.scale)
        }
    }
    function e() {
        c.dbclick(k.getEventLayer(),
        function() {
            g && (clearInterval(g), g = null);
            var a = 1.5 * k.getZoom();
            a > k.MAX_ZOOM && (a = k.MIN_ZOOM);
            var c = a - k.getZoom();
            b.add("zoom",
            function() {
                var b = k.getZoom() + c / 10;
                if (0 < c && b < a || 0 > c && b > a) k.setZoom(b);
                else return k.setZoom(a),
                !0;
                k.getZoom()
            })
        })
    }
    var k, g;
    return {
        addToPano: function(a) {
            k = a;
            k.addListener("tile_loaded", f)
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/APPDownload/ui", ["require", "application/qutil", "common/util", "common/Platform", "application/stat"],
function(d) {
    var c = d("application/qutil");
    d("common/util");
    d("common/Platform");
    var b = d("application/stat");
    d = function() {
        this.options = Object.create(this.constructor.defaults)
    };
    d.defaults = {
        wording: "\u5feb\u901f\u67e5\u627e\u66f4\u591a\u8857\u666f,\u8bf7\u7528\u201c\u817e\u8baf\u624b\u673a\u5730\u56fe\u201d",
        is_open: "\u5728\u817e\u8baf\u624b\u673a\u5730\u56fe\u4e2d\u5feb\u901f\u67e5\u770b\u66f4\u591a\u8857\u666f",
        not_open: "\u67e5\u770b\u66f4\u591a\u8857\u666f\uff0c\u4e0b\u8f7d\u817e\u8baf\u624b\u673a\u5730\u56fe",
        open_url: "",
        open_btn: "\u5df2\u5b89\u88c5\uff0c\u8bf7\u6253\u5f00",
        download_btn: "\u672a\u5b89\u88c5\uff0c\u8bf7\u4e0b\u8f7d",
        download_url: "http://softroute.map.qq.com/downloadfile?cid\x3d00164"
    };
    d.prototype.create = function() {
        var a = document.createElement("div");
        a.className = "APPDownload";
        var b = document.createElement("div");
        b.className = "logo";
        var d = document.createElement("div");
        d.className = "content";
        var e = document.createElement("p");
        e.className = "wording";
        e.textContent = this.options.wording;
        var k = document.createElement("div");
        k.className = "btns";
        var g = document.createElement("div");
        g.className = "open_btn";
        g.textContent = this.options.open_btn;
        this._bindOpenBtnEvents(g);
        var p = document.createElement("div");
        p.className = "download_btn";
        p.textContent = this.options.download_btn;
        this._bindDownloadBtnEvents(p);
        k.appendChild(p);
        k.appendChild(g);
        var n = this;
        c.isMapAppInstalled(function(b) { ! 0 === b ? (e.textContent = n.options.is_open, n._bindOpenBtnEvents(a), k.style.display = "none") : !1 === b && (e.textContent = n.options.not_open, n._bindDownloadBtnEvents(a), k.style.display = "none")
        });
        d.appendChild(e);
        a.appendChild(b);
        a.appendChild(d);
        a.appendChild(k);
        this.bindCt(a);
        return this.ct = a
    };
    d.prototype._createOpenButton = function() {
        return open
    };
    d.prototype._createDownloadButton = function() {
        return download
    };
    d.prototype._bindOpenBtnEvents = function(a) {
        var c = this;
        a && a.addEventListener("mousedown",
        function() {
            b.openMapAppBySearch();
            setTimeout(function() {
                c.options.onOpenBtnClick && c.options.onOpenBtnClick(function(a) {
                    window.location.href = a
                })
            },
            500)
        },
        !1);
        a = null
    };
    d.prototype._bindDownloadBtnEvents = function(a) {
        var c = this;
        a && a.addEventListener("mousedown",
        function() {
            b.downloadMapAppBySearch();
            window.open(c.options.download_url)
        },
        !1);
        a = null
    };
    d.prototype.bindCt = function(a) {
        a.addEventListener("mousedown",
        function(a) {
            a.stopPropagation()
        },
        !1);
        a.addEventListener("mouseup",
        function(a) {
            a.stopPropagation()
        },
        !1)
    };
    d.prototype.fadeIn = function() {
        this.ct && (this.ct.style.display = "block");
        this.ct && (this.ct.style.opacity = 1);
        this.ct && (this.ct.style.visibility = "visible")
    };
    d.prototype.fadeOut = function() {
        this.ct && (this.ct.style.opacity = 0);
        this.ct && (this.ct.style.visibility = "hidden");
        setTimeout(function() {
            this.ct && (this.ct.style.display = "none")
        },
        500)
    };
    d.prototype.destroy = function() {
        this.ct && this.ct.parentNode && this.ct.parentNode.removeChild(this.ct);
        this.ct = null
    };
    return d
});
define("plugins/APPDownload/index", ["require", "plugins/APPDownload/ui", "application/urlManager", "common/Platform", "common/util"],
function(d) {
    var c = d("plugins/APPDownload/ui"),
    b = d("application/urlManager").hash;
    d("common/Platform");
    var a = d("common/util");
    return {
        addToPano: function(d) {
            if (! ("wx" === b.ref || 0 == b.search)) {
                var h = new c;
                b.ref && 0 === b.ref.indexOf("qqnew") && (h.options.download_url = "http://softroute.map.qq.com/downloadfile?cid\x3d00168");
                var e = !1;
                document.body.appendChild(h.create());
                h.options.onOpenBtnClick = function(c) {
                    var e = "";
                    a.lngFromProjectionTo4326(d.getModel().detail.basic.x);
                    a.latFromProjectionTo4326(d.getModel().detail.basic.y);
                    e = "sososv://pano\x3d" + d.getSvid() + "\x26heading\x3d" + d.getHeading() + "\x26pitch\x3d" + d.getPitch() + "\x26zoom\x3d" + d.getZoom() + "\x26n\x3d" + encodeURIComponent("\u8857\u666f\u5730\u70b9") + "\x26m\x3d" + a.lngFromProjectionTo4326(d.getModel().detail.basic.x) + "," + (a.latFromProjectionTo4326(d.getModel().detail.basic.y) + 0.01) + "\x26referer\x3dh5_sv_" + (b.ref || "");
                    c && c(e)
                };
                d.addListener("showAPPDownload",
                function() {
                    e || (h.fadeIn(), e = !0)
                });
                d.addListener("SearchAroundBlur",
                function() {
                    h.fadeOut();
                    e = !1
                })
            }
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/SearchAround/ui", ["require", "common/Platform"],
function(d) {
    var c = d("common/Platform");
    d = function() {
        this.options = Object.create(this.constructor.defaults)
    };
    d.defaults = {
        placeholder: "\u8f93\u5165\u5730\u5740\u4fe1\u606f"
    };
    d.prototype.create = function() {
        var b = document.createElement("div");
        b.className = "searchAround";
        b.id = "Kepler_searchAround";
        var a = document.createElement("form");
        a.className = "form";
        var c = document.createElement("span");
        c.className = "glass";
        var d = document.createElement("input");
        d.className = "search";
        d.type = "search";
        d.placeholder = this.options.placeholder;
        d.autofocus = !1;
        var e = document.createElement("span");
        e.className = "cancel";
        e.textContent = "\u53d6\u6d88";
        e = document.createElement("i");
        e.className = "clear";
        this.bindSearch(d, e, b);
        a.appendChild(c);
        a.appendChild(d);
        a.appendChild(e);
        this.bindForm(a, d);
        b.appendChild(a);
        this.search = d;
        this.clear = e;
        this.ct = b;
        this.bindCt();
        return b
    };
    d.prototype.bindCt = function() {
        var b = this;
        c.ios && this.ct.addEventListener("click",
        function() {
            b.search.blur()
        })
    };
    d.prototype.bindSearch = function(b, a, c) {
        var d = this;
        b.onkeyup = b.oninput = function(a) {
            "" === this.value ? d.hideClear() : d.showClear();
            d.options.oninput && d.options.oninput(a)
        };
        b.onblur = function(a) {
            this.blur();
            d.options.onblur && d.options.onblur(a)
        };
        b.onfocus = function(a) {
            d.options.onfocus && d.options.onfocus(a)
        };
        b.addEventListener("mouseup",
        function(a) {
            a.stopPropagation();
            a = a.changedTouches[0];
            a = this.getBoundingClientRect().right - a.clientX;
            35 > a && 0 < a && (this.value = "", d.hideClear())
        },
        !1);
        b.addEventListener("click",
        function(a) {
            a.preventDefault();
            a.stopPropagation();
            a = this.getBoundingClientRect().right - a.clientX;
            29 > a && 0 < a && (this.value = "", d.hideClear())
        },
        !1);
        b = null
    };
    d.prototype.bindForm = function(b, a) {
        var c = this;
        b.addEventListener("submit",
        function(b) {
            a.blur();
            c.options.onsearch && c.options.onsearch(a.value);
            b.preventDefault();
            return ! 1
        },
        !1);
        b.addEventListener("click",
        function(a) {
            a.stopPropagation()
        },
        !1);
        b = null
    };
    d.prototype.hideClear = function() {
        this.clear && (this.clear.style.visibility = "hidden")
    };
    d.prototype.showClear = function() {
        this.clear && (this.clear.style.visibility = "visible")
    };
    d.prototype.fadeIn = function() {
        this.ct && this.ct.classList.add("searchAroundShow")
    };
    d.prototype.fadeOut = function() {
        this.ct && this.ct.classList.remove("searchAroundShow");
        this.hideClear()
    };
    d.prototype.destroy = function() {
        this.ct && this.ct.parentNode && this.ct.parentNode.removeChild(this.ct);
        this.ct = null
    };
    d.prototype.createSearchUI = function() {
        var b = document.createElement("div");
        b.className = "SearchAround_info";
        this.searchUI = b;
        /iphone\s4/i.test(navigator.userAgent) && c.mqq && (b.style.lineHeight = "50px");
        return b
    };
    d.prototype.showInfo = function(b) {
        this.searchUI && (this.searchUI.textContent = b, this.searchUI.style.display = "block")
    };
    d.prototype.hideInfo = function() {
        this.searchUI && (this.searchUI.style.display = "none")
    };
    d.prototype.destroySearchUI = function() {};
    return d
});
define("plugins/SearchAround/search", ["require", "common/util", "application/Config"],
function(d) {
    var c = d("common/util"),
    b = d("application/Config");
    d = function() {
        this.options = Object.create(this.constructor.defaults)
    };
    d.defaults = {
        city: "\u5317\u4eac",
        page_index: 1,
        page_size: 20
    };
    d.prototype.search = function() {
        var a = this;
        this.getPlaceByJsonp("region(" + this.options.city + ")", this.options.keywords, this.options.page_size, this.options.page_index,
        function(b) {
            if (b && 0 == b.status && b.data) if (b.data.length) {
                var c = !1;
                b.data.forEach(function(b) {
                    b.pano && (b.pano.id && a.options.currentPanoId != b.pano.id && !c) && (a.options.onsearchend && a.options.onsearchend(b.pano), c = !0)
                });
                c || a.options.onnodata && a.options.onnodata()
            } else a.options.onnodata && a.options.onnodata();
            else a.options.onerror && a.options.onerror()
        })
    };
    d.prototype.getPlaceByJsonp = function(a, d, h, e, k) {
        a = encodeURIComponent(a);
        d = encodeURIComponent(d);
        a = b.placeSearch + "/ws/place/v1/search/?boundary\x3d" + a + "\x26keyword\x3d" + d + "\x26page_size\x3d" + h + "\x26page_index\x3d" + e + "\x26key\x3d" + b.placeSearchKey;
        console.log("Search streetview http request", a);
        c.loadJsonp(a, k)
    };
    d.prototype.getCity = function(a, d) {
        var h = c.latFromProjectionTo4326(a.detail.basic.y),
        e = c.lngFromProjectionTo4326(a.detail.basic.x);
        c.loadJsonp(b.placeSearch + "/ws/geocoder/v1/?location\x3d" + h + "," + e + "\x26key\x3d" + b.placeSearchKey,
        function(a) {
            a && 0 == a.status && a.result && a.result.address_component && a.result.address_component.city ? d("") : d(null)
        })
    };
    return d
});
define("plugins/SearchAround/index", "require application/urlManager plugins/SearchAround/ui plugins/SearchAround/search common/util application/stat".split(" "),
function(d) {
    var c = d("application/urlManager").hash,
    b = d("plugins/SearchAround/ui"),
    a = d("plugins/SearchAround/search");
    d("common/util");
    var f = d("application/stat");
    return {
        addToPano: function(d) {
            if (! ("wx" === c.ref || 0 == c.search)) {
                var e = new b,
                k = new a,
                g = "",
                p = !1;
                document.body.appendChild(e.createSearchUI());
                document.body.appendChild(e.create());
                e.options.onfocus = function() {
                    f.clickSearchBtn();
                    e.fadeIn();
                    d.dispatchEvent("fadeOutAddressBar");
                    d.dispatchEvent("showAPPDownload");
                    d.getOverlayVisible() && (d.setOverlayVisible(!1), p = d.stopOverlayChanged = !0)
                };
                e.options.onsearch = function(a) {
                    g && (k.options.city = g);
                    k.options.keywords = a;
                    k.options.currentPanoId = d.getSvid();
                    k.options.onsearchend = n;
                    k.options.onnodata = k.options.onerror = l;
                    k.search();
                    e.showInfo("\u6b63\u5728\u67e5\u8be2, \u8bf7\u7a0d\u540e...")
                };
                var n = function(a) {
                    e.hideInfo();
                    d.setSvid(a.id);
                    void 0 != a.heading && void 0 != a.pitch && d.setPov({
                        heading: a.heading,
                        pitch: a.pitch
                    })
                },
                l = function() {
                    e.showInfo("\u67e5\u8be2\u65e0\u7ed3\u679c");
                    setTimeout(function() {
                        e.hideInfo()
                    },
                    2E3)
                };
                e.options.onblur = function() {
                    e.fadeOut();
                    d.dispatchEvent("fadeInAddressBar");
                    d.dispatchEvent("SearchAroundBlur");
                    d.stopOverlayChanged = !1;
                    p && d.setOverlayVisible(!0)
                };
                d.addListener("addressbar_click",
                function(a) {});
                d.addListener("svid_changed",
                function() {
                    k.getCity(d.getModel(),
                    function(a) {
                        null !== a && (g = a)
                    })
                })
            }
        },
        removeFromPano: function(a) {}
    }
});
define("plugins/PoiDetail/Data", ["require", "common/util", "application/urlManager"],
function(d) {
    function c(a) {
        a && 0 === a.err ? (a = a.data, f.each(p,
        function(a) {
            a.data = []
        }), a.forEach(function(a, b) {
            a.showIndex = a.rank * k - a.distance * g;
            a.type in p && a.distance <= p[a.type].max_dist && p[a.type].data.push(a)
        }), f.each(p,
        function(a) {
            a.data.sort(function(a, b) {
                return b.showIndex - a.showIndex
            })
        }), b(p)) : (f.each(p,
        function(a) {
            a.data = null
        }), b(null))
    }
    function b(a) {
        e.dispatchEvent("PoiDetail_data_changed", a)
    }
    function a() {
        if (!e.isMiniAlbum()) {
            var a = e.getModel();
            f.getPOIDetail(a.detail.basic.x, a.detail.basic.y, "all", c)
        }
    }
    var f = d("common/util"),
    h = d("application/urlManager").hash,
    e,
    k = 0.6,
    g = 0.4,
    p = {
        restaurant: {
            max_dist: 500,
            data: null
        },
        cinema: {
            max_dist: 1500,
            data: null
        },
        hotel: {
            max_dist: 1E3,
            data: null
        }
    };
    return {
        addToPano: function(b) {
            "detail" === h.poi && (e = b, e.addListener("svid_changed", a))
        },
        removeFromPano: function() {},
        name: "Poidetail data"
    }
});
define("plugins/PoiDetail/DetailPoi/TabCt", ["require", "common/util"],
function(d) {
    var c = d("common/util");
    d = function() {
        this.options = Object.create(this.constructor.defaults)
    };
    d.defaults = {
        model: "expand",
        visible: !1,
        selected: "restaurant",
        showList: "restaurant,cinema,hotel"
    };
    var b = d.prototype;
    b.create = function() {
        var a = document.createElement("div");
        a.classList.add("poidetail_tab");
        a.id = "pdtab";
        var b = document.createElement("div");
        b.classList.add("hot");
        b.id = "pdhot";
        var c = document.createElement("div");
        c.classList.add("list");
        c.id = "pdlist";
        a.appendChild(b);
        a.appendChild(c);
        var d = document.createElement("div");
        d.classList.add("btn");
        d.textContent = "\u7f8e\u98df";
        d.dataset.type = "restaurant";
        var k = document.createElement("div");
        k.classList.add("btn");
        k.textContent = "\u7535\u5f71";
        k.dataset.type = "cinema";
        var g = document.createElement("div");
        g.classList.add("btn");
        g.textContent = "\u9152\u5e97";
        g.dataset.type = "hotel";
        c.appendChild(d);
        c.appendChild(k);
        c.appendChild(g);
        this.restaurant = d;
        this.cinema = k;
        this.hotel = g;
        this.list = c;
        this.hot = b;
        this.btns = [this.restaurant, this.cinema, this.hotel];
        this.ct = a;
        this.set();
        this.bindEvent();
        return a
    };
    b.bindEvent = function() {
        this.hot.onclick = c.bindThis(this.hotEvent, this);
        this.restaurant.onclick = c.bindThis(this.btnsEvent, this);
        this.cinema.onclick = c.bindThis(this.btnsEvent, this);
        this.hotel.onclick = c.bindThis(this.btnsEvent, this)
    };
    b.hotEvent = function(a) {
        switch (this.options.model) {
        case "fold":
            this.setModel("expand");
            break;
        case "expand":
            this.setModel("fold"),
            this.setSelected("none")
        }
    };
    b.btnsEvent = function(a) {
        this.options.selected === a.target.dataset.type ? this.setSelected("none") : this.setSelected(a.target.dataset.type)
    };
    b.set = function() {
        var a = this.options;
        this._setVisible(a.visible);
        this._setSelected(a.selected);
        this._setModel(a.model);
        this._setShowList(a.showList)
    };
    b.setVisible = function(a) {
        this.options.visible !== a && this._setVisible(a)
    };
    b._setVisible = function(a) {
        a ? this.ct.classList.remove("hide") : this.ct.classList.add("hide");
        this.options.visible = a
    };
    b.setSelected = function(a) {
        this.options.selected === a || -1 === this.options.showList.indexOf(a) && "none" !== a || this._setSelected(a)
    };
    b._setSelected = function(a) {
        "none" === a ? this.cancel() : this.select(a);
        this.options.selected = a;
        this.options.onSelectedChanged && this.options.onSelectedChanged(this.options.selected)
    };
    b.setShowList = function(a) {
        this.options.showList !== a && this._setShowList(a)
    };
    b._setShowList = function(a) {
        for (var b = this.btns,
        c = "",
        d = 0,
        k = b.length; d < k; d++) - 1 < a.indexOf(b[d].dataset.type) ? (b[d].classList.remove("hide"), c = b[d].dataset.type) : b[d].classList.add("hide");
        this.setLastChild(c); - 1 === a.indexOf(this.options.selected) && "none" !== this.options.selected && this.setSelected("none");
        this.options.showList = a
    };
    b.setLastChild = function(a) {
        for (var b = this.btns.length - 1; 0 <= b; b--) a === this.btns[b].dataset.type ? this.btns[b].classList.add("last-child") : this.btns[b].classList.remove("last-child")
    };
    b.expand = function() {
        this.hot && this.hot.classList.remove("fold");
        this.showBtns()
    };
    b.fold = function() {
        this.hot && this.hot.classList.add("fold");
        this.hideBtns()
    };
    b.hideBtns = function() {
        this.list && this.list.classList.add("hide")
    };
    b.showBtns = function() {
        this.list && this.list.classList.remove("hide")
    };
    b.select = function(a) {
        if ("none" !== this.options.selected) {
            var b = this[this.options.selected];
            b && b.classList.remove("selected")
        }
        this[a] && this[a].classList.add("selected")
    };
    b.cancel = function() {
        if ("none" !== this.options.selected) {
            var a = this[this.options.selected];
            a && a.classList.remove("selected")
        }
    };
    b.setModel = function(a) {
        this.options.model !== a && this._setModel(a)
    };
    b._setModel = function(a) {
        "loading" === this.options.model && this.cancelLoading();
        switch (a) {
        case "fold":
            this.fold();
            break;
        case "expand":
            this.expand();
            break;
        case "loading":
            this.setLoading()
        }
        this.options.model = a
    };
    b.setLoading = function() {
        this.hot.classList.add("loading")
    };
    b.cancelLoading = function() {
        this.hot.classList.remove("loading")
    };
    b.startLoading = function() {
        "loading" !== this.options.model && (this.cacheModel = this.options.model, this.setModel("fold"), this.setModel("loading"))
    };
    b.endLoading = function() {
        "loading" === this.options.model && this.cacheModel && this.setModel(this.cacheModel)
    };
    return d
});
define("plugins/PoiDetail/Tab", ["require", "plugins/PoiDetail/DetailPoi/TabCt", "application/urlManager", "common/util"],
function(d) {
    function c(a) {
        a = a.data;
        if (!a || g.isMiniAlbum()) f(!0),
        p.setVisible(!1);
        else {
            var b = [],
            c;
            for (c in a) a[c].data.length && b.push(c);
            b.length || p.setVisible(!1);
            p.setShowList(b.join(","));
            p.endLoading();
            n = !0;
            m = a;
            f()
        }
    }
    function b() {
        g.isMiniAlbum() ? p.setVisible(!1) : (p.startLoading(), p.setVisible(!0), n = !1);
        f(!0)
    }
    function a(a) {
        l = a;
        v("none" === a ? "": a);
        n && setTimeout(function() {
            f()
        },
        10)
    }
    function f(a) {
        a ? g.dispatchEvent("POIDetail_refresh", {
            status: "loading",
            data: []
        }) : g.dispatchEvent("POIDetail_refresh", {
            status: "none" === l ? "default": l,
            data: "none" === l ? [] : m[l].data
        })
    }
    var h = d("plugins/PoiDetail/DetailPoi/TabCt"),
    e = d("application/urlManager"),
    k = d("common/util"),
    g,
    p = new h,
    n = !1,
    l = p.options.selected,
    m = null,
    v = function(a) {
        var b = window.location.hash1,
        c;
        /(([#&])catalog=([^&]*))/i.test(b) && (c = RegExp.$1);
        void 0 !== c ? RegExp.$3 !== a && window.location.replace(b.replace(c, RegExp.$2 + "catalog\x3d" + a)) : a && window.location.replace(location.hash1 += "\x26catalog\x3d" + a)
    };
    return {
        addToPano: function(d) {
            if ("detail" === e.hash.poi) {
                g = d;
                document.body.appendChild(p.create());
                p.options.onSelectedChanged = a;
                var f = e.hash.catalog;
                p.setSelected(f ? f: "none");
                k.getShareTitle = function() {
                    var a = p.options.selected;
                    return "\u8857\u666f" + (p[a] && p[a].textContent || "")
                };
                d.addListener("PoiDetail_data_changed", c);
                d.addListener("svid_changed", b)
            }
        },
        removeFromPano: function() {},
        getShareTitle: function() {}
    }
});
define("plugins/PoiDetail/DetailPoi/Marker", ["require", "common/util", "crystal/geom/Rectangle", "application/Config", "application/stat"],
function(d) {
    function c(a) {
        for (var b in a) this[b] = a[b];
        this.create()
    }
    var b = d("common/util");
    d("crystal/geom/Rectangle");
    var a = d("application/Config"),
    f = d("application/stat");
    d = c.prototype;
    d.heading = 0;
    d.pitch = 0;
    d.left = 0;
    d.top = 0;
    d.inpano = !1;
    d.dom = null;
    d.ARROW_WHITE_IMG = a.getImgUrl("images/Arrow_white.png");
    d.DETAIL_URL = a.poidetailPage;
    d.show = function() {
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
        this.dom.style.display = "block"
    };
    d.hide = function() {
        this.dom && (this.dom.style.display = "none")
    };
    d.setPosition = function(a, b) {
        this.left = a;
        this.top = b
    };
    var h = function() {
        var a = {};
        return function(b) {
            a[b] || (a[b] = function(a) {
                this.style.backgroundColor = b;
                a.stopPropagation()
            });
            return a[b]
        }
    } ();
    d.create = function() {
        var c = this,
        d = b.createElem("a", {
            position: "absolute",
            "text-decoration": "none",
            display: "block",
            "-webkit-transition": "background-color 0.3s ease-in",
            "background-color": "rgba(0, 0, 0, 0.55)",
            overflow: "hidden",
            "border-radius": "5px",
            "z-index": 10
        });
        d.href = c.DETAIL_URL.replace("{dpId}", c.dpId);
        d.addEventListener("mousedown", h("rgba(11,122,255,0.8)"), !1);
        d.addEventListener("mouseup", h("rgba(0, 0, 0, 0.55)"), !1);
        d.addEventListener("mouseup",
        function() {
            f.clickdetailPoiMarker()
        },
        !1);
        var g = b.createElem("div", {
            height: "32px",
            padding: "4px",
            "padding-right": "8px"
        }),
        p = b.createElem("img", {
            width: "32px",
            height: "32px",
            "float": "left",
            "border-radius": "2px",
            "margin-right": "4px"
        });
        p.src = c.thumb || a.getImgUrl("images/marker_" + c.type + ".png");
        p.onerror = function() {
            this.src = a.getImgUrl("images/marker_" + c.type + ".png");
            this.onerror = null
        };
        var n = b.createElem("h1", {
            padding: 0,
            margin: 0,
            "font-size": "12px",
            color: "#FFF",
            "line-height": "16px"
        });
        n.innerHTML = c.name || "";
        var l = b.createElem("p", {
            padding: 0,
            margin: 0,
            "font-size": "12px",
            color: "#C2C2C2",
            "line-height": "16px",
            "background-image": "url(" + this.ARROW_WHITE_IMG + ")",
            "background-position": "100% 50%",
            "background-size": "8px 12px",
            "background-repeat": "no-repeat"
        });
        if (c.distance || 0 === c.distance) l.textContent = c.distance + "\u7c73";
        var m = b.textWidth(n),
        v = b.textWidth(l) + 8;
        g.appendChild(p);
        g.appendChild(n);
        g.appendChild(l);
        d.appendChild(g);
        d.style.height = "40px";
        d.style.width = 48 + Math.max(m, v) + "px";
        c.dom = d
    };
    d.destroy = function() {
        this.dom.parentNode.removeChild(this.dom);
        this.dom = null
    };
    return c
});
define("plugins/PoiDetail/Markers", "require common/util common/Event plugins/PoiDetail/DetailPoi/Marker crystal/geom/Rectangle application/urlManager".split(" "),
function(d) {
    function c() {
        B = x.getModel()
    }
    function b(a) {
        J = a.data.status;
        "loading" === a.data.status ? z() : O(a.data.status, a.data.data)
    }
    function a(a) {
        p(a.data.poi)
    }
    function f() {
        J === K.DEFAULT || H || (D ? D = !1 : u())
    }
    function h() {
        H = !1;
        D = !0;
        J !== K.DEFAULT && u(C)
    }
    function e() {
        H = !1;
        J !== K.DEFAULT && u()
    }
    function k() {
        H = !0;
        E && E.forEach(function(a) {
            a.hide()
        })
    }
    function g(a) {
        G = [];
        a.forEach(function(a) {
            a = new w(a);
            a.width = parseFloat(a.dom.style.width) + S;
            a.height = parseFloat(a.dom.style.height) + S;
            a.hide();
            var b = y.getPOV(B.detail.basic.x, B.detail.basic.y, a.x, a.y, a.h);
            a.heading = b.heading;
            a.pitch = b.pitch;
            G.push(a);
            F.appendChild(a.dom)
        })
    }
    function p(a) {
        if (G) {
            var b;
            G.forEach(function(c) {
                c.id === a && (b = c)
            });
            l(b)
        }
    }
    function n(a) {
        var b = x.getHeading(),
        c = 360,
        d = null;
        a.forEach(function(a) {
            var e = (a.heading + x.getHeadingRangeByCenter(a.width / 2)) % 360,
            e = Math.abs(e - b),
            e = 180 < e ? 360 - e: e;
            e < c && (c = e, d = a)
        });
        return d
    }
    function l(a) {
        var b = (a.heading + x.getHeadingRangeByCenter(a.width / 2)) % 360,
        c = x.getHeading();
        x.dispatchEvent("turnstart", {
            beginHeading: c,
            endHeading: b,
            speed: I
        });
        C = a
    }
    function m(a) {
        var b = x.getPOIPos(a.heading, a.pitch);
        b ? (a.setPosition(b.x, b.y), a.inpano = !0) : a.inpano = !1;
        return a.inpano
    }
    function v(a, b) {
        if (!m(b) || !m(a)) return ! 1;
        var c = new q(a.left, a.top, a.width, a.height),
        d = new q(b.left, b.top, b.width, b.height);
        return c.intersects(d)
    }
    function u(a) {
        if (a) E && E.forEach(function(a) {
            a.hide()
        }),
        E = [a];
        else {
            if (E) {
                E = E.filter(function(a) {
                    return ! m(a) ? (a.hide(), !1) : !0
                });
                a = E.concat();
                for (var b, c = 0; b = a.shift();) {
                    var d = !1;
                    a.forEach(function(a, e) {
                        v(b, a) && !d && (a.hide(), E.splice(c + 1 + e, 1), d = !0)
                    });
                    c++
                }
            } else E = [];
            G && G.forEach(function(a) {
                if (m(a) && !(E.length > U)) {
                    var b = !1;
                    E.forEach(function(c) {
                        v(c, a) && (b = !0)
                    }); ! b && E.push(a)
                }
            })
        }
        s()
    }
    function s() {
        E && E.forEach(function(a) {
            m(a) ? a.show() : a.hide()
        })
    }
    function z() {
        G && G.forEach(function(a) {
            F.removeChild(a.dom)
        });
        G = E = null
    }
    var y = d("common/util");
    d("common/Event");
    var w = d("plugins/PoiDetail/DetailPoi/Marker"),
    q = d("crystal/geom/Rectangle"),
    A = d("application/urlManager").hash,
    x,
    B,
    F,
    G,
    H = !1,
    D = !1,
    E,
    C,
    J,
    K = {
        DEFAULT: "default",
        RESTAURANT: "restaurant",
        CINEMA: "cinema",
        HOTEL: "hotel"
    },
    I = 0.1,
    U = 3,
    S = 2,
    O = function(a, b) {
        a !== K.DEFAULT && (g(b), u());
        O = function(a, b) {
            z();
            a !== K.DEFAULT && (g(b), l(n(G)))
        }
    };
    return {
        addToPano: function(d) {
            "detail" === A.poi && (x = d, x.addListener("POIDetail_refresh", b), x.addListener("POIDetail_itemselected", a), x.addListener("svid_changed", c), x.addListener("render", f), x.addListener("turnstart", k), x.addListener("turnend", h), x.addListener("turnstop", e), x.setIsForceRefresh(!0), F = document.createElement("div"), x.getControlLayer().appendChild(F))
        },
        removeFromPano: function() {
            z()
        }
    }
}); (function(d, c) {
    function b(a) {
        if ("" === h) return a;
        a = a.charAt(0).toUpperCase() + a.substr(1);
        return h + a
    }
    var a = Math,
    f = c.createElement("div").style,
    h = function() {
        for (var a = ["t", "webkitT", "MozT", "msT", "OT"], b, c = 0, d = a.length; c < d; c++) if (b = a[c] + "ransform", b in f) return a[c].substr(0, a[c].length - 1);
        return ! 1
    } (),
    e = h ? "-" + h.toLowerCase() + "-": "",
    k = b("transform"),
    g = b("transitionProperty"),
    p = b("transitionDuration"),
    n = b("transformOrigin"),
    l = b("transitionTimingFunction"),
    m = b("transitionDelay"),
    v = /android/gi.test(navigator.appVersion),
    u = /iphone|ipad/gi.test(navigator.appVersion),
    s = /hp-tablet/gi.test(navigator.appVersion),
    z = b("perspective") in f,
    y = "ontouchstart" in d && !s,
    w = !1 !== h,
    q = b("transition") in f,
    A = "onorientationchange" in d ? "orientationchange": "resize",
    x = y ? "mousedown": "mousedown",
    B = y ? "mousemove": "mousemove",
    F = y ? "mouseup": "mouseup",
    G = y ? "touchcancel": "mouseup",
    H = !1 === h ? !1 : {
        "": "transitionend",
        webkit: "webkitTransitionEnd",
        Moz: "transitionend",
        O: "otransitionend",
        ms: "MSTransitionEnd"
    } [h],
    D = function() {
        return d.requestAnimationFrame || d.webkitRequestAnimationFrame || d.mozRequestAnimationFrame || d.oRequestAnimationFrame || d.msRequestAnimationFrame ||
        function(a) {
            return setTimeout(a, 1)
        }
    } (),
    E = d.cancelRequestAnimationFrame || d.webkitCancelAnimationFrame || d.webkitCancelRequestAnimationFrame || d.mozCancelRequestAnimationFrame || d.oCancelRequestAnimationFrame || d.msCancelRequestAnimationFrame || clearTimeout,
    C = z ? " translateZ(0)": "",
    s = function(a, b) {
        var f = this,
        h;
        f.wrapper = "object" == typeof a ? a: c.getElementById(a);
        f.wrapper.style.overflow = "hidden";
        f.scroller = f.wrapper.children[0];
        f.options = {
            hScroll: !0,
            vScroll: !0,
            x: 0,
            y: 0,
            bounce: !0,
            bounceLock: !1,
            momentum: !0,
            lockDirection: !0,
            useTransform: !0,
            useTransition: !1,
            topOffset: 0,
            checkDOMChanges: !1,
            handleClick: !0,
            hScrollbar: !0,
            vScrollbar: !0,
            fixedScrollbar: v,
            hideScrollbar: u,
            fadeScrollbar: u && z,
            scrollbarClass: "",
            zoom: !1,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: "scroll",
            snap: !1,
            snapThreshold: 1,
            onRefresh: null,
            onBeforeScrollStart: function(a) {
                a.preventDefault()
            },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,
            onZoom: null,
            onZoomEnd: null
        };
        for (h in b) f.options[h] = b[h];
        f.x = f.options.x;
        f.y = f.options.y;
        f.options.useTransform = w && f.options.useTransform;
        f.options.hScrollbar = f.options.hScroll && f.options.hScrollbar;
        f.options.vScrollbar = f.options.vScroll && f.options.vScrollbar;
        f.options.zoom = f.options.useTransform && f.options.zoom;
        f.options.useTransition = q && f.options.useTransition;
        f.options.zoom && v && (C = "");
        f.scroller.style[g] = f.options.useTransform ? e + "transform": "top left";
        f.scroller.style[p] = "0";
        f.scroller.style[n] = "0 0";
        f.options.useTransition && (f.scroller.style[l] = "cubic-bezier(0.33,0.66,0.66,1)");
        f.options.useTransform ? f.scroller.style[k] = "translate(" + f.x + "px," + f.y + "px)" + C: f.scroller.style.cssText += ";position:absolute;top:" + f.y + "px;left:" + f.x + "px";
        f.options.useTransition && (f.options.fixedScrollbar = !0);
        f.refresh();
        f._bind(A, d);
        f._bind(x); ! y && "none" != f.options.wheelAction && (f._bind("DOMMouseScroll"), f._bind("mousewheel"));
        f.options.checkDOMChanges && (f.checkDOMTime = setInterval(function() {
            f._checkDOMChanges()
        },
        500))
    };
    s.prototype = {
        enabled: !0,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function(a) {
            switch (a.type) {
            case x:
                if (!y && 0 !== a.button) break;
                this._start(a);
                break;
            case B:
                this._move(a);
                break;
            case F:
            case G:
                this._end(a);
                break;
            case A:
                this._resize();
                break;
            case "DOMMouseScroll":
            case "mousewheel":
                this._wheel(a);
                break;
            case H:
                this._transitionEnd(a)
            }
        },
        _checkDOMChanges: function() { ! this.moved && (!this.zoomed && !(this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) && this.refresh()
        },
        _scrollbar: function(b) {
            var d;
            this[b + "Scrollbar"] ? (this[b + "ScrollbarWrapper"] || (d = c.createElement("div"), this.options.scrollbarClass ? d.className = this.options.scrollbarClass + b.toUpperCase() : d.style.cssText = "position:absolute;z-index:100;" + ("h" == b ? "height:7px;bottom:1px;left:2px;right:" + (this.vScrollbar ? "7": "2") + "px": "width:7px;bottom:" + (this.hScrollbar ? "7": "2") + "px;top:2px;right:1px"), d.style.cssText += ";pointer-events:none;" + e + "transition-property:opacity;" + e + "transition-duration:" + (this.options.fadeScrollbar ? "350ms": "0") + ";overflow:hidden;opacity:" + (this.options.hideScrollbar ? "0": "1"), this.wrapper.appendChild(d), this[b + "ScrollbarWrapper"] = d, d = c.createElement("div"), this.options.scrollbarClass || (d.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + e + "background-clip:padding-box;" + e + "box-sizing:border-box;" + ("h" == b ? "height:100%": "width:100%") + ";" + e + "border-radius:3px;border-radius:3px"), d.style.cssText += ";pointer-events:none;" + e + "transition-property:" + e + "transform;" + e + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + e + "transition-duration:0;" + e + "transform: translate(0,0)" + C, this.options.useTransition && (d.style.cssText += ";" + e + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), this[b + "ScrollbarWrapper"].appendChild(d), this[b + "ScrollbarIndicator"] = d), "h" == b ? (this.hScrollbarSize = this.hScrollbarWrapper.clientWidth, this.hScrollbarIndicatorSize = a.max(a.round(this.hScrollbarSize * this.hScrollbarSize / this.scrollerW), 8), this.hScrollbarIndicator.style.width = this.hScrollbarIndicatorSize + "px", this.hScrollbarMaxScroll = this.hScrollbarSize - this.hScrollbarIndicatorSize, this.hScrollbarProp = this.hScrollbarMaxScroll / this.maxScrollX) : (this.vScrollbarSize = this.vScrollbarWrapper.clientHeight, this.vScrollbarIndicatorSize = a.max(a.round(this.vScrollbarSize * this.vScrollbarSize / this.scrollerH), 8), this.vScrollbarIndicator.style.height = this.vScrollbarIndicatorSize + "px", this.vScrollbarMaxScroll = this.vScrollbarSize - this.vScrollbarIndicatorSize, this.vScrollbarProp = this.vScrollbarMaxScroll / this.maxScrollY), this._scrollbarPos(b, !0)) : this[b + "ScrollbarWrapper"] && (w && (this[b + "ScrollbarIndicator"].style[k] = ""), this[b + "ScrollbarWrapper"].parentNode.removeChild(this[b + "ScrollbarWrapper"]), this[b + "ScrollbarWrapper"] = null, this[b + "ScrollbarIndicator"] = null)
        },
        _resize: function() {
            var a = this;
            setTimeout(function() {
                a.refresh()
            },
            v ? 200 : 0)
        },
        _pos: function(b, c) {
            this.zoomed || (b = this.hScroll ? b: 0, c = this.vScroll ? c: 0, this.options.useTransform ? this.scroller.style[k] = "translate(" + b + "px," + c + "px) scale(" + this.scale + ")" + C: (b = a.round(b), c = a.round(c), this.scroller.style.left = b + "px", this.scroller.style.top = c + "px"), this.x = b, this.y = c, this._scrollbarPos("h"), this._scrollbarPos("v"))
        },
        _scrollbarPos: function(b, c) {
            var d = "h" == b ? this.x: this.y;
            this[b + "Scrollbar"] && (d *= this[b + "ScrollbarProp"], 0 > d ? (this.options.fixedScrollbar || (d = this[b + "ScrollbarIndicatorSize"] + a.round(3 * d), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width": "height"] = d + "px"), d = 0) : d > this[b + "ScrollbarMaxScroll"] && (this.options.fixedScrollbar ? d = this[b + "ScrollbarMaxScroll"] : (d = this[b + "ScrollbarIndicatorSize"] - a.round(3 * (d - this[b + "ScrollbarMaxScroll"])), 8 > d && (d = 8), this[b + "ScrollbarIndicator"].style["h" == b ? "width": "height"] = d + "px", d = this[b + "ScrollbarMaxScroll"] + (this[b + "ScrollbarIndicatorSize"] - d))), this[b + "ScrollbarWrapper"].style[m] = "0", this[b + "ScrollbarWrapper"].style.opacity = c && this.options.hideScrollbar ? "0": "1", this[b + "ScrollbarIndicator"].style[k] = "translate(" + ("h" == b ? d + "px,0)": "0," + d + "px)") + C)
        },
        _start: function(b) {
            var c = y ? b.touches[0] : b,
            e,
            f;
            if (this.enabled) {
                this.options.onBeforeScrollStart && this.options.onBeforeScrollStart.call(this, b); (this.options.useTransition || this.options.zoom) && this._transitionTime(0);
                this.zoomed = this.animating = this.moved = !1;
                this.dirY = this.dirX = this.absDistY = this.absDistX = this.distY = this.distX = 0;
                this.options.zoom && (y && 1 < b.touches.length) && (f = a.abs(b.touches[0].pageX - b.touches[1].pageX), e = a.abs(b.touches[0].pageY - b.touches[1].pageY), this.touchesDistStart = a.sqrt(f * f + e * e), this.originX = a.abs(b.touches[0].pageX + b.touches[1].pageX - 2 * this.wrapperOffsetLeft) / 2 - this.x, this.originY = a.abs(b.touches[0].pageY + b.touches[1].pageY - 2 * this.wrapperOffsetTop) / 2 - this.y, this.options.onZoomStart && this.options.onZoomStart.call(this, b));
                if (this.options.momentum && (this.options.useTransform ? (e = getComputedStyle(this.scroller, null)[k].replace(/[^0-9\-.,]/g, "").split(","), f = +(e[12] || e[4]), e = +(e[13] || e[5])) : (f = +getComputedStyle(this.scroller, null).left.replace(/[^0-9-]/g, ""), e = +getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, "")), f != this.x || e != this.y)) this.options.useTransition ? this._unbind(H) : E(this.aniTime),
                this.steps = [],
                this._pos(f, e),
                this.options.onScrollEnd && this.options.onScrollEnd.call(this);
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.startX = this.x;
                this.startY = this.y;
                this.pointX = c.pageX;
                this.pointY = c.pageY;
                this.startTime = b.timeStamp || Date.now();
                this.options.onScrollStart && this.options.onScrollStart.call(this, b);
                this._bind(B, d);
                this._bind(B, this.scroller);
                this._bind(F, d);
                this._bind(G, d)
            }
        },
        _move: function(b) {
            var c = y ? b.touches[0] : b,
            d = c.pageX - this.pointX,
            e = c.pageY - this.pointY,
            f = this.x + d,
            h = this.y + e,
            g = b.timeStamp || Date.now();
            this.options.onBeforeScrollMove && this.options.onBeforeScrollMove.call(this, b);
            if (this.options.zoom && y && 1 < b.touches.length) f = a.abs(b.touches[0].pageX - b.touches[1].pageX),
            h = a.abs(b.touches[0].pageY - b.touches[1].pageY),
            this.touchesDist = a.sqrt(f * f + h * h),
            this.zoomed = !0,
            c = 1 / this.touchesDistStart * this.touchesDist * this.scale,
            c < this.options.zoomMin ? c = 0.5 * this.options.zoomMin * Math.pow(2, c / this.options.zoomMin) : c > this.options.zoomMax && (c = 2 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / c)),
            this.lastScale = c / this.scale,
            f = this.originX - this.originX * this.lastScale + this.x,
            h = this.originY - this.originY * this.lastScale + this.y,
            this.scroller.style[k] = "translate(" + f + "px," + h + "px) scale(" + c + ")" + C,
            this.options.onZoom && this.options.onZoom.call(this, b);
            else {
                this.pointX = c.pageX;
                this.pointY = c.pageY;
                if (0 < f || f < this.maxScrollX) f = this.options.bounce ? this.x + d / 2 : 0 <= f || 0 <= this.maxScrollX ? 0 : this.maxScrollX;
                if (h > this.minScrollY || h < this.maxScrollY) h = this.options.bounce ? this.y + e / 2 : h >= this.minScrollY || 0 <= this.maxScrollY ? this.minScrollY: this.maxScrollY;
                this.distX += d;
                this.distY += e;
                this.absDistX = a.abs(this.distX);
                this.absDistY = a.abs(this.distY);
                6 > this.absDistX && 6 > this.absDistY || (this.options.lockDirection && (this.absDistX > this.absDistY + 5 ? (h = this.y, e = 0) : this.absDistY > this.absDistX + 5 && (f = this.x, d = 0)), this.moved = !0, this._pos(f, h), this.dirX = 0 < d ? -1 : 0 > d ? 1 : 0, this.dirY = 0 < e ? -1 : 0 > e ? 1 : 0, 300 < g - this.startTime && (this.startTime = g, this.startX = this.x, this.startY = this.y), this.options.onScrollMove && this.options.onScrollMove.call(this, b))
            }
        },
        _end: function(b) {
            if (! (y && 0 !== b.touches.length)) {
                var e = this,
                f = y ? b.changedTouches[0] : b,
                h,
                g,
                m = {
                    dist: 0,
                    time: 0
                },
                l = {
                    dist: 0,
                    time: 0
                },
                n = (b.timeStamp || Date.now()) - e.startTime,
                q = e.x,
                w = e.y;
                e._unbind(B, d);
                e._unbind(B, e.scroller);
                e._unbind(F, d);
                e._unbind(G, d);
                e.options.onBeforeScrollEnd && e.options.onBeforeScrollEnd.call(e, b);
                if (e.zoomed) q = e.scale * e.lastScale,
                q = Math.max(e.options.zoomMin, q),
                q = Math.min(e.options.zoomMax, q),
                e.lastScale = q / e.scale,
                e.scale = q,
                e.x = e.originX - e.originX * e.lastScale + e.x,
                e.y = e.originY - e.originY * e.lastScale + e.y,
                e.scroller.style[p] = "200ms",
                e.scroller.style[k] = "translate(" + e.x + "px," + e.y + "px) scale(" + e.scale + ")" + C,
                e.zoomed = !1,
                e.refresh(),
                e.options.onZoomEnd && e.options.onZoomEnd.call(e, b);
                else {
                    if (e.moved) {
                        if (300 > n && e.options.momentum) {
                            m = q ? e._momentum(q - e.startX, n, -e.x, e.scrollerW - e.wrapperW + e.x, e.options.bounce ? e.wrapperW: 0) : m;
                            l = w ? e._momentum(w - e.startY, n, -e.y, 0 > e.maxScrollY ? e.scrollerH - e.wrapperH + e.y - e.minScrollY: 0, e.options.bounce ? e.wrapperH: 0) : l;
                            q = e.x + m.dist;
                            w = e.y + l.dist;
                            if (0 < e.x && 0 < q || e.x < e.maxScrollX && q < e.maxScrollX) m = {
                                dist: 0,
                                time: 0
                            };
                            if (e.y > e.minScrollY && w > e.minScrollY || e.y < e.maxScrollY && w < e.maxScrollY) l = {
                                dist: 0,
                                time: 0
                            }
                        }
                        m.dist || l.dist ? (m = a.max(a.max(m.time, l.time), 10), e.options.snap && (l = q - e.absStartX, n = w - e.absStartY, a.abs(l) < e.options.snapThreshold && a.abs(n) < e.options.snapThreshold ? e.scrollTo(e.absStartX, e.absStartY, 200) : (l = e._snap(q, w), q = l.x, w = l.y, m = a.max(l.time, m))), e.scrollTo(a.round(q), a.round(w), m)) : e.options.snap ? (l = q - e.absStartX, n = w - e.absStartY, a.abs(l) < e.options.snapThreshold && a.abs(n) < e.options.snapThreshold ? e.scrollTo(e.absStartX, e.absStartY, 200) : (l = e._snap(e.x, e.y), (l.x != e.x || l.y != e.y) && e.scrollTo(l.x, l.y, l.time))) : e._resetPos(200)
                    } else y && (e.doubleTapTimer && e.options.zoom ? (clearTimeout(e.doubleTapTimer), e.doubleTapTimer = null, e.options.onZoomStart && e.options.onZoomStart.call(e, b), e.zoom(e.pointX, e.pointY, 1 == e.scale ? e.options.doubleTapZoom: 1), e.options.onZoomEnd && setTimeout(function() {
                        e.options.onZoomEnd.call(e, b)
                    },
                    200)) : this.options.handleClick && (e.doubleTapTimer = setTimeout(function() {
                        e.doubleTapTimer = null;
                        for (h = f.target; 1 != h.nodeType;) h = h.parentNode;
                        "SELECT" != h.tagName && ("INPUT" != h.tagName && "TEXTAREA" != h.tagName) && (g = c.createEvent("MouseEvents"), g.initMouseEvent("click", !0, !0, b.view, 1, f.screenX, f.screenY, f.clientX, f.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, null), g._fake = !0, h.dispatchEvent(g))
                    },
                    e.options.zoom ? 250 : 0))),
                    e._resetPos(400);
                    e.options.onTouchEnd && e.options.onTouchEnd.call(e, b)
                }
            }
        },
        _resetPos: function(a) {
            var b = 0 <= this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX: this.x,
            c = this.y >= this.minScrollY || 0 < this.maxScrollY ? this.minScrollY: this.y < this.maxScrollY ? this.maxScrollY: this.y;
            b == this.x && c == this.y ? (this.moved && (this.moved = !1, this.options.onScrollEnd && this.options.onScrollEnd.call(this)), this.hScrollbar && this.options.hideScrollbar && ("webkit" == h && (this.hScrollbarWrapper.style[m] = "300ms"), this.hScrollbarWrapper.style.opacity = "0"), this.vScrollbar && this.options.hideScrollbar && ("webkit" == h && (this.vScrollbarWrapper.style[m] = "300ms"), this.vScrollbarWrapper.style.opacity = "0")) : this.scrollTo(b, c, a || 0)
        },
        _wheel: function(a) {
            var b = this,
            c, d;
            if ("wheelDeltaX" in a) c = a.wheelDeltaX / 12,
            d = a.wheelDeltaY / 12;
            else if ("wheelDelta" in a) c = d = a.wheelDelta / 12;
            else if ("detail" in a) c = d = 3 * -a.detail;
            else return;
            "zoom" == b.options.wheelAction ? (d = b.scale * Math.pow(2, 1 / 3 * (d ? d / Math.abs(d) : 0)), d < b.options.zoomMin && (d = b.options.zoomMin), d > b.options.zoomMax && (d = b.options.zoomMax), d != b.scale && (!b.wheelZoomCount && b.options.onZoomStart && b.options.onZoomStart.call(b, a), b.wheelZoomCount++, b.zoom(a.pageX, a.pageY, d, 400), setTimeout(function() {
                b.wheelZoomCount--; ! b.wheelZoomCount && b.options.onZoomEnd && b.options.onZoomEnd.call(b, a)
            },
            400))) : (c = b.x + c, d = b.y + d, 0 < c ? c = 0 : c < b.maxScrollX && (c = b.maxScrollX), d > b.minScrollY ? d = b.minScrollY: d < b.maxScrollY && (d = b.maxScrollY), 0 > b.maxScrollY && b.scrollTo(c, d, 0))
        },
        _transitionEnd: function(a) {
            a.target == this.scroller && (this._unbind(H), this._startAni())
        },
        _startAni: function() {
            var b = this,
            c = b.x,
            d = b.y,
            e = Date.now(),
            f,
            h,
            g;
            b.animating || (b.steps.length ? (f = b.steps.shift(), f.x == c && f.y == d && (f.time = 0), b.animating = !0, b.moved = !0, b.options.useTransition ? (b._transitionTime(f.time), b._pos(f.x, f.y), b.animating = !1, f.time ? b._bind(H) : b._resetPos(0)) : (g = function() {
                var k = Date.now(),
                m;
                k >= e + f.time ? (b._pos(f.x, f.y), b.animating = !1, b.options.onAnimationEnd && b.options.onAnimationEnd.call(b), b._startAni()) : (k = (k - e) / f.time - 1, h = a.sqrt(1 - k * k), k = (f.x - c) * h + c, m = (f.y - d) * h + d, b._pos(k, m), b.animating && (b.aniTime = D(g)))
            },
            g())) : b._resetPos(400))
        },
        _transitionTime: function(a) {
            a += "ms";
            this.scroller.style[p] = a;
            this.hScrollbar && (this.hScrollbarIndicator.style[p] = a);
            this.vScrollbar && (this.vScrollbarIndicator.style[p] = a)
        },
        _momentum: function(b, c, d, e, f) {
            c = a.abs(b) / c;
            var h = c * c / 0.0012;
            0 < b && h > d ? (d += f / (6 / (6E-4 * (h / c))), c = c * d / h, h = d) : 0 > b && h > e && (e += f / (6 / (6E-4 * (h / c))), c = c * e / h, h = e);
            return {
                dist: h * (0 > b ? -1 : 1),
                time: a.round(c / 6E-4)
            }
        },
        _offset: function(a) {
            for (var b = -a.offsetLeft,
            c = -a.offsetTop; a = a.offsetParent;) b -= a.offsetLeft,
            c -= a.offsetTop;
            a != this.wrapper && (b *= this.scale, c *= this.scale);
            return {
                left: b,
                top: c
            }
        },
        _snap: function(b, c) {
            var d, e, f;
            f = this.pagesX.length - 1;
            d = 0;
            for (e = this.pagesX.length; d < e; d++) if (b >= this.pagesX[d]) {
                f = d;
                break
            }
            f == this.currPageX && (0 < f && 0 > this.dirX) && f--;
            b = this.pagesX[f];
            e = (e = a.abs(b - this.pagesX[this.currPageX])) ? 500 * (a.abs(this.x - b) / e) : 0;
            this.currPageX = f;
            f = this.pagesY.length - 1;
            for (d = 0; d < f; d++) if (c >= this.pagesY[d]) {
                f = d;
                break
            }
            f == this.currPageY && (0 < f && 0 > this.dirY) && f--;
            c = this.pagesY[f];
            d = (d = a.abs(c - this.pagesY[this.currPageY])) ? 500 * (a.abs(this.y - c) / d) : 0;
            this.currPageY = f;
            f = a.round(a.max(e, d)) || 200;
            return {
                x: b,
                y: c,
                time: f
            }
        },
        _bind: function(a, b, c) { (b || this.scroller).addEventListener(a, this, !!c)
        },
        _unbind: function(a, b, c) { (b || this.scroller).removeEventListener(a, this, !!c)
        },
        destroy: function() {
            this.scroller.style[k] = "";
            this.vScrollbar = this.hScrollbar = !1;
            this._scrollbar("h");
            this._scrollbar("v");
            this._unbind(A, d);
            this._unbind(x);
            this._unbind(B, d);
            this._unbind(B, this.scroller);
            this._unbind(F, d);
            this._unbind(G, d);
            this.options.hasTouch || (this._unbind("DOMMouseScroll"), this._unbind("mousewheel"));
            this.options.useTransition && this._unbind(H);
            this.options.checkDOMChanges && clearInterval(this.checkDOMTime);
            this.options.onDestroy && this.options.onDestroy.call(this)
        },
        refresh: function() {
            var b, c, d, e = 0;
            c = 0;
            this.scale < this.options.zoomMin && (this.scale = this.options.zoomMin);
            this.wrapperW = this.wrapper.clientWidth || 1;
            this.wrapperH = this.wrapper.clientHeight || 1;
            this.minScrollY = -this.options.topOffset || 0;
            this.scrollerW = a.round(this.scroller.offsetWidth * this.scale);
            this.scrollerH = a.round((this.scroller.offsetHeight + this.minScrollY) * this.scale);
            this.maxScrollX = this.wrapperW - this.scrollerW;
            this.maxScrollY = this.wrapperH - this.scrollerH + this.minScrollY;
            this.dirY = this.dirX = 0;
            this.options.onRefresh && this.options.onRefresh.call(this);
            this.hScroll = this.options.hScroll && 0 > this.maxScrollX;
            this.vScroll = this.options.vScroll && (!this.options.bounceLock && !this.hScroll || this.scrollerH > this.wrapperH);
            this.hScrollbar = this.hScroll && this.options.hScrollbar;
            this.vScrollbar = this.vScroll && this.options.vScrollbar && this.scrollerH > this.wrapperH;
            b = this._offset(this.wrapper);
            this.wrapperOffsetLeft = -b.left;
            this.wrapperOffsetTop = -b.top;
            if ("string" == typeof this.options.snap) {
                this.pagesX = [];
                this.pagesY = [];
                d = this.scroller.querySelectorAll(this.options.snap);
                b = 0;
                for (c = d.length; b < c; b++) e = this._offset(d[b]),
                e.left += this.wrapperOffsetLeft,
                e.top += this.wrapperOffsetTop,
                this.pagesX[b] = e.left < this.maxScrollX ? this.maxScrollX: e.left * this.scale,
                this.pagesY[b] = e.top < this.maxScrollY ? this.maxScrollY: e.top * this.scale
            } else if (this.options.snap) {
                for (this.pagesX = []; e >= this.maxScrollX;) this.pagesX[c] = e,
                e -= this.wrapperW,
                c++;
                this.maxScrollX % this.wrapperW && (this.pagesX[this.pagesX.length] = this.maxScrollX - this.pagesX[this.pagesX.length - 1] + this.pagesX[this.pagesX.length - 1]);
                c = e = 0;
                for (this.pagesY = []; e >= this.maxScrollY;) this.pagesY[c] = e,
                e -= this.wrapperH,
                c++;
                this.maxScrollY % this.wrapperH && (this.pagesY[this.pagesY.length] = this.maxScrollY - this.pagesY[this.pagesY.length - 1] + this.pagesY[this.pagesY.length - 1])
            }
            this._scrollbar("h");
            this._scrollbar("v");
            this.zoomed || (this.scroller.style[p] = "0", this._resetPos(400))
        },
        scrollTo: function(a, b, c, d) {
            var e = a;
            this.stop();
            e.length || (e = [{
                x: a,
                y: b,
                time: c,
                relative: d
            }]);
            a = 0;
            for (b = e.length; a < b; a++) e[a].relative && (e[a].x = this.x - e[a].x, e[a].y = this.y - e[a].y),
            this.steps.push({
                x: e[a].x,
                y: e[a].y,
                time: e[a].time || 0
            });
            this._startAni()
        },
        scrollToElement: function(b, c) {
            var d;
            if (b = b.nodeType ? b: this.scroller.querySelector(b)) d = this._offset(b),
            d.left += this.wrapperOffsetLeft,
            d.top += this.wrapperOffsetTop,
            d.left = 0 < d.left ? 0 : d.left < this.maxScrollX ? this.maxScrollX: d.left,
            d.top = d.top > this.minScrollY ? this.minScrollY: d.top < this.maxScrollY ? this.maxScrollY: d.top,
            c = void 0 === c ? a.max(2 * a.abs(d.left), 2 * a.abs(d.top)) : c,
            this.scrollTo(d.left, d.top, c)
        },
        scrollToPage: function(a, b, c) {
            c = void 0 === c ? 400 : c;
            this.options.onScrollStart && this.options.onScrollStart.call(this);
            this.options.snap ? (a = "next" == a ? this.currPageX + 1 : "prev" == a ? this.currPageX - 1 : a, b = "next" == b ? this.currPageY + 1 : "prev" == b ? this.currPageY - 1 : b, a = 0 > a ? 0 : a > this.pagesX.length - 1 ? this.pagesX.length - 1 : a, b = 0 > b ? 0 : b > this.pagesY.length - 1 ? this.pagesY.length - 1 : b, this.currPageX = a, this.currPageY = b, a = this.pagesX[a], b = this.pagesY[b]) : (a *= -this.wrapperW, b *= -this.wrapperH, a < this.maxScrollX && (a = this.maxScrollX), b < this.maxScrollY && (b = this.maxScrollY));
            this.scrollTo(a, b, c)
        },
        disable: function() {
            this.stop();
            this._resetPos(0);
            this.enabled = !1;
            this._unbind(B, d);
            this._unbind(B, this.scroller);
            this._unbind(F, d);
            this._unbind(G, d)
        },
        enable: function() {
            this.enabled = !0
        },
        stop: function() {
            this.options.useTransition ? this._unbind(H) : E(this.aniTime);
            this.steps = [];
            this.animating = this.moved = !1
        },
        zoom: function(a, b, c, d) {
            var e = c / this.scale;
            this.options.useTransform && (this.zoomed = !0, d = void 0 === d ? 200 : d, a = a - this.wrapperOffsetLeft - this.x, b = b - this.wrapperOffsetTop - this.y, this.x = a - a * e + this.x, this.y = b - b * e + this.y, this.scale = c, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX: this.x, this.y = this.y > this.minScrollY ? this.minScrollY: this.y < this.maxScrollY ? this.maxScrollY: this.y, this.scroller.style[p] = d + "ms", this.scroller.style[k] = "translate(" + this.x + "px," + this.y + "px) scale(" + c + ")" + C, this.zoomed = !1)
        },
        isReady: function() {
            return ! this.moved && !this.zoomed && !this.animating
        }
    };
    f = null;
    "undefined" !== typeof exports ? exports.iScroll = s: d.iScroll = s
})(window, document);
define("plugins/PoiDetail/DetailPoi/lib/iscroll",
function() {});
define("plugins/PoiDetail/DetailPoi/SlidableList", ["require", "plugins/PoiDetail/DetailPoi/lib/iscroll"],
function(d) {
    function c() {
        this.containerEl = null;
        this.topMargin_ = 60;
        this.last2Slides = this.slideBeginHeight_ = this.expandedSlidebarHeight_ = this.collapsedSlidbarHeight_ = this.currentHeight_ = this.contentHeight_ = null;
        this.state = this.STATE_ISOLATED;
        this.disableSliding_ = !1;
        this.expandedTime_ = null;
        this.createDom_();
        this.addListeners_()
    }
    d("plugins/PoiDetail/DetailPoi/lib/iscroll");
    c.prototype.ACTION_SPEED = 0.099;
    c.prototype.STATE_ISOLATED = 0;
    c.prototype.STATE_COLLAPSED = 1;
    c.prototype.STATE_EXPANDED = 2;
    c.prototype.STATE_SLIDING = 3;
    c.prototype.STATE_COLLAPSING = 4;
    c.prototype.STATE_EXPANDING = 5;
    c.prototype.STATE_ATTACHED = 6;
    c.prototype.TRANSITION_END_EVENT_NAME = "ontransitionend" in window ? "transitionend": "webkitTransitionEnd";
    c.prototype.createDom_ = function() {
        var b, a, c;
        b = document.createElement("div");
        b.onselectstart = function(a) {
            a.preventDefault();
            a.stopPropagation()
        };
        b.className = "Kepler-poi-list collapsed";
        b.style.visibility = "hidden";
        a = document.createElement("div");
        b.appendChild(a);
        a.className = "slide-bar";
        c = document.createElement("div");
        a.appendChild(c);
        c = document.createElement("div");
        a.appendChild(c);
        a = document.createElement("div");
        b.appendChild(a);
        a.className = "list-wrapper";
        c = document.createElement("ul");
        a.appendChild(c);
        a.ontouchmove = function(a) {};
        this.containerEl = b
    };
    c.prototype.notifyAttach = function() {
        this.state = this.STATE_ATTACHED;
        this.recalcDimensions();
        this.collapse()
    };
    c.prototype.setItems = function(b) {
        var a = this.containerEl.querySelector(".list-wrapper"),
        c = a.firstChild;
        a.style.removeProperty("height");
        c.innerHTML = "";
        this.containerEl.style.visibility = 0 < b.childNodes.length ? "visible": "hidden";
        c.appendChild(b);
        this.recalcDimensions();
        this.iscroll && this.iscroll.destroy();
        this.iscroll = new iScroll(a);
        this.collapse()
    };
    c.prototype.recalcDimensions = function() {
        if (this.state === this.STATE_ISOLATED) console.warn("List is not attached to document, dimensions can not calculated.");
        else {
            var b = this.containerEl,
            a = b.querySelector(".slide-bar"),
            c = b.querySelector(".list-wrapper");
            c.querySelector("ul");
            a.style.transition = "none";
            c.style.removeProperty("height"); (c = b.classList.contains("collapsed")) || b.classList.add("collapsed");
            this.collapsedSlidbarHeight_ = a.scrollHeight;
            b.classList.remove("collapsed");
            this.expandedSlidebarHeight_ = a.scrollHeight;
            this.contentHeight_ = b.scrollHeight;
            c && b.classList.add("collapsed");
            setTimeout(function(b) {
                a.style.removeProperty("transition")
            },
            0);
            this.updateListHeight()
        }
    };
    c.prototype.setHeight = function(b) {
        b > this.getMaxHeight() ? console.warn("Exceeding max list height.") : (this.currentHeight_ = b, this.containerEl.style.webkitTransform = "translateY(" + -b + "px)")
    };
    c.prototype.getMaxHeight = function() {
        return window.innerHeight - this.topMargin_
    };
    c.prototype.handleEvent = function(b) {
        switch (b.type) {
        case "resize":
            console.log("Resizing"),
            this.updateListHeight(),
            this.state === this.STATE_EXPANDED && (this.containerEl.style.transition = "none", this.setHeight(this.getMaxHeight()))
        }
    };
    c.prototype.updateListHeight = function() {
        this.containerEl.querySelector(".list-wrapper").style.height = this.getMaxHeight() - this.expandedSlidebarHeight_ + "px"
    };
    c.prototype.addListeners_ = function() {
        var b = this,
        a, c = this.containerEl.querySelector(".slide-bar");
        c.addEventListener("mousedown",
        function(c) {
            var d = c.targetTouches[0].clientY;
            console.log("mousedown clientY:" + d, c);
            a = d;
            b.beginSliding_(c.timeStamp)
        },
        !1);
        c.addEventListener("mousemove",
        function(c) {
            var d = c.targetTouches[0].clientY;
            c.preventDefault();
            c.stopPropagation();
            b.slide(a - d, c.timeStamp)
        },
        !1);
        c.addEventListener("mouseup",
        function(a) {
            console.log("mouseup clientY: " + a.changedTouches[0].clientY);
            a.preventDefault();
            b.endSliding_()
        },
        !1);
        window.addEventListener("resize", this, !1)
    };
    c.prototype.beginSliding_ = function(b) {
        this.disableSliding_ = this.state === this.STATE_COLLAPSED;
        this.containerEl.style.transition = "none";
        this.state = this.STATE_SLIDING;
        this.slideBeginHeight_ = this.currentHeight_;
        this.containerEl.classList.remove("collapsed");
        this.last2Slides = [];
        this.recordSlides(b)
    };
    c.prototype.slide = function(b, a) {
        this.recordSlides(a);
        this.disableSliding_ ? this.collapse() : this.setHeight(this.slideBeginHeight_ + b)
    };
    c.prototype.recordSlides = function(b) {
        this.last2Slides.push({
            height: this.currentHeight_,
            timeStamp: b
        });
        2 < this.last2Slides.length && this.last2Slides.shift()
    };
    c.prototype.endSliding_ = function() {
        var b, a;
        this.state === this.STATE_SLIDING && (console.log("End sliding."), this.containerEl.style.removeProperty("transition"), 1 < this.last2Slides.length ? this.disableSliding_ ? this.collapse() : (b = this.last2Slides[0], a = this.last2Slides[1], b = (a.height - b.height) / (a.timeStamp - b.timeStamp), b > this.ACTION_SPEED ? this.expand() : b < -this.ACTION_SPEED ? this.collapse() : this.currentHeight_ < this.getMaxHeight() / 2 ? this.collapse() : this.expand()) : (console.log("Tapped"), this.toggle()))
    };
    c.prototype.collapse = function() {
        var b = this,
        a;
        this.currentHeight_ === this.collapsedSlidbarHeight_ ? (this.containerEl.classList.add("collapsed"), this.state = this.STATE_COLLAPSED) : (this.state = this.STATE_COLLAPSING, a = function(c) {
            this.classList.add("collapsed");
            this.removeEventListener(b.TRANSITION_END_EVENT_NAME, a, !1);
            b.state = b.STATE_COLLAPSED
        },
        this.containerEl.addEventListener(this.TRANSITION_END_EVENT_NAME, a, !1), setTimeout(function() {
            a.call(b.containerEl)
        },
        600), this.setHeight(this.collapsedSlidbarHeight_))
    };
    c.prototype.expand = function() {
        function b() {
            a.state = a.STATE_EXPANDED;
            this.removeEventListener(a.TRANSITION_END_EVENT_NAME, b, !1);
            console.log("List expanded")
        }
        var a = this;
        this.state = this.STATE_EXPANDING;
        this.containerEl.classList.remove("collapsed");
        this.setHeight(this.getMaxHeight());
        this.expandedTime_ = Date.now();
        this.containerEl.addEventListener(this.TRANSITION_END_EVENT_NAME, b, !1);
        setTimeout(function() {
            b.call(a.containerEl)
        },
        600)
    };
    c.prototype.toggle = function() {
        this.currentHeight_ === this.collapsedSlidbarHeight_ ? this.expand() : this.currentHeight_ === this.getMaxHeight() && this.collapse()
    };
    return c
});
define("plugins/PoiDetail/DetailPoi/PoiDetailList", ["require", "common/util", "plugins/PoiDetail/DetailPoi/SlidableList"],
function(d) {
    function c() {
        a.apply(this, arguments);
        this.onItemSelected = null
    }
    var b = d("common/util"),
    a = d("plugins/PoiDetail/DetailPoi/SlidableList");
    b.inherits(c, a);
    c.prototype.DEFAULT_DATA = {
        name: "",
        pic: {
            restaurant: "images/marker_restaurant.png",
            hotel: "images/marker_hotel.png",
            cinema: "images/marker_cinema.png"
        }
    };
    c.prototype.MAX_STARS = 5;
    c.prototype.setPois = function(a) {
        function b(a) {
            c.state !== c.STATE_EXPANDED ? console.warn("Illegal state:" + c.state) : 700 > Date.now() - c.expandedTime_ ? console.warn("click 700 ms after list expanded. may cause bug.") : (c.onItemSelected(this.dataset.id), c.collapse())
        }
        for (var c = this,
        d = document.createDocumentFragment(), g = 0; g < a.length; g++) {
            var p = a[g],
            n = document.createElement("li");
            d.appendChild(n);
            n.dataset.id = p.id;
            n.onclick = b;
            var l = new Image;
            n.appendChild(l);
            l.src = p.thumb || this.DEFAULT_DATA.pic[p.type];
            l.onerror = function(a) {
                return function() {
                    this.src = a.DEFAULT_DATA.pic[p.type];
                    this.onerror = null
                }
            } (this);
            l = document.createElement("div");
            n.appendChild(l);
            n = document.createElement("div");
            l.appendChild(n);
            n.textContent = p.name || this.DEFAULT_DATA.name;
            n.className = "title";
            n = this.createRatingStarEl(p.starLevel / 20);
            l.appendChild(n);
            p.price && l.appendChild(this.createPriceEl(p));
            n = document.createElement("div");
            l.appendChild(n);
            n.className = "distance";
            n.textContent = p.distance + "\u7c73"
        }
        this.setItems(d)
    };
    c.prototype.createRatingStarEl = function(a) {
        var b = document.createElement("div");
        b.className = "stars";
        for (var c = a % 1,
        d = a - c - 1; 0 <= d; d--) {
            var g = document.createElement("div");
            b.appendChild(g);
            g.className = "on"
        }
        c && (d = document.createElement("div"), b.appendChild(d), d.className = "half");
        for (d = this.MAX_STARS - Math.ceil(a) - 1; 0 <= d; d--) a = document.createElement("div"),
        b.appendChild(a),
        a.className = "off";
        return b
    };
    c.prototype.createPriceEl = function(a) {
        console.assert(!isNaN(parseFloat(a.price)), "Only call this method when the price of poi is number");
        var b = document.createElement("div");
        b.className = "price";
        "hotel" === a.type ? b.textContent = "\u6700\u4f4e\u4ef7\uff1a\uffe5" + a.price: "restaurant" === a.type && (b.textContent = "\u4eba\u5747\uff1a\uffe5" + a.price);
        return b
    };
    return c
});
define("plugins/PoiDetail/List", ["require", "application/urlManager", "plugins/PoiDetail/DetailPoi/PoiDetailList"],
function(d) {
    var c = d("application/urlManager").hash,
    b = d("plugins/PoiDetail/DetailPoi/PoiDetailList"),
    a;
    return {
        addToPano: function(d) {
            "detail" === c.poi && (a = new b, a.onItemSelected = function(a) {
                d.dispatchEvent("POIDetail_itemselected", {
                    poi: a
                });
                console.log("Item selected:", a)
            },
            d.addListener("POIDetail_refresh",
            function(b) {
                a.setPois(b.data.data)
            }), document.body.appendChild(a.containerEl), a.notifyAttach())
        },
        removeFromPano: function() {
            document.body.removeChild(a.containerEl)
        }
    }
});
define("core/plugins", "require plugins/QuickAdvance plugins/AddressBar plugins/ClickToGo plugins/Dragging plugins/Gyrometer plugins/ImportantPOI plugins/LinkPOI plugins/MiniAlbum plugins/MiniMap plugins/PanoMark plugins/RegionPassageway plugins/SharePOI plugins/ZoomControl plugins/APPDownload/index plugins/SearchAround/index plugins/PoiDetail/Data plugins/PoiDetail/Tab plugins/PoiDetail/Markers plugins/PoiDetail/List".split(" "),
function(d) {
    function c(a, c) {
        b.push({
            id: a,
            pluginObject: c
        })
    }
    d = [d("plugins/QuickAdvance"), d("plugins/AddressBar"), d("plugins/ClickToGo"), d("plugins/Dragging"), d("plugins/Gyrometer"), d("plugins/ImportantPOI"), d("plugins/LinkPOI"), d("plugins/MiniAlbum"), d("plugins/MiniMap"), d("plugins/PanoMark"), d("plugins/RegionPassageway"), d("plugins/SharePOI"), d("plugins/ZoomControl"), d("plugins/APPDownload/index"), d("plugins/SearchAround/index"), d("plugins/PoiDetail/Data"), d("plugins/PoiDetail/Tab"), d("plugins/PoiDetail/Markers"), d("plugins/PoiDetail/List")];
    for (var b = [], a = 0; a < d.length; a++) c("plugin_" + a, d[a]);
    return {
        register: c,
        getPlugins: function() {
            return b
        }
    }
});
define("application/PanoramaInstance", "core/Panorama crystal/geom/Vector3D application/Config core/plugins application/urlManager application/stat".split(" "),
function(d, c, b, a, f, h) {
    function panoramaInstance(c, e) {
        s = c;
        u = e || {};
        this.panorama = null;
        if (u.pano) {
            var f = u.pano;
            u.fovy = e.fovy || b.defaultFovY;
            var z = {
                svDataUrl: b.xmlDomain,
                fromProduct: encodeURIComponent(m.ref || "unknown"),
                fromChannel: encodeURIComponent(m.ch || ""),
                //logo: b.getImgUrl("images/mapLogo3.png"),
                logo: "http://webapi.amap.com/theme/v1.3/autonavi.png",
                fovy: e.fovy || b.defaultFovY,
                renderer: m.impl
            };
            this.panorama = v = new d(s, u, z);
            window.addEventListener("resize", l);
            "onorientationchange" in window && window.addEventListener("orientationchange", l);
            v.addListener("svid_changed", k);
            v.addListener("pov_change", g);
            v.addListener("tile_loading", n);
            v.addListener("tile_loaded", p);
            for (var z = a.getPlugins(), x = 0; x < z.length; x++) v.addPlugin(z[x].pluginObject);
            v.setSvid(f);
            h.renderCore(v.getRenderType())
        }
    }
    function k(a) {
        a = v.getSvid();
        m.pano = a;
        f.updateHash()
    }
    function g(a) {
        z && clearTimeout(z);
        z = setTimeout(function() {
            var a = v.getHeading().toFixed(0),
            b = v.getPitch().toFixed(0),
            c = !1,
            d = window.location.href,
            e;
            /heading=([^&]*)/i.test(d) && (e = RegExp.$1);
            void 0 !== e ? e != a && (d = d.replace(/heading=[^&]*/, "heading\x3d" + a), c = !0) : (d = d + "\x26heading\x3d" + a, c = !0);
            var f;
            /pitch=([^&]*)/i.test(d) && (f = RegExp.$1);
            void 0 !== f ? f != b && (d = d.replace(/pitch=[^&]*/, "pitch\x3d" + b), c = !0) : (d = d + "\x26pitch\x3d" + b, c = !0);
            c && window.location.replace(d)
        },
        600)
    }
    function p(a) {
        v.removeListener("tile_loading", n);
        v.removeListener("tile_loaded", p);
        document.getElementById("loadingContainer") && window.hideLoading && window.hideLoading();
        try {
            WeixinJSBridge.invoke("onStreetViewReady", {})
        } catch(b) {}
        h.tiledLoaded1()
    }
    function n(a) {
        var b = document.getElementById("loading");
        b && (b.textContent = (100 * a.data.percent).toFixed(0) + "%")
    }
    function l(a) {
        v.setViewPort(__qq_pano_options._qq_w || document.documentElement.clientWidth, __qq_pano_options._qq_h || document.documentElement.clientHeight);
        window.scrollTo(0, 0);
    }
    var m = f.hash,
    v, u, s, z;
    panoramaInstance.prototype.resize = function() {
        v.setViewPort(__qq_pano_options._qq_w || document.documentElement.clientWidth, __qq_pano_options._qq_h || document.documentElement.clientHeight)
    };
    return panoramaInstance
});
window.devicePixelRatio = window.devicePixelRatio || 1; (function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
    function(c) {
        return setTimeout(c, 1E3 / 35)
    };
    if (window.parent !== window && /iP(hone|od|ad)/.test(navigator.platform)) { / OS(\d + ) _ / .test(navigator.appVersion);
        var d = parseInt(RegExp.$1);
        7 >= d && (console.warn("Embeded in iframe of iOS " + d + ""), window.requestAnimationFrame = function(c) {
            return setTimeout(c, 1E3 / 45)
        })
    }
})(); (function() {
    function d(c) {
        this.dom = c
    }
    document.documentElement.classList || (d.prototype.__defineGetter__("length",
    function() {
        return this._getList().length
    }), d.prototype._getList = function() {
        var c = this.dom.className.trim();
        return c ? c.split(/\s+/) : []
    },
    d.prototype._setList = function(c) {
        this.dom.className = c.join(" ")
    },
    d.prototype.add = function(c) {
        c = c.trim();
        this.dom.className += " " + c;
        return ! 0
    },
    d.prototype.remove = function(c) {
        c = c.trim();
        for (var b = this._getList(), a = b.length - 1; 0 <= a; a--) b[a] === c && b.splice(a, 1);
        this._setList(b);
        return ! 1
    },
    d.prototype.contains = function(c) {
        c = c.trim();
        for (var b = this._getList(), a = b.length - 1; 0 <= a; a--) if (b[a] === c) return ! 0;
        return ! 1
    },
    d.prototype.toggle = function(c) {
        this.contains(c) ? this.remove(c) : this.add(c)
    },
    HTMLElement.prototype.__defineGetter__("classList",
    function() {
        return new d(this)
    }))
})(); (function() {
    document.documentElement.dataset || HTMLElement.prototype.__defineGetter__("dataset",
    function() {
        this._dataset || (this._dataset = {});
        return this._dataset
    })
})(); (function() {
    window.localStorage || (_localStorage = {},
    window.localStorage = {
        clear: function() {
            _localStorage = {}
        },
        getItem: function(d) {},
        key: function() {},
        length: 1,
        removeItem: function() {},
        setItem: function() {}
    })
})();
define("common/polyfill",
function() {});
define("application/report", [],
function() {
    function d(a) {
        try {
            var c = [],
            d = b.pcl,
            e = window.event ? window.event.srcElement: a.target;
            if (e && e.getAttribute(b.attribute || "ch")) c.push({
                key: "ch",
                value: e.getAttribute(b.attribute || "ch")
            });
            d.extraPara && 0 < d.extraPara.length && (c = c.concat(d.extraPara));
            b.stat(c)
        } catch(k) {}
    }
    var c = {
        setCookie: function(a, b) {
            var c = new Date;
            c.setTime(c.getTime() + 15552E7);
            c = [a + "\x3d" + escape(b)];
            document.cookie = c.join(";")
        },
        getCookie: function(a) {
            if (!document.cookie) return null;
            a = document.cookie.match(RegExp("(^| )" + a + "\x3d([^;]*)(;|$)"));
            return null != a ? unescape(a[2]) : null
        }
    },
    b = {
        url: "http://pr.map.qq.com/pingd",
        pcl: {
            on: !1,
            attribute: "ch",
            extraPara: []
        },
        pgv: {
            on: !0,
            refer: location.href,
            app: "",
            extraPara: []
        },
        genSuid: function() {
            var a = (new Date).getUTCMilliseconds();
            return Math.round(2147483647 * Math.random()) * a % 1E10
        },
        stat: function(a) {
            for (var c = new Image(1, 1), d = b.url, e = 0; e < a.length; e++) var k = a[e],
            d = d + ((0 == e ? "?": "\x26") + k.key + "\x3d" + k.value);
            d = 0 < d.indexOf("?") ? d + "\x26": d + "?";
            d += "s\x3d" + (new Date).getTime();
            c.src = d
        },
        run: function(a) {
            c.getCookie("suid") && c.setCookie("suid", b.genSuid());
            a.url && (b.url = a.url);
            if (a.pgv && a.pgv.on) {
                b.pgv = a.pgv;
                var f = b.pgv;
                if (f) try {
                    var h = [];
                    h.push({
                        key: "app",
                        value: f.app || ""
                    });
                    f.extraPara && 0 < f.extraPara.length && (h = h.concat(f.extraPara));
                    h.push({
                        key: "refer",
                        value: f.refer || ""
                    });
                    b.stat(h)
                } catch(e) {}
            }
            a.pcl && a.pcl.on && (b.pcl = a.pcl, document.attachEvent ? document.attachEvent("onclick", d) : document.addEventListener("click", d, !1))
        }
    };
    return b
});
require.config({
    baseUrl: "src"
});
require("application/Config common/TimeShaft common/util application/urlManager application/PanoramaInstance common/polyfill common/Platform application/report application/stat".split(" "),
function(d, c, b, a, f, h, e, k, g) {
    function p() {
        z.panorama.addListener("addr_loaded",
        function() {
            var a = y,
            b = {
                title: "\u817e\u8baf\u8857\u666f"
            };
            b.image_url = "http://sv0.map.qq.com/view?svid\x3d" + s.pano + "\x26r\x3d50\x26from\x3dhtml5\x26size\x3d0\x26no_decrypt_svid\x3d1";
            b.desc = z.panorama.data.address || "\u7cbe\u5f69\u4e00\u77ac\uff0c\u52a0\u8f7d\u4e2d";
            b.share_url = n();
            a(b)
        })
    }
    function n() {
        var a = "http://" + window.location.hostname + window.location.pathname + b.hashFilter(window.location.hash);
        "hr" === s.ref && (/(([#&])ref=hr(&|$))/i.test(window.location.href), a = a.replace(RegExp.$1, RegExp.$2 + "ref\x3dhrbypano" + RegExp.$3));
        return a
    }
    function l(a, c) {
        b.loadJsonp("http://l.map.qq.com/api/shorten?url\x3d" + encodeURIComponent(c),
        function(b) {
            0 == b.error ? a && a(b.short_url) : a && a(c)
        })
    }
    function m() {
        function a() {
        	// / pano = ([ ^ &] * ) / i.test(window.location.href);
            return "http://sv0.map.qq.com/view?svid\x3d" + (RegExp.$1 || s.pano) + "\x26r\x3d50\x26from\x3dhtml5\x26size\x3d0\x26no_decrypt_svid\x3d1"
        }
        function c() {
            if (b.getShareTitle) return b.getShareTitle();
            if ("wx" == s.ref) return "\u8857\u666f";
            if ("GMIC" === s.ref) return "\u9ad8\u6e05\u5b9e\u666f-GMIC\u5168\u7403\u79fb\u52a8\u4e92\u8054\u7f51\u5927\u4f1a";
            var a = s,
            d = a.n ? decodeURIComponent(a.n) : "",
            e = a.rn ? decodeURIComponent(a.rn) : "";
            a.a && decodeURIComponent(a.a);
            a.p && decodeURIComponent(a.p);
            return d || e || u || ""
        }
        function d(a, b) {
            var c = s;
            c.n && decodeURIComponent(c.n);
            c.rn && decodeURIComponent(c.rn);
            var e = c.a ? decodeURIComponent(c.a) : "",
            c = c.p ? decodeURIComponent(c.p) : "",
            f = (z.panorama.data.addr || "") + (b + a);
            e ? f = e + (c && b + c) + (b + a) : c && (f = c + (b + a));
            "35023560120913140743200" == s.pano && (f = "\u8089\u75db\u554a\uff0c\u5f53\u5e74\u5f00\u8f66\u6ca1\u627e\u5230\u5bbe\u9986\uff0c\u6700\u540e\u88ab\u8feb\u81ea\u8d39\u7761\u4e94\u661f\u7ea7\u3002" + (b + a));
            if ("hr" === s.ref || "hrbypano" === s.ref) f = "\u5b9e\u62cd\u817e\u8baf\u5168\u56fd\u529e\u516c\u5ba4\uff0c360\u00b0\u65e0\u6b7b\u89d2\u6d4f\u89c8\u5458\u5de5\u9910\u5385\u3001\u4f1a\u8bae\u5ba4\u3001\u529e\u516c\u533a\u3001\u8336\u6c34\u95f4\uff0c\u8d85\u5f3a\u8bbe\u8ba1\u611f\uff01\u592a\u6f02\u4eae\u4e86\uff01";
            "GMIC" === s.ref && (f = "2014\u5e74GMIC\u5927\u4f1a\u5c06\u5438\u5f15\u6765\u81ea\u5168\u7403\u7684300\u591a\u540d\u79fb\u52a8\u4e92\u8054\u7f51\u9886\u8896\uff0c\u5feb\u6765\u73b0\u573a\u770b\u770b\u5427\uff01");
            return f || ""
        }
        function e() {
            WeixinJSBridge.on("menu:share:appmessage",
            function(b) {
                b = n();
                WeixinJSBridge.invoke("sendAppMessage", {
                    appid: f,
                    img_url: a(),
                    img_width: "80",
                    img_height: "80",
                    link: b,
                    title: c(),
                    desc: d("", "\n")
                },
                function(a) {})
            });
            WeixinJSBridge.on("menu:share:timeline",
            function(b) {
                b = n();
                b = {
                    appid: f,
                     img_url: a(),
                    img_width: "80",
                    img_height: "80",
                    link: b,
                    desc: b,
                    title: c() + " " + d("", "\n")
                };
                "GMIC" === s.ref && (b.desc = "", b.title = "2014\u9ad8\u6e05\u5b9e\u666fGMIC\u5168\u7403\u79fb\u52a8\u4e92\u8054\u7f51\u5927\u4f1a");
                WeixinJSBridge.invoke("shareTimeline", b,
                function(a) {})
            });
            WeixinJSBridge.on("menu:share:weibo",
            function(a) {
                a = n();
                l(function(a) {
                    WeixinJSBridge.invoke("shareWeibo", {
                        content: c() + "  " + d(a, "  "),
                        url: a
                    },
                    function(a) {})
                },
                a)
            })
        }
        var f = "wx" == s.ref ? "wx751a1acca5688ba3": "wx36174d3a5f72f64a";
        window.WeixinJSBridge ? e() : document.addEventListener("WeixinJSBridgeReady",
        function() {
            e()
        },
        !1)
    }
    function v() { /**(document.body.parentNode || document.body).addEventListener("mousemove",
        function(a) {
            a.stopPropagation();
            a.preventDefault()
        });*/
        document.body.onselectstart = function(a) {
            return ! 1
        }
    }
    var u = "\u817e\u8baf\u5730\u56fe",
    s = a.hash,
    z = null; (function() {
        g.appId = d.statAPPName;
        g.fromProduct = s.ref || "";
        g.fromChannel = s.ch || "";
        e.android ? g.os = "android": e.ios && (g.os = "ios");
        k.run({
            on: !0,
            app: g.appId,
            refer: location.href,
            extraPara: [{
                key: "ch",
                value: g.fromChannel
            },
            {
                key: "pf",
                value: g.os
            }]
        });
        c.setMaxFPS(35);
        var b = /isappinstalled=(\d)/i.test(window.location.href) ? RegExp.$1: -1;
        1 != b && (b = /appinstall=(\d)/i.test(window.location.href) ? RegExp.$1: -1);
        var h = a.hash;
        h.isappinstalled = b;
        h.poi = h.poi || 0;
        h.coord && (h.m = h.coord);
        "wx" == s.ref ? document.title = "\u8857\u666f": s.rn && (document.title = s.rn);
        if (b = s.prefixSv)"admin" == b ? (d.tileDomain = d.admin_tileDomain, d.thumbDomain = d.admin_thumbDomain, d.xmlDomain = d.admin_xmlDomain) : "test" == b && (d.tileDomain = d.test_tileDomain, d.thumbDomain = d.test_thumbDomain, d.xmlDomain = d.test_xmlDomain);
        e.mobileQQ && (b = document.createElement("script"), b.src = d.getResPath("lib/qqapi.js"), b.type = "text/javascript", document.head.appendChild(b));
        var b = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight;

        var mergeObject = function (json1,json2){
    		for(var key in json1){
    			json2[key] = json1[key];
    		}
    		//创建新对象
    		var r = {};
    		for(var k in json2){
    			r[k] = json2[k];
    		}
    		return r;
    	}

        __qq_pano_options.initDomWH = function (f) {
	        var q_hh_dom = iD.util.getDom('KDSEditor-sidebar');
	        	__qq_pano_options._qq_hh = q_hh_dom && parseInt(iD.util.getStyleValue(q_hh_dom, 'width')) || 0;
	        	
	        var ttiipprent = iD.util.getDom('KDSEditor-content');
	        if (__qq_pano_options._qq_isSetWH) {
	        	f ? null : __qq_pano_options._qq_w = __qq_pano_options._qq_oldw - __qq_pano_options._qq_hh;
	        	__qq_pano_options._qq_h = __qq_pano_options._qq_oldh;
        	} else {
        		__qq_pano_options._qq_w = ttiipprent && parseInt(iD.util.getStyleValue(ttiipprent, 'width')) || 0;
        		__qq_pano_options._qq_h = 0;
        	}
        }

        __qq_pano_options._initPanoWindowData = function () {
		    __qq_pano_options._qq_lls = {};
		    __qq_pano_options._qq_trans_len = 2;
		    __qq_pano_options.initDomWH();
		    
		    var idContainer = iD.util.getDom('KDSEditor-content').parentNode;
	        __qq_pano_options._qq_con_margin_lft = (idContainer && (parseInt(iD.util.getStyleValue(idContainer, 'margin-left')))) || 0;
	        __qq_pano_options._qq_con_lft = (idContainer && parseInt(iD.util.getStyleValue(idContainer, 'left'))) || 0;
	        __qq_pano_options._qq_con_margin_top = (idContainer && parseInt(iD.util.getStyleValue(idContainer, 'margin-top'))) || 0;
	        __qq_pano_options._qq_con_top = (idContainer && parseInt(iD.util.getStyleValue(idContainer, 'top'))) || 0;
        }

        __qq_pano_options.qq__showPanorama = function (l, svid, panoramaOptions, addPanoramaMarker) {

        	__qq_pano_options._initPanoWindowData();

        	__qq_pano_options.panoramaDom = l;//===========开放对象===========
			var aaa = a.cloneHash();
			aaa = mergeObject(panoramaOptions, aaa);
			aaa.pano = svid; aaa.svid = svid;
			z = new f(l, aaa);
			__qq_pano_options.qq__a.addListener("svid_changed", addPanoramaMarker);//iD中矢量添加，与QQ无关
		    m();
		    e.mobileQQ && p();
		    //v();
		    g.netSpeed();
		    
		    //滚轮事件
		    l.onmousewheel = function(e){
			    e = e || window.event;
			    if (!panoramaOptions.scrollwheel) return;
			    var lll = z.panorama.getZoom();
			    if (e.wheelDelta > 0 || e.detail > 0) {
		    		lll += 1; z.panorama.setZoom(lll);
		    	} else {
		    		lll -= 1; z.panorama.setZoom(lll);
		    	}
		    };
		    
		}
        
    })();
    var y = function() {
        var a = 1;
        return function(b) {
            if (window.JsBridge) window.JsBridge.callMethod("QQApi", "setShareInfo", b);
            else {
                var c = document.createElement("iframe");
                c.style.cssText = "display:none;width:0px;height:0px;";
                var d = navigator.userAgent;
                if ( - 1 < d.indexOf("Android")) window.JsBridge = {},
                window.JsBridge.callback = function(a) { (a = document.getElementById("jsbridge_" + String(a))) && document.body.removeChild(a)
                },
                b = encodeURIComponent(JSON.stringify(b || {})),
                d = a++,
                b = "jsbridge://QQApi/setShareInfo/" + d + "/" + b,
                document.body.appendChild(c),
                c.id = "jsbridge_" + d,
                c.src = b;
                else if ( - 1 < d.indexOf("iPhone") || -1 < d.indexOf("iPad") || -1 < d.indexOf("iPod")) window.iOSQQApi = window.iOSQQApi || {},
                b = encodeURIComponent(JSON.stringify({
                    params: b || {}
                })),
                c.src = "jsbridge://data/setShareInfo?p\x3d" + b,
                document.body.appendChild(c),
                document.body.removeChild(c)
            }
        }
    } ()
});
define("application/main",
function() {});