//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "uniform sampler2D colorTexture;\n\
varying vec2 v_textureCoordinates;\n\
#ifdef AUTO_EXPOSURE\n\
uniform sampler2D autoExposure;\n\
#endif\n\
void main()\n\
{\n\
vec4 fragmentColor = texture2D(colorTexture, v_textureCoordinates);\n\
vec3 color = fragmentColor.rgb;\n\
#ifdef AUTO_EXPOSURE\n\
color /= texture2D(autoExposure, vec2(0.5)).r;\n\
#endif\n\
color = czm_acesTonemapping(color);\n\
color = czm_inverseGamma(color);\n\
gl_FragColor = vec4(color, fragmentColor.a);\n\
}\n\
";
});