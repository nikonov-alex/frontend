import morphdom from "morphdom";

type Render<State> = { ( s: State ): HTMLElement };
type EventHandler<State> = { ( s: State, e: Event ): State };
type LocalEventRecord<State> = EventHandler<State>;
type GlobalEventRecord<State> = { handler: EventHandler<State>, target: "window" | "document" };
type EventRecord<State> = LocalEventRecord<State> | GlobalEventRecord<State>;
type Events<State> = { [name: string]: EventRecord<State> };

const isGlobalEvent = <State>( record: EventRecord<State> ): record is GlobalEventRecord<State> =>
    typeof record !== "function";
const getHandler = <State>( record: EventRecord<State> ): EventHandler<State> =>
    isGlobalEvent( record ) ? record.handler : record;

type EmitPredicate<State> = { ( os: State, ns: State ): boolean };
type EventEmitter<State> = { ( s: State ): Event };
type EmitRecord<State> = {
    when: EmitPredicate<State>,
    emit: EventEmitter<State>,
    target?: "element" | "window"
}

type Args<State> = {
    initialState: State,
    render: Render<State>,
    events?: Events<State>,
    emit?: EmitRecord<State>[],
    id?: string,
    redraw?: "refresh" | "merge"
};

function main<State>( args: Args<State> ) {
    let state = args.initialState;
    const wrapper = document.createElement( "div" );
    if ( args.id ) {
        wrapper.id = args.id;
    }
    let root = args.render( state );
    wrapper.appendChild( root );
    let deferredRedraw = false;

    function maybeEmitEvents( oldState: State ) {
        if ( args.emit ) {
            for ( const record of args.emit ) {
                if ( record.when( oldState, state ) ) {
                    const target = "window" === record.target
                        ? window
                        : wrapper;
                    target.dispatchEvent( record.emit( state ) );
                }
            }
        }
    }

    function redraw() {
        const rendered = args.render( state );
        if ( root.isEqualNode( rendered ) ) {
            return;
        }
        if ( args.redraw && "refresh" === args.redraw || root.nodeName !== rendered.nodeName ) {
            root.replaceWith( rendered );
            root = rendered;
        }
        else {
            morphdom( root, rendered, {
                onBeforeElUpdated: ( fromEl, toEl ) =>
                    !fromEl.isEqualNode( toEl )
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
        maybeEmitEvents( oldState );
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
            const target = isGlobalEvent( record )
                ? "window" === record.target
                    ? window
                    : document
                : wrapper;
            target.addEventListener( name, eventHandler, true )
        } );
    }

    return wrapper;
}

export default main;