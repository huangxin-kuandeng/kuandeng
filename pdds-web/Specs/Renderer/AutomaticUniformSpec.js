define([
        'Core/Cartesian2',
        'Core/Cartesian3',
        'Core/Color',
        'Core/defaultValue',
        'Core/Matrix4',
        'Core/OrthographicFrustum',
        'Core/OrthographicOffCenterFrustum',
        'Renderer/Pass',
        'Renderer/Texture',
        'Scene/SceneMode',
        'Specs/createCamera',
        'Specs/createContext',
        'Specs/createFrameState'
    ], 'Renderer/AutomaticUniforms', function(
        Cartesian2,
        Cartesian3,
        Color,
        defaultValue,
        Matrix4,
        OrthographicFrustum,
        OrthographicOffCenterFrustum,
        Pass,
        Texture,
        SceneMode,
        createCamera,
        createContext,
        createFrameState) {
        'use strict';

describe('Renderer/AutomaticUniforms', function() {

    var context;

    beforeAll(function() {
        context = createContext();
    });

    afterAll(function() {
        context.destroyForSpecs();
    });

    function createMockCamera(view, projection, infiniteProjection, position, direction, right, up) {
        return {
            viewMatrix : defaultValue(view, Matrix4.clone(Matrix4.IDENTITY)),
            inverseViewMatrix : Matrix4.inverseTransformation(defaultValue(view, Matrix4.clone(Matrix4.IDENTITY)), new Matrix4()),
            frustum : {
                near : 1.0,
                far : 1000.0,
                top : 2.0,
                bottom : -2.0,
                left : -1.0,
                right : 1.0,
                projectionMatrix : defaultValue(projection, Matrix4.clone(Matrix4.IDENTITY)),
                infiniteProjectionMatrix : defaultValue(infiniteProjection, Matrix4.clone(Matrix4.IDENTITY)),
                computeCullingVolume : function() {
                    return undefined;
                },
                getPixelSize : function() {
                    return new Cartesian2(1.0, 0.1);
                }
            },
            position : defaultValue(position, Cartesian3.clone(Cartesian3.ZERO)),
            positionWC : defaultValue(position, Cartesian3.clone(Cartesian3.ZERO)),
            directionWC : defaultValue(direction, Cartesian3.clone(Cartesian3.UNIT_Z)),
            rightWC : defaultValue(right, Cartesian3.clone(Cartesian3.UNIT_X)),
            upWC : defaultValue(up, Cartesian3.clone(Cartesian3.UNIT_Y))
        };
    }

    it('can declare automatic uniforms', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4((czm_viewport.x == 0.0) && (czm_viewport.y == 0.0) && (czm_viewport.z == 1.0) && (czm_viewport.w == 1.0)); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewport', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4((czm_viewport.x == 0.0) && (czm_viewport.y == 0.0) && (czm_viewport.z == 1.0) && (czm_viewport.w == 1.0)); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewportOrthographic', function() {
        var fs =
            'void main() { ' +
            '  bool b0 = (czm_viewportOrthographic[0][0] != 0.0) && (czm_viewportOrthographic[1][0] == 0.0) && (czm_viewportOrthographic[2][0] == 0.0) && (czm_viewportOrthographic[3][0] != 0.0); ' +
            '  bool b1 = (czm_viewportOrthographic[0][1] == 0.0) && (czm_viewportOrthographic[1][1] != 0.0) && (czm_viewportOrthographic[2][1] == 0.0) && (czm_viewportOrthographic[3][1] != 0.0); ' +
            '  bool b2 = (czm_viewportOrthographic[0][2] == 0.0) && (czm_viewportOrthographic[1][2] == 0.0) && (czm_viewportOrthographic[2][2] != 0.0) && (czm_viewportOrthographic[3][2] != 0.0); ' +
            '  bool b3 = (czm_viewportOrthographic[0][3] == 0.0) && (czm_viewportOrthographic[1][3] == 0.0) && (czm_viewportOrthographic[2][3] == 0.0) && (czm_viewportOrthographic[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewportTransformation', function() {
        var fs =
            'void main() { ' +
            '  bool b0 = (czm_viewportTransformation[0][0] != 0.0) && (czm_viewportTransformation[1][0] == 0.0) && (czm_viewportTransformation[2][0] == 0.0) && (czm_viewportTransformation[3][0] != 0.0); ' +
            '  bool b1 = (czm_viewportTransformation[0][1] == 0.0) && (czm_viewportTransformation[1][1] != 0.0) && (czm_viewportTransformation[2][1] == 0.0) && (czm_viewportTransformation[3][1] != 0.0); ' +
            '  bool b2 = (czm_viewportTransformation[0][2] == 0.0) && (czm_viewportTransformation[1][2] == 0.0) && (czm_viewportTransformation[2][2] != 0.0) && (czm_viewportTransformation[3][2] != 0.0); ' +
            '  bool b3 = (czm_viewportTransformation[0][3] == 0.0) && (czm_viewportTransformation[1][3] == 0.0) && (czm_viewportTransformation[2][3] == 0.0) && (czm_viewportTransformation[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_globeDepthTexture', function() {
        context.uniformState.globeDepthTexture = new Texture({
            context : context,
            source : {
                width : 1,
                height : 1,
                arrayBufferView : new Uint8Array([255, 255, 255, 255])
            }
        });
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(texture2D(czm_globeDepthTexture, vec2(0.5, 0.5)).r == 1.0);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_model', function() {
        var fs =
            'void main() { ' +
            '  bool b0 = (czm_model[0][0] ==  1.0) && (czm_model[1][0] ==  2.0) && (czm_model[2][0] ==  3.0) && (czm_model[3][0] ==  4.0); ' +
            '  bool b1 = (czm_model[0][1] ==  5.0) && (czm_model[1][1] ==  6.0) && (czm_model[2][1] ==  7.0) && (czm_model[3][1] ==  8.0); ' +
            '  bool b2 = (czm_model[0][2] ==  9.0) && (czm_model[1][2] == 10.0) && (czm_model[2][2] == 11.0) && (czm_model[3][2] == 12.0); ' +
            '  bool b3 = (czm_model[0][3] == 13.0) && (czm_model[1][3] == 14.0) && (czm_model[2][3] == 15.0) && (czm_model[3][3] == 16.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            1.0,  2.0,  3.0,  4.0,
            5.0,  6.0,  7.0,  8.0,
            9.0, 10.0, 11.0, 12.0,
            13.0, 14.0, 15.0, 16.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseModel', function() {
        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseModel[0][0] ==  0.0) && (czm_inverseModel[1][0] == 1.0) && (czm_inverseModel[2][0] == 0.0) && (czm_inverseModel[3][0] == -2.0); ' +
            '  bool b1 = (czm_inverseModel[0][1] == -1.0) && (czm_inverseModel[1][1] == 0.0) && (czm_inverseModel[2][1] == 0.0) && (czm_inverseModel[3][1] ==  1.0); ' +
            '  bool b2 = (czm_inverseModel[0][2] ==  0.0) && (czm_inverseModel[1][2] == 0.0) && (czm_inverseModel[2][2] == 1.0) && (czm_inverseModel[3][2] ==  0.0); ' +
            '  bool b3 = (czm_inverseModel[0][3] ==  0.0) && (czm_inverseModel[1][3] == 0.0) && (czm_inverseModel[2][3] == 0.0) && (czm_inverseModel[3][3] ==  1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            0.0, -1.0, 0.0, 1.0,
            1.0,  0.0, 0.0, 2.0,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_view', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
                1.0,  2.0,  3.0,  4.0,
                5.0,  6.0,  7.0,  8.0,
                9.0, 10.0, 11.0, 12.0,
               13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_view[0][0] ==  1.0) && (czm_view[1][0] ==  2.0) && (czm_view[2][0] ==  3.0) && (czm_view[3][0] ==  4.0); ' +
            '  bool b1 = (czm_view[0][1] ==  5.0) && (czm_view[1][1] ==  6.0) && (czm_view[2][1] ==  7.0) && (czm_view[3][1] ==  8.0); ' +
            '  bool b2 = (czm_view[0][2] ==  9.0) && (czm_view[1][2] == 10.0) && (czm_view[2][2] == 11.0) && (czm_view[3][2] == 12.0); ' +
            '  bool b3 = (czm_view[0][3] == 13.0) && (czm_view[1][3] == 14.0) && (czm_view[2][3] == 15.0) && (czm_view[3][3] == 16.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_view3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
                1.0,  2.0,  3.0,  4.0,
                5.0,  6.0,  7.0,  8.0,
                9.0, 10.0, 11.0, 12.0,
               13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_view3D[0][0] ==  1.0) && (czm_view3D[1][0] ==  2.0) && (czm_view3D[2][0] ==  3.0) && (czm_view3D[3][0] ==  4.0); ' +
            '  bool b1 = (czm_view3D[0][1] ==  5.0) && (czm_view3D[1][1] ==  6.0) && (czm_view3D[2][1] ==  7.0) && (czm_view3D[3][1] ==  8.0); ' +
            '  bool b2 = (czm_view3D[0][2] ==  9.0) && (czm_view3D[1][2] == 10.0) && (czm_view3D[2][2] == 11.0) && (czm_view3D[3][2] == 12.0); ' +
            '  bool b3 = (czm_view3D[0][3] == 13.0) && (czm_view3D[1][3] == 14.0) && (czm_view3D[2][3] == 15.0) && (czm_view3D[3][3] == 16.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewRotation', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
                1.0,  2.0,  3.0,  4.0,
                5.0,  6.0,  7.0,  8.0,
                9.0, 10.0, 11.0, 12.0,
               13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_viewRotation[0][0] ==  1.0) && (czm_viewRotation[1][0] ==  2.0) && (czm_viewRotation[2][0] ==  3.0); ' +
            '  bool b1 = (czm_viewRotation[0][1] ==  5.0) && (czm_viewRotation[1][1] ==  6.0) && (czm_viewRotation[2][1] ==  7.0); ' +
            '  bool b2 = (czm_viewRotation[0][2] ==  9.0) && (czm_viewRotation[1][2] == 10.0) && (czm_viewRotation[2][2] == 11.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewRotation3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
                1.0,  2.0,  3.0,  4.0,
                5.0,  6.0,  7.0,  8.0,
                9.0, 10.0, 11.0, 12.0,
               13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_viewRotation3D[0][0] ==  1.0) && (czm_viewRotation3D[1][0] ==  2.0) && (czm_viewRotation3D[2][0] ==  3.0); ' +
            '  bool b1 = (czm_viewRotation3D[0][1] ==  5.0) && (czm_viewRotation3D[1][1] ==  6.0) && (czm_viewRotation3D[2][1] ==  7.0); ' +
            '  bool b2 = (czm_viewRotation3D[0][2] ==  9.0) && (czm_viewRotation3D[1][2] == 10.0) && (czm_viewRotation3D[2][2] == 11.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseView', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               0.0, -1.0, 0.0, 7.0,
               1.0,  0.0, 0.0, 8.0,
               0.0,  0.0, 1.0, 0.0,
               0.0,  0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseView[0][0] ==  0.0) && (czm_inverseView[1][0] == 1.0) && (czm_inverseView[2][0] == 0.0) && (czm_inverseView[3][0] == -8.0) &&' +
            '    (czm_inverseView[0][1] == -1.0) && (czm_inverseView[1][1] == 0.0) && (czm_inverseView[2][1] == 0.0) && (czm_inverseView[3][1] ==  7.0) &&' +
            '    (czm_inverseView[0][2] ==  0.0) && (czm_inverseView[1][2] == 0.0) && (czm_inverseView[2][2] == 1.0) && (czm_inverseView[3][2] ==  0.0)' +
            '  ); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseView3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               0.0, -1.0, 0.0, 7.0,
               1.0,  0.0, 0.0, 8.0,
               0.0,  0.0, 1.0, 0.0,
               0.0,  0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseView3D[0][0] ==  0.0) && (czm_inverseView3D[1][0] == 1.0) && (czm_inverseView3D[2][0] == 0.0) && (czm_inverseView3D[3][0] == -8.0) &&' +
            '    (czm_inverseView3D[0][1] == -1.0) && (czm_inverseView3D[1][1] == 0.0) && (czm_inverseView3D[2][1] == 0.0) && (czm_inverseView3D[3][1] ==  7.0) &&' +
            '    (czm_inverseView3D[0][2] ==  0.0) && (czm_inverseView3D[1][2] == 0.0) && (czm_inverseView3D[2][2] == 1.0) && (czm_inverseView3D[3][2] ==  0.0)' +
            '  ); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseViewRotation', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               0.0, -1.0, 0.0, 7.0,
               1.0,  0.0, 0.0, 8.0,
               0.0,  0.0, 1.0, 9.0,
               0.0,  0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseViewRotation[0][0] ==  0.0) && (czm_inverseViewRotation[1][0] == 1.0) && (czm_inverseViewRotation[2][0] == 0.0) && ' +
            '    (czm_inverseViewRotation[0][1] == -1.0) && (czm_inverseViewRotation[1][1] == 0.0) && (czm_inverseViewRotation[2][1] == 0.0) && ' +
            '    (czm_inverseViewRotation[0][2] ==  0.0) && (czm_inverseViewRotation[1][2] == 0.0) && (czm_inverseViewRotation[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseViewRotation3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               0.0, -1.0, 0.0, 7.0,
               1.0,  0.0, 0.0, 8.0,
               0.0,  0.0, 1.0, 9.0,
               0.0,  0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseViewRotation3D[0][0] ==  0.0) && (czm_inverseViewRotation3D[1][0] == 1.0) && (czm_inverseViewRotation3D[2][0] == 0.0) && ' +
            '    (czm_inverseViewRotation3D[0][1] == -1.0) && (czm_inverseViewRotation3D[1][1] == 0.0) && (czm_inverseViewRotation3D[2][1] == 0.0) && ' +
            '    (czm_inverseViewRotation3D[0][2] ==  0.0) && (czm_inverseViewRotation3D[1][2] == 0.0) && (czm_inverseViewRotation3D[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_projection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            undefined,
            new Matrix4(
               1.0,  2.0,  3.0,  4.0,
               5.0,  6.0,  7.0,  8.0,
               9.0, 10.0, 11.0, 12.0,
              13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_projection[0][0] ==  1.0) && (czm_projection[1][0] ==  2.0) && (czm_projection[2][0] ==  3.0) && (czm_projection[3][0] ==  4.0); ' +
            '  bool b1 = (czm_projection[0][1] ==  5.0) && (czm_projection[1][1] ==  6.0) && (czm_projection[2][1] ==  7.0) && (czm_projection[3][1] ==  8.0); ' +
            '  bool b2 = (czm_projection[0][2] ==  9.0) && (czm_projection[1][2] == 10.0) && (czm_projection[2][2] == 11.0) && (czm_projection[3][2] == 12.0); ' +
            '  bool b3 = (czm_projection[0][3] == 13.0) && (czm_projection[1][3] == 14.0) && (czm_projection[2][3] == 15.0) && (czm_projection[3][3] == 16.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            undefined,
            new Matrix4(
               0.0, -1.0, 0.0, 1.0,
               1.0,  0.0, 0.0, 2.0,
               0.0,  0.0, 1.0, 0.0,
               0.0,  0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseProjection[0][0] ==  0.0) && (czm_inverseProjection[1][0] == 1.0) && (czm_inverseProjection[2][0] == 0.0) && (czm_inverseProjection[3][0] == -2.0); ' +
            '  bool b1 = (czm_inverseProjection[0][1] == -1.0) && (czm_inverseProjection[1][1] == 0.0) && (czm_inverseProjection[2][1] == 0.0) && (czm_inverseProjection[3][1] ==  1.0); ' +
            '  bool b2 = (czm_inverseProjection[0][2] ==  0.0) && (czm_inverseProjection[1][2] == 0.0) && (czm_inverseProjection[2][2] == 1.0) && (czm_inverseProjection[3][2] ==  0.0); ' +
            '  bool b3 = (czm_inverseProjection[0][3] ==  0.0) && (czm_inverseProjection[1][3] == 0.0) && (czm_inverseProjection[2][3] == 0.0) && (czm_inverseProjection[3][3] ==  1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseProjection in 2D', function() {
        var frameState = createFrameState(context, createMockCamera(
            undefined,
            new Matrix4(
                0.0, -1.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 2.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0)));
        frameState.mode = SceneMode.SCENE2D;

        var us = context.uniformState;
        us.update(frameState);

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseProjection[0][0] == 0.0) && (czm_inverseProjection[1][0] == 0.0) && (czm_inverseProjection[2][0] == 0.0) && (czm_inverseProjection[3][0] == 0.0); ' +
            '  bool b1 = (czm_inverseProjection[0][1] == 0.0) && (czm_inverseProjection[1][1] == 0.0) && (czm_inverseProjection[2][1] == 0.0) && (czm_inverseProjection[3][1] == 0.0); ' +
            '  bool b2 = (czm_inverseProjection[0][2] == 0.0) && (czm_inverseProjection[1][2] == 0.0) && (czm_inverseProjection[2][2] == 0.0) && (czm_inverseProjection[3][2] == 0.0); ' +
            '  bool b3 = (czm_inverseProjection[0][3] == 0.0) && (czm_inverseProjection[1][3] == 0.0) && (czm_inverseProjection[2][3] == 0.0) && (czm_inverseProjection[3][3] == 0.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseProjection in 3D with orthographic projection', function() {
        var frameState = createFrameState(context, createMockCamera(
            undefined,
            new Matrix4(
                0.0, -1.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 2.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0)));
        var frustum = new OrthographicFrustum();
        frustum.aspectRatio = 1.0;
        frustum.width = 1.0;
        frameState.camera.frustum = frustum;

        var us = context.uniformState;
        us.update(frameState);

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseProjection[0][0] == 0.0) && (czm_inverseProjection[1][0] == 0.0) && (czm_inverseProjection[2][0] == 0.0) && (czm_inverseProjection[3][0] == 0.0); ' +
            '  bool b1 = (czm_inverseProjection[0][1] == 0.0) && (czm_inverseProjection[1][1] == 0.0) && (czm_inverseProjection[2][1] == 0.0) && (czm_inverseProjection[3][1] == 0.0); ' +
            '  bool b2 = (czm_inverseProjection[0][2] == 0.0) && (czm_inverseProjection[1][2] == 0.0) && (czm_inverseProjection[2][2] == 0.0) && (czm_inverseProjection[3][2] == 0.0); ' +
            '  bool b3 = (czm_inverseProjection[0][3] == 0.0) && (czm_inverseProjection[1][3] == 0.0) && (czm_inverseProjection[2][3] == 0.0) && (czm_inverseProjection[3][3] == 0.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_infiniteProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(undefined, undefined,
            new Matrix4(1.0,  2.0,  3.0,  4.0,
                        5.0,  6.0,  7.0,  8.0,
                        9.0, 10.0, 11.0, 12.0,
                       13.0, 14.0, 15.0, 16.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_infiniteProjection[0][0] ==  1.0) && (czm_infiniteProjection[1][0] ==  2.0) && (czm_infiniteProjection[2][0] ==  3.0) && (czm_infiniteProjection[3][0] ==  4.0); ' +
            '  bool b1 = (czm_infiniteProjection[0][1] ==  5.0) && (czm_infiniteProjection[1][1] ==  6.0) && (czm_infiniteProjection[2][1] ==  7.0) && (czm_infiniteProjection[3][1] ==  8.0); ' +
            '  bool b2 = (czm_infiniteProjection[0][2] ==  9.0) && (czm_infiniteProjection[1][2] == 10.0) && (czm_infiniteProjection[2][2] == 11.0) && (czm_infiniteProjection[3][2] == 12.0); ' +
            '  bool b3 = (czm_infiniteProjection[0][3] == 13.0) && (czm_infiniteProjection[1][3] == 14.0) && (czm_infiniteProjection[2][3] == 15.0) && (czm_infiniteProjection[3][3] == 16.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_modelView', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               1.0, 0.0, 0.0, 1.0,
               0.0, 1.0, 0.0, 1.0,
               0.0, 0.0, 1.0, 1.0,
               0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelView[0][0] == 2.0) && (czm_modelView[1][0] == 0.0) && (czm_modelView[2][0] == 0.0) && (czm_modelView[3][0] == 1.0); ' +
            '  bool b1 = (czm_modelView[0][1] == 0.0) && (czm_modelView[1][1] == 2.0) && (czm_modelView[2][1] == 0.0) && (czm_modelView[3][1] == 1.0); ' +
            '  bool b2 = (czm_modelView[0][2] == 0.0) && (czm_modelView[1][2] == 0.0) && (czm_modelView[2][2] == 2.0) && (czm_modelView[3][2] == 1.0); ' +
            '  bool b3 = (czm_modelView[0][3] == 0.0) && (czm_modelView[1][3] == 0.0) && (czm_modelView[2][3] == 0.0) && (czm_modelView[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            2.0, 0.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0,
            0.0, 0.0, 2.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_modelView3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               1.0, 0.0, 0.0, 1.0,
               0.0, 1.0, 0.0, 1.0,
               0.0, 0.0, 1.0, 1.0,
               0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelView3D[0][0] == 2.0) && (czm_modelView3D[1][0] == 0.0) && (czm_modelView3D[2][0] == 0.0) && (czm_modelView3D[3][0] == 1.0); ' +
            '  bool b1 = (czm_modelView3D[0][1] == 0.0) && (czm_modelView3D[1][1] == 2.0) && (czm_modelView3D[2][1] == 0.0) && (czm_modelView3D[3][1] == 1.0); ' +
            '  bool b2 = (czm_modelView3D[0][2] == 0.0) && (czm_modelView3D[1][2] == 0.0) && (czm_modelView3D[2][2] == 2.0) && (czm_modelView3D[3][2] == 1.0); ' +
            '  bool b3 = (czm_modelView3D[0][3] == 0.0) && (czm_modelView3D[1][3] == 0.0) && (czm_modelView3D[2][3] == 0.0) && (czm_modelView3D[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            2.0, 0.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0,
            0.0, 0.0, 2.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_modelViewRelativeToEye', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(
               1.0, 0.0, 0.0, 1.0,
               0.0, 1.0, 0.0, 1.0,
               0.0, 0.0, 1.0, 1.0,
               0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelViewRelativeToEye[0][0] == 2.0) && (czm_modelViewRelativeToEye[1][0] == 0.0) && (czm_modelViewRelativeToEye[2][0] == 0.0) && (czm_modelViewRelativeToEye[3][0] == 0.0); ' +
            '  bool b1 = (czm_modelViewRelativeToEye[0][1] == 0.0) && (czm_modelViewRelativeToEye[1][1] == 2.0) && (czm_modelViewRelativeToEye[2][1] == 0.0) && (czm_modelViewRelativeToEye[3][1] == 0.0); ' +
            '  bool b2 = (czm_modelViewRelativeToEye[0][2] == 0.0) && (czm_modelViewRelativeToEye[1][2] == 0.0) && (czm_modelViewRelativeToEye[2][2] == 2.0) && (czm_modelViewRelativeToEye[3][2] == 0.0); ' +
            '  bool b3 = (czm_modelViewRelativeToEye[0][3] == 0.0) && (czm_modelViewRelativeToEye[1][3] == 0.0) && (czm_modelViewRelativeToEye[2][3] == 0.0) && (czm_modelViewRelativeToEye[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            2.0, 0.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0,
            0.0, 0.0, 2.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseModelView', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(Matrix4.clone(Matrix4.IDENTITY))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseModelView[0][0] ==  0.0) && (czm_inverseModelView[1][0] == 1.0) && (czm_inverseModelView[2][0] == 0.0) && (czm_inverseModelView[3][0] == -2.0); ' +
            '  bool b1 = (czm_inverseModelView[0][1] == -1.0) && (czm_inverseModelView[1][1] == 0.0) && (czm_inverseModelView[2][1] == 0.0) && (czm_inverseModelView[3][1] ==  1.0); ' +
            '  bool b2 = (czm_inverseModelView[0][2] ==  0.0) && (czm_inverseModelView[1][2] == 0.0) && (czm_inverseModelView[2][2] == 1.0) && (czm_inverseModelView[3][2] ==  0.0); ' +
            '  bool b3 = (czm_inverseModelView[0][3] ==  0.0) && (czm_inverseModelView[1][3] == 0.0) && (czm_inverseModelView[2][3] == 0.0) && (czm_inverseModelView[3][3] ==  1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            0.0, -1.0, 0.0, 1.0,
            1.0,  0.0, 0.0, 2.0,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseModelView3D', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(Matrix4.clone(Matrix4.IDENTITY))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseModelView3D[0][0] ==  0.0) && (czm_inverseModelView3D[1][0] == 1.0) && (czm_inverseModelView3D[2][0] == 0.0) && (czm_inverseModelView3D[3][0] == -2.0); ' +
            '  bool b1 = (czm_inverseModelView3D[0][1] == -1.0) && (czm_inverseModelView3D[1][1] == 0.0) && (czm_inverseModelView3D[2][1] == 0.0) && (czm_inverseModelView3D[3][1] ==  1.0); ' +
            '  bool b2 = (czm_inverseModelView3D[0][2] ==  0.0) && (czm_inverseModelView3D[1][2] == 0.0) && (czm_inverseModelView3D[2][2] == 1.0) && (czm_inverseModelView3D[3][2] ==  0.0); ' +
            '  bool b3 = (czm_inverseModelView3D[0][3] ==  0.0) && (czm_inverseModelView3D[1][3] == 0.0) && (czm_inverseModelView3D[2][3] == 0.0) && (czm_inverseModelView3D[3][3] ==  1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';
        var m = new Matrix4(
            0.0, -1.0, 0.0, 1.0,
            1.0,  0.0, 0.0, 2.0,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_viewProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_viewProjection[0][0] == 1.0) && (czm_viewProjection[1][0] == 0.0) && (czm_viewProjection[2][0] == 0.0) && (czm_viewProjection[3][0] == 0.0); ' +
            '  bool b1 = (czm_viewProjection[0][1] == 0.0) && (czm_viewProjection[1][1] == 1.0) && (czm_viewProjection[2][1] == 0.0) && (czm_viewProjection[3][1] == 8.0); ' +
            '  bool b2 = (czm_viewProjection[0][2] == 0.0) && (czm_viewProjection[1][2] == 0.0) && (czm_viewProjection[2][2] == 1.0) && (czm_viewProjection[3][2] == 9.0); ' +
            '  bool b3 = (czm_viewProjection[0][3] == 0.0) && (czm_viewProjection[1][3] == 0.0) && (czm_viewProjection[2][3] == 0.0) && (czm_viewProjection[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_inverseViewProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseViewProjection[0][0] == 1.0) && (czm_inverseViewProjection[1][0] == 0.0) && (czm_inverseViewProjection[2][0] == 0.0) && (czm_inverseViewProjection[3][0] ==  0.0); ' +
            '  bool b1 = (czm_inverseViewProjection[0][1] == 0.0) && (czm_inverseViewProjection[1][1] == 1.0) && (czm_inverseViewProjection[2][1] == 0.0) && (czm_inverseViewProjection[3][1] == -8.0); ' +
            '  bool b2 = (czm_inverseViewProjection[0][2] == 0.0) && (czm_inverseViewProjection[1][2] == 0.0) && (czm_inverseViewProjection[2][2] == 1.0) && (czm_inverseViewProjection[3][2] == -9.0); ' +
            '  bool b3 = (czm_inverseViewProjection[0][3] == 0.0) && (czm_inverseViewProjection[1][3] == 0.0) && (czm_inverseViewProjection[2][3] == 0.0) && (czm_inverseViewProjection[3][3] ==  1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_modelViewProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelViewProjection[0][0] == 1.0) && (czm_modelViewProjection[1][0] == 0.0) && (czm_modelViewProjection[2][0] == 0.0) && (czm_modelViewProjection[3][0] == 7.0); ' +
            '  bool b1 = (czm_modelViewProjection[0][1] == 0.0) && (czm_modelViewProjection[1][1] == 1.0) && (czm_modelViewProjection[2][1] == 0.0) && (czm_modelViewProjection[3][1] == 8.0); ' +
            '  bool b2 = (czm_modelViewProjection[0][2] == 0.0) && (czm_modelViewProjection[1][2] == 0.0) && (czm_modelViewProjection[2][2] == 1.0) && (czm_modelViewProjection[3][2] == 9.0); ' +
            '  bool b3 = (czm_modelViewProjection[0][3] == 0.0) && (czm_modelViewProjection[1][3] == 0.0) && (czm_modelViewProjection[2][3] == 0.0) && (czm_modelViewProjection[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseModelViewProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_inverseModelViewProjection[0][0] == 1.0) && (czm_inverseModelViewProjection[1][0] == 0.0) && (czm_inverseModelViewProjection[2][0] == 0.0) && (czm_inverseModelViewProjection[3][0] == -7.0); ' +
            '  bool b1 = (czm_inverseModelViewProjection[0][1] == 0.0) && (czm_inverseModelViewProjection[1][1] == 1.0) && (czm_inverseModelViewProjection[2][1] == 0.0) && (czm_inverseModelViewProjection[3][1] == -8.0); ' +
            '  bool b2 = (czm_inverseModelViewProjection[0][2] == 0.0) && (czm_inverseModelViewProjection[1][2] == 0.0) && (czm_inverseModelViewProjection[2][2] == 1.0) && (czm_inverseModelViewProjection[3][2] == -9.0); ' +
            '  bool b3 = (czm_inverseModelViewProjection[0][3] == 0.0) && (czm_inverseModelViewProjection[1][3] == 0.0) && (czm_inverseModelViewProjection[2][3] == 0.0) && (czm_inverseModelViewProjection[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_modelViewProjectionRelativeToEye', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelViewProjectionRelativeToEye[0][0] == 1.0) && (czm_modelViewProjectionRelativeToEye[1][0] == 0.0) && (czm_modelViewProjectionRelativeToEye[2][0] == 0.0) && (czm_modelViewProjectionRelativeToEye[3][0] == 0.0); ' +
            '  bool b1 = (czm_modelViewProjectionRelativeToEye[0][1] == 0.0) && (czm_modelViewProjectionRelativeToEye[1][1] == 1.0) && (czm_modelViewProjectionRelativeToEye[2][1] == 0.0) && (czm_modelViewProjectionRelativeToEye[3][1] == 0.0); ' +
            '  bool b2 = (czm_modelViewProjectionRelativeToEye[0][2] == 0.0) && (czm_modelViewProjectionRelativeToEye[1][2] == 0.0) && (czm_modelViewProjectionRelativeToEye[2][2] == 1.0) && (czm_modelViewProjectionRelativeToEye[3][2] == 9.0); ' +
            '  bool b3 = (czm_modelViewProjectionRelativeToEye[0][3] == 0.0) && (czm_modelViewProjectionRelativeToEye[1][3] == 0.0) && (czm_modelViewProjectionRelativeToEye[2][3] == 0.0) && (czm_modelViewProjectionRelativeToEye[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_modelViewInfiniteProjection', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 8.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0),
            undefined,
            new Matrix4(1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 9.0,
                        0.0, 0.0, 0.0, 1.0))));

        var fs =
            'void main() { ' +
            '  bool b0 = (czm_modelViewInfiniteProjection[0][0] == 1.0) && (czm_modelViewInfiniteProjection[1][0] == 0.0) && (czm_modelViewInfiniteProjection[2][0] == 0.0) && (czm_modelViewInfiniteProjection[3][0] == 7.0); ' +
            '  bool b1 = (czm_modelViewInfiniteProjection[0][1] == 0.0) && (czm_modelViewInfiniteProjection[1][1] == 1.0) && (czm_modelViewInfiniteProjection[2][1] == 0.0) && (czm_modelViewInfiniteProjection[3][1] == 8.0); ' +
            '  bool b2 = (czm_modelViewInfiniteProjection[0][2] == 0.0) && (czm_modelViewInfiniteProjection[1][2] == 0.0) && (czm_modelViewInfiniteProjection[2][2] == 1.0) && (czm_modelViewInfiniteProjection[3][2] == 9.0); ' +
            '  bool b3 = (czm_modelViewInfiniteProjection[0][3] == 0.0) && (czm_modelViewInfiniteProjection[1][3] == 0.0) && (czm_modelViewInfiniteProjection[2][3] == 0.0) && (czm_modelViewInfiniteProjection[3][3] == 1.0); ' +
            '  gl_FragColor = vec4(b0 && b1 && b2 && b3); ' +
            '}';

        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_normal', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_normal[0][0] == 1.0) && (czm_normal[1][0] == 0.0) && (czm_normal[2][0] == 0.0) && ' +
            '    (czm_normal[0][1] == 0.0) && (czm_normal[1][1] == 1.0) && (czm_normal[2][1] == 0.0) && ' +
            '    (czm_normal[0][2] == 0.0) && (czm_normal[1][2] == 0.0) && (czm_normal[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 8.0,
            0.0, 0.0, 1.0, 9.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseNormal', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseNormal[0][0] ==  0.0) && (czm_inverseNormal[1][0] == 1.0) && (czm_inverseNormal[2][0] == 0.0) && ' +
            '    (czm_inverseNormal[0][1] == -1.0) && (czm_inverseNormal[1][1] == 0.0) && (czm_inverseNormal[2][1] == 0.0) && ' +
            '    (czm_inverseNormal[0][2] ==  0.0) && (czm_inverseNormal[1][2] == 0.0) && (czm_inverseNormal[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        var m = new Matrix4(
            0.0, -1.0, 0.0, 7.0,
            1.0,  0.0, 0.0, 8.0,
            0.0,  0.0, 1.0, 9.0,
            0.0,  0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_normal3D', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_normal3D[0][0] == 1.0) && (czm_normal3D[1][0] == 0.0) && (czm_normal3D[2][0] == 0.0) && ' +
            '    (czm_normal3D[0][1] == 0.0) && (czm_normal3D[1][1] == 1.0) && (czm_normal3D[2][1] == 0.0) && ' +
            '    (czm_normal3D[0][2] == 0.0) && (czm_normal3D[1][2] == 0.0) && (czm_normal3D[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        var m = new Matrix4(
            1.0, 0.0, 0.0, 7.0,
            0.0, 1.0, 0.0, 8.0,
            0.0, 0.0, 1.0, 9.0,
            0.0, 0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_inverseNormal3D', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_inverseNormal3D[0][0] ==  0.0) && (czm_inverseNormal3D[1][0] == 1.0) && (czm_inverseNormal3D[2][0] == 0.0) && ' +
            '    (czm_inverseNormal3D[0][1] == -1.0) && (czm_inverseNormal3D[1][1] == 0.0) && (czm_inverseNormal3D[2][1] == 0.0) && ' +
            '    (czm_inverseNormal3D[0][2] ==  0.0) && (czm_inverseNormal3D[1][2] == 0.0) && (czm_inverseNormal3D[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        var m = new Matrix4(
            0.0, -1.0, 0.0, 7.0,
            1.0,  0.0, 0.0, 8.0,
            0.0,  0.0, 1.0, 9.0,
            0.0,  0.0, 0.0, 1.0);
        expect({
            context : context,
            fragmentShader : fs,
            modelMatrix : m
        }).contextToRender();
    });

    it('has czm_encodedCameraPositionMCHigh and czm_encodedCameraPositionMCLow', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera(undefined, undefined, undefined, new Cartesian3(-1000.0, 0.0, 100000.0))));

        var fs =
            'void main() { ' +
            '  bool b = (czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow == vec3(-1000.0, 0.0, 100000.0)); ' +
            '  gl_FragColor = vec4(b); ' +
            '}';

        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_entireFrustum', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4((czm_entireFrustum.x == 1.0) && (czm_entireFrustum.y == 1000.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_frustumPlanes', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(equal(czm_frustumPlanes, vec4(2.0, -2.0, -1.0, 1.0))); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sunPositionWC', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_sunPositionWC != vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sunPositionColumbusView', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_sunPositionColumbusView != vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sunDirectionEC', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_sunDirectionEC != vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sunDirectionWC', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_sunDirectionWC != vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_moonDirectionEC', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_moonDirectionEC != vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_viewerPositionWC', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs = 'void main() { gl_FragColor = vec4(czm_viewerPositionWC == vec3(0.0)); }';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_frameNumber', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_frameNumber != 0.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_morphTime', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_morphTime == 1.0); ' +   // 3D
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_temeToPseudoFixed', function() {
        var us = context.uniformState;
        us.update(createFrameState(context, createMockCamera()));

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(' +
            '    (czm_temeToPseudoFixed[0][0] != 0.0) && (czm_temeToPseudoFixed[1][0] != 0.0) && (czm_temeToPseudoFixed[2][0] == 0.0) && ' +
            '    (czm_temeToPseudoFixed[0][1] != 0.0) && (czm_temeToPseudoFixed[1][1] != 0.0) && (czm_temeToPseudoFixed[2][1] == 0.0) && ' +
            '    (czm_temeToPseudoFixed[0][2] == 0.0) && (czm_temeToPseudoFixed[1][2] == 0.0) && (czm_temeToPseudoFixed[2][2] == 1.0) ' +
            '  ); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passEnvironment', function() {
        var us = context.uniformState;
        us.updatePass(Pass.ENVIRONMENT);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passEnvironment);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passCompute', function() {
        var us = context.uniformState;
        us.updatePass(Pass.COMPUTE);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passCompute);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passGlobe', function() {
        var us = context.uniformState;
        us.updatePass(Pass.GLOBE);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passGlobe);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passTerrainClassification', function() {
        var us = context.uniformState;
        us.updatePass(Pass.TERRAIN_CLASSIFICATION);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passTerrainClassification);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passCesium3DTileClassification', function() {
        var us = context.uniformState;
        us.updatePass(Pass.CESIUM_3D_TILE_CLASSIFICATION);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passCesium3DTileClassification);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passOpaque', function() {
        var us = context.uniformState;
        us.updatePass(Pass.OPAQUE);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passOpaque);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passTranslucent', function() {
        var us = context.uniformState;
        us.updatePass(Pass.TRANSLUCENT);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passTranslucent);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_pass and czm_passOverlay', function() {
        var us = context.uniformState;
        us.updatePass(Pass.OVERLAY);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_pass == czm_passOverlay);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sceneMode', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_sceneMode == 3.0); ' +   // 3D
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sceneMode2D', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_sceneMode2D == 2.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sceneModeColumbusView', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_sceneModeColumbusView == 1.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sceneMode3D', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_sceneMode3D == 3.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sceneModeMorphing', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_sceneModeMorphing == 0.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_eyeHeight2D == 0,0 in Scene3D', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_eyeHeight2D.x == 0.0, czm_eyeHeight2D.y == 0.0, 1.0, 1.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_eyeHeight2D in Scene2D', function() {
        var us = context.uniformState;
        var camera = createCamera();
        var frustum = new OrthographicOffCenterFrustum();
        frustum.near = 1.0;
        frustum.far = 2.0;
        frustum.left = -2.0;
        frustum.right = 2.0;
        frustum.top = 1.0;
        frustum.bottom = -1.0;
        camera.frustum = frustum;
        var frameState = createFrameState(context, camera);
        frameState.mode = SceneMode.SCENE2D;

        us.update(frameState);
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_eyeHeight2D.x == 2.0, czm_eyeHeight2D.y == 4.0, 1.0, 1.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_imagerySplitPosition', function() {
        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_imagerySplitPosition == 0.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_backgroundColor', function() {
        var frameState = createFrameState(context, createMockCamera());
        frameState.backgroundColor = new Color(0.0, 0.25, 0.75, 1.0);
        context.uniformState.update(frameState);

        var fs =
            'void main() { ' +
            '  gl_FragColor = vec4(czm_backgroundColor.r == 0.0, czm_backgroundColor.g == 0.25, czm_backgroundColor.b == 0.75, czm_backgroundColor.a == 1.0); ' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_minimumDisableDepthTestDistance', function() {
        var frameState = createFrameState(context, createMockCamera());
        context.uniformState.update(frameState);
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_minimumDisableDepthTestDistance == 0.0);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_orthographicIn3D', function() {
        var frameState = createFrameState(context, createMockCamera());
        context.uniformState.update(frameState);
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_orthographicIn3D == 0.0);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();

        var frustum = new OrthographicFrustum();
        frustum.aspectRatio = 1.0;
        frustum.width = 1.0;
        frameState.camera.frustum = frustum;
        context.uniformState.update(frameState);
        fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_orthographicIn3D == 1.0);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_log2FarDistance', function() {
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_log2FarDistance == (2.0 / log2(czm_currentFrustum.y + 1.0)));' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_log2FarPlusOne', function() {
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_log2FarPlusOne == log2(czm_currentFrustum.y + 1.0));' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_log2NearDistance', function() {
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_log2NearDistance == log2(czm_currentFrustum.x));' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_gamma', function() {
        context.uniformState.gamma = 1.0;
        var fs =
            'void main() {' +
            '  gl_FragColor = vec4(czm_gamma == 1.0);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

    it('has czm_sunColor', function() {
        var us = context.uniformState;
        var frameState = createFrameState(context, createMockCamera());
        frameState.sunColor = new Cartesian3(1.0, 2.0, 3.0);
        us.update(frameState);
        var fs =
            'void main() {' +
            '  bool b0 = czm_sunColor.x == 1.0;' +
            '  bool b1 = czm_sunColor.y == 2.0;' +
            '  bool b2 = czm_sunColor.z == 3.0;' +
            '  gl_FragColor = vec4(b0 && b1 && b2);' +
            '}';
        expect({
            context : context,
            fragmentShader : fs
        }).contextToRender();
    });

}, 'WebGL');
});
