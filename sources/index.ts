import morphdom from "morphdom";

type Render<State> = { ( s: State ): HTMLElement };
type EventHandler<State> = { ( s: State, e: Event ): State };
type LocalEventRecord<State> = EventHandler<State>;
type GlobalEventRecord<State> = { handler: EventHandler<State>, source: "global" };
type EventRecord<State> = LocalEventRecord<State> | GlobalEventRecord<State>;
type Events<State> = { [name: string]: EventRecord<State> };

const isGlobalEvent = <State>( record: EventRecord<State> ): record is GlobalEventRecord<State> =>
    typeof record !== "function";
const getHandler = <State>( record: EventRecord<State> ): EventHandler<State> =>
    isGlobalEvent( record ) ? record.handler : record;

type Args<State> = {
    initialState: State,
    render: Render<State>,
    events?: Events<State>
};

function main<State>( args: Args<State> ) {
    let state = args.initialState;
    let root = args.render( state );
    let deferredRedraw = false;

    function redraw() {
        const rendered = args.render( state );
        console.log( rendered.cloneNode( true ) );
        if ( root.isEqualNode( rendered ) ) {
            return;
        }
        if ( root.nodeName !== rendered.nodeName ) {
            root.replaceWith( rendered );
            root = rendered;
        }
        else {
            morphdom( root, rendered, {
                getNodeKey: node =>
                    "cacheID" in node
                        ? node.cacheID
                    : "id" in node
                        ? node.id
                    : undefined,
                onBeforeNodeAdded: ( node ) =>
                    "cacheID" in node && "reference" in node
                        //@ts-ignore
                        ? node.reference.deref().cloneNode( true )
                    : node,
                onBeforeElUpdated: ( fromEl, toEl ) => !(
                    "cacheID" in toEl && "cacheID" in fromEl && toEl.cacheID === fromEl.cacheID ||
                    fromEl.isEqualNode( toEl )
                )
            } );
        }
    }

    function changeState( newState: State ) {
        if ( state === newState ) {
            return;
        }
        const oldState = state;
        state = newState;
        if ( !deferredRedraw ) {
            setTimeout( () => {
                redraw();
                deferredRedraw = false;
            }, 0 );
            deferredRedraw = true;
        }
    }

    if ( args.events ) {
        function eventHandler( event: Event ) {
            //@ts-ignore
            const record = args.events[event.type];
            if ( !isGlobalEvent( record ) ) {
                if ( [ "submit" ].includes( event.type ) ) {
                    event.preventDefault();
                }
                event.stopImmediatePropagation();
            }

            const handler = getHandler( record );
            changeState( handler( state, event ) );
        }

        Object.entries( args.events ).forEach( ([name, record]) => {
            const target = isGlobalEvent( record ) ? window : root;
            target.addEventListener( name, eventHandler, true )
        } );
    }

    return root;
}

export default main;