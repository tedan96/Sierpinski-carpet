var canvas;
var gl;
var i;
var points = [];
var NumTimesToSubdivide = 7;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var vertices = [
        vec2(-1,0),
        vec2(0,1),
        vec2(1, 0),
        vec2(0, -1)
    ];
    divideTriangle(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0  );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    render();
};

function triangle( a, b, c, d )
{
    points.push( a, b, c, d );
}
function divideTriangle( a, b, c, d, count )
{
   if ( count === 0 ) {
        triangle( a, b, c, d);
    }
   else {
        var bc1 = mix( b, c, 1/3);
        var bc2 = mix( b, c, 2/3);
        var ab1 = mix( a, b, 1/3);
        var ab2 = mix( a, b, 2/3);
        var cd1 = mix( c, d, 1/3);
        var cd2 = mix( c, d, 2/3);
        var ad1 = mix( a, d, 1/3);
        var ad2 = mix( a, d, 2/3);
        var ma = mix( ab1, cd2, 1/3);
        var mb = mix( ab2, cd1, 1/3);
        var mc = mix( ab2, cd1, 2/3);
        var md = mix( ab1, cd2, 2/3);
         --count;
        divideTriangle(ab2, b, bc1, mb, count);  
        divideTriangle(mb, bc1, bc2, mc, count); 
        divideTriangle(mc, bc2, c, cd1, count);  
        divideTriangle(ab1, ab2, mb, ma, count); 
        divideTriangle(md, mc, cd1, cd2, count);
        divideTriangle(a, ab1, ma, ad1, count);  
        divideTriangle(ad1, ma, md, ad2, count); 
        divideTriangle(ad2, md, cd2, d, count);  
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    for(i = 0; i< points.length; i = i+4){ 
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4);
    }
}