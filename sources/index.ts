import morphdom from "morphdom";

type EventHandler<State, SharedStates extends any[]> = { ( s: State, e: Event, ... sharedStates: SharedStates ): State }
type Events<State, SharedStates extends any[]> = { [name: string]: EventHandler<State, SharedStates> };

type Render<State, SharedStates extends any[]> = { ( s: State, ... sharedStates: SharedStates ): HTMLElement };

class SharedState<T> {

    private _listeners: Set<{(): void}> = new Set();

    constructor(
        private _data: T
    ) { }

    public get data(): T {
        return this._data;
    }

    public set data( value: T ) {
        this._data = value;
        this._listeners.forEach( listener =>
            listener() );
    }

    public addListener( listener: {(): void} ) {
        this._listeners.add( listener );
    }

    public removeListener( listener: {(): void} ) {
        this._listeners.delete( listener );
    }

}

type UpdateSharedState<State, T> = {
    sharedState: SharedState<T>,
    when: { ( os: State, ns: State ): boolean },
    update: { ( s: State ): T }
}

type Component<State, SharedStates extends any[]> = {
    initialState: State,
    render: Render<State, SharedStates>,
    events?: {
        local?: Events<State, SharedStates>,
        window?: Events<State, SharedStates>,
        document?: Events<State, SharedStates>
    },
    sharedStates: {[I in keyof SharedStates]: SharedState<SharedStates[I]>},
    updateSharedStates?: UpdateSharedState<State, any>[]
}

type Options = {
    viewport: HTMLElement
}

let COMPONENTS: {[id: string]: Component<any, any[]>} = { };

const registerComponents = ( components: {[id: string]: Component<any, any[]>} ) => {
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

const initViewports = ( viewports: {[id: string]: HTMLElement} ) => {
    Object.entries( viewports ).forEach( ( [ id, viewport ] ) => {
        if ( id in COMPONENTS ) {
            component( COMPONENTS[id], { viewport } );
        }
    } );
}

const destroyInstances = ( oldViewports: {[id: string]: HTMLElement} ) =>
    Object.keys( oldViewports ).forEach( id => {
        INSTANCES[id].destroy();
        delete INSTANCES[id];
        delete oldViewports[id];
    } );

const sharedStatesValues =
    <SharedStates extends any[]>( sharedStates: {[I in keyof SharedStates]: SharedState<SharedStates[I]>}): SharedStates =>
        sharedStates.map( sharedState => sharedState.data ) as SharedStates;

const component = <State, SharedStates extends any[]>(
    component: Component<State, SharedStates>,
    options: Options
) => {
    const render = ( state: State ) =>
        component.render( state, ... sharedStatesValues( component.sharedStates ) );

    let state = component.initialState;
    let element = render( state );
    initViewports( findViewports( element ) );
    let deferredRedraw = false;

    const redraw = () => {
        const rendered = render( state );
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
                        return !node.parentElement?.classList.contains( "viewport" );
                    }
                } );
            }

            const newViewports = findViewports( element );
            updateViewports( oldViewports, newViewports );
            destroyInstances( oldViewports );
        }
    };

    const maybeRedraw = () => {
        if ( !deferredRedraw ) {
            setTimeout( () => {
                redraw();
                deferredRedraw = false;
            }, 0 );
            deferredRedraw = true;
        }
    }

    const changeState = ( newState: State ) => {
        if ( state !== newState ) {
            const oldState = state;
            state = newState;
            maybeRedraw();
            component.updateSharedStates?.forEach( ( { sharedState, when, update } ) => {
                if ( when( oldState, state ) ) {
                    sharedState.data = update( state );
                }
            } );
        }
    };

    const eventHandler = ( event: Event, eventHandler: EventHandler<State, SharedStates> ) => {
        changeState(
            eventHandler( state, event, ... sharedStatesValues( component.sharedStates ) ) );
    }

    const localEventsHandler = ( event: Event ) => {
        if ( [ "submit" ].includes( event.type ) ) {
            event.preventDefault();
        }
        event.stopImmediatePropagation();
        //@ts-ignore
        eventHandler( event, component.events.local[event.type] );

    };
    const windowEventsHandler = ( event: Event ) => {
        //@ts-ignore
        eventHandler( event, component.events.window[event.type] );
    };

    const documentEventsHandler = ( event: Event ) => {
        //@ts-ignore
        eventHandler( event, component.events.document[event.type] );
    };

    const bindEvents = ( events: Events<State, SharedStates>, target: EventTarget, eventsHandler: { (e: Event): void } ) =>
        Object.keys( events ).forEach( ( eventName ) =>
            target.addEventListener( eventName, eventsHandler ));

    const unbindEvents = ( events: Events<State, SharedStates>, target: EventTarget, eventsHandler: { (e: Event): void } ) =>
        Object.keys( events ).forEach( ( eventName ) =>
            target.removeEventListener( eventName, eventsHandler ));

    const sharedStateUpdated = () => {
        maybeRedraw();
    }

    const draw = () => element;
    const destroy = () => {
        unbindEvents( component.events?.local ?? { }, element, localEventsHandler );
        unbindEvents( component.events?.window ?? { }, window, windowEventsHandler );
        unbindEvents( component.events?.document ?? { }, document, documentEventsHandler );
        component.sharedStates.forEach( sharedState =>
            sharedState.removeListener( sharedStateUpdated ) );
    }

    bindEvents( component.events?.local ?? { }, element, localEventsHandler );
    bindEvents( component.events?.window ?? { }, window, windowEventsHandler );
    bindEvents( component.events?.document ?? { }, document, documentEventsHandler );
    component.sharedStates.forEach( sharedState =>
        sharedState.addListener( sharedStateUpdated ) );
    options.viewport.append( element );
    INSTANCES[options.viewport.id] = { draw, destroy };
}


export { registerComponents, component, SharedState };