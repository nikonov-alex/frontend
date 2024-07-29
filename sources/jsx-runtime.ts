const RESERVED_PROPS = [ "key", "ref", "__self", "__source" ];


type Child = JSX.Element | string | Child[];
type Props<P extends { } = { }> = P & { children?: Child | Child[] }

const selfProps = ({ children, ... rest }: Props ): { } =>
    Object.entries( rest ).reduce(
        ( result, [ prop, value ] ) =>
            RESERVED_PROPS.includes( prop )
                ? result
                : { ... result, [prop]: value },
        { }
    );


type FunctionComponent<P = {}> = ( props: P ) => JSX.Element;

type ElementType<P = any, Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> =
    | { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag]
    | FunctionComponent<P>;

type PROPS_HASH = string;
type ComponentCache = Map<PROPS_HASH, WeakRef<JSX.Element>>;
const CACHE = new Map<FunctionComponent<any>, ComponentCache>();

const OBJECT_TO_ID = new WeakMap<object | symbol, number>;
const ID_TO_OBJECT = new Map<number, WeakRef<object | symbol>>;
let COUNTER = 1;

const isUsedID = ( id: number ): boolean => {
    const ref = ID_TO_OBJECT.get( id );
    if ( !ref ) {
        return false;
    }
    if ( !ref.deref() ) {
        ID_TO_OBJECT.delete( id );
        return false;
    }
    return true;
}

const objectID = ( obj: object | symbol ): number => {
    let id = OBJECT_TO_ID.get( obj );
    if ( !id ) {
        while ( isUsedID( COUNTER ) ) {
            COUNTER++;
            if ( COUNTER <= 0 ) {
                COUNTER = 1;
            }
        }
        id = COUNTER;
        OBJECT_TO_ID.set( obj, id );
        ID_TO_OBJECT.set( id, new WeakRef( obj ) );
    }
    return id;
}

const valueHash = ( value: any ): string =>
    value === null
        ? "null" :
        value === undefined
            ? "undef" :
            [ "boolean", "number", "bigint", "string" ].includes( typeof value )
                ? value.toString()
                : objectID( value );

const hash = ( props: object ): PROPS_HASH =>
    Object.entries( props ).reduce(
        ( hash, [prop, value] ) =>
            hash + `${prop}=${valueHash(value)}`,
        ''
    );

const cacheSet = ( component: FunctionComponent<any>, props: object, elem: JSX.Element | null ) => {
    let componentCache = CACHE.get( component );
    if ( !componentCache ) {
        componentCache = new Map();
        CACHE.set( component, componentCache );
    }

    const cacheID = hash( props );
    if ( null === elem ) {
        componentCache.delete( cacheID )
    }
    else {
        //@ts-ignore
        elem.cacheID = cacheID;
        componentCache.set( cacheID, new WeakRef( elem ) )
    }
}

const cacheGet = ( component: FunctionComponent<any>, props: object ): JSX.Element | null => {
    const cacheID = hash( props );

    const componentCache = CACHE.get( component );
    if ( !componentCache ) {
        return null;
    }
    const ref = componentCache.get( cacheID );
    if ( !ref ) {
        return null;
    }
    const elem = ref.deref();
    if ( !elem ) {
        cacheSet( component, props, null );
        return null;
    }
    const result = elem.cloneNode( false );
    //@ts-ignore
    result.cacheID = cacheID;
    //@ts-ignore
    result.reference = ref;
    return result as JSX.Element;
}


const functionComponent = <P extends {} = {}>(
    func: FunctionComponent<P>,
    props: Props<P>
): JSX.Element => {
    if ( Array.isArray( props.children ) && props.children.length > 0 || !Array.isArray( props.children ) && props.children ) {
        return func( props );
    }

    const p = selfProps( props );
    let elem = cacheGet( func, p );
    if ( !elem ) {
        elem = func( props );
        cacheSet( func, p, elem );
    }
    return elem;
}

const addAttributes = ( elem: JSX.Element, props: object ) =>
    Object.entries( props ).forEach(
        ( [ prop, value ] ) => {
            elem.setAttribute( prop, value.toString() );
        } );

const addChildren = ( elem: JSX.Element, children: Child | Child[] ) =>
    Array.isArray( children )
        ? children.forEach( child =>
            addChildren( elem, child )
        )
        : elem.append( children );

const HTMLNode = <P = any, Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements>(
    type: { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag],
    props: Props
): JSX.Element => {
    const elem = document.createElement( type );
    addAttributes( elem, selfProps( props ) )
    if ( props.children ) {
        addChildren( elem, props.children );
    }
    return elem;
};

export const jsx = (
    type: ElementType,
    props: Props,
    key?: string | number | bigint
): JSX.Element =>
    "string" === typeof type
        ? HTMLNode( type, props )
        : functionComponent( type, props )



export type Node =
    | object
    | (() => Node)
    | boolean
    | number
    | bigint
    | string
    | null
    | undefined;

type Attributes = Props<Record<string, Node | undefined>>

export namespace JSX {
    export type IntrinsicElements = Record<string, Attributes>;
    export type Element = HTMLElement;
}

export { jsx as jsxs }