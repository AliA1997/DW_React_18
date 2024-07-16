import { Route, RouteProps, redirect } from "react-router-dom";
import { useStore } from "../stores/store";
import { ElementType, useEffect } from "react";


type Props = RouteProps & {
    component: ElementType | React.ComponentType<any>;
};

export default function PrivateRoute({component: Component, ...rest}: Props) {
    const {userStore: {isLoggedIn}} = useStore();

    useEffect(
        () => {
            if(!isLoggedIn) redirect("/");
        },
        [isLoggedIn]
    )
    return (
        <Route 
            {...rest}
            element={<Component />}
        />
    )
}