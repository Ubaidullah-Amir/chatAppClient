function RouteContext({component,context,...rest}) {
    const Provider = UserContext.Provider
    const Component = component
    return ( 
        
        <Route  {...rest}>
            <Provider>
                <Component />
            </Provider>
        </Route>
     );
}

export default RouteContext