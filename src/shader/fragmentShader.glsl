      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform sampler2D image;
      uniform sampler2D image2;
      uniform sampler2D transition;
      uniform float mixRatio;
      void main() {
        // vec4 transitionTexel = texture2D(transition, vUv);
        vec4 transitionTexel1 = texture2D(transition, vUv);
        vec4 i1Texel = texture2D(image, vUv);
        vec4 i2Texel = texture2D(image2, vUv);

        float r = mixRatio * 1.6 - 0.3;
        float mixF = clamp((transitionTexel1.r - r) * 3.33, 0.0, 1.0);
        gl_FragColor = mix(i2Texel,i1Texel,mixF);
      }