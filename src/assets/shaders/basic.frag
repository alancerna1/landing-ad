#ifdef GL_ES
      precision lowp float;
      precision lowp int;
#endif

#define PI  3.14159265358
#define TAU 6.28318530718
// #define PHI 1.61803398874

#define MAX_SPARKLES 120.

uniform vec2 u_resolution;
uniform float u_time;

float rand(float n) {
    return fract(dot(fract(n * 12.9898), fract(n * 4.1414)) * 43.5453);
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43.5453);
}

vec2 h12_polar(float t) {
    float a = fract(sin(t * 12.9898) * 11.3179) * TAU;
    float d = fract(sin((t+a) * 17.7391) * 13.1937);
    return vec2(sin(a), cos(a)) * d;
}

float sdfLine(in vec2 uv, in vec2 a, in vec2 b) {
    vec2 pa = uv-a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    vec2 v = pa - ba * h;
    // return dot(v, v) * 0.25 * u_resolution.y;
    return length(pa - ba * h);
}

vec3 sparkle(in vec2 uv, in float lv, in float seed, in float time) {
    uv.x += 0.005 * sin(TAU * uv.y * mod(seed, 5.));
    uv.y += 0.005 * sin(TAU * uv.x * mod(seed, 5.));

    vec2 dir = 0.4 * h12_polar(seed);
    float k = smoothstep(1., .5, time);
    float l = sdfLine(uv, max(0., time - k) * dir, time * dir);
    float m = u_resolution.y * smoothstep(0., 0.05 + lv * k, l);
    return vec3(1.0, 0.5, 0.1) / m;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
    vec3 rgb = vec3(0.0);

    float lv = dot(uv, uv);
    float t = 3. * u_time;

    rgb += (1. / u_resolution.y) * vec3(1.0, 0.5, 0.1) / lv;

    for (float i = 0.; i < MAX_SPARKLES; i++) {
        float f = rand(i); // [0, 1]
        rgb += sparkle(uv, lv, i + f * mod(floor(t + f), 4.), fract(t + f));
    }

    rgb -= 4. * lv;

    gl_FragColor = vec4(rgb, 1.0);
}