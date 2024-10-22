import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "./slices/roleSlice";

export const HasAccess = (actions) => {

    const user = JSON.parse(localStorage.getItem('user'))

    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the fetchRoles action on component mount
        if (window.location.pathname === "/default") {
            dispatch(fetchRoles(user?._id));
        }
    }, [dispatch]);

    const roles = useSelector((state) => state?.roles?.roles);

    const rolesToCheck = roles?.map(item => item.roleName)
    const mergedPermissions = {};
    const superAdminPermission = {
        "create": true,
        "update": true,
        "delete": true,
        "view": true,
        "import": true,
        "export": true,
    };

    actions?.forEach(action => {
        const access = rolesToCheck.map(roleToCheck => {
            const role = roles.find(r => r.roleName === roleToCheck);
            return role?.access?.find(a => a.title === action);
        });

        access?.forEach(permission => {
            // Check if permission is defined
            if (permission) {
                // Destructure permission only if it's defined
                const { title, ...rest } = permission;

                if (!mergedPermissions[title]) {
                    mergedPermissions[title] = { ...rest };
                } else {
                    // Merge with priority to true values
                    Object.keys(rest).forEach(key => {
                        if (mergedPermissions[title][key] !== true) {
                            mergedPermissions[title][key] = rest[key];
                        }
                    });
                }
            }
        });
    });


    // Return permissions for each action
    return actions.map(action => (
        user?.role === "superAdmin" ? superAdminPermission : mergedPermissions[action]
    ));
};