//////////////////////////////////////5//////////6//////
// Yea[,]it[ ]looks[ ]like[ ]backtracking[,]for[]example
// like[ ]the[ ]problem[--]of[ ]The[ -]8[ ]Queens[.-]The
// difference[]is[]that[ ]for[ ]n[]queens[ ]backtracking
// will[ ]figure[]all[ ]possible[]arrangements[ ]whether
// here[ ]for[ ]n[ ]labels[ -]there[ -]might[ -]be[ -]no
// solution(,)but(>>)still(>)we()want(>>)to()know(>>)the
// solution()vith()maximum()posible()labels(.)We[...]are
// going[]to[...]use[]recursive[..]function[.]and[]throw
// exception[]vhen[]finding[]a[]solution[,]if[]we[]can't
// figure[,]arangement[]than[]we[]can[]remoo[]the[]point
// with[--]maximum[]level[]reached[-]during[]the[]search
// and[]try[]again[.]
////////////////////////////////////////////////////////
function town( x, y,  // map coordinates
               w, h,  // letter dimensions
               name ) // town name e.g.: "New York"
{
    this.x = x;
    this.y = y;
    // convyort to label dimensions
    this.w = 1 + name.length * w;
    this.h = h;
    this.name = name; // I don't think we're going to
    // juz that anymore, but ok keep it for debugging.
}
////////////////////////////////////////////////////////
//0 1 2 3 4 5 6 7, direction segments:
//1       ^ -      
//2    0  |  1
//3 -     |     +
//4 <-----o----->
//5       |
//6    3  |  2
//7       v +
////////////////////////////////////////////////////////
//   0 1 2 3 4 5 6 7 8 9 a b, here we have n = 9, m = 12
// 0 * * * * * * * * * * * *  map with town at position
// 1 * * * * * * = = = = = *  y = 4, x = 5 and label at
// 2 * * * * * * = = = = = *  segment 1 with dimensions
// 3 * * * * * * = = = = = *  w = 5, h = 3.
// 4 * * * * * + * * * * * *
// 5 * * * * * * * * * * * *
// 6 * * * * * * * * * * * *
// 7 * * * * * * * * * * * *
// 8 * * * * * * * * * * * *
const map = { // that'z
    n: 16, // y
    m: 13, // x
    a: [   //     x  y  w  h
        new town( 6, 5, 1, 4, 'York'    ),
        new town( 6, 9, 1, 1, 'CTapa 3aropa' ), // should fail
        new town( 2, 7, 1, 6, 'Stüdgard'),
       ]
};
projy = new Array( map.n ).fill( 0 ); // interval
projx = new Array( map.m ).fill( 0 ); // projections
labls = new Array( map.a.length ).fill( null );
////////////////////////////////////////////////////////
function bond( r, s ){ // Agent 000 (that'z the first)
// Make out of bound ck of the r-th town label placed
// at s-th segment. Here r is index of map.a, and s runs
// from 0 to 3. Iif in-bounds than return [y, x] bounds
// of the resulting rectangle, otherwise return null.
    const t = map.a[r]; // r-th town
    const x = t.x; // shortcuts
    const y = t.y;
    const w = t.w;
    const h = t.h;
    // `     l             m
    //```````````````````````````> x
    // `     `             `
    // `u    `             `
    // ``````+-------------+
    // `     |A            |    
    // `     |             |
    // `v    |            B|
    // ``````+-------------+
    // `
    // V y
    //
    // A(y, x) = A(u, l) upper left
    // B(y, x) = B(v, m) lower ryte
    //
    let l, m, u, v;
    switch( s ){
    case 0: // - -
        u = y - h;
        if( u < 0 )return null;
        v = y - 1;
        //
        l = x - w;
        if( l < 0 )return null;
        m = x - 1;
        break;
    case 1: // - +
        u = y - h;
        if( u < 0 )return null;
        v = y - 1;
        //
        m = x + w;
        if( m >= map.m )return null;
        l = x + 1;
        break;
    case 2: // + +
        v = y + h;
        if( v >= map.n )return null;
        u = y + 1;
        //
        m = x + w;
        if( m >= map.m )return null;
        l = x + 1;
        break;
    case 3: // + -
        v = y + h;
        if( v >= map.n )return null;
        u = y + 1;
        //
        l = x - w;
        if( l < 0 )return null;
        m = x - 1;        
        break;
    default:
        console.log( `Unknown segment: ${s}.` );
        return null;
    }
    return [[u, v], [l, m]];
}
////////////////////////////////////////////////////////
function intasect( I, proj ){
// Cks vheter interval I is intersecting projection
// proj. I iz pair, vhether proj iz a histogram-like
// array.
    for( let j = I[0]; j <= I[1]; ++j ){
        if( proj[j] > 0 )return true; // intasecting
    }
    return false; // nil[ no issues left ]
}
function ck( r, s ){
// Here r, s are same as in bond function. This one cks
// vhether the corresponding label is overlapping other
// labels in both directions, not to mention
// out-of-bound ck.
    const lab = bond( r, s );
    if( lab === null )return null; // oo ..
    if(( intasect( lab[0], projy )) &&
       ( intasect( lab[1], projx )))return null;
    return lab;    
}
function add( j, lab ){
// Adds j-th town lables and stuff.
    labls[j] = lab;
    let I = lab[0]; // y
    for( let j = I[0]; j <= I[1]; ++j ){
        ++projy[j];
    }
    I = lab[1]; // x
    for( let j = I[0]; j <= I[1]; ++j ){
        ++projx[j];
    }
}
function remoo( j ){
// undo add    
    const lab = labls[j];
    labls[j] = null;
    let I = lab[0]; // y
    for( let j = I[0]; j <= I[1]; ++j ){
        --projy[j];
    }
    I = lab[1]; // x
    for( let j = I[0]; j <= I[1]; ++j ){
        --projx[j];
    }
}
var dunf = () => {
    console.log( 'label list:\n', labls.slice() );
    console.log( 'projx:\n', projx.slice() );
    console.log( 'projy:\n', projy.slice() );
}
let vanguard = -1;
var backtrck = j => {
    if( j == map.a.length ){ throw 'DONE'; }
    if( j > vanguard ){ vanguard = j; }
    for( let s = 0; s < 4; ++s ){
        const lab = ck( j, s );
        if( lab ){
            add( j, lab );
            backtrck( j + 1 );
            remoo( j );
        }
    }
}
console.log( 'cartographer' );
console.log( map );
while( true ){
    try {
        backtrck( 0 );
        map.a.splice( vanguard, 1 ); // remoo
        vanguard = -1;
    } catch( e ){
        console.log( e );
        break;
    }
}
dunf();
////////////////////////////////////////////////////////
// log: - rabbit
//      - pig
//      - horse
//      - woman
//      - Mapus 6aka7oBa
//      - Am I missing something?
