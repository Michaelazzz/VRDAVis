import * as THREE from 'three';

const VolumeShader = {
    vertexShader: /* glsl */`

        varying vec3 v_origin;
        varying vec3 v_direction;

        void main() {
            v_origin = vec3(inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
            v_direction = position - v_origin;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fradgmentShader: /* glsl */`
        #define STEPS 100.0
        #define MAX_DIST 100.
        #define THRESHOLD .25
        #define RANGE .1
        #define OPACITY .1

        precision highp float;
        precision mediump sampler3D;

        uniform sampler3D u_textureData;
        uniform sampler2D u_colourMap;

        varying vec3 v_origin;
        varying vec3 v_direction;

        vec2 hitBox(vec3 origin, vec3 direction) {
            const vec3 boxMin = vec3(-0.5);
            const vec3 boxMax = vec3(0.5);

            vec3 inverseDirection = 1.0 / direction;

            vec3 tempMinValue = (boxMin - origin) * inverseDirection;
            vec3 tempMaxValue = (boxMax - origin) * inverseDirection;

            vec3 minValue = min(tempMinValue, tempMaxValue);
            vec3 maxValue = max(tempMinValue, tempMaxValue);

            float t0 = max(minValue.x, max(minValue.y, minValue.z));
            float t1 = min(maxValue.x, min(maxValue.y, maxValue.z));

            return vec2(t0, t1);
        }

        float samplePoint(vec3 point) {
            return texture(u_textureData, point).r;
        }

        vec3 sampleColourMap(float value) {
            return texture(u_colourMap, vec2(value, 0.5)).rgb;
        }

        void main() {
            vec3 rayDirection = normalize(v_direction);
            vec2 bounds = hitBox(v_origin, rayDirection);

            if ( bounds.x > bounds.y ) discard;

            bounds.x = max( bounds.x, 0.0 );

            vec3 point = v_origin + bounds.x * rayDirection;
            vec3 inc = 1.0 / abs(rayDirection);
            float delta = min(inc.x, min(inc.y, inc.z));
            delta /= STEPS;

            vec3 white = vec3(1.0, 1.0, 1.0);

            vec4 color = vec4(white, 0.0);

            // ray march through the volume
            for(float i = bounds.x; i < bounds.y; i+=delta){
                float d = samplePoint(point + 0.5);
                color.rgb = sampleColourMap(d);
                //d = smoothstep(THRESHOLD - RANGE, THRESHOLD + RANGE, d) * OPACITY;
                d *= OPACITY;
                //color.rgb += (1.0 - color.a) * d * color.rgb;
                color.a += (1.0 - color.a) * d;
                
                // stop ray if it has accumulated enough opacity
                if(color.a >= 0.95) break;

                // move point on step in direction of the ray
                point += rayDirection * delta;
            }
            
            gl_FragColor = color;

            // discard point if it is empty
            if ( color.a == 0.0 ) discard;
        }
    `
};

export { VolumeShader };