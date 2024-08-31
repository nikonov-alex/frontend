import morphdom from "morphdom";

type EventHandler<State> = { ( s: State, e: Event ): State };
type Events<State> = { [name: string]: EventHandler<State> };

type Component<State> = {
    initialState: State,
    render: { ( s: State ): HTMLElement },
    events?: {
        local?: Events<State>,
        window?: Events<State>
    },
}

type Options = {
    viewport: HTMLElement
}

let COMPONENTS: {[id: string]: Component<any>} = { };

const registerComponents = ( components: {[id: string]: Component<any>} ) => {
    COMPONENTS = components;
}

const INSTANCES: {[id: string]: {
    draw: {(): HTMLElement},
    destroy: {(): void}
}} = { };

const findViewports = ( elem: HTMLElement ) =>
    Array.from( elem.querySelectorAll<HTMLElement>( ".viewport" ) )
        .reduce( ( map, viewport ) =>
            ( { ... map, [viewport.id]: viewport } ),
            { } as {[id: string]: HTMLElement} );

const updateViewports = (
    oldViewports: {[id: string]: HTMLElement},
    newViewports: {[id: string]: HTMLElement}
) =>
    Object.entries( newViewports ).forEach( ( [ id, viewport ] ) => {
        if ( viewport.hasChildNodes() ) {
            delete oldViewports[id];
        }
        else {
            if ( id in INSTANCES ) {
                viewport.append( INSTANCES[id].draw() );
                if ( id in oldViewports ) {
                    delete oldViewports[id];
                }
            }
            else if ( id in COMPONENTS ) {
                component( COMPONENTS[id], { viewport } );
            }
        }
    } );

const destroyInstances = ( oldViewports: {[id: string]: HTMLElement} ) =>
    Object.keys( oldViewports ).forEach( id => {
        INSTANCES[id].destroy();
        delete INSTANCES[id];
        delete oldViewports[id];
    } );

const component = <State>(
    component: Component<State>,
    options: Options
) => {
    let state = component.initialState;
    let element = component.render( state );
    let deferredRedraw = false;

    const redraw = () => {
        const rendered = component.render( state );
        console.log( "rendered", rendered.cloneNode( true ) );
        if ( !element.isEqualNode( rendered ) ) {
            const oldViewports = findViewports( element );

            if ( element.nodeName !== rendered.nodeName ) {
                element.replaceWith( rendered );
                element = rendered;
            }
            else {
                morphdom( element, rendered, {
                    onBeforeElUpdated: ( fromEl, toEl ) =>
                        !fromEl.isEqualNode( toEl ),
                    onBeforeNodeDiscarded: node => {
                        console.log( "discarded", node.cloneNode( true ) );
                        return true;
                    }
                } );
            }

            const newViewports = findViewports( element );
            updateViewports( oldViewports, newViewports );
            destroyInstances( oldViewports );
        }
    };

    const changeState = ( newState: State ) => {
        if ( state !== newState ) {
            state = newState;
            if ( !deferredRedraw ) {
                setTimeout( () => {
                    redraw();
                    deferredRedraw = false;
                }, 0 );
                deferredRedraw = true;
            }
        }
    };

    const localEventsHandler = ( event: Event ) => {
        if ( [ "submit" ].includes( event.type ) ) {
            event.preventDefault();
        }
        event.stopImmediatePropagation();
        //@ts-ignore
        const eventHandler = component.events.local[event.type];
        changeState( eventHandler( state, event ) );
    };
    const windowEventsHandler = ( event: Event ) => {
        //@ts-ignore
        const eventHandler = component.events.window[event.type];
        changeState( eventHandler( state, event ) );
    };

    const bindEvents = ( events: Events<State>, target: EventTarget, eventsHandler: { (e: Event): void } ) =>
        Object.keys( events ).forEach( ( eventName ) =>
            target.addEventListener( eventName, eventsHandler ));

    const unbindEvents = ( events: Events<State>, target: EventTarget, eventsHandler: { (e: Event): void } ) =>
        Object.keys( events ).forEach( ( eventName ) =>
            target.removeEventListener( eventName, eventsHandler ));

    const draw = () => element;
    const destroy = () => {
        unbindEvents( component.events?.local ?? { }, element, localEventsHandler );
        unbindEvents( component.events?.window ?? { }, window, windowEventsHandler );
    }

    bindEvents( component.events?.local ?? { }, element, localEventsHandler );
    bindEvents( component.events?.window ?? { }, window, windowEventsHandler );
    options.viewport.append( element );
    INSTANCES[options.viewport.id] = { draw, destroy };
}


export { registerComponents, component };